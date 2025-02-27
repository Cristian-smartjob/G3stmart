'use client'

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/users";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { PreInvoiceDetail } from "@/interface/common";
import { RootState } from "@/lib/store";
import PreInvoiceDetailRow from "./row/PreInvoceDetailRow";
import GenericModal from "../modals/GenericModal";
import LeaveDaysCalendar from "../core/LeaveDaysCalendar";
import TabSelector, { Selector } from "../core/TabSelector";
import MainTable from "./MainTable";
import { CheckboxStatus } from "@/interface/ui";
import { selectAll, selectItem } from "@/lib/features/preinvoicesdetail";
import TableSkeleton from "../core/TableSkeleton";


const header = [
  "Smarter",
  "Cargo",
  /*
  "Rut",
  "Pais",*/
  "Tarifa / mes",
  "Día / mes facturable",
  "Días de ausencia",
  "Total día mes consumidos",
  "HH mes consumidos",
  "Total por cobrar (UF)",
  "Total por cobrar (CLP)",
]

const tabs: Selector[] = [
  { id:1, label: 'Datos' },
  { id:2, label: 'Días fuera' },
]

interface Props {
  typeFilter: number;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  showCheckbox?: boolean;
}

export default function PreInvoiceDetailTable({ typeFilter, rightContent, bottomContent, showCheckbox }: Props){

  const [currentPage, setCurrentPage] = useState(1)

  const detailsRoot = useSelector<RootState, PreInvoiceDetail[]>(state => state.preInvoicesDetail.list)
  const isLoading = useSelector<RootState, boolean>(state => state.preInvoicesDetail.isLoading)
  const checkboxStatus = useSelector<RootState, CheckboxStatus>(state => state.preInvoicesDetail.allSelectedStatus)

  const details = detailsRoot.filter(item => {
    if(typeFilter === 1){
      return true
    } else if(typeFilter === 2){
      return item.status === "ASSIGN"
    }else {
      return item.status === "NO_ASSIGN"
    }
  })

  const [menu, setMenu] = useState(1)
  const [isOpen, setIsOpen] = useState(false)


  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])

  

  const handleActionPress = (item: PreInvoiceDetail) => {
    setIsOpen(true)
  }

  const handlerChangeSelectAll = (value: CheckboxStatus) => {
    dispatch(selectAll(value))
}
const handlerChangeSelectItem = (item:PreInvoiceDetail, value: CheckboxStatus) => {
  const newItem: PreInvoiceDetail = {
      ...item,
      isSelected: value === CheckboxStatus.On
  }
 
  dispatch(selectItem(newItem))
}


  return (
      <div className="overflow-x-auto">
        
        <GenericModal isOpen={isOpen} onClose={() => {
          setIsOpen(false)
        }}>
          <div>
            <TabSelector labels={tabs} selected={menu}  onSelect={(index: number) => {
              setMenu(index)
                          
                }}  />
            <div className="mt-6">
            <LeaveDaysCalendar />
            </div>
          </div>
        </GenericModal>
        
       

         <MainTable 
                   title="Detalle" 
                   count={details.length} 
                   page={currentPage}
                   header={header} 
                   showCheckbox={showCheckbox} 
                   checkboxStatus={checkboxStatus}
                   onChangeSelectAll={handlerChangeSelectAll}
                   rightContent={rightContent}
                   bottomContent={bottomContent}
                   onSelectPage={page => {
                     setCurrentPage(page)
                   }}
                   onNext={() => {
                     const page = Math.min(Math.ceil(details.length / 10), currentPage + 1)
                     setCurrentPage(page)
                   }}
                   onPrev={() => {
                       const page = Math.max(1, currentPage - 1)
                       setCurrentPage(page)
                   }}
                   >
                   <>

                   <TableSkeleton
                    isLoading={isLoading && details.length <= 0}
                    size={6}
                    />

                   {(details.slice((Math.max(0, currentPage - 1)) * 10, currentPage * 10)).map(item => (
                       <PreInvoiceDetailRow 
                          key={item.id} 
                          showCheckbox={showCheckbox}
                          onChangeCheckBox={handlerChangeSelectItem}
                          item={item} 
                          onClick={() => {}} 
                          
                         
                          />
                   ))}
                   </>
                 </MainTable>
        
      </div>
  )
}