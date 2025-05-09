import { NextResponse } from "next/server";
import { FilterCondition } from "@/infrastructure/database/types/database.types";
import { GenericRepository } from "@/infrastructure/database/repositories/generic/GenericRepository";
import { getModelFromTableName } from "@/infrastructure/database/utils/prismaUtils";
import { PeopleRepository } from "@/infrastructure/database/repositories/peopleRepository";
import { ContactRepository } from "@/infrastructure/database/repositories/contactRepository";
import { PreInvoiceRepository } from "@/infrastructure/database/repositories/preInvoiceRepository";
import { ClientWithCurrencyRepository } from "@/infrastructure/database/repositories/clientWithCurrencyRepository";
import {
  AFPInstitutionRepository,
  HealthInstitutionRepository,
  SeniorityRepository,
  RoleRepository,
  JobTitleRepository,
  CurrencyTypeRepository,
  PriceRepository,
} from "@/infrastructure/database/repositories/dataRepositories";
import { DataTables } from "@/lib/features/data";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, columns, conditions, includeAllJoins } = body;

    if (!table) {
      return NextResponse.json({ error: "Table is required" }, { status: 400 });
    }

    if (table === "People") {
      const peopleRepo = new PeopleRepository();

      if (includeAllJoins) {
        const result = await peopleRepo.findWithAllJoins(conditions as FilterCondition[]);
        return NextResponse.json({ data: result });
      }

      const result = await peopleRepo.findWithJobTitle(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === "Contact") {
      const contactRepo = new ContactRepository();
      const result = await contactRepo.findWithClient(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === "Client") {
      try {
        const clientRepo = new ClientWithCurrencyRepository();
        const result = await clientRepo.findWithCurrencyType(conditions as FilterCondition[]);
        return NextResponse.json({ data: result });
      } catch (error) {
        console.error("Error fetching Client:", error);
        return NextResponse.json({ error: "Failed to fetch Client data" }, { status: 500 });
      }
    }

    if (table === "PreInvoice") {
      try {
        const preInvoiceRepo = new PreInvoiceRepository();
        const result = await preInvoiceRepo.findWithRelations();
        return NextResponse.json({ data: result });
      } catch (error) {
        console.error("Error fetching PreInvoice:", error);
        return NextResponse.json({ error: "Failed to fetch PreInvoice data" }, { status: 500 });
      }
    }

    if (table === DataTables.AFPInstitution) {
      const afpRepo = new AFPInstitutionRepository();
      const result = await afpRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.HealthInstitution) {
      const healthRepo = new HealthInstitutionRepository();
      const result = await healthRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.Seniority) {
      const seniorityRepo = new SeniorityRepository();
      const result = await seniorityRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.Role) {
      const roleRepo = new RoleRepository();
      const result = await roleRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.JobTitle) {
      const jobTitleRepo = new JobTitleRepository();
      const result = await jobTitleRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.CurrencyType) {
      const currencyRepo = new CurrencyTypeRepository();
      const result = await currencyRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    if (table === DataTables.Price) {
      const priceRepo = new PriceRepository();
      const result = await priceRepo.findAll(conditions as FilterCondition[]);
      return NextResponse.json({ data: result });
    }

    try {
      getModelFromTableName(table);
    } catch {
      return NextResponse.json({ error: `Table '${table}' is not supported` }, { status: 400 });
    }

    const genericRepo = new GenericRepository(table);
    const result = await genericRepo.find(columns, conditions as FilterCondition[]);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error in select API route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
