import { prisma } from "../connection/prisma";
import type {
  Prisma,
  AFPInstitution,
  HealthInstitution,
  Seniority,
  Role,
  JobTitle,
  CurrencyType,
} from "../prisma/index";
import { FilterCondition } from "../types/database.types";

export class AFPInstitutionRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<AFPInstitution[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.aFPInstitution.findMany({
      where,
    });
  }

  async findById(id: number): Promise<AFPInstitution | null> {
    return await prisma.aFPInstitution.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.AFPInstitutionCreateInput): Promise<AFPInstitution> {
    return await prisma.aFPInstitution.create({
      data,
    });
  }

  async update(id: number, data: Prisma.AFPInstitutionUpdateInput): Promise<AFPInstitution> {
    return await prisma.aFPInstitution.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<AFPInstitution> {
    return await prisma.aFPInstitution.delete({
      where: { id },
    });
  }
}

export class HealthInstitutionRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<HealthInstitution[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.healthInstitution.findMany({
      where,
    });
  }

  async findById(id: number): Promise<HealthInstitution | null> {
    return await prisma.healthInstitution.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.HealthInstitutionCreateInput): Promise<HealthInstitution> {
    return await prisma.healthInstitution.create({
      data,
    });
  }

  async update(id: number, data: Prisma.HealthInstitutionUpdateInput): Promise<HealthInstitution> {
    return await prisma.healthInstitution.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<HealthInstitution> {
    return await prisma.healthInstitution.delete({
      where: { id },
    });
  }
}

export class SeniorityRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<Seniority[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.seniority.findMany({
      where,
    });
  }

  async findById(id: number): Promise<Seniority | null> {
    return await prisma.seniority.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.SeniorityCreateInput): Promise<Seniority> {
    return await prisma.seniority.create({
      data,
    });
  }

  async update(id: number, data: Prisma.SeniorityUpdateInput): Promise<Seniority> {
    return await prisma.seniority.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Seniority> {
    return await prisma.seniority.delete({
      where: { id },
    });
  }
}

export class RoleRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<Role[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.role.findMany({
      where,
    });
  }

  async findById(id: number): Promise<Role | null> {
    return await prisma.role.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return await prisma.role.create({
      data,
    });
  }

  async update(id: number, data: Prisma.RoleUpdateInput): Promise<Role> {
    return await prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Role> {
    return await prisma.role.delete({
      where: { id },
    });
  }
}

export class JobTitleRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<JobTitle[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.jobTitle.findMany({
      where,
    });
  }

  async findById(id: number): Promise<JobTitle | null> {
    return await prisma.jobTitle.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.JobTitleCreateInput): Promise<JobTitle> {
    return await prisma.jobTitle.create({
      data,
    });
  }

  async update(id: number, data: Prisma.JobTitleUpdateInput): Promise<JobTitle> {
    return await prisma.jobTitle.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<JobTitle> {
    return await prisma.jobTitle.delete({
      where: { id },
    });
  }
}

export class CurrencyTypeRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<CurrencyType[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    return await prisma.currencyType.findMany({
      where,
    });
  }

  async findById(id: number): Promise<CurrencyType | null> {
    return await prisma.currencyType.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.CurrencyTypeCreateInput): Promise<CurrencyType> {
    return await prisma.currencyType.create({
      data,
    });
  }

  async update(id: number, data: Prisma.CurrencyTypeUpdateInput): Promise<CurrencyType> {
    return await prisma.currencyType.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<CurrencyType> {
    return await prisma.currencyType.delete({
      where: { id },
    });
  }
}

export class PriceRepository {
  async findAll(conditions: FilterCondition[] = []): Promise<any[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn = column === "created_at" ? "createdAt" : column === "updated_at" ? "updatedAt" : column;

      switch (operator) {
        case "=":
          where[prismaColumn] = value;
          break;
        case ">":
          where[prismaColumn] = { gt: value };
          break;
        case ">=":
          where[prismaColumn] = { gte: value };
          break;
        case "<":
          where[prismaColumn] = { lt: value };
          break;
        case "<=":
          where[prismaColumn] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[prismaColumn] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[prismaColumn] = value;
      }
    });

    const result = await prisma.price.findMany({
      where,
      include: {
        currencyType: true,
      },
    });

    return result.map((price) => ({
      id: price.id,
      name: price.name,
      value: price.amount?.toNumber() || 0,
      description: price.description,
      createdAt: price.createdAt,
      updatedAt: price.updatedAt,
      CurrencyType: price.currencyType,
    }));
  }

  async findById(id: number): Promise<any | null> {
    const result = await prisma.price.findUnique({
      where: { id },
      include: {
        currencyType: true,
      },
    });

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      value: result.amount?.toNumber() || 0,
      description: result.description,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      CurrencyType: result.currencyType,
    };
  }

  async create(data: any): Promise<any> {
    const { value, CurrencyType, ...rest } = data;

    const result = await prisma.price.create({
      data: {
        ...rest,
        amount: value,
        currencyType: CurrencyType
          ? {
              connect: { id: CurrencyType.id },
            }
          : undefined,
      },
      include: {
        currencyType: true,
      },
    });

    return {
      id: result.id,
      name: result.name,
      value: result.amount?.toNumber() || 0,
      description: result.description,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      CurrencyType: result.currencyType,
    };
  }
}
