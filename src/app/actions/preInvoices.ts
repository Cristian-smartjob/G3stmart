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
    invoiceNumber: dbPreInvoice.invoiceNumber || "",
    month: dbPreInvoice.month,
    year: dbPreInvoice.year,
    value: Number(dbPreInvoice.value),
    rejectNote: dbPreInvoice.rejectNote || "",
    client,
    contact,
  };
}

export async function fetchPreInvoices(): Promise<PreInvoice[]> {
  const preInvoices = await prisma.preInvoice.findMany({
    select: {
      id: true,
      status: true,
      month: true,
      year: true,
      value: true,
      total: true,
      invoiceNumber: true,
      ocNumber: true,
      hesNumber: true,
      rejectNote: true,
      ocAmount: true,
      edpNumber: true,
      completedBy: true,
      completedAt: true,
      client: {
        select: {
          id: true,
          name: true,
          marginPercentage: true,
        },
      },
      contact: {
        select: {
          id: true,
          name: true,
          lastName: true,
        },
      },
    },
  });

  // Transformar los datos numéricos para garantizar compatibilidad
  return preInvoices.map((dbPreInvoice) => {
    // Convertir Client de Prisma a nuestra interfaz Client
    const client = dbPreInvoice.client
      ? {
          id: dbPreInvoice.client.id,
          name: dbPreInvoice.client.name,
          marginPercentage: dbPreInvoice.client.marginPercentage ? Number(dbPreInvoice.client.marginPercentage) : null,
        }
      : undefined;

    // Convertir Contact de Prisma a nuestra interfaz Contact
    const contact = dbPreInvoice.contact
      ? {
          id: dbPreInvoice.contact.id,
          name: dbPreInvoice.contact.name,
          lastName: dbPreInvoice.contact.lastName || undefined, // Convertir null a undefined
        }
      : undefined;

    return {
      id: dbPreInvoice.id,
      clientId: dbPreInvoice.client?.id || null,
      client,
      contactId: dbPreInvoice.contact?.id || null,
      contact,
      status: dbPreInvoice.status,
      month: dbPreInvoice.month,
      year: dbPreInvoice.year,
      value: dbPreInvoice.value !== null ? Number(dbPreInvoice.value) : undefined,
      total: dbPreInvoice.total !== null ? Number(dbPreInvoice.total) : undefined,
      invoiceNumber: dbPreInvoice.invoiceNumber,
      ocNumber: dbPreInvoice.ocNumber,
      hesNumber: dbPreInvoice.hesNumber,
      rejectNote: dbPreInvoice.rejectNote,
      ocAmount: dbPreInvoice.ocAmount !== null ? Number(dbPreInvoice.ocAmount) : null,
      edpNumber: dbPreInvoice.edpNumber,
      completedBy: dbPreInvoice.completedBy,
      completedAt: dbPreInvoice.completedAt,
    };
  });
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

    // Obtener todos los smarters/people para agregarlos como detalles
    const allPeople = await prisma.people.findMany({
      where: {
        clientId: clientId, // Filtrar solo por smarters/people del cliente específico
      },
      select: {
        id: true,
        fee: true,
        billableDay: true,
        netSalary: true,
      },
    });

    // Validar que el cliente tenga smarters asociados
    if (!allPeople || allPeople.length === 0) {
      console.error("El cliente no tiene smarters asociados");
      throw new Error(
        "No se puede crear la prefactura. El cliente seleccionado no tiene smarters asociados. Por favor, primero asigna smarters al cliente en la sección de gestión de smarters."
      );
    }

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

    // Intentar reparar la secuencia de PreInvoiceDetail antes de crear los detalles
    try {
      // Obtener el valor máximo actual de ID en PreInvoiceDetail
      const lastPreInvoiceDetail = await prisma.preInvoiceDetail.findFirst({
        orderBy: { id: "desc" },
      });

      const maxDetailId = lastPreInvoiceDetail ? lastPreInvoiceDetail.id : 0;
      console.log("ID máximo actual de PreInvoiceDetail:", maxDetailId);

      // Reparar la secuencia usando SQL nativo
      await prisma.$executeRaw`SELECT setval('"PreInvoiceDetail_id_seq"', ${maxDetailId}, true)`;
      console.log("Secuencia de PreInvoiceDetail reparada exitosamente");
    } catch (seqError) {
      console.error("Error al intentar reparar la secuencia de PreInvoiceDetail:", seqError);
      // Continuamos de todos modos
    }

    // Calcular el valor total de la prefactura
    const totalValue = allPeople.reduce((sum, person) => {
      const netSalary = typeof person.netSalary === "number" ? person.netSalary : Number(person.netSalary);
      return sum + (netSalary || 0);
    }, 0);

    // Ahora intentamos crear la prefactura y sus detalles usando la transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear la prefactura
      const createdPreInvoice = await tx.preInvoice.create({
        data: {
          status: "PENDING",
          month: month,
          year: year,
          value: totalValue,
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

      console.log("PreInvoice creada con éxito:", createdPreInvoice);

      // Crear detalles para cada smarter/people
      for (const person of allPeople) {
        await tx.preInvoiceDetail.create({
          data: {
            status: "ASSIGN", // Estado inicial (antes era "PENDING")
            personId: person.id,
            preInvoiceId: createdPreInvoice.id,
            value: person.netSalary !== undefined && person.netSalary !== null ? Number(person.netSalary) : 0,
            billableDays: person.billableDay || 0,
            leaveDays: 0,
            totalConsumeDays: person.billableDay || 0,
          },
        });
      }

      console.log(`Se agregaron ${allPeople.length} smarters como detalles a la prefactura ${createdPreInvoice.id}`);

      return createdPreInvoice;
    });

    revalidatePath("/");

    // Mapear directamente los resultados
    return await mapToDomainModel(result);
  } catch (error) {
    console.error("Error creating preInvoice:", error);

    // Mantener el mensaje de error original si es sobre smarters
    if (error instanceof Error && error.message.includes("no tiene smarters asociados")) {
      throw error; // Re-lanzar el error original
    }

    // Para otros tipos de errores, usar mensaje genérico
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

      // Si el estado cambia a COMPLETED o facturada, registramos quién lo completó y cuándo
      if (data.status === "COMPLETED") {
        // Si no se proporciona completedBy, usamos un valor genérico
        updateData.completedBy = data.completedBy || "sistema";
        // Si no se proporciona completedAt, usamos la fecha y hora actual
        updateData.completedAt = data.completedAt || new Date();
        console.log(
          "updatePreInvoice: Registrando completación por:",
          updateData.completedBy,
          "en:",
          updateData.completedAt
        );
      }
    }

    // También actualizar otros campos si están presentes
    if (data.ocNumber) updateData.ocNumber = data.ocNumber;
    if (data.hesNumber) updateData.hesNumber = data.hesNumber;
    if (data.invoiceNumber) updateData.invoiceNumber = data.invoiceNumber;
    if (data.rejectNote) updateData.rejectNote = data.rejectNote;
    if (data.ocAmount !== undefined) updateData.ocAmount = data.ocAmount;
    if (data.edpNumber) updateData.edpNumber = data.edpNumber;
    // Permitir actualización explícita de quién completó y cuándo
    if (data.completedBy) updateData.completedBy = data.completedBy;
    if (data.completedAt) updateData.completedAt = data.completedAt;

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

export async function recalculatePreInvoice(id: number): Promise<PreInvoice> {
  try {
    console.log("Recalculando prefactura con ID:", id);

    // Obtener todos los detalles de la prefactura
    const details = await prisma.preInvoiceDetail.findMany({
      where: {
        preInvoiceId: id,
      },
      select: {
        id: true,
        value: true,
        billableDays: true,
        leaveDays: true,
        totalConsumeDays: true,
        person: {
          select: {
            id: true,
            fee: true,
            billableDay: true,
          },
        },
      },
    });

    // Calcular el nuevo valor total
    const totalValue = details.reduce((sum, detail) => {
      const fee = typeof detail.person?.fee === "number" ? detail.person.fee : Number(detail.person?.fee || 0);
      const billableDays = Number(detail.billableDays || 0);
      const leaveDays = Number(detail.leaveDays || 0);
      const totalConsumeDays = billableDays - leaveDays;

      // Actualizar el detalle con los nuevos valores
      prisma.preInvoiceDetail.update({
        where: { id: detail.id },
        data: {
          value: fee,
          totalConsumeDays: totalConsumeDays,
        },
      });

      return sum + fee;
    }, 0);

    // Actualizar la prefactura con el nuevo valor total
    const updatedPreInvoice = await prisma.preInvoice.update({
      where: { id },
      data: {
        value: totalValue,
      },
      include: {
        client: true,
        contact: true,
      },
    });

    revalidatePath("/");
    return await mapToDomainModel(updatedPreInvoice);
  } catch (error) {
    console.error("Error recalculando prefactura:", error);
    throw new Error("No se pudo recalcular la prefactura");
  }
}
