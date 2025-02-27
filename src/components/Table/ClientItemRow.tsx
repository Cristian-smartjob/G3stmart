'use client'
import { Table } from "flowbite-react";
import { Client } from "@/interface/common";
import PeoplePopOver from "../core/PeoplePopOver";
import Options from "../core/Options";

interface Props {
    item: Client;
}

export default function ClientItemRow({ item }: Props){

 
    return (
        <tr 
        className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"  
        id="table-column-header-0" 
        data-accordion-target="#table-column-body-0" 
        aria-expanded="false" 
        aria-controls="table-column-body-0">
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
            {item.name}
            </th>
            <td className="px-4 py-3">{item.rut}</td>
            <td className="px-4 py-3">{item.billable_day}</td>
            <td className="px-4 py-3">{item.CurrencyType.name}</td>
        </tr>
    )
}