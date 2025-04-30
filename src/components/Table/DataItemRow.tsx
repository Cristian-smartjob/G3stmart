"use client";
import { AFPInstitution } from "@/interface/common";

interface Props {
  item: AFPInstitution;
}

export default function DataItemRow({ item }: Props) {
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
        {item.id}
      </th>
      <td className="px-4 py-3">{item.name} </td>
    </tr>
  );
}
