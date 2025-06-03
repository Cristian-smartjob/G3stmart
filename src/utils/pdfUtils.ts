// Interfaces para el PDF
export interface PreinvoicePDFData {
  title: string;
  ufValue: number;
  workingDays: number;
  dailyHours: number;
  details: PreinvoiceDetailPDF[];
  instructions: string[];
}

export interface PreinvoiceDetailPDF {
  rut: string;
  name: string;
  country: string;
  profile: string;
  seniority: string;
  startDate: string;
  project: string;
  projectManager: string;
  absences: number;
  absenceType: string;
  workedDays: number;
  equivalentHours: number;
  tariffUF: number;
  periodValueUF: number;
  periodValueCLP: number;
  observations: string;
}

// Interfaces para tipos específicos del PDF
export interface PreInvoiceWithDetails {
  id: number;
  month: number;
  year: number;
  ufValueUsed: number | null;
  client: {
    name: string;
  } | null;
  details: Array<{
    id: number;
    value: number;
    billableDays: number;
    leaveDays: number;
    totalConsumeDays: number;
    person: {
      id: number;
      name: string;
      lastName: string;
      dni: string | null;
      country: string | null;
      seniority: {
        name: string;
        id: number;
        createdAt: Date | null;
        updatedAt: Date | null;
      } | null;
      jobTitle: {
        name: string;
      } | null;
    } | null;
  }>;
}

export interface PreinvoiceDetailRow {
  rut: string;
  name: string;
  country: string;
  profile: string;
  seniority: string;
  startDate: string;
  project: string;
  projectManager: string;
  absences: number;
  absenceType: string;
  workedDays: number;
  equivalentHours: number;
  tariffUF: number;
  periodValueUF: number;
  periodValueCLP: number;
  observations: string;
}

// Función para transformar datos de prefactura a formato PDF
export function transformToPreinvoicePDFData(preInvoiceData: PreInvoiceWithDetails): PreinvoicePDFData {
  // Validar datos de entrada
  if (!preInvoiceData) {
    throw new Error("Datos de prefactura no válidos");
  }

  const safePreInvoiceData = {
    ...preInvoiceData,
    ufValueUsed: Number(preInvoiceData.ufValueUsed) || 39127.41, // Valor por defecto
    client: preInvoiceData.client || { name: "Cliente no especificado" },
    details: preInvoiceData.details || [],
  };

  // Función helper para validar números
  const safeNumber = (value: unknown, fallback: number = 0): number => {
    const num = Number(value);
    return isFinite(num) ? num : fallback;
  };

  // Función helper para validar strings
  const safeString = (value: unknown, fallback: string = "N/A"): string => {
    return value && typeof value === "string" ? value : fallback;
  };

  // Generar mes y año del título
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthName = monthNames[safeNumber(safePreInvoiceData.month, 1) - 1] || "Mes desconocido";
  const year = safeNumber(safePreInvoiceData.year, new Date().getFullYear());

  const title = `Detalle de prefactura a ${monthName} -${year.toString().slice(-2)}`;

  // Calcular días del mes
  const daysInMonth = new Date(year, safeNumber(safePreInvoiceData.month, 1), 0).getDate();

  // Transformar detalles con validaciones seguras
  const details: PreinvoiceDetailPDF[] = safePreInvoiceData.details.map((detail) => {
    const person = detail.person;
    const fullName = person ? `${safeString(person.name)} ${safeString(person.lastName)}`.trim() || "N/A" : "N/A";

    // Valores seguros para cálculos
    const value = safeNumber(detail.value);
    const billableDays = safeNumber(detail.billableDays, daysInMonth);
    const leaveDays = safeNumber(detail.leaveDays);
    const totalConsumeDays = safeNumber(detail.totalConsumeDays, billableDays - leaveDays);

    // Cálculos seguros
    const equivalentHours = totalConsumeDays * 8; // 8 horas por día

    // Tarifa UF por hora - evitar división por cero
    const tariffUF = billableDays > 0 ? value / (billableDays * 8) : 0;

    // Valor período UF - evitar división por cero
    const periodValueUF = billableDays > 0 ? (value * totalConsumeDays) / billableDays : 0;

    // Valor período CLP
    const periodValueCLP = periodValueUF * safePreInvoiceData.ufValueUsed;

    return {
      rut: person?.dni ? safeString(person.dni) : "N/A",
      name: fullName,
      country: person?.country ? safeString(person.country) : "Chile",
      profile: person?.jobTitle?.name ? safeString(person.jobTitle.name) : "Desarrollador",
      seniority: person?.seniority?.name ? safeString(person.seniority.name) : "Junior",
      startDate: "N/A", // No disponible en los datos actuales
      project: "N/A", // No disponible en los datos actuales
      projectManager: "N/A", // No disponible en los datos actuales
      absences: safeNumber(leaveDays),
      absenceType: leaveDays > 0 ? "Ausencia justificada" : "N/A",
      workedDays: safeNumber(totalConsumeDays),
      equivalentHours: safeNumber(equivalentHours),
      tariffUF: safeNumber(tariffUF),
      periodValueUF: safeNumber(periodValueUF),
      periodValueCLP: safeNumber(periodValueCLP),
      observations: "",
    };
  });

  return {
    title,
    ufValue: safeNumber(safePreInvoiceData.ufValueUsed, 39127.41),
    workingDays: daysInMonth,
    dailyHours: 8,
    details,
    instructions: [
      "Esta prefactura detalla los servicios profesionales prestados durante el período especificado.",
      "Los valores están expresados tanto en UF como en pesos chilenos según la UF del día de facturación.",
      "Los días trabajados corresponden a los días hábiles del mes menos las ausencias registradas.",
      "Las tarifas por hora están calculadas en base a los días facturables del período.",
      "Cualquier observación adicional se incluye en la columna correspondiente.",
    ],
  };
}
