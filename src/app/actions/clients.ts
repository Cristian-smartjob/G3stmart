"use server";

import { Client } from "@/interface/common";
import { prisma } from "@/infrastructure/database/connection/prisma";

export async function getClientById(id: number): Promise<Client | null> {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        rut: true,
        address: true,
        companyName: true,
        billableDay: true,
        currencyTypeId: true,
        marginPercentage: true,
      }
    });

    if (!client) {
      return null;
    }

    return {
      id: client.id,
      name: client.name,
      rut: client.rut,
      address: client.address,
      companyName: client.companyName,
      billableDay: client.billableDay ? Number(client.billableDay) : null,
      currencyTypeId: client.currencyTypeId,
      marginPercentage: client.marginPercentage ? Number(client.marginPercentage) : null,
    };
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    throw new Error("No se pudo obtener la información del cliente");
  }
} 