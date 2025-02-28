'use client'
import { Table } from "flowbite-react";
import { Contact } from "@/interface/common";
import Options from "../core/Options";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import SavingIndicator from "../core/badge/SavingIndicator";
import DeletingIndicator from "../core/badge/DeletingIndicator";


interface Props {
    item: Contact;
    onPressItem: (option: string, item: Contact) => void;
}

export default function ContactItemRow({ item, onPressItem }: Props){

    const isEditingLoading = useSelector<RootState, {[key:string]: boolean}>(state => state.contacts.isEditingLoading)
    const isEditing = isEditingLoading[item.id]

    const isDeletingLoading = useSelector<RootState, {[key:string]: boolean}>(state => state.contacts.isDeletingLoading)
    const isDeleting = isDeletingLoading[item.id]
 
    return (

        <tr 
        className="border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"  aria-expanded="false" aria-controls="table-column-body-0">
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
            {item.Client.name}
            {isEditing ? <SavingIndicator /> : null}
            {isDeleting ? <DeletingIndicator /> : null}
            </th>
            <td className="px-4 py-3">{item.name} {item.last_name}</td>
            <td className="px-4 py-3">{item.email}</td>
            <td className="px-4 py-3">{item.phone}</td>
            <td className="px-4 py-3">
                <Options onPressItem={(value) => {
                    onPressItem(value, item)
                }} />
            </td>
        </tr>
    )
}