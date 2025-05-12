import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import type { Cell } from "exceljs";

const prisma = new PrismaClient();

// Esquema de validación para campos del Excel
const ExcelRowSchema = z.object({
  cliente: z.string().min(1, "Cliente es requerido"),
  jefatura: z.string().min(1, "Jefatura es requerido"),
  email_jefatura: z
    .string()
    .transform((val) => (typeof val === "string" ? val.trim() : ""))
    .optional()
    .transform((val) => {
      if (!val) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? val : "";
    }),
  telefono_jefatura: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === null || v === undefined) return "";
      const vStr = String(v).trim();
      return /^[0-9\s\(\)\-\+]+$/.test(vStr) ? vStr : "";
    }),
  cargo: z.string().optional(),
});

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

type ImportResult = {
  success: boolean;
  processed: number[];
  failed: { row: number; error: string }[];
  total: number;
  processedCount: number;
  failedCount: number;
  omittedRows?: { row: number; reason: string }[];
  omittedCount?: number;
};

// Función para extraer texto seguro de una celda de ExcelJS
interface RichTextPart {
  text: string;
}
interface RichTextValue {
  richText: RichTextPart[];
}
interface TextValue {
  text: string;
}
interface FormulaValue {
  formula: string;
  result?: string | number;
}

function obtenerTextoCelda(celda: Cell): string {
  const valor = celda?.value;
  if (valor === null || valor === undefined) {
    return "";
  }
  if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
    return valor.toString();
  }
  // RichText
  if (typeof valor === "object" && "richText" in valor && Array.isArray((valor as RichTextValue).richText)) {
    return (valor as RichTextValue).richText.map((part: RichTextPart) => part.text).join("");
  }
  // Hyperlink o texto simple
  if (typeof valor === "object" && "text" in valor) {
    return (valor as TextValue).text;
  }
  // Fórmula
  if (typeof valor === "object" && "formula" in valor) {
    const formulaVal = valor as FormulaValue;
    return formulaVal.result ? formulaVal.result.toString() : "";
  }
  return "";
}

// Procesar nombre completo y separarlo en nombre y apellido
function procesarNombreCompleto(nombreCompleto: string): { name: string; lastName: string } {
  const partes = nombreCompleto.trim().split(/\s+/);
  if (partes.length === 0) return { name: "", lastName: "" };
  if (partes.length === 1) return { name: partes[0], lastName: "" };

  return {
    name: partes[0],
    lastName: partes.slice(1).join(" "),
  };
}

// Caché en memoria para technical stacks ya procesados
const technicalStacksCache = new Map<string, number>();

// Modificamos la estructura de los datos de fila para incluir rowNumber
interface ExcelRowWithRowNumber extends Record<string, unknown> {
  rowNumber: number;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;
    const isPreview = data.get("preview") === "true";

    if (!file) {
      return NextResponse.json({ success: false, error: "No se ha proporcionado un archivo" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    // Obtener la primera hoja del libro
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ success: false, error: "El archivo no contiene hojas" }, { status: 400 });
    }

    // Extraer datos del excel
    const rows: ExcelRowWithRowNumber[] = [];
    const errors: ValidationError[] = [];
    const omittedRows: { row: number; reason: string }[] = [];

    // Procesamos a partir de la segunda fila (la primera es el encabezado)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Omitir la fila de encabezado

      // Extracción por posición (no por nombre de columna)
      const cliente = obtenerTextoCelda(row.getCell(1)).trim();
      const jefatura = obtenerTextoCelda(row.getCell(2)).trim();
      const emailJefatura = obtenerTextoCelda(row.getCell(3)).trim();
      const telefonoJefatura = obtenerTextoCelda(row.getCell(4)).trim();
      const cargo = obtenerTextoCelda(row.getCell(5)).trim();

      // Omitir filas con cliente o jefatura vacíos
      if (!cliente) {
        omittedRows.push({ row: rowNumber, reason: "Cliente vacío" });
        return;
      }

      if (!jefatura) {
        omittedRows.push({ row: rowNumber, reason: "Jefatura vacía" });
        return;
      }

      // Construir objeto de fila
      const excelRow = {
        cliente,
        jefatura,
        email_jefatura: emailJefatura,
        telefono_jefatura: telefonoJefatura,
        cargo,
      };

      // Validar datos
      const validationResult = ExcelRowSchema.safeParse(excelRow);

