import { prisma } from "../connection/prisma";
import type { Prisma, Client, Contact } from "@prisma/client";

interface FilterCondition {
  column: string;
  operator: string;
  value: string | number | boolean | unknown[];
}

export class ContactRepository {
  async findWithClient(conditions: FilterCondition[] = []): Promise<(Contact & { client: Client | null })[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn =
        column === "is_delete"
          ? "isDelete"
          : column === "client_id"
          ? "clientId"
          : column === "created_at"
          ? "createdAt"
          : column === "updated_at"
          ? "updatedAt"
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

    const result = await prisma.contact.findMany({
      where,
      include: {
        client: true,
      },
    });
    return result;
  }

  async findAll(): Promise<Contact[]> {
    return prisma.contact.findMany();
  }

  async findById(id: number): Promise<(Contact & { client: Client | null }) | null> {
    return prisma.contact.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  async create(data: Omit<Prisma.ContactCreateInput, "client">): Promise<Contact> {
    return prisma.contact.create({ data });
  }

  async update(id: number, data: Prisma.ContactUpdateInput): Promise<Contact> {
    const result = await prisma.contact.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      name: result.name,
      lastName: result.lastName,
      email: result.email,
      phone: result.phone,
      clientId: result.clientId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: number): Promise<Contact> {
    return prisma.contact.delete({ where: { id } });
  }
}
