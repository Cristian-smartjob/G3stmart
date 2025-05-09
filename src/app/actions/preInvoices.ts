"use server";

import { PreinvoiceForm } from "@/interface/form";
import { PreInvoiceRepository } from "@/infrastructure/database/repositories/preInvoiceRepository";
import type { PreInvoice, PreInvoiceUpdate, Client, Contact } from "../../interface/common";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/database/connection/prisma";
import { fechaToISOString, crearRangoFechaUTC } from "@/utils/date";

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
        billableDay: dbPreInvoice.client.billableDay ? Number(dbPreInvoice.client.billableDay) : null,
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
    ufValueUsed: dbPreInvoice.ufValueUsed ? Number(dbPreInvoice.ufValueUsed) : null,
    ufDateUsed: dbPreInvoice.ufDateUsed || null,
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
      ufValueUsed: true,
      ufDateUsed: true,
      client: {
        select: {
          id: true,
          name: true,
          marginPercentage: true,
          billableDay: true,
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
          billableDay: dbPreInvoice.client.billableDay ? Number(dbPreInvoice.client.billableDay) : null,
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
      ufValueUsed: dbPreInvoice.ufValueUsed !== null ? Number(dbPreInvoice.ufValueUsed) : null,
      ufDateUsed: dbPreInvoice.ufDateUsed || null,
    };
  });
}

/**
 * Obtiene el valor UF apropiado según la fecha de la prefactura y el día de facturación del cliente
 * Si la prefactura es para el mes actual o futuro: usa la UF del día actual
 * Si la prefactura es para un mes pasado: usa la UF del día de facturación del cliente para ese mes
 */
