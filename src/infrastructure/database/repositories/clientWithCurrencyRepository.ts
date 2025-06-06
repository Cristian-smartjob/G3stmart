import { prisma } from "../connection/prisma";
import type { Prisma, Client, CurrencyType } from "@prisma/client";

interface FilterCondition {
  column: string;
  operator: string;
  value: string | number | boolean | unknown[];
}

export class ClientWithCurrencyRepository {
  async findWithCurrencyType(conditions: FilterCondition[] = []): Promise<(Client & { currencyType: CurrencyType | null })[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn =
        column === "created_at"
          ? "createdAt"
          : column === "updated_at"
          ? "updatedAt"
          : column === "billable_day"
          ? "billableDay"
          : column === "currency_type_id"
          ? "currencyTypeId"
          : column === "company_name"
          ? "companyName"
          : column;

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

    try {
      const result = await prisma.client.findMany({
        where,
        include: {
          currencyType: true,
        },
      });

      return result as (Client & { currencyType: CurrencyType | null })[];
    } catch (error) {
      console.error("Error fetching Client with relations:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<(Client & { currencyType: CurrencyType | null }) | null> {
    try {
      const result = await prisma.client.findUnique({
        where: { id },
        include: {
          currencyType: true,
        },
      });

      if (!result) return null;

      return result as Client & { currencyType: CurrencyType | null };
    } catch (error) {
      console.error(`Error fetching Client with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: Prisma.ClientCreateInput): Promise<Client> {
    return await prisma.client.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ClientUpdateInput): Promise<Client> {
    return await prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Client> {
    return await prisma.client.delete({
      where: { id },
    });
  }
}
