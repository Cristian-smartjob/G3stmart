"use client";

import { useEffect, useState } from "react";
import { deleteItem, fetch } from "@/lib/features/clients";
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
import DeleteModal from "../modals/DeleteModal";

const header = ["Nombre", "Rut", "Día facturación", "Moneda", "Opciones"];

export default function ClientTable() {
  const clients = useSelector<RootState, Client[]>((state) => state.clients.list);

  const isLoading = useSelector<RootState, boolean>((state) => state.clients.isLoading);
  const isCreateLoading = useSelector<RootState, boolean>((state) => state.clients.isCreateLoading);

  const [selectClient, setSelectClient] = useState<Client | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const filteredClients = filterClient(clients, query);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  const handleClick = () => {
    setShowDialog(true);
  };

  const handlerClose = () => {
    setShowDialog(false);
    setEditMode(false);
  };

  const handlerPressItem = (option: string, client: Client) => {
    setSelectClient(client);

    if (option === "edit") {
      setShowDialog(true);
      setEditMode(true);
    } else if (option === "delete") {
      setIsOpenDelete(true);
    }
  };

  return (
    <div>
      <GenericModal isOpen={showDialog} onClose={handlerClose}>
        <AddClientForm onSave={handlerClose} isEditMode={isEditMode} />
      </GenericModal>

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onConfirm={() => {
          setIsOpenDelete(false);

          dispatch(
            deleteItem({
              ...selectClient,
            })
          );
        }}
        element="cliente"
      />

      <Search buttonAddTitle="Agregar cliente" buttonAddOnClick={handleClick} onSearch={setQuery} />

      <MainTable
        title={"Clientes"}
        count={clients.length}
        page={currentPage}
        header={header}
        isLoading={isCreateLoading}
        showCheckbox={false}
        onChangeSelectAll={() => {}}
        onSelectPage={(page) => {
          setCurrentPage(page);
        }}
        onNext={() => {
          const page = Math.min(Math.ceil(filteredClients.length / 10), currentPage + 1);
          setCurrentPage(page);
        }}
        onPrev={() => {
          const page = Math.max(1, currentPage - 1);
          setCurrentPage(page);
        }}
      >
        <>
          <TableSkeleton isLoading={isLoading && filteredClients.length <= 0} size={5} />
          {filteredClients.slice(Math.max(0, currentPage - 1) * 10, currentPage * 10).map((item) => (
            <ClientItemRow key={item.id} item={item} onPressItem={handlerPressItem} />
          ))}
        </>
      </MainTable>
    </div>
  );
}