async function getAppropriateUFValue(
  month: number,
  year: number,
  clientBillableDay: number | null
): Promise<{ uf: number; date: Date }> {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() devuelve 0-11
    const currentYear = today.getFullYear();

    // Por defecto, usamos la UF más reciente
    const latestUF = await prisma.currencyHistory.findFirst({
      where: {},
      orderBy: { date: "desc" },
      select: { uf: true, date: true },
    });

    if (!latestUF) {
      // Mantenemos este log por ser informativo de un valor por defecto
      console.log(`⚠️ No se encontraron valores de UF en la base de datos, usando valor por defecto`);
      return { uf: 39127.41, date: today };
    }

    // Si estamos en el mes actual o futuro, usar UF actual
    if (year > currentYear || (year === currentYear && month >= currentMonth)) {
      return {
        uf: Number(latestUF.uf),
        date: latestUF.date,
      };
    }

    // Para un mes pasado, buscar la UF del día de facturación de ese mes
    // Si no hay día de facturación especificado, usar el último día del mes
    const billableDay = clientBillableDay || 25; // Valor predeterminado si no está definido

    // Calcular último día del mes
    const daysInMonth = new Date(year, month, 0).getDate();

    // Si el día de facturación es mayor que los días del mes, usar el último día
    const adjustedBillableDay = billableDay > daysInMonth ? daysInMonth : billableDay;

    // Generar la fecha basada en el día de facturación EXACTO
    // Usar UTC para evitar problemas con zonas horarias
    const targetDate = new Date(Date.UTC(year, month - 1, adjustedBillableDay, 12, 0, 0));

    // IMPORTANTE: Para días de facturación, NO queremos ajustar la fecha si cae en día hábil
    // Solo ajustamos si cae en fin de semana
    const dayOfWeek = targetDate.getDay();
    let needsAdjustment = false;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Domingo (0) o Sábado (6)
      needsAdjustment = true;
    }

    // PRIMERO: Intentar buscar con SQL directo para eliminar problemas con los tipos de fecha
    try {
      const isoDate = fechaToISOString(targetDate);

      // Nueva lógica mejorada: buscar el valor exacto o el valor anterior más cercano
      // en un solo query (hasta 5 días antes)
      const result = await prisma.$queryRaw`
        SELECT * FROM "CurrencyHistory" 
        WHERE DATE(date) <= ${isoDate}::date
        ORDER BY date DESC 
        LIMIT 1
      `;

      if (result && Array.isArray(result) && result.length > 0) {
        const resultDate = new Date(result[0].date);

        // Devolver el valor y la fecha real del registro encontrado
        return {
          uf: Number(result[0].uf),
          date: resultDate, // Usar la fecha real del valor UF encontrado
        };
      }

      // SEGUNDO: Si no encuentra con SQL directo y es fin de semana, buscar día hábil anterior
      if (needsAdjustment) {
        const fridayDate = new Date(targetDate);
        if (dayOfWeek === 0) {
          // Domingo
          fridayDate.setUTCDate(fridayDate.getUTCDate() - 2); // Retroceder al viernes
        } else if (dayOfWeek === 6) {
          // Sábado
          fridayDate.setUTCDate(fridayDate.getUTCDate() - 1); // Retroceder al viernes
        }

        const fridayIsoDate = fechaToISOString(fridayDate);

        // Buscar con SQL directo para el día hábil anterior o el más cercano
        const fridayResult = await prisma.$queryRaw`
          SELECT * FROM "CurrencyHistory" 
          WHERE DATE(date) <= ${fridayIsoDate}::date
          ORDER BY date DESC 
          LIMIT 1
        `;

        if (fridayResult && Array.isArray(fridayResult) && fridayResult.length > 0) {
          // Devolver la fecha real del registro encontrado
          const fridayResultDate = new Date(fridayResult[0].date);
          return {
            uf: Number(fridayResult[0].uf),
            date: fridayResultDate, // Usar la fecha real del valor UF encontrado
          };
        }
      }

      // TERCERO: Buscar el valor anterior más cercano como último recurso
      const historicalUF = await prisma.currencyHistory.findFirst({
        where: {
          date: {
            lt: targetDate,
          },
        },
        orderBy: { date: "desc" },
        select: { uf: true, date: true },
      });

      if (historicalUF) {
        // Devolver la fecha real del registro encontrado
        return {
          uf: Number(historicalUF.uf),
          date: historicalUF.date, // Usar la fecha real del valor UF encontrado
        };
      }

      // Si no se encuentra ningún valor, devolver el más reciente
      return {
        uf: Number(latestUF.uf),
        date: latestUF.date, // Usar la fecha real del valor UF más reciente
      };
    } catch (sqlError) {
      console.error("Error al buscar valor UF con SQL:", sqlError);
      // En caso de error SQL, intentar con el método estándar

      // Crear fechas de inicio y fin del día en UTC para evitar problemas de zona horaria
      const { inicio: startOfDay, fin: endOfDay } = crearRangoFechaUTC(targetDate);

      const exactUF = await prisma.currencyHistory.findFirst({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { date: "desc" },
        select: { uf: true, date: true },
      });

      if (exactUF) {
        return {
          uf: Number(exactUF.uf),
          date: exactUF.date, // Usar la fecha real del valor UF encontrado
        };
      }

      // Si falla, usar la UF más reciente pero con la fecha correcta
      return {
        uf: Number(latestUF.uf),
        date: latestUF.date, // Usar la fecha real del valor UF más reciente
      };
    }
  } catch (error) {
    console.error("Error general al obtener valor UF apropiado:", error);
    // En caso de error, devolver un valor por defecto con la fecha actual
    return { uf: 39127.41, date: new Date() };
  }
}

/**
 * Verifica si ya existe una prefactura para el mismo cliente, mes y año
 */
async function checkDuplicatePreInvoice(clientId: number, month: number, year: number): Promise<boolean> {
  try {
    const existingPreInvoice = await prisma.preInvoice.findFirst({
      where: {
        clientId: clientId,
        month: month,
        year: year,
      },
    });

    return !!existingPreInvoice;
  } catch (error) {
    console.error("Error al verificar prefacturas duplicadas:", error);
    return false; // En caso de error, asumimos que no hay duplicados
  }
}

