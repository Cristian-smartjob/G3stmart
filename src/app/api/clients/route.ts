import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        billableDay: true,
        rut: true,
        marginPercentage: true,
        currencyType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClients = clients.map((client) => ({
      ...client,
      marginPercentage: client.marginPercentage ? Number(client.marginPercentage) : null,
    }));

    return NextResponse.json({ data: serializedClients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "Error fetching clients data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json();

    const newClient = await prisma.client.create({
      data: clientData,
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClient = {
      ...newClient,
      marginPercentage: newClient.marginPercentage ? Number(newClient.marginPercentage) : null,
    };

    return NextResponse.json({ data: serializedClient }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ message: "Error creating client" }, { status: 500 });
  }
}
