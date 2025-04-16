import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/connection/prisma";
import { DataTables } from "@/lib/features/data";

type Params = {
  params: {
    table: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { table } = params;
    
    let data;
    switch (table) {
      case DataTables.AFPInstitution:
        data = await prisma.aFPInstitution.findMany();
        break;
      case DataTables.JobTitle:
        data = await prisma.jobTitle.findMany();
        break;
      case DataTables.HealthInstitution:
        data = await prisma.healthInstitution.findMany();
        break;
      case DataTables.Role:
        data = await prisma.role.findMany();
        break;
      case DataTables.Seniority:
        data = await prisma.seniority.findMany();
        break;
      case DataTables.Price:
        data = await prisma.price.findMany({
          include: {
            CurrencyType: true
          }
        });
        break;
      default:
        return NextResponse.json(
          { message: `Invalid table name: ${table}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${params.table} data:`, error);
    return NextResponse.json(
      { message: `Error fetching ${params.table} data` },
      { status: 500 }
    );
  }
} 