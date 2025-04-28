"use client";

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/users";
import { fetch as FetchClients } from "@/lib/features/clients";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import PeopleItemRow from "../Table/PeopleItemRow";
import AddPeopleForm from "../dialogForm/AddPeopleForm";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import AssignProjectModal from "../modals/AssignProjectModal";
import GenericDialog from "../dialog/GenericDialog";
import FilterPeople from "../dialog/FilterPeople";
import GenericModal from "../modals/GenericModal";
import MainTable from "../Table/MainTable";
import TableSkeleton from "../core/TableSkeleton";
import { PeopleWithAllRelations } from "@/types/people";

const header = [
  "Empresa",
  "nombre apellido",
  "rut",
  "cargo",
  "correo",
  "telefono",
  "fecha de inicio",
  "fecha de termino",
];

function filterPeople(people: PeopleWithAllRelations[] | undefined, searchTerm: string): PeopleWithAllRelations[] {
  if (!people || !Array.isArray(people)) {
    return [];
  }

  return people.filter((person) => {
    if (!person) return false;

    return Object.keys(person).some((key) => {
      const value = person[key as keyof PeopleWithAllRelations];
      return typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
}

export default function PeopleTable() {
  const users = useSelector<RootState, PeopleWithAllRelations[]>((state) => state.users.list);
  const isLoading = useSelector<RootState, boolean>((state) => state.users.isLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSmarter, setSelectedSmarter] = useState<PeopleWithAllRelations | undefined>(undefined);
  const [query, setQuery] = useState("");

  const filteredUsers = filterPeople(users, query);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetch());
    dispatch(FetchClients());
  }, [dispatch]);

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleClickFilter = () => {
    setShowFilterDialog(true);
  };

  const handlerClose = () => {
    setShowDialog(false);
  };

  const handlerCloseFilter = () => {
    setShowFilterDialog(false);
  };

  const handleActionPress = (item: PeopleWithAllRelations) => {
    setSelectedSmarter(item);
    setIsOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <GenericModal isOpen={showDialog} onClose={handlerClose}>
        <AddPeopleForm />
      </GenericModal>

      <GenericDialog isShow={showFilterDialog} onClose={handlerCloseFilter}>
        <FilterPeople />
      </GenericDialog>

      <AssignProjectModal isOpen={isOpen} setIsOpen={setIsOpen} smarter={selectedSmarter} />

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
              <button
                id="actionsDropdownButton"
                onClick={handleClickFilter}
                data-dropdown-toggle="actionsDropdown"
                className="w-full ml-4 md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <FunnelIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="actionsDropdownButton"
                onClick={handleClick}
                data-dropdown-toggle="actionsDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                <PlusIcon className="h-4 w-4" /> <span className="ml-2">Agregar Smarter</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto"></div>
      </div>

      <MainTable
        title="Smarters"
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
          <TableSkeleton isLoading={isLoading && filteredUsers.length <= 0} size={7} />

          {filteredUsers.slice(Math.max(0, currentPage - 1) * 10, currentPage * 10).map((item) => (
            <PeopleItemRow key={item.id} item={item} onActionPress={handleActionPress} />
          ))}
        </>
      </MainTable>
    </div>
  );
}
