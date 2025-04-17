"use client";

import type { People, JobTitle, Client as ClientModel, Role, AFPInstitution, HealthInstitution, Seniority, CurrencyType } from "@prisma/client";

// Definir el tipo de PeopleWithAllRelations según lo que necesitamos
type PeopleWithAllRelations = People & {
  jobTitle: JobTitle | null;
  client: ClientModel | null;
  role: Role | null;
  afpInstitution: AFPInstitution | null;
  healthInstitution: HealthInstitution | null;
  seniority: Seniority | null;
  currencyType: CurrencyType | null;
};

interface Props {
  item: PeopleWithAllRelations;
  clients?: ClientModel[]; // Marcado como opcional ya que no lo estamos utilizando
  onActionPress: (people: PeopleWithAllRelations) => void;
}

export default function PeopleItemRow({ item, onActionPress }: Props) {
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
        12/12/2025
      </td>
      <td className="px-4 py-3" onClick={handlerClick}>
        12/12/2025
      </td>
    </tr>
  );
}
