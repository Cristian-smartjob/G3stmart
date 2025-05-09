import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";
import axios from "axios";
import { fechaToISOString } from "@/utils/date";

function toCLDateString(date: Date): string {
  // Retorna dd-mm-yyyy usando UTC para evitar problemas de zona horaria
  const d = date.getUTCDate().toString().padStart(2, "0");
  const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const y = date.getUTCFullYear();
  return `${d}-${m}-${y}`;
}

async function fetchDayValue(tipo: string, date: string): Promise<number | null> {
  try {
    const res = await axios.get(`https://mindicador.cl/api/${tipo}/${date}`);
    const serie = res.data.serie;
    if (serie && serie.length > 0) {
      return serie[0].valor;
    }
    console.warn(`[API] No hay datos para ${tipo} en ${date}`);
    return null;
  } catch (err) {
    if (typeof err === "object" && err !== null && "response" in err) {
      // @ts-expect-error: sabemos que puede tener response
      console.error(`[API] Error consultando ${tipo} para ${date}:`, err.response?.data || err);
    } else {
      console.error(`[API] Error consultando ${tipo} para ${date}:`, err);
    }
    return null;
  }
}

export async function POST() {
  try {
    // Buscar la última fecha en la tabla
    const last = await prisma.currencyHistory.findFirst({
      orderBy: { date: "desc" },
    });
    
    // Crear fecha en UTC para evitar problemas de zona horaria
    const today = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      12, 0, 0
    ));
    
    // Formatear fecha para consulta en formato chileno
    const todayCL = toCLDateString(today);

    if (!last) {
      // Si no hay datos, solo insertar el valor del día actual
      const uf = await fetchDayValue("uf", todayCL);
      const usd = await fetchDayValue("dolar", todayCL);
      if (uf !== null && usd !== null) {
        await prisma.currencyHistory.create({
          data: {
            date: today, // Usar fecha UTC
            uf,
            usd,
          },
        });
        return NextResponse.json({ message: "Insertado solo el valor del día actual." }, { status: 201 });
      } else {
        return NextResponse.json(
          { message: `No se pudo obtener el valor del día actual (${todayCL}). UF: ${uf}, USD: ${usd}` },
          { status: 500 }
        );
      }
    }

    // Si hay datos, insertar los días faltantes
    // Crear una copia de la fecha en UTC
    const lastDate = new Date(Date.UTC(
      last.date.getUTCFullYear(),
      last.date.getUTCMonth(),
      last.date.getUTCDate() + 1, // Día siguiente al último
      12, 0, 0
    ));
    
    const missingDates: { iso: string; cl: string; fecha: Date }[] = [];
    const d = new Date(lastDate);
    while (d <= today) {
      missingDates.push({
        iso: fechaToISOString(d),
        cl: toCLDateString(d),
        fecha: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0))
      });
      // Incrementar en UTC para evitar problemas con cambios de horario
      d.setUTCDate(d.getUTCDate() + 1);
    }
    
    let inserted = 0;
    for (const { iso, cl, fecha } of missingDates) {
      const uf = await fetchDayValue("uf", cl);
      const usd = await fetchDayValue("dolar", cl);
      if (uf !== null && usd !== null) {
        await prisma.currencyHistory.upsert({
          where: { date: fecha }, // Usar la fecha UTC
          update: { uf, usd },
          create: { date: fecha, uf, usd }, // Usar la fecha UTC
        });
        inserted++;
      } else {
        console.warn(`[DB] No se insertó ${iso} (${cl}): UF=${uf}, USD=${usd}`);
      }
    }
    return NextResponse.json({ message: `Actualización completa. Días insertados: ${inserted}` }, { status: 200 });
  } catch (error) {
    console.error("Error actualizando currency_history:", error);
    return NextResponse.json(
      {
        message: "Error actualizando currency_history",
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
      },
      { status: 500 }
    );
  }
}
