import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Esquema de validación para campos del Excel
const ExcelRowSchema = z.object({
  full_name: z.string().min(1, "Nombre completo es requerido"),
  dni: z.string().optional(),
  company: z.string().optional(),
  contract_type: z.string().optional(),
  start_date: z.any().optional(),
  end_date: z.any().optional(),
  client_end_date: z.any().optional(),
  status: z.string().optional(),
  causal: z.string().optional(),
  reason: z.string().optional(),
  client: z.string().optional(),
  work_mode: z.string().optional(),
  job_title: z.string().optional(),
  seniority: z.string().optional(),
  tech_stack: z.string().optional(),
  sales_manager: z.string().optional(),
  search_manager: z.string().optional(),
  delivery_manager: z.string().optional(),
  leader: z.string().optional(),
  leader_email: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  leader_phone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  birth_date: z.any().optional(),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Formato de email inválido",
    }),
  corporate_email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Formato de email corporativo inválido",
    }),
  address: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  district: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  city: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  country: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  nationality: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  afp: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  health: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  bank: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  account_number: z.any().optional(),
  salary_currency: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  salary: z.any().optional(),
  fee_currency: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  service_fee: z.any().optional(),
  has_vat: z.string().optional().nullable(),
  laptop_currency: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
  laptop_bonus: z.any().optional(),
  comment: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v === null ? "" : v)),
});

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

// Función para validar y convertir fechas
function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;

  // Intentar varios formatos comunes de fecha
  const date = new Date(dateString);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    // Intentar formatear manualmente DD/MM/YYYY o DD-MM-YYYY
    if (dateString.includes("/") || dateString.includes("-")) {
      const separator = dateString.includes("/") ? "/" : "-";
      const parts = dateString.split(separator);

      if (parts.length === 3) {
        // Asumir formato DD/MM/YYYY
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Los meses en JS van de 0-11
        const year = parseInt(parts[2]);

        const newDate = new Date(year, month, day);
        if (!isNaN(newDate.getTime())) {
          return newDate;
        }
      }
    }
    return null;
  }

  return date;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const preview = formData.get("preview") === "true";

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 });
    }

    // Verificar tipo de archivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "El archivo debe ser un Excel (.xlsx o .xls)" }, { status: 400 });
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", dateNF: "yyyy-mm-dd" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: "yyyy-mm-dd" }) as Record<string, unknown>[];

    // Validar datos
    const validationErrors: ValidationError[] = [];
    const validRows: Record<string, unknown>[] = [];

    data.forEach((row, index) => {
      try {
        // Validar fila
        ExcelRowSchema.parse(row);
        validRows.push(row);
      } catch (error: unknown) {
        if ((error as { errors?: unknown[] }).errors) {
          (error as { errors: unknown[] }).errors.forEach((err: unknown) => {
            const typedError = err as { path: string[]; message: string };
            validationErrors.push({
              row: index + 2, // +2 porque la primera fila es la cabecera y Excel comienza en 1
              field: typedError.path.join("."),
              message: typedError.message,
            });
          });
        }
      }
    });

    // Si hay errores, devolver la lista de errores
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors: validationErrors,
          preview: data.slice(0, 10),
          totalRows: data.length,
        },
        { status: 400 }
      );
    }

    // Si es preview, solo devolver la validación y preview
    if (preview) {
      return NextResponse.json({
        success: true,
        errors: [],
        preview: data.slice(0, 10),
        totalRows: data.length,
      });
    }

    // Procesar las filas válidas (solo si no es preview)
    const results = await processRows(validRows);

    return NextResponse.json({
      success: true,
      processed: results.processed,
      failed: results.failed,
      duplicated: results.duplicated,
      preview: data.slice(0, 10),
      totalRows: data.length,
    });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    return NextResponse.json({ error: "Error al procesar el archivo" }, { status: 500 });
  }
}

