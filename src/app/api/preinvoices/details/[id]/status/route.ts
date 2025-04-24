import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    if (!status || (status !== 'ASSIGN' && status !== 'NO_ASSIGN')) {
      return NextResponse.json(
        { message: "Invalid status value. Must be 'ASSIGN' or 'NO_ASSIGN'" },
        { status: 400 }
      );
    }
    
    const updatedDetail = await prisma.preInvoiceDetail.update({
      where: { id: Number(id) },
      data: { status }
    });

    return NextResponse.json({ data: updatedDetail }, { status: 200 });
  } catch (error) {
    console.error(`Error updating pre-invoice detail status:`, error);
    return NextResponse.json(
      { message: "Error updating pre-invoice detail status" },
      { status: 500 }
    );
  }
} 