'use client'
import { Table } from "flowbite-react";
import {  People, PreInvoiceDetail } from "@/interface/common";
import { formatCurrency } from "@/utils/data";
import { CheckboxStatus } from "@/interface/ui";


interface Props {
    item: PreInvoiceDetail;
    showCheckbox?:boolean;
    onClick: (item: PreInvoiceDetail) => void;
    onChangeCheckBox: (item: PreInvoiceDetail, value: CheckboxStatus) => void;
}

export default function PreInvoiceDetailRow({ item, onClick, showCheckbox, onChangeCheckBox}: Props){
    
    const handlerClick = () => {onClick(item)}

 
    return (
        <tr 
        className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"  
        id="table-column-header-0" 
        data-accordion-target="#table-column-body-0" 
        aria-expanded="false" aria-controls="table-column-body-0"
        >
        {showCheckbox ? (
             <td className="px-4 py-3 w-4">
             <div className="flex items-center">
                 <input id={`selected_${item.id}`} value={item.isSelected ? "On": "Off"} onChange={value => {
                     const newValue = value.target.value === "Off" ? CheckboxStatus.On : CheckboxStatus.Off
                     onChangeCheckBox(item, newValue)
                 }} checked={item.isSelected ?? false} type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                 <label className="sr-only">checkbox</label>
             </div>
         </td>
        ) : null}
       


        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center" onClick={handlerClick}>
            {item.People.name} <br /> {item.People.last_name}
        </th>
        
        <td className="px-4 py-3" onClick={handlerClick}>
        {item.People.JobTitle.name}
        </td>

        {/*
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.People.dni}  
        </td>
        
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.People.country}  
        </td>*/}
    
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency(item.value)}  
        </td>

        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.billable_days}
        </td>

        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.leave_days}
        </td>


        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.total_consume_days}
        </td>


        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {item.total_consume_days * 8}
        </td>
    
        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency(item.value * item.total_consume_days / item.billable_days)}  
        </td>

        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={handlerClick}>
        {formatCurrency(item.value * item.total_consume_days / item.billable_days)}  
        </td>

        
    </tr>
    )
}

