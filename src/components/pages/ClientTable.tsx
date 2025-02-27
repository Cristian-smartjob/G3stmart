'use client'

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/clients";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { Client } from "@/interface/common";
import { RootState } from "@/lib/store";
import AddClientForm from "../dialogForm/AddClientForm";
import Search from "../Table/Search/SearchBar";
import GenericModal from "../modals/GenericModal";
import MainTable from "../Table/MainTable";
import ClientItemRow from "../Table/ClientItemRow";
import TableSkeleton from "../core/TableSkeleton";
import { filterClient } from "@/utils/filter";

const header = ["Nombre", "Rut", "Día facturación", "Moneda"]

export default function ClientTable(){

  const clients = useSelector<RootState, Client[]>(state => state.clients.list)
  
  const isLoading = useSelector<RootState, boolean>(state => state.clients.isLoading)
  const isCreateLoading = useSelector<RootState, boolean>(state => state.clients.isCreateLoading)

  const [showDialog, setShowDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState("")


  const filteredClients = filterClient(clients, query)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])

  const handleClick = () => {
    setShowDialog(true)
  }

  const handlerClose = () => {
    setShowDialog(false)
  }

  return (
      <div>
        
        <GenericModal  isOpen={showDialog} onClose={handlerClose}>
          <AddClientForm onSave={handlerClose} />
        </GenericModal>

        <Search buttonAddTitle="Agregar cliente" buttonAddOnClick={handleClick} onSearch={setQuery} />
      
        <MainTable 
              title={"Clientes"} 
              count={clients.length} 
              page={currentPage}
              header={header} 
              isLoading={isCreateLoading}
              showCheckbox={false} 
              onChangeSelectAll={() => {}}
              onSelectPage={page => {
                setCurrentPage(page)
              }}
              onNext={() => {
                const page = Math.min(Math.ceil(filteredClients.length / 10), currentPage + 1)
                setCurrentPage(page)
              }}
              onPrev={() => {
                  const page = Math.max(1, currentPage - 1)
                  setCurrentPage(page)
              }}
              >
              <>
               <TableSkeleton
                  isLoading={isLoading && filteredClients.length <= 0}
                  size={4}
                />
              {(filteredClients.slice((Math.max(0, currentPage - 1)) * 10, currentPage * 10)).map(item => (
                  <ClientItemRow key={item.id} item={item} />
              ))}
              </>
          </MainTable>
      
        
      </div>
  )
}