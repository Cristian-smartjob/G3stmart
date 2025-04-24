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
    const contactData = await request.json();
    
    // Eliminar id del objeto de datos para evitar conflictos
    const { id: contactId, ...data } = contactData;
    
    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data
    });

    return NextResponse.json({ data: updatedContact }, { status: 200 });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { message: "Error updating contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    const deletedContact = await prisma.contact.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ data: deletedContact }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { message: "Error deleting contact" },
      { status: 500 }
    );
  }
} 