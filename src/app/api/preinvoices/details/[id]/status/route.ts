import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

// Define el tipo de parámetros esperados
interface Params {
  id: string;
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    // Esperar a que se resuelva la promesa de params
    const params = await context.params;
    const detailId = Number(params.id);

    const { status } = await request.json();

    if (!status || (status !== "ASSIGN" && status !== "NO_ASSIGN")) {
      return NextResponse.json({ message: "Invalid status value. Must be 'ASSIGN' or 'NO_ASSIGN'" }, { status: 400 });
    }

    const updatedDetail = await prisma.preInvoiceDetail.update({
      where: { id: detailId },
      data: { status },
    });

    const serializedDetail = {
      ...updatedDetail,
      value: updatedDetail.value ? Number(updatedDetail.value) : null,
      billableDays: updatedDetail.billableDays ? Number(updatedDetail.billableDays) : null,
      leaveDays: updatedDetail.leaveDays ? Number(updatedDetail.leaveDays) : null,
      totalConsumeDays: updatedDetail.totalConsumeDays ? Number(updatedDetail.totalConsumeDays) : null,
    };

    return NextResponse.json({ data: serializedDetail }, { status: 200 });
  } catch (error) {
    console.error(`Error updating pre-invoice detail status:`, error);
    return NextResponse.json({ message: "Error updating pre-invoice detail status" }, { status: 500 });
  }
}
