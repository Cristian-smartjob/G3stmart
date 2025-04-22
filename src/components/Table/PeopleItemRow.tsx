"use client";

import { PeopleWithAllRelations } from "@/infrastructure/database/repositories/peopleRepository";
import { Client } from "@/interface/common";

interface Props {
  item: PeopleWithAllRelations;
  clients: Client[];
  onActionPress: (people: PeopleWithAllRelations) => void;
}

export default function PeopleItemRow({ item, clients, onActionPress }: Props) {
  const client = (clients || []).find((client) => client.id === item.clientId);

  const handlerClick = () => {
    onActionPress(item);
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
        {item.clientName}
      </th>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.name} {item.lastName}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.dni}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.jobTitleName}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.email}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        {item.phone}
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        12/12/2025
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        12/12/2025
      </td>
    </tr>
  );
}
