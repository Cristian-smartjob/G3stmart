import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
      include: {
        currencyType: true,
      },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClient = {
      ...client,
      marginPercentage: client.marginPercentage ? Number(client.marginPercentage) : null,
      billableDay: client.billableDay ? Number(client.billableDay) : null,
      selectedContactIds: client.selectedContactIds || [],
    };

    return NextResponse.json({ data: serializedClient }, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ message: "Error fetching client data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    const clientData = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    const updateData = {
      name: clientData.name,
      rut: clientData.rut,
      companyName: clientData.company_name,
      address: clientData.address,
      billableDay: clientData.billable_day,
      currencyTypeId: clientData.currency_type_id,
      marginPercentage: clientData.margin_percentage,
      selectedContactIds: clientData.selected_contact_ids || [],
    };

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        currencyType: true,
      },
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClient = {
      ...updatedClient,
      marginPercentage: updatedClient.marginPercentage ? Number(updatedClient.marginPercentage) : null,
      billableDay: updatedClient.billableDay ? Number(updatedClient.billableDay) : null,
      selectedContactIds: updatedClient.selectedContactIds || [],
    };

    return NextResponse.json({ data: serializedClient }, { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ message: "Error updating client" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    const deletedClient = await prisma.client.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: deletedClient }, { status: 200 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Error deleting client" }, { status: 500 });
  }
}
