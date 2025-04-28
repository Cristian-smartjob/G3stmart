import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, context: Params) {
  try {
    const { id } = context.params;
    const clientData = await request.json();

    // Preparar los datos para actualización en Prisma
    const updateData = {
      name: clientData.name,
      rut: clientData.rut,
      companyName: clientData.company_name,
      address: clientData.address,
      billableDay: clientData.billable_day,
      currencyTypeId: clientData.currency_type_id,
      marginPercentage: clientData.margin_percentage,
    };

    console.log("Updating client with data:", updateData);

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
    };

    console.log("Updated client:", serializedClient);
    return NextResponse.json({ data: serializedClient }, { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ message: "Error updating client" }, { status: 500 });
  }
}

export async function GET(request: Request, context: Params) {
  try {
    const { id } = context.params;

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
    };

    console.log("Client by ID:", serializedClient);
    return NextResponse.json({ data: serializedClient }, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ message: "Error fetching client data" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: Params) {
  try {
    const { id } = context.params;

    const deletedClient = await prisma.client.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: deletedClient }, { status: 200 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Error deleting client" }, { status: 500 });
  }
}
