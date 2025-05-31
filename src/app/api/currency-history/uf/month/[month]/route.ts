import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

interface UFMonthParams {
  month: string; // Formato: YYYY-MM
}

/**
 * Valida el formato del parámetro de mes
 */
function validateMonthParam(month: string): { year: number; monthNum: number } | null {
  const monthRegex = /^(\d{4})-(\d{2})$/;
  const match = month.match(monthRegex);

  if (!match) {
    return null;
  }

  const year = parseInt(match[1], 10);
  const monthNum = parseInt(match[2], 10);

  // Validar rangos
  if (year < 2020 || year > 2030 || monthNum < 1 || monthNum > 12) {
    return null;
  }

  return { year, monthNum };
}

/**
 * Calcula el primer y último día del mes
 */
function getMonthRange(year: number, month: number): { startDate: Date; endDate: Date } {
  // Primer día del mes
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));

  // Último día del mes
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

  return { startDate, endDate };
}

export async function GET(request: NextRequest, { params }: { params: Promise<UFMonthParams> }) {
  try {
    const { month } = await params;

    console.log(`[UF Month] Consultando valores UF para ${month}`);

    // Validar formato del parámetro
    const validation = validateMonthParam(month);
    if (!validation) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato de mes inválido. Use YYYY-MM (ej: 2025-06)",
          example: "2025-06",
        },
        { status: 400 }
      );
    }

    const { year, monthNum } = validation;
    const { startDate, endDate } = getMonthRange(year, monthNum);

    // Consultar valores UF del mes
    const ufValues = await prisma.currencyHistory.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        uf: {
          gt: 0, // Solo registros con valor UF válido
        },
      },
      select: {
        date: true,
        uf: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calcular estadísticas
    const totalDays = ufValues.length;
    const ufValuesArray = ufValues.map((v) => Number(v.uf));
    const minUF = totalDays > 0 ? Math.min(...ufValuesArray) : null;
    const maxUF = totalDays > 0 ? Math.max(...ufValuesArray) : null;
    const avgUF = totalDays > 0 ? ufValuesArray.reduce((a, b) => a + b, 0) / totalDays : null;

    // Calcular días esperados en el mes
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const missingDays = daysInMonth - totalDays;

    // Formatear datos para respuesta
    const formattedValues = ufValues.map((record) => ({
      date: record.date.toISOString().split("T")[0], // YYYY-MM-DD
      uf: Number(record.uf),
      created_at: record.created_at?.toISOString(),
      updated_at: record.updated_at?.toISOString(),
    }));

    // Preparar respuesta
    const response = {
      success: true,
      data: {
        month,
        year,
        monthNum,
        statistics: {
          totalDays,
          daysInMonth,
          missingDays,
          completeness: `${((totalDays / daysInMonth) * 100).toFixed(1)}%`,
          minUF: minUF ? Number(minUF.toFixed(2)) : null,
          maxUF: maxUF ? Number(maxUF.toFixed(2)) : null,
          avgUF: avgUF ? Number(avgUF.toFixed(2)) : null,
        },
        values: formattedValues,
      },
    };

    console.log(`[UF Month] Encontrados ${totalDays} valores UF para ${month}`);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`[UF Month] Error consultando valores UF:`, error);

    return NextResponse.json(
      {
        success: false,
        message: "Error consultando valores UF del mes",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
