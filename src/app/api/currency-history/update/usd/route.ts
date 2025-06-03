import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

/**
 * Obtiene la fecha actual en zona horaria de Santiago de Chile
 */
const getTodayInSantiago = (): string => {
  const now = new Date();

  // Usar Intl.DateTimeFormat para obtener fecha en Santiago de manera más precisa
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const result = formatter.format(now); // Devuelve formato YYYY-MM-DD

  return result;
};

/**
 * Actualiza el valor USD del día o del año completo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loadFullYear = false } = body;

    if (loadFullYear) {
      // Cargar datos del año completo
      return await updateUSDFullYear();
    } else {
      // Comportamiento original: actualizar solo el día actual
      return await updateUSDToday();
    }
  } catch (error) {
    console.error("Error en endpoint USD:", error);
    return NextResponse.json({ success: false, message: "Error procesando solicitud USD" }, { status: 500 });
  }
}

/**
 * Actualiza USD para el día actual (comportamiento original)
 */
async function updateUSDToday() {
  try {
    const today = getTodayInSantiago();
    const todayDate = new Date(today + "T00:00:00.000Z");

    // Consultar API externa para obtener USD del día
    const response = await fetch("https://mindicador.cl/api/usd", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error en API externa: ${response.status}`);
    }

    const data = await response.json();
    const usdValue = data.valor;

    if (typeof usdValue !== "number") {
      throw new Error("Valor USD inválido recibido de la API");
    }

    // Verificar si ya existe un registro para hoy
    const existingRecord = await prisma.currencyHistory.findUnique({
      where: { date: todayDate },
    });

    let action: "created" | "updated" | "unchanged";
    let previousValue: number | undefined;

    if (existingRecord) {
      if (existingRecord.usd === usdValue) {
        action = "unchanged";
      } else {
        previousValue = existingRecord.usd;
        await prisma.currencyHistory.update({
          where: { date: todayDate },
          data: { usd: usdValue },
        });
        action = "updated";
      }
    } else {
      await prisma.currencyHistory.create({
        data: {
          date: todayDate,
          usd: usdValue,
          uf: 0, // Valor por defecto
        },
      });
      action = "created";
    }

    return NextResponse.json({
      success: true,
      message: `USD ${action === "created" ? "creado" : action === "updated" ? "actualizado" : "sin cambios"}`,
      data: {
        date: today,
        usdValue,
        action,
        previousValue,
      },
    });
  } catch (error) {
    console.error("Error updating USD today:", error);
    return NextResponse.json({ success: false, message: "Error actualizando USD del día" }, { status: 500 });
  }
}

/**
 * Actualiza USD para el año completo
 */
async function updateUSDFullYear() {
  try {
    const currentYear = new Date().getFullYear();

    console.log(`[USD Full Year] Iniciando carga para año ${currentYear}`);

    // Consultar API externa para obtener USD del año completo
    const response = await fetch(`https://mindicador.cl/api/dolar/${currentYear}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error en API externa: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[USD Full Year] Respuesta de API:`, {
      version: data.version,
      codigo: data.codigo,
      serieLength: data.serie?.length || 0,
      serieType: typeof data.serie,
      isArray: Array.isArray(data.serie),
    });

    const serie = data.serie;

    if (!serie) {
      throw new Error("No se encontró la propiedad 'serie' en la respuesta de la API");
    }

    if (!Array.isArray(serie)) {
      console.error("[USD Full Year] Formato inesperado de serie:", typeof serie, serie);
      throw new Error(`Formato de datos inválido: serie es ${typeof serie}, se esperaba array`);
    }

    if (serie.length === 0) {
      throw new Error("La serie de datos está vacía");
    }

    console.log(`[USD Full Year] Procesando ${serie.length} registros`);

    let totalInserted = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const processedDates: string[] = [];

    // Procesar cada registro del año
    for (const record of serie) {
      try {
        if (!record.fecha || !record.valor) {
          console.warn(`[USD Full Year] Registro inválido:`, record);
          totalErrors++;
          continue;
        }

        const recordDate = new Date(record.fecha);
        const usdValue = record.valor;

        if (typeof usdValue !== "number" || isNaN(usdValue)) {
          console.warn(`[USD Full Year] Valor USD inválido para fecha ${record.fecha}:`, usdValue);
          totalErrors++;
          continue;
        }

        // Verificar si ya existe un registro para esta fecha
        const existingRecord = await prisma.currencyHistory.findUnique({
          where: { date: recordDate },
        });

        if (existingRecord) {
          if (existingRecord.usd !== usdValue) {
            // Actualizar solo si el valor es diferente
            await prisma.currencyHistory.update({
              where: { date: recordDate },
              data: { usd: usdValue },
            });
            totalUpdated++;
            console.log(`[USD Full Year] Actualizado ${record.fecha}: ${usdValue}`);
          } else {
            totalSkipped++;
          }
        } else {
          // Crear nuevo registro
          await prisma.currencyHistory.create({
            data: {
              date: recordDate,
              usd: usdValue,
              uf: 0, // Valor por defecto
            },
          });
          totalInserted++;
          console.log(`[USD Full Year] Insertado ${record.fecha}: ${usdValue}`);
        }

        processedDates.push(recordDate.toISOString().split("T")[0]);
      } catch (error) {
        console.error(`[USD Full Year] Error procesando registro para fecha ${record.fecha}:`, error);
        totalErrors++;
      }
    }

    // Calcular rango de fechas procesadas
    const sortedDates = processedDates.sort();
    const minDate = sortedDates.length > 0 ? sortedDates[0] : null;
    const maxDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;

    console.log(`[USD Full Year] Completado:`, {
      totalInserted,
      totalUpdated,
      totalSkipped,
      totalErrors,
      dateRange: { minDate, maxDate },
    });

    return NextResponse.json({
      success: true,
      message: `USD actualizado para el año ${currentYear}`,
      summary: {
        year: currentYear,
        totalInserted,
        totalUpdated,
        totalSkipped,
        totalErrors,
        totalProcessed: processedDates.length,
        dateRange: {
          minDate,
          maxDate,
        },
      },
    });
  } catch (error) {
    console.error("[USD Full Year] Error general:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { success: false, message: `Error actualizando USD del año completo: ${errorMessage}` },
      { status: 500 }
    );
  }
}
