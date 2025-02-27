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

const header = ["Nombre", "Rut", "Día facturación", "Moneda"]

export default function ClientTable(){

  const clients = useSelector<RootState, Client[]>(state => state.clients.list)
  const isLoading = useSelector<RootState, boolean>(state => state.clients.isLoading)
  const [showDialog, setShowDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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
          <AddClientForm />
        </GenericModal>

        <Search buttonAddTitle="Agregar cliente" buttonAddOnClick={handleClick} />
      
        <MainTable 
              title={"Clientes"} 
              count={clients.length} 
              page={currentPage}
              header={header} 
              showCheckbox={false} 
              onChangeSelectAll={() => {}}
              onSelectPage={page => {
                setCurrentPage(page)
              }}
              onNext={() => {
                const page = Math.min(Math.ceil(clients.length / 10), currentPage + 1)
                setCurrentPage(page)
              }}
              onPrev={() => {
                  const page = Math.max(1, currentPage - 1)
                  setCurrentPage(page)
              }}
              >
              <>
               <TableSkeleton
                  isLoading={isLoading && clients.length <= 0}
                  size={4}
                />
              {(clients.slice((Math.max(0, currentPage - 1)) * 10, currentPage * 10)).map(item => (
                  <ClientItemRow key={item.id} item={item} />
              ))}
              </>
          </MainTable>
      
        
      </div>
  )
}