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
        address: true,
        companyName: true,
        marginPercentage: true,
        currencyTypeId: true,
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
      billableDay: client.billableDay ? Number(client.billableDay) : null,
      marginPercentage: client.marginPercentage ? Number(client.marginPercentage) : null,
    }));

    // console.log("Clients data from API:", serializedClients);
    return NextResponse.json({ data: serializedClients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "Error fetching clients data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json();

    // Mapear los datos del formulario a la estructura de la base de datos
    const prismaData = {
      name: clientData.name,
      rut: clientData.rut,
      companyName: clientData.company_name,
      address: clientData.address,
      billableDay: clientData.billable_day,
      currencyTypeId: clientData.currency_type_id,
      marginPercentage: clientData.margin_percentage,
    };

    console.log("Creating client with data:", prismaData);

    const newClient = await prisma.client.create({
      data: prismaData,
      include: {
        currencyType: true,
      },
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClient = {
      ...newClient,
      billableDay: newClient.billableDay ? Number(newClient.billableDay) : null,
      marginPercentage: newClient.marginPercentage ? Number(newClient.marginPercentage) : null,
    };

    return NextResponse.json({ data: serializedClient }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ message: "Error creating client" }, { status: 500 });
  }
}
