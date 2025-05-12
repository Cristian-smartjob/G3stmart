"use client";

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/contacts";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { Contact } from "@/lib/features/contacts";
import { RootState } from "@/lib/store";
import { PlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import GenericModal from "../modals/GenericModal";
import ContactItemRow from "../Table/ContactItemRow";
import { deleteItem } from "@/lib/features/contacts";

import AddContactForm from "../dialogForm/AddContactForm";
import MainTable from "../Table/MainTable";
import TableSkeleton from "../core/TableSkeleton";
import DeleteModal from "../modals/DeleteModal";
import ImportContactsModal from "../modals/ImportContactsModal";

const header = ["Empresa", "Nombre apellido", "Telefono", "Correo", "Opciones"];

function filterContact(people: Contact[] | undefined, searchTerm: string): Contact[] {
  if (!people || !Array.isArray(people)) {
    return [];
  }

  return people.filter((person) => {
    return Object.keys(person).some((key) => {
      const value = person[key as keyof Contact];
      return typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
}

export default function ContactTable() {
  const contacts = useSelector<RootState, Contact[]>((state) => state.contacts.list);
  const isLoading = useSelector<RootState, boolean>((state) => state.contacts.isLoading);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [selectContact, setSelectContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState("");

  const filteredUsers = filterContact(contacts, query);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  const handleClick = () => {
    setSelectContact(null);
    setShowDialog(true);
  };

  const handlerClose = () => {
    setShowDialog(false);
  };

  const handleClickImport = () => {
    setShowImportModal(true);
  };

  const handlerCloseImport = () => {
    setShowImportModal(false);
  };

  const handlerPressItem = (option: string, contact: Contact) => {
    setSelectContact(contact);

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
        <AddContactForm
          isEditMode={isEditMode}
          contact={
            selectContact === null
              ? {}
              : {
                  ...selectContact,
                  client_id: selectContact.clientId,
                }
          }
          onSave={handlerClose}
        />
      </GenericModal>

      <DeleteModal
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onConfirm={() => {
          setIsOpenDelete(false);
          if (selectContact) {
            dispatch(
              deleteItem({
                ...selectContact,
                client_id: selectContact.clientId,
              })
            );
          }
        }}
        element="contacto"
      />

      <ImportContactsModal isOpen={showImportModal} onClose={handlerCloseImport} />

      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Buscar
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Buscar"
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />
              </div>
            </form>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="importExcelButton"
                onClick={handleClickImport}
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <ArrowUpTrayIcon className="h-4 w-4" /> <span className="ml-2">Cargar Excel de Contactos</span>
              </button>
              <button
                id="actionsDropdownButton"
                onClick={handleClick}
                data-dropdown-toggle="actionsDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <PlusIcon className="h-4 w-4" /> <span className="ml-2">Agregar Contacto</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto"></div>
      </div>

      <MainTable
        title="Contactos"
        count={filteredUsers.length}
        page={currentPage}
        header={header}
        showCheckbox={false}
        onChangeSelectAll={() => {}}
        onSelectPage={(page) => {
          setCurrentPage(page);
        }}
        onNext={() => {
          const page = Math.min(Math.ceil(filteredUsers.length / 10), currentPage + 1);
          setCurrentPage(page);
        }}
        onPrev={() => {
          const page = Math.max(1, currentPage - 1);
          setCurrentPage(page);
        }}
      >
        <>
          <TableSkeleton isLoading={isLoading && filteredUsers.length <= 0} size={5} />

          {filteredUsers.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
            <ContactItemRow key={item.id} item={item} onPressItem={handlerPressItem} />
          ))}
        </>
      </MainTable>
    </div>
  );
}
