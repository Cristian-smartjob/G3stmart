import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";
import axios from "axios";

function toCLDateString(date: Date): string {
  // Retorna dd-mm-yyyy
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
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
    const today = new Date();
    const todayStr = today.toISOString().substring(0, 10);
    const todayCL = toCLDateString(today);

    if (!last) {
      // Si no hay datos, solo insertar el valor del día actual
      const uf = await fetchDayValue("uf", todayCL);
      const usd = await fetchDayValue("dolar", todayCL);
      if (uf !== null && usd !== null) {
        await prisma.currencyHistory.create({
          data: {
            date: new Date(todayStr),
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
    const lastDate = new Date(last.date);
    lastDate.setDate(lastDate.getDate() + 1); // Día siguiente al último
    const missingDates: { iso: string; cl: string }[] = [];
    const d = new Date(lastDate);
    while (d <= today) {
      missingDates.push({ iso: d.toISOString().substring(0, 10), cl: toCLDateString(d) });
      d.setDate(d.getDate() + 1);
    }
    let inserted = 0;
    for (const { iso, cl } of missingDates) {
      const uf = await fetchDayValue("uf", cl);
      const usd = await fetchDayValue("dolar", cl);
      if (uf !== null && usd !== null) {
        await prisma.currencyHistory.upsert({
          where: { date: new Date(iso) },
          update: { uf, usd },
          create: { date: new Date(iso), uf, usd },
        });
        inserted++;
        console.log(`[DB] Insertado ${iso}: UF=${uf}, USD=${usd}`);
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