async function processRows(rows: Record<string, unknown>[]) {
  const processed: number[] = [];
  const failed: { row: number; error: string }[] = [];
  const duplicated: { row: number; dni: string }[] = [];

  // Función auxiliar para hacer debug de valores
  const debugValue = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
  };

  console.log(`🔄 Iniciando procesamiento de ${rows.length} filas...`);

  // Primero verificamos todos los DNIs para detectar duplicados en la base de datos
  const dniToCheck = new Map<number, string>(); // Mapa de rowIndex -> dni

  for (let i = 0; i < rows.length; i++) {
    const rowIndex = i + 2; // Excel comienza en 1 y la primera fila es cabecera
    const row = rows[i];
    const dni = row["dni"] as string;

    if (dni && dni.trim() !== "") {
      dniToCheck.set(rowIndex, dni);
    }
  }

  console.log(`📋 Verificando ${dniToCheck.size} DNIs para detectar duplicados...`);

  // Verificar todos los DNIs en una sola consulta
  if (dniToCheck.size > 0) {
    const dnisToVerify = Array.from(dniToCheck.values());

    console.log(`🔎 DNIs a verificar: ${JSON.stringify(dnisToVerify)}`);

    try {
      // Verificar conexión a la base de datos
      try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Conexión a la base de datos verificada");
      } catch (connectError) {
        console.error("❌ Error de conexión a la base de datos:", connectError);
        throw new Error("No se pudo conectar a la base de datos");
      }

      // Verificar si la tabla 'People' existe y tiene registros
      try {
        const peopleCount = await prisma.people.count();
        console.log(`📊 La tabla People contiene ${peopleCount} registros en total`);
      } catch (countError) {
        console.error("❌ Error al contar registros en la tabla People:", countError);
      }

      // Verificar DNIs duplicados
      const existingPeople = await prisma.people.findMany({
        where: {
          dni: {
            in: dnisToVerify,
            mode: "default", // Modo exacto de búsqueda
          },
        },
        select: {
          id: true,
          dni: true,
          name: true,
          lastName: true,
        },
      });

      // Validación extra para asegurar que los resultados son correctos
      const validExistingPeople = existingPeople.filter(
        (person) => person && person.dni && dnisToVerify.includes(person.dni)
      );

      console.log(`🔍 Encontrados ${validExistingPeople.length} DNIs duplicados en la base de datos.`);

      if (validExistingPeople.length > 0) {
        console.log(
          `📝 Detalles de DNIs encontrados en la base de datos: ${JSON.stringify(
            validExistingPeople.map((p) => p.dni)
          )}`
        );
      } else {
        console.log(`✅ No se encontraron DNIs duplicados en la base de datos. Todos los registros son nuevos.`);
      }

      // Crear un mapa de DNIs existentes para búsqueda rápida
      const existingDNIs = new Map();
      validExistingPeople.forEach((person) => {
        if (person.dni) {
          existingDNIs.set(person.dni, person);
          console.log(`📌 DNI "${person.dni}" ya existe en la base de datos con ID ${person.id}`);
        }
      });

      // Marcar los duplicados
      let newDniCount = 0;
      for (const [rowIndex, dni] of dniToCheck.entries()) {
        if (existingDNIs.has(dni)) {
          const person = existingDNIs.get(dni);
          console.log(
            `⚠️ DNI duplicado en fila ${rowIndex}: "${dni}" - ID existente: ${person.id} (${person.name} ${person.lastName})`
          );
          duplicated.push({ row: rowIndex, dni });
        } else {
          console.log(`✓ DNI "${dni}" en fila ${rowIndex} es nuevo, no existe en la base de datos`);
          newDniCount++;
        }
      }

      console.log(`🔢 Resumen de verificación: ${newDniCount} DNIs nuevos, ${duplicated.length} DNIs duplicados`);
    } catch (error) {
      console.error("❌ Error al verificar DNIs duplicados:", error);
    }
  }

  // Ahora procesamos cada fila
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 2; // Excel comienza en 1 y la primera fila es cabecera

    // Para la primera fila, mostrar todas las claves disponibles
    if (i === 0) {
      console.log("Nombres de columnas disponibles:", Object.keys(row));
    }

    // Verificar si la fila está completamente vacía
    const isEmpty = Object.values(row).every(
      (value) =>
        value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "")
    );

    if (isEmpty) {
      console.log(`⏩ Omitiendo fila ${rowIndex} por estar vacía`);
      continue; // Saltar al siguiente ciclo
    }

    // Verificar si el DNI ya fue marcado como duplicado
    const dni = row["dni"] as string;
    const isDuplicate = duplicated.some((item) => item.row === rowIndex);

    if (isDuplicate) {
      console.log(`➡️ Omitiendo procesamiento de fila ${rowIndex} por DNI "${dni}" duplicado.`);
      continue; // Saltar al siguiente registro
    }

    try {
      // Extraer nombre y apellido
      const fullName = (row["full_name"] as string) || "";
      const nameParts = fullName.split(" ");

      // Tomar las dos primeras palabras como nombre (si hay suficientes)
      const name = nameParts.length > 1 ? nameParts.slice(0, 2).join(" ") : nameParts.length > 0 ? nameParts[0] : "";

      // Tomar el resto como apellido
      const lastName = nameParts.length > 2 ? nameParts.slice(2).join(" ") : nameParts.length > 1 ? nameParts[1] : "";

      // Procesar cliente
      let clientId = null;
      if (row["client"]) {
        // Buscar cliente existente
        let client = await prisma.client.findFirst({
          where: {
            name: row["client"] as string,
          },
        });

        // Si no existe, crearlo
        if (!client) {
          client = await prisma.client.create({
            data: {
              name: row["client"] as string,
            },
          });
        }

        clientId = client.id;
      }

      // Buscar o crear cargo (JobTitle)
      let jobTitleId = null;
      if (row["job_title"]) {
        try {
          // Primero buscar por nombre exacto
          let jobTitle = await prisma.jobTitle.findFirst({
            where: {
              name: row["job_title"] as string,
            },
          });

          // Si no encuentra, buscar de forma insensible a mayúsculas/minúsculas
          if (!jobTitle) {
            jobTitle = await prisma.jobTitle.findFirst({
              where: {
                name: {
                  mode: "insensitive",
                  equals: row["job_title"] as string,
                },
              },
            });
          }

          // Si sigue sin existir, crearlo
          if (!jobTitle) {
            try {
              jobTitle = await prisma.jobTitle.create({
                data: {
                  name: row["job_title"] as string,
                },
              });
              console.log(`✅ Cargo creado exitosamente: ${row["job_title"]} (ID: ${jobTitle.id})`);
            } catch (createError) {
              console.error(`❌ Error al crear cargo "${row["job_title"]}":`, createError);

              // Esperar un momento e intentar buscar nuevamente
              await new Promise((resolve) => setTimeout(resolve, 100));

              jobTitle = await prisma.jobTitle.findFirst({
                where: {
                  name: row["job_title"] as string,
                },
              });

              if (jobTitle) {
                console.log(`🔍 Cargo encontrado después del error: ${row["job_title"]} (ID: ${jobTitle.id})`);
              } else {
                console.error(`❌❌ No se pudo crear ni encontrar el cargo: ${row["job_title"]}`);
              }
            }
          }

          if (jobTitle) {
            jobTitleId = jobTitle.id;
            console.log(`✓ Asignando jobTitleId: ${jobTitleId} para ${row["job_title"]}`);
          }
        } catch (error) {
          console.error(`⚠️ Error al procesar cargo "${row["job_title"]}":`, error);
        }
      }

      // Buscar o crear seniority
      let seniorityId = null;
      if (row["seniority"]) {
        let seniority = await prisma.seniority.findFirst({
          where: {
            name: row["seniority"] as string,
          },
        });

        if (!seniority) {
          try {
            seniority = await prisma.seniority.create({
              data: {
                name: row["seniority"] as string,
              },
            });
          } catch {
            // Si falla la creación, intentar buscar de nuevo
            seniority = await prisma.seniority.findFirst({
              where: {
                name: row["seniority"] as string,
              },
            });

            if (!seniority) {
              throw new Error(`No se pudo crear o encontrar la seniority: ${row["seniority"]}`);
            }
          }
        }

        seniorityId = seniority.id;
      }

      // Buscar o crear stack técnico
      let technicalStacksId = null;
      if (row["tech_stack"]) {
        try {
          // Primero buscar por nombre exacto
          let techStack = await prisma.technicalsStacks.findFirst({
            where: {
              name: row["tech_stack"] as string,
            },
          });

          // Si no encuentra, buscar de forma insensible a mayúsculas/minúsculas
          if (!techStack) {
            techStack = await prisma.technicalsStacks.findFirst({
              where: {
                name: {
                  mode: "insensitive",
                  equals: row["tech_stack"] as string,
                },
              },
            });
          }

          // Si sigue sin existir, crearlo
          if (!techStack) {
            try {
              techStack = await prisma.technicalsStacks.create({
                data: {
                  name: row["tech_stack"] as string,
                },
              });
              console.log(`✅ Stack técnico creado exitosamente: ${row["tech_stack"]} (ID: ${techStack.id})`);
            } catch (createError) {
              console.error(`❌ Error al crear stack técnico "${row["tech_stack"]}":`, createError);

              // Esperar un momento e intentar buscar nuevamente
              await new Promise((resolve) => setTimeout(resolve, 100));

              techStack = await prisma.technicalsStacks.findFirst({
                where: {
                  name: row["tech_stack"] as string,
                },
              });

              if (techStack) {
                console.log(
                  `🔍 Stack técnico encontrado después del error: ${row["tech_stack"]} (ID: ${techStack.id})`
                );
              } else {
                console.error(`❌❌ No se pudo crear ni encontrar el stack técnico: ${row["tech_stack"]}`);
              }
            }
          }

          if (techStack) {
            technicalStacksId = techStack.id;
            console.log(`✓ Asignando technicalStacksId: ${technicalStacksId} para ${row["tech_stack"]}`);
          }
        } catch (error) {
          console.error(`⚠️ Error al procesar stack técnico "${row["tech_stack"]}":`, error);
        }
      }

      // Buscar o crear institución AFP
      let afpInstitutionId = null;
      if (row["afp"]) {
        let afp = await prisma.aFPInstitution.findFirst({
          where: {
            name: row["afp"] as string,
          },
        });

        if (!afp) {
          try {
            afp = await prisma.aFPInstitution.create({
              data: {
                name: row["afp"] as string,
              },
            });
          } catch {
            // Si falla la creación, intentar buscar de nuevo
            afp = await prisma.aFPInstitution.findFirst({
              where: {
                name: row["afp"] as string,
              },
            });

            if (!afp) {
              throw new Error(`No se pudo crear o encontrar la AFP: ${row["afp"]}`);
            }
          }
        }

        afpInstitutionId = afp.id;
      }

      // Buscar o crear institución de salud
      let healthInstitutionId = null;
      if (row["health"]) {
        try {
          // Primero buscar por nombre
          let health = await prisma.healthInstitution.findFirst({
            where: {
              name: {
                equals: row["health"] as string,
                mode: "insensitive", // Búsqueda insensible a mayúsculas/minúsculas
              },
            },
          });

          // Si no existe, crearlo
          if (!health) {
            health = await prisma.healthInstitution.create({
              data: {
                name: row["health"] as string,
              },
            });
            console.log(`Institución de salud creada: ${row["health"]}`);
          }

          healthInstitutionId = health.id;
        } catch (error) {
          console.error(`Error al procesar institución de salud "${row["health"]}":`, error);
          // No interrumpir el proceso, seguir con un ID nulo
        }
      }

      // Buscar o crear tipo de moneda para sueldo
      let salaryCurrencyTypeId = null;
      if (row["salary_currency"]) {
        let currency = await prisma.currencyType.findFirst({
          where: {
            name: row["salary_currency"] as string,
          },
        });

        if (!currency) {
          try {
            currency = await prisma.currencyType.create({
              data: {
                name: row["salary_currency"] as string,
                symbol: (row["salary_currency"] as string).substring(0, 3),
              },
            });
          } catch {
            // Si falla la creación, intentar buscar de nuevo
            currency = await prisma.currencyType.findFirst({
              where: {
                name: row["salary_currency"] as string,
              },
            });

            if (!currency) {
              throw new Error(`No se pudo crear o encontrar la moneda: ${row["salary_currency"]}`);
            }
          }
        }

        salaryCurrencyTypeId = currency.id;
      }

      // Buscar o crear tipo de moneda para tarifa
      let feeCurrencyTypeId = null;
      if (row["fee_currency"]) {
        let currency = await prisma.currencyType.findFirst({
          where: {
            name: row["fee_currency"] as string,
          },
        });

        if (!currency) {
          try {
            currency = await prisma.currencyType.create({
              data: {
                name: row["fee_currency"] as string,
                symbol: (row["fee_currency"] as string).substring(0, 3),
              },
            });
          } catch {
            // Si falla la creación, intentar buscar de nuevo
            currency = await prisma.currencyType.findFirst({
              where: {
                name: row["fee_currency"] as string,
              },
            });

            if (!currency) {
              throw new Error(`No se pudo crear o encontrar la moneda: ${row["fee_currency"]}`);
            }
          }
        }

        feeCurrencyTypeId = currency.id;
      }

      // Buscar o crear tipo de moneda para laptop
      let laptopCurrencyTypeId = null;
      if (row["laptop_currency"]) {
        let currency = await prisma.currencyType.findFirst({
          where: {
            name: row["laptop_currency"] as string,
          },
        });

        if (!currency) {
          try {
            currency = await prisma.currencyType.create({
              data: {
                name: row["laptop_currency"] as string,
                symbol: (row["laptop_currency"] as string).substring(0, 3),
              },
            });
          } catch {
            // Si falla la creación, intentar buscar de nuevo
            currency = await prisma.currencyType.findFirst({
              where: {
                name: row["laptop_currency"] as string,
              },
            });

            if (!currency) {
              throw new Error(`No se pudo crear o encontrar la moneda: ${row["laptop_currency"]}`);
            }
          }
        }

        laptopCurrencyTypeId = currency.id;
      }

      // Convertir a booleano
      const isActive = row["status"]
        ? (row["status"] as string).toLowerCase() === "activo" ||
          (row["status"] as string).toLowerCase() === "true" ||
          row["status"] === "1" ||
          (row["status"] as string).toLowerCase() === "sí" ||
          (row["status"] as string).toLowerCase() === "si"
        : false;

      // Convertir a booleano para IVA
      const fee = row["has_vat"]
        ? (row["has_vat"] as string).toLowerCase() === "true" ||
          row["has_vat"] === "1" ||
          (row["has_vat"] as string).toLowerCase() === "sí" ||
          (row["has_vat"] as string).toLowerCase() === "si"
        : false;

      // Parsear fechas con manejo de errores
      const contractStart = parseDate(row["start_date"] as string | null);
      const contractEnd = parseDate(row["end_date"] as string | null);
      const contractClientEnd = parseDate(row["client_end_date"] as string | null);
      const birthDate = parseDate(row["birth_date"] as string | null);

      // Obtener valores correctamente del Excel
      const searchManagerValue =
        row["search_manager"] || row["search_manager"] || row["search_manager"] || row["search_manager"];

      const deliveryManagerValue = row["delivery_manager"] || row["delivery_manager "];

      // Registrar los valores para diagnóstico
      console.log(`Columnas disponibles para esta fila: ${Object.keys(row).join(", ")}`);
      console.log(`Intentando acceder a: "search_manager" y "delivery_manager"`);
      console.log(
        `Valores encontrados: searchManager="${searchManagerValue}", deliveryManager="${deliveryManagerValue}"`
      );

      // Crear registro de persona
      try {
        await prisma.people.create({
          data: {
            name,
            lastName,
            dni: (row["dni"] as string) || null,
            corporateName: (row["company"] as string) || null,
            corporateEmail: (row["corporate_email"] as string) || null,
            contractType: (row["contract_type"] as string) || null,
            contractStart,
            contractEnd,
            contractClientEnd,
            roleId: 2, // Default role_id
            isActive,
            causal: (row["causal"] as string) || null,
            reason: (row["reason"] as string) || null,
            clientId,
            remote: (row["work_mode"] as string) || null,
            jobTitleId,
            seniorityId,
            technicalStacksId,
            salesManager: (row["sales_manager"] as string) || null,
            searchManager: (searchManagerValue as string) || null,
            deliveryManager: (deliveryManagerValue as string) || null,
            leader: (row["leader"] as string) || null,
            leaderMail: (row["leader_email"] as string) || null,
            leaderPhone: (row["leader_phone"] as string) || null,
            birth: birthDate,
            phone: (row["phone"] as string) || null,
            email: (row["email"] as string) || null,
            address: (row["address"] as string) || null,
            sublocality: (row["district"] as string) || null,
            locality: (row["city"] as string) || null,
            country: (row["country"] as string) || null,
            nationality: (row["nationality"] as string) || null,
            afpInstitutionId,
            healthInstitutionId,
            bank: (row["bank"] as string) || null,
            accountNumber: row["account_number"]
              ? parseInt((row["account_number"] as string).replace(/\D/g, ""))
              : null,
            salaryCurrencyTypeId,
            netSalary: row["salary"] ? parseFloat((row["salary"] as string).replace(/,/g, "")) : null,
            feeCurrencyTypeId,
            serviceFee: row["service_fee"] ? parseFloat((row["service_fee"] as string).replace(/,/g, "")) : null,
            fee,
            billableDay: 30, // Default value
            laptopCurrencyTypeId,
            laptopBonus: row["laptop_bonus"] ? parseFloat((row["laptop_bonus"] as string).replace(/,/g, "")) : null,
            comment: (row["comment"] as string) || null,
          },
        });
        console.log(
          `✅ Persona creada exitosamente en fila ${rowIndex}: ${name} ${lastName} (DNI: ${debugValue(dni)})`
        );
        processed.push(rowIndex); // Añadir a procesados
      } catch (createError) {
        console.error(`❌ Error al crear persona en fila ${rowIndex}:`, createError);
        failed.push({
          row: rowIndex,
          error: createError instanceof Error ? createError.message : "Error al crear persona",
        });
      }
    } catch (error: unknown) {
      console.error(`❌ Error al procesar fila ${rowIndex}:`, error);
      failed.push({
        row: rowIndex,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  console.log(`📊 Resumen final de importación:
    - Filas procesadas: ${processed.length}
    - Filas duplicadas: ${duplicated.length}
    - Filas con errores: ${failed.length}
    - Total filas analizadas: ${rows.length}
  `);

  return { processed, failed, duplicated };
}
