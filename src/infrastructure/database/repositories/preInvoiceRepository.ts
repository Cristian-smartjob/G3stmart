import { prisma } from "../connection/prisma";
import type { Prisma, PreInvoice, Client } from "../prisma/index";
import { FilterCondition } from "../types/database.types";

export interface PreInvoiceWithRelations extends PreInvoice {
  Client: Client;
  Contact?: { id: number; name: string; last_name: string } | null;
}

export class PreInvoiceRepository {
  async findWithRelations(conditions: FilterCondition[] = []): Promise<PreInvoiceWithRelations[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      const prismaColumn =
        column === "created_at"
          ? "createdAt"
          : column === "updated_at"
          ? "updatedAt"
          : column === "oc_number"
          ? "ocNumber"
          : column === "hes_number"
          ? "hesNumber"
          : column === "preinvoice_number"
          ? "preinvoiceNumber"
          : column === "client_id"
          ? "clientId"
          : column === "contact_id"
          ? "contactId"
          : column === "reject_note"
          ? "rejectNote"
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
      const result = await prisma.preInvoice.findMany({
        where,
        include: {
          client: true,
        },
      });

      return result
        .filter((item) => item.client !== null)
        .map((item) => ({
          ...item,
          Client: item.client as Client,
          Contact: null,
        })) as PreInvoiceWithRelations[];
    } catch (error) {
      console.error("Error fetching PreInvoice with relations:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<PreInvoiceWithRelations | null> {
    try {
      const result = await prisma.preInvoice.findUnique({
        where: { id },
        include: {
          client: true,
        },
      });

      if (!result || !result.client) return null;

      return {
        ...result,
        Client: result.client,
        Contact: null,
      } as PreInvoiceWithRelations;
    } catch (error) {
      console.error(`Error fetching PreInvoice with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: Prisma.PreInvoiceCreateInput): Promise<PreInvoice> {
    return await prisma.preInvoice.create({
      data,
    });
  }

  async update(id: number, data: Prisma.PreInvoiceUpdateInput): Promise<PreInvoice> {
    return await prisma.preInvoice.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<PreInvoice> {
    return await prisma.preInvoice.delete({
      where: { id },
    });
  }
}
