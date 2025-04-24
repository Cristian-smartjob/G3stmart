import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        client: true
      }
    });

    return NextResponse.json({ data: contacts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Error fetching contacts data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contactData = await request.json();
    
    const newContact = await prisma.contact.create({
      data: contactData
    });

    return NextResponse.json({ data: newContact }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "Error creating contact" },
      { status: 500 }
    );
  }
} 