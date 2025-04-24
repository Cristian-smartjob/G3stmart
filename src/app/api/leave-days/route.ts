import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function POST(request: Request) {
  try {
    const { startDate, endDate, personId } = await request.json();
    
    if (!startDate || !endDate || !personId) {
      return NextResponse.json(
        { message: "Missing required fields: startDate, endDate, or personId" },
        { status: 400 }
      );
    }
    
    const newLeaveDays = await prisma.leaveDays.create({
      data: {
        startDate,
        endDate,
        person: {
          connect: { id: Number(personId) }
        }
      }
    });

    return NextResponse.json({ data: newLeaveDays }, { status: 201 });
  } catch (error) {
    console.error("Error creating leave days:", error);
    return NextResponse.json(
      { message: "Error creating leave days" },
      { status: 500 }
    );
  }
} 