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
}

export default function PreInvoiceDetailRow({
  item,
  onClick,
  showCheckbox,
  onChangeCheckBox,
  isPreInvoiceBlocked = false,
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

      <td className="px-4 py-3" onClick={handlerClick}>
        {jobTitleName}
      </td>

      {/*
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.person?.dni || item.People?.dni || ""}  
        </td>
        
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.person?.country || item.People?.country || ""}  
        </td>*/}

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency(numValue)}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numBillableDays}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numLeaveDays}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numTotalConsumeDays}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {numTotalConsumeDays * 8}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency((numValue * numTotalConsumeDays) / numBillableDays)}
      </td>

      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency((numValue * numTotalConsumeDays) / numBillableDays)}
      </td>
    </tr>
  );
}
