import { NextRequest, NextResponse } from "next/server";
import * as ExcelJS from "exceljs";
import { prisma } from "@/infrastructure/database/connection/prisma";
import { z } from "zod";

// Esquema de validación para los datos del Excel
const ExcelRowSchema = z.object({
  "Nombre y Apellido": z.string().optional(),
  Rut: z.string().min(1, "RUT es requerido"),
  Inicio: z.unknown(),
  Término: z.unknown(),
  Motivo: z.string().optional(),
  Cliente: z.string().optional(),
  Grupo: z.string().optional(),
  observaciones: z.string().optional().nullable(),
  "N° días": z.unknown().optional(),
  Hábiles: z.unknown().optional(),
  Corridos: z.unknown().optional(),
});

// Tipo para representar errores de validación
type ValidationError = {
  rut: string;
  error: string;
};

// Función para verificar si una ausencia ya existe para evitar duplicados
async function checkDuplicateAbsence(personId: number, startDate: Date, endDate: Date): Promise<boolean> {
  const existingAbsence = await prisma.absences.findFirst({
    where: {
      person_id: personId,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return !!existingAbsence;
}

// Función para convertir fechas de Excel a objetos Date
function excelDateToJSDate(excelDate: unknown): Date | null {
  console.log("[DEBUG] Procesando fecha:", { excelDate, type: typeof excelDate });

  if (!excelDate) return null;

  // Si es un string, intentar parsearlo como fecha
  if (typeof excelDate === "string") {
    try {
      // Formato DD/MM/YYYY
      if (excelDate.includes("/")) {
        const parts = excelDate.split("/");
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          return null;
        }
        const date = new Date(year, month - 1, day);
        console.log("[DEBUG] Fecha parseada desde string:", { original: excelDate, parsed: date });
        return date;
      }

      // Formato ISO
      const isoDate = new Date(excelDate);
      if (!isNaN(isoDate.getTime())) {
        console.log("[DEBUG] Fecha parseada como ISO:", { original: excelDate, parsed: isoDate });
        return isoDate;
      }
    } catch (error) {
      console.error("Error al parsear fecha:", error);
      return null;
    }
  }

  // Si es un número, puede ser un número de serie de Excel
  if (typeof excelDate === "number") {
    // Convertir el número de serie de Excel a fecha JavaScript
    // Excel usa un sistema donde 1 = 1/1/1900
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    console.log("[DEBUG] Fecha parseada desde número Excel:", { original: excelDate, parsed: date });
    return date;
  }

  // Si es un objeto Date, devolverlo directamente
  if (excelDate instanceof Date) {
    console.log("[DEBUG] Fecha ya es objeto Date:", excelDate);
    return excelDate;
  }

  console.log("[DEBUG] No se pudo parsear la fecha:", { excelDate, type: typeof excelDate });
  return null;
}

// Función para extraer texto seguro de una celda de ExcelJS
function getCellValue(cell: ExcelJS.Cell): unknown {
  if (!cell) return null;

  // Si es una celda con fecha, devolver el valor como Date
  if (cell.type === ExcelJS.ValueType.Date) {
    console.log("[DEBUG] Celda de tipo fecha:", { value: cell.value, text: cell.text });
    return cell.value;
  }

  // Para celdas vacías o nulas
  if (cell.type === ExcelJS.ValueType.Null || cell.value === null || cell.value === undefined) {
    console.log("[DEBUG] Celda vacía o nula");
    return null;
  }

  // Para otros tipos, devolver el valor como string
  const value = cell.text || cell.value;
  console.log("[DEBUG] Valor de celda:", { value, text: cell.text, rawValue: cell.value, type: cell.type });
  return value;
}

export async function POST(request: NextRequest) {
  try {
    console.log("[DEBUG] Iniciando procesamiento de archivo de ausencias");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("[ERROR] No se proporcionó archivo");
      return NextResponse.json({ success: false, error: "No se ha proporcionado ningún archivo" }, { status: 400 });
    }

    console.log("[DEBUG] Archivo recibido:", { name: file.name, size: file.size, type: file.type });

    // Verificar tipo de archivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      console.log("[ERROR] Tipo de archivo inválido:", file.name);
      return NextResponse.json(
        { success: false, error: "El archivo debe ser un Excel (.xlsx o .xls)" },
        { status: 400 }
      );
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer();
    console.log("[DEBUG] Buffer del archivo creado, tamaño:", buffer.byteLength);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    console.log("[DEBUG] Workbook cargado exitosamente");

    // Obtener la primera hoja
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      console.log("[ERROR] No se encontró la primera hoja");
      return NextResponse.json({ success: false, error: "El archivo no contiene hojas" }, { status: 400 });
    }

    console.log("[DEBUG] Hoja encontrada:", {
      name: worksheet.name,
      rowCount: worksheet.rowCount,
      columnCount: worksheet.columnCount,
    });

    // Verificar que el archivo no esté vacío
    if (worksheet.rowCount <= 1) {
      console.log("[ERROR] Archivo vacío o solo con encabezados");
      return NextResponse.json(
        {
          success: false,
          error: "El archivo no contiene datos",
          totalFilas: 0,
          totalInsertadas: 0,
        },
        { status: 400 }
      );
    }

    // Obtener encabezados
    const headers: string[] = [];
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.text.trim();
    });

    console.log("[DEBUG] Encabezados encontrados:", headers);

    // Verificar encabezados mínimos necesarios
    const requiredHeaders = ["Rut", "Inicio", "Término"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

    if (missingHeaders.length > 0) {
      console.log("[ERROR] Faltan encabezados requeridos:", missingHeaders);
      return NextResponse.json(
        {
          success: false,
          error: `Faltan columnas requeridas: ${missingHeaders.join(", ")}`,
          totalFilas: 0,
          totalInsertadas: 0,
        },
        { status: 400 }
      );
    }

    // Procesar los datos
    const errors: ValidationError[] = [];
    const processedRuts = new Set<string>(); // Para evitar errores duplicados
    let insertedCount = 0;
    let totalRows = 0; // Contador de filas con datos reales

    console.log("[DEBUG] Iniciando procesamiento de filas de datos");

    // Verificar cuántas personas hay en la base de datos
    const totalPeople = await prisma.people.count();
    console.log("[DEBUG] Total de personas en la base de datos:", totalPeople);

    // Mostrar algunos RUTs de ejemplo de la base de datos
    const samplePeople = await prisma.people.findMany({
      select: { dni: true },
      take: 5,
    });
    console.log(
      "[DEBUG] Ejemplos de RUTs en la base de datos:",
      samplePeople.map((p) => p.dni)
    );

    // Iterar sobre las filas, comenzando desde la segunda (índice 2)
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const excelRow = worksheet.getRow(rowNumber);

      // Saltar filas vacías
      if (excelRow.cellCount === 0) {
        continue;
      }

      // Convertir fila a objeto
      const rowData: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const cell = excelRow.getCell(index + 1);
        rowData[header] = getCellValue(cell);
      });

      console.log("[DEBUG] Procesando fila", rowNumber, ":", rowData);

      // Saltar si es una fila de encabezados duplicada (verificar si el RUT es "Rut")
      if (rowData.Rut === "Rut" || rowData.Rut === "RUT") {
        console.log("[DEBUG] Saltando fila de encabezados duplicada:", rowNumber);
        continue;
      }

      try {
        // Validar fila
        const validRow = ExcelRowSchema.parse(rowData);
        console.log("[DEBUG] Fila validada:", validRow);

        // Incrementar contador solo después de validación exitosa
        totalRows++;

        // Normalizar el RUT (convertir a string y limpiar)
        const normalizedRut = String(validRow.Rut).trim();
        console.log("[DEBUG] Buscando persona con RUT normalizado:", normalizedRut);

        // Buscar la persona por RUT (intentar varias variaciones)
        let person = await prisma.people.findFirst({
          where: { dni: normalizedRut },
          select: { id: true, dni: true },
        });

        // Si no se encuentra, intentar sin guión
        if (!person && normalizedRut.includes("-")) {
          const rutWithoutDash = normalizedRut.replace("-", "");
          console.log("[DEBUG] Intentando sin guión:", rutWithoutDash);
          person = await prisma.people.findFirst({
            where: { dni: rutWithoutDash },
            select: { id: true, dni: true },
          });
        }

        // Si no se encuentra, intentar con guión si no lo tiene
        if (!person && !normalizedRut.includes("-")) {
          // Agregar guión antes del último dígito
          const rutWithDash = normalizedRut.slice(0, -1) + "-" + normalizedRut.slice(-1);
          console.log("[DEBUG] Intentando con guión:", rutWithDash);
          person = await prisma.people.findFirst({
            where: { dni: rutWithDash },
            select: { id: true, dni: true },
          });
        }

        if (!person) {
          console.log("[DEBUG] Persona no encontrada para RUT:", normalizedRut);
          // Solo agregar error si no hemos procesado este RUT antes
          if (!processedRuts.has(normalizedRut)) {
            errors.push({
              rut: normalizedRut,
              error: "Persona no encontrada con este RUT",
            });
            processedRuts.add(normalizedRut);
          }
          continue;
        }

        console.log("[DEBUG] Persona encontrada:", { id: person.id, dni: person.dni, rutBuscado: normalizedRut });

        // Procesar fechas
        const startDate = excelDateToJSDate(validRow.Inicio);
        const endDate = excelDateToJSDate(validRow.Término);

        if (!startDate || !endDate) {
          console.log("[DEBUG] Error en fechas:", {
            startDate,
            endDate,
            inicio: validRow.Inicio,
            termino: validRow.Término,
          });
          // Solo agregar error si no hemos procesado este RUT antes
          if (!processedRuts.has(normalizedRut)) {
            errors.push({
              rut: normalizedRut,
              error: "Formato de fecha inválido",
            });
            processedRuts.add(normalizedRut);
          }
          continue;
        }

        console.log("[DEBUG] Fechas procesadas:", { startDate, endDate });

        // Verificar si ya existe una ausencia similar para evitar duplicados
        const isDuplicate = await checkDuplicateAbsence(person.id, startDate, endDate);
        if (isDuplicate) {
          console.log("[DEBUG] Ausencia duplicada encontrada para:", { personId: person.id, startDate, endDate });
          // Solo agregar error si no hemos procesado este RUT antes
          if (!processedRuts.has(normalizedRut)) {
            errors.push({
              rut: normalizedRut,
              error: "Ya existe un registro de ausencia para estas fechas",
            });
            processedRuts.add(normalizedRut);
          }
          continue;
        }

        // Extraer y procesar los campos adicionales del Excel
        const totalDays = validRow["N° días"] ? Number(validRow["N° días"]) : null;
        const businessDays = validRow.Hábiles ? Number(validRow.Hábiles) : null;
        const calendarDays = validRow.Corridos ? Number(validRow.Corridos) : null;
        const observations = validRow.observaciones?.toString() || null;

        console.log("[DEBUG] Campos adicionales extraídos:", {
          totalDays,
          businessDays,
          calendarDays,
          observations,
        });

        // Crear el registro de ausencia
        const newAbsence = await prisma.absences.create({
          data: {
            person_id: person.id,
            start_date: startDate,
            end_date: endDate,
            reason: validRow.Motivo?.toString() || "",
            leave_type: "Automática", // O extraerlo si lo tiene el Excel
            total_days: totalDays,
            business_days: businessDays,
            calendar_days: calendarDays,
            observations: observations,
          },
        });

        console.log("[DEBUG] Ausencia creada exitosamente:", newAbsence);
        insertedCount++;
      } catch (error) {
        console.error(`[ERROR] Error al procesar fila ${rowNumber}:`, error);
        const rutValue = rowData.Rut ? String(rowData.Rut).trim() : "Desconocido";

        // Incrementar contador para filas con errores de validación (también son filas de datos)
        totalRows++;

        // Solo agregar error si no hemos procesado este RUT antes
        if (!processedRuts.has(rutValue)) {
          errors.push({
            rut: rutValue,
            error: error instanceof Error ? error.message : "Error desconocido",
          });
          processedRuts.add(rutValue);
        }
      }
    }

    console.log("[DEBUG] Procesamiento completado:", { totalRows, insertedCount, errorsCount: errors.length });

    return NextResponse.json({
      success: true,
      totalFilas: totalRows,
      totalInsertadas: insertedCount,
      errores: errors,
    });
  } catch (error) {
    console.error("[ERROR] Error general al procesar el archivo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar el archivo",
        totalFilas: 0,
        totalInsertadas: 0,
      },
      { status: 500 }
    );
  }
}
