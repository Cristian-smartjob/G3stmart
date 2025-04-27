import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";
import { Prisma } from "@prisma/client";

// Define el tipo de parámetros esperados
interface Params {
  id: string;
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    // Esperar a que se resuelva la promesa de params
    const params = await context.params;
    const numericId = Number(params.id);

    console.log(`API: Actualizando el estado de la prefactura ID ${numericId}`);

    const requestData = await request.json();
    const { status, rejectNote, ocNumber, hesNumber, invoiceNumber, ocAmount, completedBy } = requestData;

    console.log(`API: Datos recibidos:`, requestData);

    if (!status) {
      return NextResponse.json({ message: "Se requiere el parámetro status" }, { status: 400 });
    }

    // Crear objeto con datos de actualización
    const updateData: Prisma.PreInvoiceUpdateInput = { status };

    // Agregar campos opcionales si están presentes
    if (rejectNote !== undefined) updateData.rejectNote = rejectNote;
    if (ocNumber !== undefined) updateData.ocNumber = ocNumber;
    if (hesNumber !== undefined) updateData.hesNumber = hesNumber;
    if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber;
    if (ocAmount !== undefined) updateData.ocAmount = ocAmount;

    // Si el estado cambia a COMPLETED (facturada), actualizar los campos completedBy y completedAt
    if (status === "COMPLETED") {
      // El nombre de usuario se debería obtener del contexto de autenticación
      // Por ahora usamos un valor estático para demostración
      updateData.completedBy = completedBy || "Usuario actual"; // Idealmente proviene de la sesión
      updateData.completedAt = new Date();
      console.log(
        `API: Marcando prefactura como completada por ${updateData.completedBy} en ${updateData.completedAt}`
      );
    }

    console.log(`API: Datos para actualizar:`, updateData);

    const updatedPreInvoice = await prisma.preInvoice.update({
      where: { id: numericId },
      data: updateData,
    });

    // Convertir valores Decimal a Number para evitar problemas de serialización
    const serializedPreInvoice = {
      ...updatedPreInvoice,
      value: updatedPreInvoice.value ? Number(updatedPreInvoice.value) : null,
      total: updatedPreInvoice.total ? Number(updatedPreInvoice.total) : null,
      ocAmount: updatedPreInvoice.ocAmount ? Number(updatedPreInvoice.ocAmount) : null,
    };

    console.log(`API: Prefactura actualizada correctamente:`, serializedPreInvoice);

    return NextResponse.json({ data: serializedPreInvoice }, { status: 200 });
  } catch (error) {
    console.error(`Error actualizando el estado de la prefactura:`, error);
    return NextResponse.json({ message: "Error al actualizar el estado de la prefactura" }, { status: 500 });
  }
}
