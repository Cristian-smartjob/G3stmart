import { NextResponse } from "next/server";
import { PreInvoiceRepository } from "@/infrastructure/database/repositories/preInvoiceRepository";

const preInvoiceRepository = new PreInvoiceRepository();

export async function POST() {
  try {
    // Obtenemos las prefacturas con sus relaciones
    const preInvoicesData = await preInvoiceRepository.findWithRelations();

    // Verificamos si hay datos válidos
    if (!preInvoicesData || preInvoicesData.length === 0) {
      return NextResponse.json(
        {
          data: [],
          success: true,
        },
        { status: 200 }
      );
    }

    // Serializamos y aseguramos que cada prefactura tenga cliente y contacto para evitar errores
    const serializedPreInvoices = preInvoicesData.map((invoice) => {
      // Convertir valores Decimal a Number
      const client = invoice.client
        ? {
            ...invoice.client,
            marginPercentage: invoice.client.marginPercentage ? Number(invoice.client.marginPercentage) : null,
          }
        : null;

      return {
        ...invoice,
        value: invoice.value ? Number(invoice.value) : null,
        total: invoice.total ? Number(invoice.total) : null,
        ocAmount: invoice.ocAmount ? Number(invoice.ocAmount) : null,
        client: client,
        contact: invoice.contact || null,
      };
    });

    return NextResponse.json(
      {
        data: serializedPreInvoices,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching preinvoices:`, error);
    return NextResponse.json(
      {
        message: "Error fetching preinvoices",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtenemos las prefacturas con sus relaciones
    const preInvoicesData = await preInvoiceRepository.findWithRelations();

    // Verificamos si hay datos válidos
    if (!preInvoicesData || preInvoicesData.length === 0) {
      return NextResponse.json(
        {
          data: [],
          success: true,
        },
        { status: 200 }
      );
    }

    // Serializamos y aseguramos que cada prefactura tenga cliente y contacto para evitar errores
    const serializedPreInvoices = preInvoicesData.map((invoice) => {
      // Convertir valores Decimal a Number
      const client = invoice.client
        ? {
            ...invoice.client,
            marginPercentage: invoice.client.marginPercentage ? Number(invoice.client.marginPercentage) : null,
          }
        : null;

      return {
        ...invoice,
        value: invoice.value ? Number(invoice.value) : null,
        total: invoice.total ? Number(invoice.total) : null,
        ocAmount: invoice.ocAmount ? Number(invoice.ocAmount) : null,
        client: client,
        contact: invoice.contact || null,
      };
    });

    return NextResponse.json(
      {
        data: serializedPreInvoices,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching preinvoices:`, error);
    return NextResponse.json(
      {
        message: "Error fetching preinvoices",
        success: false,
      },
      { status: 500 }
    );
  }
}
