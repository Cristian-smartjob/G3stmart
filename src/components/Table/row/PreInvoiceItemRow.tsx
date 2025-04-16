"use client";
import type { PreInvoice } from "../../../interface/common";

import Link from "next/link";
import { formatCurrency } from "@/utils/data";
import Badge from "@/components/core/Badge";

interface Props {
  item: PreInvoice;
}

export default function PreInvoiceItemRow({ item }: Props) {
  return (
    <tr
      className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
      id="table-column-header-0"
      data-accordion-target="#table-column-body-0"
      aria-expanded="false"
      aria-controls="table-column-body-0"
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
      >
        {item.client ? item.client.name : "Sin cliente"}
      </th>
      <td className="px-4 py-3">
        {!item.contact
          ? "No asignada"
          : `${item.contact.name} ${item.contact.lastName || ""}`}
      </td>
      <td className="px-4 py-3">
        {" "}
        {item.month < 10 ? "0" : ""}
        {item.month} / {item.year}
      </td>
      <td className="px-4 py-3">{formatCurrency(item.value)}</td>

      <td className="px-4 py-3">
        {" "}
        <Link
          href={`/preInvocedetail/${item.id}`}
          className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ver detalle
        </Link>
      </td>
      <td className="px-4 py-3">
        <Badge status={item.status} />
      </td>
    </tr>
  );
}
