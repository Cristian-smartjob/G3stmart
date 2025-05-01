import { prisma } from "../connection/prisma";
import type {
  Prisma,
  Client,
  JobTitle,
  Role,
  Seniority,
  AFPInstitution,
  HealthInstitution,
  LeaveDays,
  People,
  CurrencyType,
  TechnicalsStacks,
} from "@prisma/client";

interface FilterCondition {
  column: string;
  operator: string;
  value: string | number | boolean | unknown[];
}

export class PeopleRepository {
  async findWithJobTitle(conditions: FilterCondition[] = []): Promise<(People & { jobTitle: JobTitle | null })[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      switch (operator) {
        case "=":
          where[column] = value;
          break;
        case ">":
          where[column] = { gt: value };
          break;
        case ">=":
          where[column] = { gte: value };
          break;
        case "<":
          where[column] = { lt: value };
          break;
        case "<=":
          where[column] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[column] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[column] = value;
      }
    });

    const result = await prisma.people.findMany({
      where,
      include: {
        jobTitle: true,
      },
    });

    return result;
  }

  async findWithAllJoins(conditions: FilterCondition[] = []): Promise<
    (People & {
      jobTitle: JobTitle | null;
      client: Client | null;
      role: Role | null;
      afpInstitution: AFPInstitution | null;
      healthInstitution: HealthInstitution | null;
      seniority: Seniority | null;
      salaryCurrencyType: CurrencyType | null;
      feeCurrencyType: CurrencyType | null;
      laptopCurrencyType: CurrencyType | null;
      technicalStacks: TechnicalsStacks | null;
    })[]
  > {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      switch (operator) {
        case "=":
          where[column] = value;
          break;
        case ">":
          where[column] = { gt: value };
          break;
        case ">=":
          where[column] = { gte: value };
          break;
        case "<":
          where[column] = { lt: value };
          break;
        case "<=":
          where[column] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[column] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[column] = value;
      }
    });

    const result = await prisma.people.findMany({
      where,
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
    return result;
  }

  async findAll(): Promise<People[]> {
    return prisma.people.findMany();
  }

  async findById(id: number): Promise<
    | (People & {
        client: Client | null;
        jobTitle: JobTitle | null;
        role: Role | null;
        seniority: Seniority | null;
        afpInstitution: AFPInstitution | null;
        healthInstitution: HealthInstitution | null;
        salaryCurrencyType: CurrencyType | null;
        feeCurrencyType: CurrencyType | null;
        laptopCurrencyType: CurrencyType | null;
        technicalStacks: TechnicalsStacks | null;
        leaveDays: LeaveDays[];
      })
    | null
  > {
    return prisma.people.findUnique({
      where: { id },
      include: {
        client: true,
        jobTitle: true,
        role: true,
        seniority: true,
        afpInstitution: true,
        healthInstitution: true,
        salaryCurrencyType: true,
        feeCurrencyType: true,
        laptopCurrencyType: true,
        technicalStacks: true,
        leaveDays: true,
      },
    });
  }

  async create(data: Omit<Prisma.PeopleCreateInput, "leaveDays" | "preInvoiceDetails">): Promise<People> {
    return prisma.people.create({ data });
  }

  async update(id: number, data: Prisma.PeopleUpdateInput): Promise<People> {
    return prisma.people.update({ where: { id }, data });
  }

  async delete(id: number): Promise<People> {
    return prisma.people.delete({ where: { id } });
  }

  async findByName(name: string): Promise<People[]> {
    return prisma.people.findMany({
      where: {
        OR: [{ name: { contains: name, mode: "insensitive" } }, { lastName: { contains: name, mode: "insensitive" } }],
      },
    });
  }

  async findByClient(clientId: number): Promise<People[]> {
    return prisma.people.findMany({
      where: { clientId },
      include: {
        jobTitle: true,
        seniority: true,
      },
    });
  }

  async addLeaveDay(personId: number, data: Omit<Prisma.LeaveDaysCreateInput, "person">): Promise<LeaveDays> {
    return prisma.leaveDays.create({
      data: {
        ...data,
        person: { connect: { id: personId } },
      },
    });
  }
}