      if (!validationResult.success) {
        validationResult.error.errors.forEach((error) => {
          errors.push({
            row: rowNumber,
            field: error.path.join("."),
            message: error.message,
          });
        });
      } else {
        rows.push({
          ...validationResult.data,
          rowNumber, // Añadir el número de fila para referencia
        } as ExcelRowWithRowNumber);
      }
    });

    // Si estamos en modo vista previa, devolver los datos extraídos
    if (isPreview) {
      return NextResponse.json({
        success: true,
        preview: rows.slice(0, 10).map((r) => ({
          cliente: r.cliente,
          jefatura: r.jefatura,
          email_jefatura: r.email_jefatura,
          telefono_jefatura: r.telefono_jefatura,
          cargo: r.cargo,
        })), // Mostrar solo las primeras 10 filas, sin el número de fila
        errors: errors,
        totalRows: rows.length,
        omittedRows: omittedRows,
      });
    }

    // Si hay errores, no continuar con la importación
    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: errors,
        omittedRows: omittedRows,
      });
    }

    // Procesar e importar datos
    const result = await processRows(rows);
    result.omittedRows = [...omittedRows, ...(result.omittedRows || [])];
    result.omittedCount = result.omittedRows.length;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar el archivo: " + (error as Error).message },
      { status: 500 }
    );
  }
}

