import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET() {
  try {
    const last = await prisma.currencyHistory.findFirst({
      orderBy: { date: "desc" },
    });
    if (!last) {
      return NextResponse.json({ data: null }, { status: 200 });
    }
    return NextResponse.json({
      data: {
        uf: last.uf,
        usd: last.usd,
        date: last.date.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error obteniendo currency_history" }, { status: 500 });
  }
}
