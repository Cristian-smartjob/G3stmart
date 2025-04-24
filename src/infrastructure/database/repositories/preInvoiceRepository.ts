import { prisma } from "../connection/prisma";
import type { Prisma, Client, PreInvoice, Contact } from "@prisma/client";

export class PreInvoiceRepository {
  async findAll(): Promise<PreInvoice[]> {
    return prisma.preInvoice.findMany();
  }

  async findWithRelations(): Promise<(PreInvoice & { client: Client | null; contact: Contact | null })[]> {
    return prisma.preInvoice.findMany({
      include: { client: true, contact: true },
    });
  }

  async findById(id: number): Promise<(PreInvoice & { client: Client | null; contact: Contact | null }) | null> {
    return prisma.preInvoice.findUnique({
      where: { id },
      include: { client: true, contact: true },
    });
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
