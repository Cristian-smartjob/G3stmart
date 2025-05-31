import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    // Obtener ausencias con relación a People y Client
    const absences = await prisma.absences.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        start_date: "desc",
      },
      include: {
        person: {
          include: {
            client: true,
          },
        },
      },
    });

    // Obtener el conteo total de registros para la paginación
    const totalCount = await prisma.absences.count();

    return NextResponse.json({
      data: absences,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener ausencias:", error);
    return NextResponse.json(
      {
        error: "Error al obtener las ausencias",
      },
      { status: 500 }
    );
  }
}
