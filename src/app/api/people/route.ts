import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function GET() {
  try {
    const people = await prisma.people.findMany({
      include: {
        jobTitle: true,
        client: true,
        role: true,
        afpInstitution: true,
        healthInstitution: true,
        seniority: true,
        salaryCurrencyType: true,
        feeCurrencyType: true,
        laptopCurrencyType: true,
        technicalStacks: true,
      },
    });

    return NextResponse.json({ data: people }, { status: 200 });
  } catch (error) {
    console.error("Error fetching people:", error);
    return NextResponse.json({ message: "Error fetching people data" }, { status: 500 });
  }
}
