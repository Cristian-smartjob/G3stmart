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
  include: { client: true; contact: true };
}>;

// Función para transformar los datos del repositorio al formato esperado por la interfaz frontend
async function mapToDomainModel(dbPreInvoice: PreInvoiceWithRelations): Promise<PreInvoice> {
  // Verificamos si existe Client, de lo contrario creamos un objeto predeterminado
  const client: Client = dbPreInvoice.client
    ? {
        id: dbPreInvoice.client.id,
        name: dbPreInvoice.client.name,
        rut: dbPreInvoice.client.rut || "",
        address: dbPreInvoice.client.address || "",
        companyName: dbPreInvoice.client.companyName || "",
        billableDay: Number(dbPreInvoice.client.billableDay) || 0,
      }
    : {
        id: 0,
        name: "Sin cliente",
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
      phone: dbPreInvoice.contact.phone || "",
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
          phone: clientContact.phone || "",
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
      name: "No asignado",
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
    contact,
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
      preInvoicesData.map(async (item) => {
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
            contact: { id: 0, name: "Error de datos" },
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
    console.log("Datos recibidos en createPreInvoice:", data);
    // Validar que tenemos los datos mínimos necesarios
    if (!data || !data.client_id || !data.month || !data.year) {
      console.error("Datos incompletos para crear prefactura:", data);
      throw new Error("Datos incompletos para crear la prefactura");
    }

    // Convertir los datos a los tipos correctos
    const clientId = Number(data.client_id);
    const contactId = data.contact_id ? Number(data.contact_id) : undefined;
    const month = Number(data.month);
    const year = Number(data.year);

    console.log("Datos procesados:", { clientId, contactId, month, year });

    // Intentar reparar la secuencia antes de crear la nueva prefactura
    try {
      // Obtener el valor máximo actual de ID
      const lastPreInvoice = await prisma.preInvoice.findFirst({
        orderBy: { id: "desc" },
      });

      const maxId = lastPreInvoice ? lastPreInvoice.id : 0;
      console.log("ID máximo actual:", maxId);

      // Reparar la secuencia usando SQL nativo
      // Esta consulta reestablece la secuencia al valor máximo actual + 1
      await prisma.$executeRaw`SELECT setval('"PreInvoice_id_seq"', ${maxId}, true)`;
      console.log("Secuencia reparada exitosamente");
    } catch (seqError) {
      console.error("Error al intentar reparar la secuencia:", seqError);
      // Continuamos de todos modos, ya que puede que no sea un problema de secuencia
    }

    // Ahora intentamos crear la prefactura usando la transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear la prefactura
      return await tx.preInvoice.create({
        data: {
          status: "PENDING",
          month: month,
          year: year,
          value: 0,
          client: {
            connect: { id: clientId },
          },
          ...(contactId
            ? {
                contact: {
                  connect: { id: contactId },
                },
              }
            : {}),
        },
        include: {
          client: true,
          contact: true,
        },
      });
    });

    console.log("PreInvoice creada con éxito:", result);
    revalidatePath("/");

    // Mapear directamente los resultados
    return await mapToDomainModel(result);
  } catch (error: unknown) {
    console.error("Error creating preInvoice:", error);

    // Mensaje de error más específico según el tipo de error
    let errorMessage = "No se pudo crear la prefactura. Por favor, intenta nuevamente más tarde.";

    if (error instanceof Error) {
      console.error("Detalles del error:", error.message);

      if (error.message.includes("Unique constraint failed on the fields: (`id`)")) {
        errorMessage = "Error interno: Conflicto con ID existente. Por favor contacta al soporte técnico.";
      }
    }

    throw new Error(errorMessage);
  }
}

export async function updatePreInvoice(id: number, data: PreInvoiceUpdate): Promise<PreInvoice> {
  try {
    console.log("updatePreInvoice: Iniciando actualización para ID:", id, "con datos:", data);
    
    // Adaptamos los datos al formato esperado por Prisma
    const updateData: Prisma.PreInvoiceUpdateInput = {};

    // Solo actualizamos el cliente si se proporciona un client_id
    if (data.client && data.client.id) {
      updateData.client = { connect: { id: data.client.id } };
    }

    // Aplicar directamente el cambio de estado si está presente
    if (data.status) {
      console.log("updatePreInvoice: Actualizando estado a:", data.status);
      updateData.status = data.status;
    }

    // También actualizar otros campos si están presentes
    if (data.ocNumber) updateData.ocNumber = data.ocNumber;
    if (data.hesNumber) updateData.hesNumber = data.hesNumber;
    if (data.invoiceNumber) updateData.invoiceNumber = data.invoiceNumber;
    if (data.rejectNote) updateData.rejectNote = data.rejectNote;
    if (data.ocAmount !== undefined) updateData.ocAmount = data.ocAmount;
    if (data.edpNumber) updateData.edpNumber = data.edpNumber;

    console.log("updatePreInvoice: Datos a actualizar:", updateData);
    
    await preInvoiceRepository.update(id, updateData);
    console.log("updatePreInvoice: Actualización exitosa en la base de datos");
    
    const preInvoiceWithRelations = await preInvoiceRepository.findById(id);
    revalidatePath("/");

    if (!preInvoiceWithRelations) {
      console.error("updatePreInvoice: No se encontró la prefactura después de la actualización");
      throw new Error("No se pudo actualizar la prefactura");
    }

    console.log("updatePreInvoice: Prefactura recuperada:", preInvoiceWithRelations);
    return await mapToDomainModel(preInvoiceWithRelations);
  } catch (error) {
    console.error("Error updating preInvoice:", error);
    throw new Error("No se pudo actualizar la prefactura");
  }
}
