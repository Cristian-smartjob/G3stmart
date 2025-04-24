import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = params;
    const preInvoiceId = Number(id);
    
    console.log(`API: Buscando detalles para prefactura ID ${preInvoiceId}`);
    
    const details = await prisma.preInvoiceDetail.findMany({
      where: {
        preInvoiceId
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
                name: true
              }
            }
          }
        }
      }
    });

    console.log(`API: Se encontraron ${details.length} detalles para prefactura ID ${preInvoiceId}`);
    
    return NextResponse.json({ data: details }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching pre-invoice details:`, error);
    return NextResponse.json(
      { message: "Error fetching pre-invoice details" },
      { status: 500 }
    );
  }
} 