import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        currencyType: true,
      },
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClients = clients.map(client => ({
      ...client,
      marginPercentage: client.marginPercentage ? Number(client.marginPercentage) : null,
      billableDay: client.billableDay ? Number(client.billableDay) : null,
    }));

    // console.log("Clients data from API:", serializedClients);
    return NextResponse.json({ data: serializedClients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "Error fetching clients data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json();

    const newClient = await prisma.client.create({
      data: {
        name: clientData.name,
        rut: clientData.rut,
        companyName: clientData.company_name,
        address: clientData.address,
        billableDay: clientData.billable_day,
        currencyTypeId: clientData.currency_type_id,
        marginPercentage: clientData.margin_percentage,
      },
      include: {
        currencyType: true,
      },
    });

    // Convertir los valores Decimal a Number para evitar problemas de serialización
    const serializedClient = {
      ...newClient,
      marginPercentage: newClient.marginPercentage ? Number(newClient.marginPercentage) : null,
      billableDay: newClient.billableDay ? Number(newClient.billableDay) : null,
    };

    return NextResponse.json({ data: serializedClient }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ message: "Error creating client" }, { status: 500 });
  }
}
