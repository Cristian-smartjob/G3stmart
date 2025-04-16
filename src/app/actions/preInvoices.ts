"use server";

import { PreinvoiceForm } from "@/interface/form";
import { PreInvoiceRepository } from "@/infrastructure/database/repositories/preInvoiceRepository";
import type { PreInvoice, PreInvoiceUpdate, Client, Contact } from "../../interface/common";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/connection/prisma";

const preInvoiceRepository = new PreInvoiceRepository();

// Definimos el tipo para los resultados con relaciones
type PreInvoiceWithRelations = Prisma.PreInvoiceGetPayload<{
  include: { client: true; contact: true }
}>;

// Función para transformar los datos del repositorio al formato esperado por la interfaz frontend
async function mapToDomainModel(dbPreInvoice: PreInvoiceWithRelations): Promise<PreInvoice> {
  // Verificamos si existe Client, de lo contrario creamos un objeto predeterminado
  const client: Client = dbPreInvoice.client ? {
    id: dbPreInvoice.client.id,
    name: dbPreInvoice.client.name,
    rut: dbPreInvoice.client.rut || "",
    address: dbPreInvoice.client.address || "",
    companyName: dbPreInvoice.client.companyName || "",
    billableDay: Number(dbPreInvoice.client.billableDay) || 0
  } : {
    id: 0,
    name: "Sin cliente"
  };

  // Intentamos obtener un contacto para este cliente
  let contact: Contact | null = null;
  
  if (dbPreInvoice.contact && dbPreInvoice.contact.id) {
    // Si ya tenemos un contacto en los datos, lo usamos
    contact = {
      id: dbPreInvoice.contact.id,
      name: dbPreInvoice.contact.name,
      lastName: dbPreInvoice.contact.lastName || "",
      email: dbPreInvoice.contact.email || "",
      phone: dbPreInvoice.contact.phone || ""
    };
  } else if (dbPreInvoice.client) {
    // Si no, intentamos buscar el primer contacto del cliente
    try {
      const clientContact = await prisma.contact.findFirst({
        where: { clientId: dbPreInvoice.client.id },
      });
      
      if (clientContact) {
        contact = {
          id: clientContact.id,
          name: clientContact.name,
          lastName: clientContact.lastName || "",
          email: clientContact.email || "",
          phone: clientContact.phone || ""
        };
      }
    } catch (error) {
      console.error("Error al buscar contacto:", error);
    }
  }
  
  // Si no pudimos encontrar ningún contacto, creamos uno en blanco
  if (!contact) {
    contact = {
      id: 0,
      name: "No asignado"
    };
  }

  // Construimos el modelo de dominio para la interfaz
  return {
    id: dbPreInvoice.id,
    status: dbPreInvoice.status,
    ocNumber: dbPreInvoice.ocNumber || "",
    hesNumber: dbPreInvoice.hesNumber || "",
    month: dbPreInvoice.month,
    year: dbPreInvoice.year,
    value: Number(dbPreInvoice.value),
    rejectNote: dbPreInvoice.rejectNote || "",
    client,
    contact
  };
}

export async function fetchPreInvoices(): Promise<PreInvoice[]> {
  try {
    const preInvoicesData = await preInvoiceRepository.findWithRelations();
    
    if (!preInvoicesData || preInvoicesData.length === 0) {
      return []; // Retornamos un array vacío en lugar de fallar
    }
    
    // Como el mapeo ahora es asíncrono, necesitamos usar Promise.all
    const mappedPreInvoices = await Promise.all(
      preInvoicesData.map(async item => {
        try {
          return await mapToDomainModel(item);
        } catch (err) {
          console.error(`Error mapeando prefactura ${item.id}:`, err);
          // Retornamos un objeto básico para evitar que falle toda la operación
          return {
            id: item.id,
            status: item.status || "PENDING",
            month: item.month,
            year: item.year,
            value: Number(item.value) || 0,
            client: { id: 0, name: "Error de datos" },
            contact: { id: 0, name: "Error de datos" }
          } as PreInvoice;
        }
      })
    );
    
    return mappedPreInvoices;
  } catch (error) {
    console.error("Error fetching preInvoices:", error);
    throw new Error("No se pudieron cargar las prefacturas");
  }
}

export async function createPreInvoice(data: PreinvoiceForm): Promise<PreInvoice> {
  try {
    // Adaptamos los datos al formato esperado por Prisma
    const insertData: Prisma.PreInvoiceCreateInput = {
      status: "PENDING",
      month: data.month || 1,
      year: data.year || new Date().getFullYear(),
      value: 0,
      client: { connect: { id: data.client_id } }
    };

    const result = await preInvoiceRepository.create(insertData);
    const preInvoiceWithRelations = await preInvoiceRepository.findById(result.id);
    revalidatePath("/");
    
    if (!preInvoiceWithRelations) {
      throw new Error("No se pudo crear la prefactura");
    }
    
    return await mapToDomainModel(preInvoiceWithRelations);
  } catch (error) {
    console.error("Error creating preInvoice:", error);
    throw new Error("No se pudo crear la prefactura");
  }
}

export async function updatePreInvoice(id: number, data: PreInvoiceUpdate): Promise<PreInvoice> {
  try {
    // Adaptamos los datos al formato esperado por Prisma
    const updateData: Prisma.PreInvoiceUpdateInput = {};
    
    // Solo actualizamos el cliente si se proporciona un client_id
    if (data.client && data.client.id) {
      updateData.client = { connect: { id: data.client.id } };
    }

    await preInvoiceRepository.update(id, updateData);
    const preInvoiceWithRelations = await preInvoiceRepository.findById(id);
    revalidatePath("/");
    
    if (!preInvoiceWithRelations) {
      throw new Error("No se pudo actualizar la prefactura");
    }
    
    return await mapToDomainModel(preInvoiceWithRelations);
  } catch (error) {
    console.error("Error updating preInvoice:", error);
    throw new Error("No se pudo actualizar la prefactura");
  }
} 