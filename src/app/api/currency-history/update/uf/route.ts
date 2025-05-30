import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";
import axios from "axios";

interface UFYearData {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  serie: Array<{
    fecha: string;
    valor: number;
  }>;
}

interface UFUpdateRequest {
  monthsForward?: number;
}

/**
 * Obtiene los valores UF de un año completo desde mindicador.cl
 * @param year Año (YYYY)
 * @returns Array de valores UF del año o null si hay error
 */
async function fetchUFYear(year: number): Promise<UFYearData | null> {
  try {
    const url = `https://mindicador.cl/api/uf/${year}`;
    console.log(`[UF API] Consultando año completo: ${url}`);

    const response = await axios.get(url, {
      timeout: 15000, // 15 segundos timeout para años completos
      headers: {
        "User-Agent": "G3stmart-Currency-Updater/2.0",
      },
    });

    if (response.data && response.data.serie && Array.isArray(response.data.serie)) {
      console.log(`[UF API] Obtenidos ${response.data.serie.length} valores para el año ${year}`);
      return response.data;
    }

    console.warn(`[UF API] No hay datos válidos para el año ${year}`);
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`[UF API] No hay datos disponibles para el año ${year} (404)`);
      } else {
        console.error(`[UF API] Error HTTP ${error.response?.status} para el año ${year}:`, error.response?.data);
      }
    } else {
      console.error(`[UF API] Error consultando el año ${year}:`, error);
    }
    return null;
  }
}

/**
 * Convierte fecha ISO a Date UTC para evitar problemas de zona horaria
 * Asegura que la fecha se guarde como 00:00:00 UTC
 */
function parseUTCDate(isoDate: string): Date {
  const date = new Date(isoDate);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
}

/**
 * Agrega meses a una fecha
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Determina qué años necesitamos consultar basado en los meses anticipados
 */
function getYearsToFetch(monthsForward: number): number[] {
  const today = new Date();
  const cutoffDate = addMonths(today, monthsForward);

  const currentYear = today.getFullYear();
  const cutoffYear = cutoffDate.getFullYear();

  const years: number[] = [currentYear];
  if (cutoffYear > currentYear) {
    years.push(cutoffYear);
  }

  return years;
}

/**
 * Inserta o actualiza un registro de UF en la base de datos
 */
async function upsertUFRecord(date: Date, value: number): Promise<"inserted" | "updated" | "skipped"> {
  try {
    // Verificar si ya existe el registro
    const existing = await prisma.currencyHistory.findUnique({
      where: { date },
      select: { id: true, uf: true },
    });

    if (existing) {
      // Verificar si el valor UF es diferente (tolerancia de 0.01)
      if (Math.abs(Number(existing.uf) - value) > 0.01) {
        await prisma.currencyHistory.update({
          where: { date },
          data: {
            uf: value,
            updated_at: new Date(),
          },
        });
        return "updated";
      } else {
        return "skipped";
      }
    } else {
      // Crear nuevo registro
      await prisma.currencyHistory.create({
        data: {
          date,
          uf: value,
          usd: 0, // Valor temporal, se actualizará con endpoint USD
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return "inserted";
    }
  } catch (error) {
    console.error(`[UF DB] Error procesando fecha ${date.toISOString().split("T")[0]}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parsear parámetros del request
    let monthsForward = 2; // Valor por defecto

    try {
      const body = (await request.json()) as UFUpdateRequest;
      if (body.monthsForward !== undefined) {
        monthsForward = Math.max(0, Math.min(24, body.monthsForward)); // Limitar entre 0 y 24 meses
      }
    } catch {
      console.log("[UF Update] Usando valor por defecto monthsForward = 2");
    }

    console.log(`[UF Update] Iniciando actualización para ${monthsForward} meses anticipados`);

    // Determinar qué años necesitamos consultar
    const yearsToFetch = getYearsToFetch(monthsForward);
    console.log(`[UF Update] Años a consultar: ${yearsToFetch.join(", ")}`);

    let totalInserted = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let minDate: string | null = null;
    let maxDate: string | null = null;
    const processedYears: string[] = [];
    const errorYears: string[] = [];

    // Procesar cada año
    for (const year of yearsToFetch) {
      try {
        console.log(`[UF Update] Procesando año ${year}`);

        // Obtener datos del año completo desde la API
        const yearData = await fetchUFYear(year);

        if (!yearData || !yearData.serie || yearData.serie.length === 0) {
          console.warn(`[UF Update] Sin datos para el año ${year}, continuando...`);
          errorYears.push(year.toString());
          totalErrors++;
          continue;
        }

        // Procesar TODA la serie del año (sin filtrar)
        console.log(`[UF Update] Procesando ${yearData.serie.length} registros completos del año ${year}`);

        // Procesar cada día del año en transacción
        let yearInserted = 0;
        let yearUpdated = 0;
        let yearSkipped = 0;

        await prisma.$transaction(async () => {
          for (const dayData of yearData.serie) {
            try {
              const date = parseUTCDate(dayData.fecha);
              const ufValue = dayData.valor;

              if (!ufValue || ufValue <= 0) {
                console.warn(`[UF Update] Valor UF inválido para ${dayData.fecha}: ${ufValue}`);
                continue;
              }

              // Usar la función de upsert
              const result = await upsertUFRecord(date, ufValue);

              switch (result) {
                case "inserted":
                  yearInserted++;
                  break;
                case "updated":
                  yearUpdated++;
                  break;
                case "skipped":
                  yearSkipped++;
                  break;
              }

              // Actualizar fechas mínimas y máximas
              const dateStr = dayData.fecha.split("T")[0];
              if (!minDate || dateStr < minDate) minDate = dateStr;
              if (!maxDate || dateStr > maxDate) maxDate = dateStr;
            } catch (dayError) {
              console.error(`[UF Update] Error procesando día ${dayData.fecha}:`, dayError);
              totalErrors++;
            }
          }
        });

        totalInserted += yearInserted;
        totalUpdated += yearUpdated;
        totalSkipped += yearSkipped;
        processedYears.push(year.toString());

        console.log(
          `[UF Update] Completado año ${year}: ${yearInserted} insertados, ${yearUpdated} actualizados, ${yearSkipped} omitidos`
        );

        // Pequeña pausa entre años para no sobrecargar la API
        if (yearsToFetch.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (yearError) {
        console.error(`[UF Update] Error procesando año ${year}:`, yearError);
        errorYears.push(year.toString());
        totalErrors++;
      }
    }

    // Preparar respuesta
    const response = {
      success: true,
      message: `Actualización UF completada - años completos guardados en base de datos`,
      summary: {
        monthsForward,
        yearsProcessed: processedYears.length,
        totalInserted,
        totalUpdated,
        totalSkipped,
        totalErrors,
        dateRange: {
          minDate,
          maxDate,
        },
        processedYears,
        errorYears: errorYears.length > 0 ? errorYears : undefined,
      },
    };

    console.log(`[UF Update] Resumen final:`, response.summary);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[UF Update] Error general:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error actualizando valores UF",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
