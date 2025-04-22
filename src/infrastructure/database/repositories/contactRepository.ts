import { prisma } from "../connection/prisma";
import type { Prisma, Client } from "../prisma/index";
import { FilterCondition } from "../types/database.types";

export interface ContactWithRelations {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  clientId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  client?: Client | null;
}

export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  clientId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class ContactRepository {
  async findWithClient(conditions: FilterCondition[] = []): Promise<ContactWithRelations[]> {
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

    return result.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      clientId: contact.clientId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      client: contact.client,
    }));
  }

  async findAll(): Promise<Contact[]> {
    const result = await prisma.contact.findMany();
    return result.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      clientId: contact.clientId,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }));
  }

  async findById(id: number): Promise<ContactWithRelations | null> {
    const result = await prisma.contact.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      clientId: result.clientId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      client: result.client,
    };
  }

  async create(data: Omit<Prisma.ContactCreateInput, "client">): Promise<Contact> {
    const result = await prisma.contact.create({
      data,
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      clientId: result.clientId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: number, data: Prisma.ContactUpdateInput): Promise<Contact> {
    const result = await prisma.contact.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      clientId: result.clientId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: number): Promise<Contact> {
    const result = await prisma.contact.delete({
      where: { id },
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      clientId: result.clientId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
