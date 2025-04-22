import { clientRepository } from "../database/repositories";
import type { Client, Contact } from "../database/prisma";
import type { Prisma } from "../database/prisma";

export class ClientService {
  async getAllClients(): Promise<Client[]> {
    return clientRepository.findAll();
  }

  async getClientById(id: number): Promise<Client | null> {
    return clientRepository.findById(id);
  }

  async createClient(clientData: {
    name: string;
    billableDay?: number;
    rut?: string;
    address?: string;
    companyName?: string;
    currencyTypeId?: number;
  }): Promise<Client> {
    const { name, billableDay, rut, address, companyName, currencyTypeId } = clientData;

    const data: Prisma.ClientCreateInput = {
      name,
      rut,
      address,
      companyName,
    };

    if (billableDay !== undefined) {
      data.billableDay = billableDay;
    }

    if (currencyTypeId) {
      data.currencyType = {
        connect: { id: currencyTypeId },
      };
    }

    return clientRepository.create(data);
  }

  async updateClient(
    id: number,
    clientData: Partial<{
      name: string;
      billableDay?: number;
      rut?: string;
      address?: string;
      companyName?: string;
      currencyTypeId?: number;
    }>
  ): Promise<Client> {
    const { name, billableDay, rut, address, companyName, currencyTypeId } = clientData;

    const data: Prisma.ClientUpdateInput = {};

    if (name) data.name = name;
    if (rut !== undefined) data.rut = rut;
    if (address !== undefined) data.address = address;
    if (companyName !== undefined) data.companyName = companyName;
    if (billableDay !== undefined) data.billableDay = billableDay;

    if (currencyTypeId) {
      data.currencyType = {
        connect: { id: currencyTypeId },
      };
    }

    return clientRepository.update(id, data);
  }

  async deleteClient(id: number): Promise<Client> {
    return clientRepository.delete(id);
  }

  async searchClientsByName(name: string): Promise<Client[]> {
    return clientRepository.findByName(name);
  }

  async addContactToClient(
    clientId: number,
    contactData: {
      name: string;
      email?: string;
      phone?: string;
    }
  ): Promise<Contact> {
    return clientRepository.addContact(clientId, contactData);
  }

  async removeContactFromClient(contactId: number): Promise<Contact> {
    return clientRepository.removeContact(contactId);
  }
}
