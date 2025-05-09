import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

// Define el tipo de parámetros esperados
interface Params {
  id: string;
}

export async function GET(request: Request, context: { params: Promise<Params> }) {
  try {
    // Esperar a que se resuelva la promesa de params
    const params = await context.params;
    const preInvoiceId = Number(params.id);


    const details = await prisma.preInvoiceDetail.findMany({
      where: {
        preInvoiceId,
      },
      select: {
        id: true,
        value: true,
        status: true,
        billableDays: true,
        leaveDays: true,
        totalConsumeDays: true,
        person: {
          select: {
            id: true,
            name: true,
            lastName: true,
            dni: true,
            country: true,
            jobTitle: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Serializar valores Decimal a Number
    const serializedDetails = details.map((detail) => ({
      ...detail,
      value: detail.value ? Number(detail.value) : null,
      billableDays: detail.billableDays ? Number(detail.billableDays) : null,
      leaveDays: detail.leaveDays ? Number(detail.leaveDays) : null,
      totalConsumeDays: detail.totalConsumeDays ? Number(detail.totalConsumeDays) : null,
      // También asegurarse de que cualquier valor anidado esté serializado
      person: detail.person
        ? {
            ...detail.person,
          }
        : null,
    }));


    return NextResponse.json({ data: serializedDetails }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching pre-invoice details:`, error);
    return NextResponse.json({ message: "Error fetching pre-invoice details" }, { status: 500 });
  }
}
