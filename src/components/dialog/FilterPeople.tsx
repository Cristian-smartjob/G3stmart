import { Datepicker } from "flowbite-react";
import SelectorChips from "../core/SelectorChips";
import ComboboxComponent from "../core/ComboboxComponent";
import { useSelector } from "react-redux";
import { Client } from "@/interface/common";
import { RootState } from "@/lib/store";
import { ComboBoxItem } from "@/interface/ui";
import { useState } from "react";

export default function FilterPeople() {


    const clients = useSelector<RootState, Client[]>(state => state.clients.list)


    const [selectedItems, setSelectedItems] = useState<ComboBoxItem[]>([])
  

    const handleSelect = (item: ComboBoxItem) => {
      setSelectedItems([...selectedItems, item])
    }

    const handleCancel = (current: ComboBoxItem) => {
      const newList = [...selectedItems.filter(item => item.id !== current.id)]
      setSelectedItems(newList)
    }


    return (
       <div>
        <div>
        <div className="p-4-justify-center">

          
        
        <ComboboxComponent 
           title="Filtrar por cliente" 
           list={(clients || []).map(item => ({id: item.id, label: item.name}))} 
           onSelect={(item: ComboBoxItem) => {
            handleSelect(item)
            
         }}

         />
        <div className="mt-4">
          <SelectorChips 
             items={selectedItems} 
             onClose={handleCancel} />
        </div>
      </div>

        </div>
        <div className="flex flex-col pt-4 pb-4 gap-y-4">
            <p>Fecha de inicio</p>
            <Datepicker minDate={new Date()}  />
        </div>
        <div className="flex flex-col pt-4 pb-4 gap-y-4">
            <p>Fecha de término</p>
            <Datepicker minDate={new Date()}  />
            </div>
        </div>
    )
}