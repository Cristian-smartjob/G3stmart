'use client'

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/preinvoices";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { PreInvoice } from "@/interface/common";
import { RootState } from "@/lib/store";

import AddPreInvoiceForm from "../dialogForm/AddPreInvoiceForm";
import Search from "../Table/Search/SearchBar";
import GenericModal from "../modals/GenericModal";
import MainTable from "../Table/MainTable";
import TabSelector, { Selector } from "../core/TabSelector";
import PreInvoiceItemRow from "../Table/row/PreInvoiceItemRow";
import TableSkeleton from "../core/TableSkeleton";


const header = [
  "Cliente", 
  "Contraparte",  
  "Mes / Año", 
  "Valor",
  "Acciones", 
  "Status"
]

const tabs: Selector[] = [
  { id: 1, label: 'Todas' },
  { id: 2,label: 'Pendientes', value: 'PENDING' },
  { id: 3,label: 'Descargados', value: 'DOWNLOADED' },
  { id: 4, label: 'Aprobados', value: 'APPROVED'  },
  { id: 5, label: 'Rechazados', value: 'REJECTED'  },
]

export default function PreinvoiceTable(){

 
  const [currentPage, setCurrentPage] = useState(1)
  const [showDialog, setShowDialog] = useState(false)
  const [selected, setSelected] = useState(1)

  const preInvoices = useSelector<RootState, PreInvoice[]>(state => state.preInvoices.list)
  const isLoading = useSelector<RootState, boolean>(state => state.preInvoices.isLoading)

  const selectedTab = tabs.find(item => item.id === selected)

  const filteredPreInvoices = preInvoices.filter(item => {
    if(selected === 1) return true
    return item.status === selectedTab?.value
  })

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])

  const handlerNewItem = () => {
    setShowDialog(true)
  }

  const handlerClose = () => {
    setShowDialog(false)
  }

  return (
    <>
    
      <GenericModal isOpen={showDialog} onClose={handlerClose}>
        <AddPreInvoiceForm />
      </GenericModal>
   
      <div className="overflow-x-auto">

       

        <Search buttonAddTitle="Agregar prefactura" buttonAddOnClick={handlerNewItem} />

        <MainTable 
          title="Prefacturas" 
          count={preInvoices.length} 
          page={currentPage}
          header={header} 
          showCheckbox={false} 
          onClickEmpty={handlerNewItem}
          bottomContent={
            <TabSelector 
              selected={selected} 
              onSelect={value => { 
                setSelected(value)
              }} 
              labels={tabs} />
            }
          emptyTitle="Agregar prefactura"
          isEmpty={!isLoading && filteredPreInvoices.length <= 0}
          onChangeSelectAll={() => {}}
          onSelectPage={page => {
            setCurrentPage(page)
          }}
          onNext={() => {
            const page = Math.min(Math.ceil(filteredPreInvoices.length / 10), currentPage + 1)
            setCurrentPage(page)
          }}
          onPrev={() => {
              const page = Math.max(1, currentPage - 1)
              setCurrentPage(page)
          }}
          >
          <>
           <TableSkeleton
                isLoading={isLoading && filteredPreInvoices.length <= 0}
                size={6}
              />
          {filteredPreInvoices.map(item => (
              <PreInvoiceItemRow key={item.id} item={item}  />
          ))}
          </>
        </MainTable>
      </div>
    </>
  )
}