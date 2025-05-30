import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const currencyType = searchParams.get("currency"); // 'usd' para lógica especial

    let currencyData;
    let lastRecordDate = null;

    // Obtener la última fecha cargada en la base de datos
    if (currencyType === "usd") {
      // Para USD, obtener la última fecha con valor USD válido (distinto de 0)
      const lastValidUSDRecord = await prisma.currencyHistory.findFirst({
        where: { usd: { not: 0 } },
        orderBy: { date: "desc" },
        select: { date: true },
      });
      lastRecordDate = lastValidUSDRecord?.date;
    } else {
      // Para UF o consultas generales, obtener la última fecha general
      const lastRecord = await prisma.currencyHistory.findFirst({
        orderBy: { date: "desc" },
        select: { date: true },
      });
      lastRecordDate = lastRecord?.date;
    }

    if (dateParam) {
      // Buscar por fecha específica
      const targetDate = new Date(dateParam + "T00:00:00.000Z");

      currencyData = await prisma.currencyHistory.findUnique({
        where: { date: targetDate },
      });

      // Si es USD y el valor es 0, buscar el último valor distinto de 0
      if (currencyType === "usd" && currencyData && currencyData.usd === 0) {
        const lastValidUSD = await prisma.currencyHistory.findFirst({
          where: {
            usd: { not: 0 },
            date: { lte: targetDate },
          },
          orderBy: { date: "desc" },
        });

        if (lastValidUSD) {
          // Retornar información especial indicando que se usó un valor anterior
          return NextResponse.json({
            data: {
              uf: currencyData.uf,
              usd: lastValidUSD.usd,
              date: currencyData.date.toISOString(),
              usdFallback: {
                value: lastValidUSD.usd,
                date: lastValidUSD.date.toISOString(),
                reason: "current_value_is_zero",
              },
            },
            lastRecordDate: lastRecordDate?.toISOString() || null,
          });
        }
      }
    } else {
      // Comportamiento original: obtener el más reciente
      currencyData = await prisma.currencyHistory.findFirst({
        orderBy: { date: "desc" },
      });

      // Si es USD y el valor más reciente es 0, buscar el último valor distinto de 0
      if (currencyType === "usd" && currencyData && currencyData.usd === 0) {
        const lastValidUSD = await prisma.currencyHistory.findFirst({
          where: { usd: { not: 0 } },
          orderBy: { date: "desc" },
        });

        if (lastValidUSD) {
          return NextResponse.json({
            data: {
              uf: currencyData.uf,
              usd: lastValidUSD.usd,
              date: currencyData.date.toISOString(),
              usdFallback: {
                value: lastValidUSD.usd,
                date: lastValidUSD.date.toISOString(),
                reason: "latest_value_is_zero",
              },
            },
            lastRecordDate: lastRecordDate?.toISOString() || null,
          });
        }
      }
    }

    if (!currencyData) {
      return NextResponse.json(
        {
          data: null,
          lastRecordDate: lastRecordDate?.toISOString() || null,
        },
        { status: 200 }
      );
    }

    const response: {
      data: {
        uf: number;
        usd: number;
        date: string;
      };
      lastRecordDate?: string | null;
    } = {
      data: {
        uf: currencyData.uf,
        usd: currencyData.usd,
        date: currencyData.date.toISOString(),
      },
    };

    // Agregar información de la última fecha cargada
    response.lastRecordDate = lastRecordDate?.toISOString() || null;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error obteniendo currency_history:", error);
    return NextResponse.json({ message: "Error obteniendo currency_history" }, { status: 500 });
  }
}
