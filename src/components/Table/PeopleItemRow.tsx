"use client";

import { PeopleWithAllRelations } from "@/types/people";
import type { Client as ClientModel } from "@prisma/client";

interface Props {
  item: PeopleWithAllRelations;
  clients?: ClientModel[]; // Marcado como opcional ya que no lo estamos utilizando
  onActionPress: (people: PeopleWithAllRelations) => void;
}

export default function PeopleItemRow({ item, onActionPress }: Props) {
  const handlerClick = () => {
    onActionPress(item);
  };

  // Función para formatear la fecha
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "No especificada";
    return new Date(date).toLocaleDateString();
  };

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
        {item.client?.name || "No asignado"}
      </th>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.name} {item.lastName}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.dni}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.jobTitle?.name || "No asignado"}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.email}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.phone}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {formatDate(item.contractStart)}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {formatDate(item.contractEnd)}
      </td>
    </tr>
  );
}
