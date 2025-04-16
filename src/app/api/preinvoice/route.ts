import { NextResponse } from "next/server";
import { PreInvoiceRepository } from "@/infrastructure/database/repositories/preInvoiceRepository";

const preInvoiceRepository = new PreInvoiceRepository();

export async function POST() {
  try {
    // Obtenemos las prefacturas con sus relaciones
    const preInvoicesData = await preInvoiceRepository.findWithRelations();
    
    // Verificamos si hay datos válidos
    if (!preInvoicesData || preInvoicesData.length === 0) {
      return NextResponse.json({ 
        data: [],
        success: true
      }, { status: 200 });
    }

    // Aseguramos que cada prefactura tenga cliente y contacto para evitar errores
    const safePreInvoices = preInvoicesData.map(invoice => {
      return {
        ...invoice,
        client: invoice.client || null,
        contact: invoice.contact || null
      };
    });
    
    return NextResponse.json({ 
      data: safePreInvoices,
      success: true
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching preinvoices:`, error);
    return NextResponse.json(
      { 
        message: "Error fetching preinvoices",
        success: false
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
      return NextResponse.json({ 
        data: [],
        success: true
      }, { status: 200 });
    }

    // Aseguramos que cada prefactura tenga cliente y contacto para evitar errores
    const safePreInvoices = preInvoicesData.map(invoice => {
      return {
        ...invoice,
        client: invoice.client || null,
        contact: invoice.contact || null
      };
    });
    
    return NextResponse.json({ 
      data: safePreInvoices,
      success: true
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching preinvoices:`, error);
    return NextResponse.json(
      { 
        message: "Error fetching preinvoices",
        success: false
      },
      { status: 500 }
    );
  }
} 