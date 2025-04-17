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
    const numericId = Number(id);
    
    console.log(`API: Actualizando el estado de la prefactura ID ${numericId}`);
    
    const requestData = await request.json();
    const { status, rejectNote, ocNumber, hesNumber, invoiceNumber, ocAmount } = requestData;
    
    console.log(`API: Datos recibidos:`, requestData);
    
    if (!status) {
      return NextResponse.json(
        { message: "Se requiere el parámetro status" },
        { status: 400 }
      );
    }
    
    // Crear objeto con datos de actualización
    const updateData: {
      status: string;
      rejectNote?: string;
      ocNumber?: string;
      hesNumber?: string;
      invoiceNumber?: string;
      ocAmount?: number;
    } = { status };
    
    // Agregar campos opcionales si están presentes
    if (rejectNote !== undefined) updateData.rejectNote = rejectNote;
    if (ocNumber !== undefined) updateData.ocNumber = ocNumber;
    if (hesNumber !== undefined) updateData.hesNumber = hesNumber;
    if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber;
    if (ocAmount !== undefined) updateData.ocAmount = ocAmount;
    
    console.log(`API: Datos para actualizar:`, updateData);
    
    const updatedPreInvoice = await prisma.preInvoice.update({
      where: { id: numericId },
      data: updateData
    });

    console.log(`API: Prefactura actualizada correctamente:`, updatedPreInvoice);

    return NextResponse.json({ data: updatedPreInvoice }, { status: 200 });
  } catch (error) {
    console.error(`Error actualizando el estado de la prefactura:`, error);
    return NextResponse.json(
      { message: "Error al actualizar el estado de la prefactura" },
      { status: 500 }
    );
  }
} 