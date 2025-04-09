import { prisma } from "../connection/prisma";
import type { Prisma } from "../prisma/index";
import type { Client, Contact } from "../prisma/index";

export interface ClientWithContacts extends Client {
  contacts: Contact[];
}

export class ClientRepository {
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany();
  }

  async findAllWithRelations(): Promise<ClientWithContacts[]> {
    return prisma.client.findMany({
      include: { contacts: true },
    });
  }

  async findById(id: number): Promise<ClientWithContacts | null> {
    return prisma.client.findUnique({
      where: { id },
      include: { contacts: true },
    });
  }

  async create(data: Omit<Prisma.ClientCreateInput, "contacts">): Promise<Client> {
    return prisma.client.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Client> {
    return prisma.client.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Client[]> {
    return prisma.client.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }

  async addContact(clientId: number, contactData: Omit<Prisma.ContactCreateInput, "client">): Promise<Contact> {
    return prisma.contact.create({
      data: {
        ...contactData,
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  async removeContact(contactId: number): Promise<Contact> {
    return prisma.contact.delete({
      where: { id: contactId },
    });
  }
}
