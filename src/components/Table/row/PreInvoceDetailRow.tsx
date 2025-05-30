"use client";
import { CheckboxStatus } from "@/interface/ui";
import { formatCurrency } from "@/utils/data";

// Definir la interfaz correcta para PreInvoiceDetail
interface PreInvoiceDetail {
  id: number;
  preInvoiceId?: number | null;
  personId?: number | null;
  status: string;
  value: number | string;
  currency_type?: number | null;
  billableDays?: number | string;
  billable_days?: number | string;
  leaveDays?: number | string;
  leave_days?: number | string;
  totalConsumeDays?: number | string;
  total_consume_days?: number | string;
  isSelected?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  // Soporte para diferentes nombres de campo que pueden venir del backend
  person?: {
    id: number;
    name: string;
    lastName: string;
    dni: string | null;
    country: string | null;
    jobTitle?: {
      id: number;
      name: string;
    } | null;
  } | null;
  People?: {
    id: number;
    name: string;
    last_name: string;
    dni: string | null;
    country: string | null;
    job_title_name?: string;
  } | null;
}

interface Props {
  item: PreInvoiceDetail;
  showCheckbox?: boolean;
  onClick: (item: PreInvoiceDetail) => void;
  onChangeCheckBox: (item: PreInvoiceDetail, value: CheckboxStatus) => void;
  isPreInvoiceBlocked?: boolean;
  ufValue?: number | null;
}

export default function PreInvoiceDetailRow({
  item,
  onClick,
  showCheckbox,
  onChangeCheckBox,
  isPreInvoiceBlocked = false,
  ufValue,
}: Props) {
  const handlerClick = () => {
    onClick(item);
  };

  // Accedemos a las propiedades de forma segura con fallbacks
  const personName = item.person?.name || item.People?.name || "";
  const personLastName = item.person?.lastName || item.People?.last_name || "";
  const jobTitleName = item.person?.jobTitle?.name || item.People?.job_title_name || "";

  // Convertimos a número para operaciones aritméticas
  const numValue = typeof item.value === "string" ? parseFloat(item.value) : item.value || 0;
  const numBillableDays =
    typeof item.billableDays === "string"
      ? parseFloat(item.billableDays)
      : typeof item.billable_days === "string"
      ? parseFloat(item.billable_days)
      : item.billableDays || item.billable_days || 1; // Evitar división por cero
  const numLeaveDays =
    typeof item.leaveDays === "string"
      ? parseFloat(item.leaveDays)
      : typeof item.leave_days === "string"
      ? parseFloat(item.leave_days)
      : item.leaveDays || item.leave_days || 0;
  const numTotalConsumeDays =
    typeof item.totalConsumeDays === "string"
      ? parseFloat(item.totalConsumeDays)
      : typeof item.total_consume_days === "string"
      ? parseFloat(item.total_consume_days)
      : item.totalConsumeDays || item.total_consume_days || 0;

  return (
    <tr
      className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
      id="table-column-header-0"
      data-accordion-target="#table-column-body-0"
      aria-expanded="false"
      aria-controls="table-column-body-0"
    >
      {showCheckbox ? (
        <td className="px-4 py-3 w-4">
          <div className="flex items-center">
            <input
              id={`selected_${item.id}`}
              value={item.isSelected ? "On" : "Off"}
              onChange={(value) => {
                if (!isPreInvoiceBlocked) {
                  const newValue = value.target.value === "Off" ? CheckboxStatus.On : CheckboxStatus.Off;
                  onChangeCheckBox(item, newValue);
                }
              }}
              checked={item.isSelected ?? false}
              disabled={isPreInvoiceBlocked}
              type="checkbox"
              className={`w-4 h-4 rounded border-gray-300 focus:ring-2 ${
                isPreInvoiceBlocked
                  ? "bg-gray-300 cursor-not-allowed text-gray-400 dark:bg-gray-600 dark:border-gray-500"
                  : "text-primary-600 bg-gray-100 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              }`}
            />
            <label className="sr-only">checkbox</label>
          </div>
        </td>
      ) : null}

      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
        onClick={handlerClick}
      >
        {personName} <br /> {personLastName}
      </th>

      {/* Cargo */}
      <td className="px-4 py-3" onClick={handlerClick}>
        {jobTitleName}
      </td>

      {/* Tarifa / mes - con tooltip que muestra el valor en CLP */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numValue < 10000 ? (
          <div className="group relative flex items-center">
            <span>{`${numValue.toFixed(2)} UF`}</span>
            {ufValue && (
              <div className="ml-1.5 cursor-help">
                <div className="relative">
                  <span className="text-xs text-blue-500 cursor-help">ⓘ</span>
                  <div className="absolute left-0 bottom-full mb-2 hidden whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-sm group-hover:block z-10">
                    = {formatCurrency(numValue * ufValue, "es-ES", "CLP")}
                    <div className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          formatCurrency(numValue, "es-ES", "CLP")
        )}
      </td>

      {/* AUSENCIAS - leave_days */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numLeaveDays}
      </td>

      {/* DÍAS TRABAJADOS - total_consume_days - leave_days (días realmente trabajados) */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numTotalConsumeDays - numLeaveDays}
      </td>

      {/* EQUIVALENTE HORAS - (total_consume_days - leave_days) * 8 */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {(numTotalConsumeDays - numLeaveDays) * 8}
      </td>

      {/* TARIFA HR - Nueva columna */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numValue < 10000 ? (
          <div className="group relative flex items-center">
            <span>{`${(numValue / (numBillableDays * 8)).toFixed(4)} UF`}</span>
            {ufValue && (
              <div className="ml-1.5 cursor-help">
                <div className="relative">
                  <span className="text-xs text-blue-500 cursor-help">ⓘ</span>
                  <div className="absolute left-0 bottom-full mb-2 hidden whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-sm group-hover:block z-10">
                    = {formatCurrency((numValue / (numBillableDays * 8)) * ufValue, "es-ES", "CLP")}
                    <div className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          formatCurrency(numValue / (numBillableDays * 8), "es-ES", "CLP")
        )}
      </td>

      {/* Total por cobrar (UF) - Proporción de días trabajados sobre días totales del mes */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numValue < 10000 ? (
          <div className="group relative flex items-center">
            <span>{`${((numValue * (numTotalConsumeDays - numLeaveDays)) / numTotalConsumeDays).toFixed(2)} UF`}</span>
            {ufValue && (
              <div className="ml-1.5 cursor-help">
                <div className="relative">
                  <span className="text-xs text-blue-500 cursor-help">ⓘ</span>
                  <div className="absolute left-0 bottom-full mb-2 hidden whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-sm group-hover:block z-10">
                    1 UF = {formatCurrency(ufValue, "es-ES", "CLP")}
                    <div className="absolute -bottom-1 left-1 h-2 w-2 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          formatCurrency(numValue, "es-ES", "CLP")
        )}
      </td>

      {/* Total por cobrar (CLP) */}
      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numValue < 10000
          ? formatCurrency(
              ((numValue * (numTotalConsumeDays - numLeaveDays)) / numTotalConsumeDays) * (ufValue || 39127.41),
              "es-ES",
              "CLP"
            )
          : formatCurrency((numValue * (numTotalConsumeDays - numLeaveDays)) / numTotalConsumeDays, "es-ES", "CLP")}
      </td>
    </tr>
  );
}
