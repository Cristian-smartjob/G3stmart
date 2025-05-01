import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    const contactData = await request.json();
    
    if (!id) {
      return NextResponse.json({ message: "Contact ID is required" }, { status: 400 });
    }
    
    // Eliminar id del objeto de datos para evitar conflictos
    const { ...data } = contactData;
    
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    
    if (!id) {
      return NextResponse.json({ message: "Contact ID is required" }, { status: 400 });
    }
    
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