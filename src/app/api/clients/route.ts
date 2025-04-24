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
        currencyType: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({ data: clients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Error fetching clients data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json();
    
    const newClient = await prisma.client.create({
      data: clientData
    });

    return NextResponse.json({ data: newClient }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { message: "Error creating client" },
      { status: 500 }
    );
  }
} 