export async function createPreInvoice(data: PreinvoiceForm): Promise<PreInvoice> {
  try {
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

    // Verificar si ya existe una prefactura para el mismo cliente, mes y año
    const isDuplicate = await checkDuplicatePreInvoice(clientId, month, year);
    if (isDuplicate) {
      throw new Error("Ya existe una prefactura para este cliente en el período seleccionado. No se pueden crear prefacturas duplicadas.");
    }

    // Obtener todos los smarters/people para agregarlos como detalles
    const allPeople = await prisma.people.findMany({
      where: {
        clientId: clientId, // Filtrar solo por smarters/people del cliente específico
      },
      select: {
        id: true,
        fee: true,
        serviceFee: true,
      },
    });

    // Obtener el cliente para obtener los días facturables
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
      select: {
        billableDay: true,
      },
    });

    // Validar que el cliente tenga smarters asociados
    if (!allPeople || allPeople.length === 0) {
      console.error("El cliente no tiene smarters asociados");
      throw new Error(
        "No se puede crear la prefactura. El cliente seleccionado no tiene smarters asociados. Por favor, primero asigna smarters al cliente en la sección de gestión de smarters."
      );
    }

    // Validar que el cliente tenga días facturables definidos
    if (!client || !client.billableDay) {
      console.error("El cliente no tiene días facturables definidos");
      throw new Error(
        "No se puede crear la prefactura. El cliente seleccionado no tiene días facturables definidos. Por favor, primero configura los días facturables del cliente."
      );
    }

    // Intentar reparar la secuencia antes de crear la nueva prefactura
    try {
      // Obtener el valor máximo actual de ID
      const lastPreInvoice = await prisma.preInvoice.findFirst({
        orderBy: { id: "desc" },
      });

      const maxId = lastPreInvoice ? lastPreInvoice.id : 0;

      // Reparar la secuencia usando SQL nativo
      // Esta consulta reestablece la secuencia al valor máximo actual + 1
      await prisma.$executeRaw`SELECT setval('"PreInvoice_id_seq"', ${maxId}, true)`;
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
    } catch (seqError) {
      console.error("Error al intentar reparar la secuencia de PreInvoiceDetail:", seqError);
      // Continuamos de todos modos
    }

    // Ahora intentamos crear la prefactura y sus detalles usando la transacción
    const result = await prisma.$transaction(async (tx) => {
      // Obtener el cliente para conocer su tipo de moneda
      const clientData = await tx.client.findUnique({
        where: { id: clientId },
        select: {
          currencyTypeId: true,
          billableDay: true,
        },
      });

      // Obtener el tipo de moneda del cliente (3 = UF, 1 = CLP)
      const clientCurrencyTypeId = clientData?.currencyTypeId || 1; // Por defecto CLP

      // Obtener el valor de UF apropiado según la lógica requerida
      const { uf: ufToCLPRate, date: ufDateUsed } = await getAppropriateUFValue(
        month,
        year,
        clientData?.billableDay ? Number(clientData.billableDay) : null
      );

      // Crear la prefactura inicialmente con valor 0, se actualizará después
      const createdPreInvoice = await tx.preInvoice.create({
        data: {
          status: "PENDING",
          month: month,
          year: year,
          value: 0, // Valor temporal, se actualizará después de procesar los detalles
          total: 0, // Valor temporal, se actualizará después de procesar los detalles
          client: {
            connect: { id: clientId },
          },
          ufValueUsed: clientCurrencyTypeId === 3 ? ufToCLPRate : null,
          ufDateUsed: clientCurrencyTypeId === 3 ? ufDateUsed : null,
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

      // Calcular correctamente el total
      let calculatedTotal = 0;

      // Crear detalles para cada smarter/people
      for (const person of allPeople) {
        // Obtener el valor del serviceFee y su tipo de moneda
        const serviceFee =
          person.serviceFee !== undefined && person.serviceFee !== null ? Number(person.serviceFee) : 0;

        // Intentar obtener el tipo de moneda del smarter, por defecto CLP
        const personData = await tx.people.findUnique({
          where: { id: person.id },
          select: { feeCurrencyTypeId: true },
        });

        const feeCurrencyTypeId = personData?.feeCurrencyTypeId || 1; // Por defecto CLP

        // Convertir el valor si es necesario (del currency type del smarter al currency type del cliente)
        let valueInClientCurrency = serviceFee;

        // Si el cliente usa UF (3) y el smarter usa CLP (1), convertir CLP a UF
        if (clientCurrencyTypeId === 3 && feeCurrencyTypeId === 1) {
          valueInClientCurrency = serviceFee / ufToCLPRate;
        }
        // Si el cliente usa CLP (1) y el smarter usa UF (3), convertir UF a CLP
        else if (clientCurrencyTypeId === 1 && feeCurrencyTypeId === 3) {
          valueInClientCurrency = serviceFee * ufToCLPRate;
        }

        const billableDays = client.billableDay || 0;
        const totalConsumeDays = billableDays; // Inicialmente son iguales, no hay días de ausencia

        // Calcular el total para este detalle usando la fórmula correcta
        const detailTotal = (Number(valueInClientCurrency) * Number(totalConsumeDays)) / Number(billableDays);

        // Crear el detalle con los valores calculados
        await tx.preInvoiceDetail.create({
          data: {
            status: "ASSIGN",
            personId: person.id,
            preInvoiceId: createdPreInvoice.id,
            value: valueInClientCurrency,
            billableDays: billableDays,
            leaveDays: 0,
            totalConsumeDays: totalConsumeDays,
            currency_type: clientCurrencyTypeId,
          },
        });

        // Sumar al total calculado
        calculatedTotal += detailTotal;
      }

      // Actualizar la prefactura con el total calculado correctamente
      await tx.preInvoice.update({
        where: { id: createdPreInvoice.id },
        data: {
          value: new Prisma.Decimal(calculatedTotal),
          total: new Prisma.Decimal(calculatedTotal),
        },
      });

      // Actualizar el objeto createdPreInvoice con los nuevos valores
      createdPreInvoice.value = new Prisma.Decimal(calculatedTotal);
      createdPreInvoice.total = new Prisma.Decimal(calculatedTotal);

      return createdPreInvoice;
    });

    revalidatePath("/");

    // Mapear directamente los resultados
    return await mapToDomainModel(result);
  } catch (error) {
    console.error("Error creating preInvoice:", error);

    // Mantener el mensaje de error original para casos específicos
    if (error instanceof Error) {
      // Caso 1: Error de smarters asociados
      if (error.message.includes("no tiene smarters asociados")) {
        throw error; // Re-lanzar el error original
      }
      
      // Caso 2: Error de prefactura duplicada
      if (error.message.includes("Ya existe una prefactura para este cliente en el período seleccionado")) {
        throw error; // Re-lanzar el error original
      }

      console.error("Detalles del error:", error.message);

      // Caso 3: Error de constraint de ID
      if (error.message.includes("Unique constraint failed on the fields: (`id`)")) {
        throw new Error("Error interno: Conflicto con ID existente. Por favor contacta al soporte técnico.");
      }
    }

    // Para otros tipos de errores, usar mensaje genérico
    throw new Error("No se pudo crear la prefactura. Por favor, intenta nuevamente más tarde.");
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

    // Aplicar directamente el cambio de estado si está presente
    if (data.status) {
      updateData.status = data.status;

      // Si el estado cambia a COMPLETED o facturada, registramos quién lo completó y cuándo
      if (data.status === "COMPLETED") {
        // Si no se proporciona completedBy, usamos un valor genérico
        updateData.completedBy = data.completedBy || "sistema";
        // Si no se proporciona completedAt, usamos la fecha y hora actual
        updateData.completedAt = data.completedAt || new Date();
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

    await preInvoiceRepository.update(id, updateData);

    const preInvoiceWithRelations = await preInvoiceRepository.findById(id);
    revalidatePath("/");

    if (!preInvoiceWithRelations) {
      console.error("updatePreInvoice: No se encontró la prefactura después de la actualización");
      throw new Error("No se pudo actualizar la prefactura");
    }

    return await mapToDomainModel(preInvoiceWithRelations);
  } catch (error) {
    console.error("Error updating preInvoice:", error);
    throw new Error("No se pudo actualizar la prefactura");
  }
}

export async function recalculatePreInvoice(id: number): Promise<PreInvoice> {
  try {
    // Obtener la prefactura con su cliente para conocer el currency_type
    const preInvoice = await prisma.preInvoice.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            currencyTypeId: true,
            billableDay: true,
          },
        },
      },
    });

    if (!preInvoice || !preInvoice.client) {
      throw new Error("No se encontró la prefactura o su cliente asociado");
    }

    // Obtener el tipo de moneda del cliente (3 = UF, 1 = CLP)
    const clientCurrencyTypeId = preInvoice.client.currencyTypeId || 1; // Por defecto CLP

    // Logs de diagnóstico
    console.log(
      `Recalculando prefactura ${id}, cliente: ${preInvoice.client.name}, mes/año: ${preInvoice.month}/${preInvoice.year}`
    );

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
        currency_type: true,
        person: {
          select: {
            id: true,
            serviceFee: true,
            feeCurrencyTypeId: true,
            billableDay: true,
          },
        },
      },
    });

    // Obtener el valor de UF apropiado según la lógica requerida
    const { uf: ufToCLPRate, date: ufDateUsed } = await getAppropriateUFValue(
      preInvoice.month,
      preInvoice.year,
      preInvoice.client.billableDay ? Number(preInvoice.client.billableDay) : null
    );

    // Calcular el nuevo valor total
    let totalValue = 0;

    for (const detail of details) {
      // Recuperar los valores del servicio del smarter
      const serviceFee =
        typeof detail.person?.serviceFee === "number"
          ? detail.person.serviceFee
          : Number(detail.person?.serviceFee || 0);

      const feeCurrencyTypeId = detail.person?.feeCurrencyTypeId || 1; // Por defecto CLP

      // Calcular días consumidos
      const billableDays = Number(detail.billableDays || 0);
      const leaveDays = Number(detail.leaveDays || 0);
      const totalConsumeDays = billableDays - leaveDays;

      // Convertir el valor si es necesario (del currency type del smarter al currency type del cliente)
      let valueInClientCurrency = serviceFee;

      // Si el cliente usa UF (3) y el smarter usa CLP (1), convertir CLP a UF
      if (clientCurrencyTypeId === 3 && feeCurrencyTypeId === 1) {
        valueInClientCurrency = serviceFee / ufToCLPRate;
      }
      // Si el cliente usa CLP (1) y el smarter usa UF (3), convertir UF a CLP
      else if (clientCurrencyTypeId === 1 && feeCurrencyTypeId === 3) {
        valueInClientCurrency = serviceFee * ufToCLPRate;
      }

      // Calcular el valor total por este detalle usando la fórmula correcta
      const detailTotal = (Number(valueInClientCurrency) * Number(totalConsumeDays)) / Number(billableDays);

      // Actualizar el detalle con los nuevos valores
      await prisma.preInvoiceDetail.update({
        where: { id: detail.id },
        data: {
          value: valueInClientCurrency,
          totalConsumeDays: totalConsumeDays,
          currency_type: clientCurrencyTypeId,
        },
      });

      // Sumar al total
      totalValue += detailTotal;
    }

    // Actualizar la prefactura con el nuevo valor total y la información de UF
    const updatedPreInvoice = await prisma.preInvoice.update({
      where: { id },
      data: {
        value: new Prisma.Decimal(totalValue),
        total: new Prisma.Decimal(totalValue),
        ufValueUsed: clientCurrencyTypeId === 3 ? ufToCLPRate : null,
        ufDateUsed: clientCurrencyTypeId === 3 ? ufDateUsed : null,
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