async function processRows(rows: ExcelRowWithRowNumber[]): Promise<ImportResult> {
  const processed: number[] = [];
  const failed: { row: number; error: string }[] = [];
  const omittedRows: { row: number; reason: string }[] = [];

  // Conjunto para rastrear combinaciones únicas de cliente+nombre+apellido
  const existingCombinations = new Set<string>();

  // Primero, cargamos las combinaciones que ya existen en la base de datos
  const existingContacts = await prisma.contact.findMany({
    select: {
      name: true,
      lastName: true,
      client: {
        select: {
          name: true,
        },
      },
    },
    where: {
      client: {
        isNot: null,
      },
    },
  });

  // Crear un conjunto con las combinaciones existentes
  for (const contact of existingContacts) {
    if (contact.client?.name) {
      const key = `${contact.client.name.toLowerCase()}_${contact.name.toLowerCase()}_${(
        contact.lastName || ""
      ).toLowerCase()}`;
      existingCombinations.add(key);
    }
  }

  // Preprocesar todos los technical stacks únicos primero
  console.log("🔄 Preprocesando technical stacks...");
  const uniqueStacks = new Set<string>();

  // Recolectar todos los cargos únicos
  for (const row of rows) {
    if (row.cargo && typeof row.cargo === "string" && row.cargo.trim()) {
      uniqueStacks.add(row.cargo as string);
    }
  }

  // Procesar todos los stacks únicos
  if (uniqueStacks.size > 0) {
    console.log(`⚙️ Procesando ${uniqueStacks.size} technical stacks únicos...`);

    // Primero, crear todos los stacks que no existan
    for (const stack of uniqueStacks) {
      try {
        // Intentar encontrar primero
        let existingStack = await prisma.technicalsStacks.findFirst({
          where: { name: stack },
        });

        if (!existingStack) {
          // Si no existe, crearlo
          existingStack = await prisma.technicalsStacks.create({
            data: { name: stack },
          });
          console.log(`Stack "${stack}" creado con ID: ${existingStack.id}`);
        } else {
          console.log(`Stack "${stack}" ya existía con ID: ${existingStack.id}`);
        }

        // Añadir a caché
        technicalStacksCache.set(stack, existingStack.id);
      } catch (error) {
        console.error(`Error al procesar stack "${stack}":`, error);
      }
    }

    // Verificar que todos los stacks estén en la base de datos
    console.log("✅ Verificando stacks en la base de datos...");
    const allStacks = await prisma.technicalsStacks.findMany();
    console.log(`Total de technical stacks en BD: ${allStacks.length}`);

    // Actualizar caché con todos los stacks de la BD
    for (const stack of allStacks) {
      technicalStacksCache.set(stack.name, stack.id);
    }

    console.log("✅ Preprocesamiento de stacks completado");
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = row.rowNumber ? Number(row.rowNumber) : i + 1;

    // Solo añadir logs detallados para la segunda fila (rowNumber==2 normalmente)
    const esSegundaFila = rowNumber === 2;

    if (esSegundaFila) {
      console.log(`🔍 DEPURACIÓN FILA #${rowNumber} - Iniciando procesamiento`);
      console.log(
        `📋 Datos de fila:`,
        JSON.stringify({
          cliente: row.cliente,
          jefatura: row.jefatura,
          email: row.email_jefatura,
          telefono: row.telefono_jefatura,
          cargo: row.cargo,
        })
      );
    }

    try {
      const clienteNombre = row.cliente as string;
      const jefaturaCompleta = row.jefatura as string;
      const { name, lastName } = procesarNombreCompleto(jefaturaCompleta);

      // Verificar si ya existe esa combinación de cliente+nombre+apellido
      const combinationKey = `${clienteNombre.toLowerCase()}_${name.toLowerCase()}_${(lastName || "").toLowerCase()}`;

      if (esSegundaFila) {
        console.log(`🔑 Clave de combinación: "${combinationKey}"`);
        console.log(`🔍 ¿Existe en combinaciones actuales?: ${existingCombinations.has(combinationKey)}`);
      }

      if (existingCombinations.has(combinationKey)) {
        omittedRows.push({
          row: rowNumber,
          reason: "Contacto duplicado (combinación de cliente y nombre ya existe)",
        });
        if (esSegundaFila) {
          console.log(`⏭️ Fila omitida por ser duplicado`);
        }
        continue; // Saltar a la siguiente fila
      }

      // PASO 1: Buscar o crear el cliente fuera de la transacción
      if (esSegundaFila) {
        console.log(`🔍 Buscando cliente: "${clienteNombre}"`);
      }

      let cliente = await prisma.client.findFirst({
        where: { name: clienteNombre },
      });

      if (!cliente) {
        if (esSegundaFila) {
          console.log(`➕ Cliente no encontrado, creando nuevo: "${clienteNombre}"`);
        }

        cliente = await prisma.client.create({
          data: {
            name: clienteNombre,
            address: "",
          },
        });

        if (esSegundaFila) {
          console.log(`✅ Cliente creado con ID: ${cliente.id}`);
        }
      } else if (esSegundaFila) {
        console.log(`✅ Cliente encontrado con ID: ${cliente.id}`);
      }

      // PASO 2: Buscar technical stack desde la caché
      let technicalStackId = null;
      if (row.cargo) {
        const cargoNombre = row.cargo as string;

        // Usar directamente la caché que ya contiene todos los stacks
        if (technicalStacksCache.has(cargoNombre)) {
          technicalStackId = technicalStacksCache.get(cargoNombre);
          if (esSegundaFila) {
            console.log(`✅ Technical stack recuperado de caché: ${technicalStackId}`);
          }
        } else {
          if (esSegundaFila) {
            console.warn(`⚠️ Technical stack "${cargoNombre}" no encontrado en caché`);
          }
        }
      }

      // Verificar que el technical stack realmente exista antes de asignarlo
      if (technicalStackId !== null) {
        try {
          const stackExiste = await prisma.technicalsStacks.findUnique({
            where: { id: technicalStackId },
            select: { id: true },
          });

          if (!stackExiste) {
            console.warn(
              `⚠️ Technical stack con ID ${technicalStackId} no existe en la base de datos. Se asignará null.`
            );
            technicalStackId = null;
          }
        } catch (error) {
          console.warn(`⚠️ Error al verificar technical stack ${technicalStackId}:`, error);
          technicalStackId = null;
        }
      }

      // PASO 3: Crear el contacto
      const email = (row.email_jefatura as string) || "";
      const phone = (row.telefono_jefatura as string) || "";

      if (esSegundaFila) {
        console.log(`➕ Creando contacto: ${name} ${lastName}`);
        console.log(
          `📋 Datos del contacto:`,
          JSON.stringify({
            name,
            lastName,
            clientId: cliente.id,
            email,
            phone,
            technicalStackId,
          })
        );
      }

      const contactoCreado = await prisma.contact.create({
        data: {
          name,
          lastName,
          clientId: cliente.id,
          email,
          phone,
          technicalStacksId: technicalStackId,
        },
      });

      if (esSegundaFila) {
        console.log(`✅ Contacto creado exitosamente con ID: ${contactoCreado.id}`);
      }

      // Agregar la combinación al conjunto para evitar duplicados en esta misma carga
      existingCombinations.add(combinationKey);

      processed.push(rowNumber); // Índice basado en 1 para referencia humana
    } catch (error: unknown) {
      console.error(`❌ Error procesando fila ${rowNumber}:`, error);
      if (esSegundaFila) {
        console.error(`📝 Detalles completos del error:`, error);
        console.error(`📝 Stack de error:`, error instanceof Error ? error.stack : "No stack disponible");
      }

      failed.push({
        row: rowNumber,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    success: true,
    processed,
    failed,
    total: rows.length,
    processedCount: processed.length,
    failedCount: failed.length,
    omittedRows,
    omittedCount: omittedRows.length,
  };
}
