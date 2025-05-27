"use client";

import React, { useState, useRef } from "react";
import { PlusIcon, FunnelIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import PeopleItemRow from "../../Table/PeopleItemRow";
import AddPeopleForm from "../../dialogForm/AddPeopleForm";
import AssignProjectModal from "../../modals/AssignProjectModal";
import GenericDialog from "../../dialog/GenericDialog";
import FilterPeople from "../../dialog/FilterPeople";
import GenericModal from "../../modals/GenericModal";
import ImportExcelModal from "../../modals/ImportExcelModal";
import ImportAbsencesModal from "../../modals/ImportAbsencesModal";
import MainTable from "../../Table/MainTable";
import TableSkeleton from "../../core/TableSkeleton";
import { ScrollSection, ScrollToLink } from "../../ui/ScrollToSection";
import styles from "./PeopleTable.module.css";
import { usePeopleTable } from "./usePeopleTable";
import AbsencesTable, { AbsencesTableRef } from "../absences/AbsencesTable";

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

type TabType = "smarters" | "absences";

/**
 * Componente PeopleTable - Muestra una tabla de personas con funcionalidades de búsqueda, filtrado y paginación
 */
export default function PeopleTable(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("smarters");
  const absencesTableRef = useRef<AbsencesTableRef>(null);

  const {
    isLoading,
    currentPage,
    showDialog,
    showFilterDialog,
    showImportModal,
    showAbsencesModal,
    isOpen,
    setIsOpen,
    selectedSmarter,
    filters,
    setQuery,
    updateFilters,
    filteredUsers,
    handleClick,
    handleClickFilter,
    handleClickImport,
    handleClickImportAbsences,
    handlerClose,
    handlerCloseFilter,
    handlerCloseImport,
    handlerCloseImportAbsences,
    handleActionPress,
    setCurrentPage,
  } = usePeopleTable();

  const handleAbsencesImportSuccess = () => {
    // Recargar la tabla de ausencias después de una importación exitosa
    if (absencesTableRef.current) {
      absencesTableRef.current.refreshData();
    }
  };

  return (
    <div className={styles.container}>
      <GenericModal isOpen={showDialog} onClose={handlerClose}>
        <AddPeopleForm />
      </GenericModal>

      <GenericDialog isShow={showFilterDialog} onClose={handlerCloseFilter}>
        <FilterPeople filters={filters} onUpdateFilters={updateFilters} onClose={handlerCloseFilter} />
      </GenericDialog>

      <ImportExcelModal isOpen={showImportModal} onClose={handlerCloseImport} />

      <ImportAbsencesModal
        isOpen={showAbsencesModal}
        onClose={handlerCloseImportAbsences}
        onSuccess={handleAbsencesImportSuccess}
      />

      <AssignProjectModal isOpen={isOpen} setIsOpen={setIsOpen} smarter={selectedSmarter} />

      <ScrollSection id="search-section" className={styles.searchSection}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.searchForm}>
              <label htmlFor="simple-search" className="sr-only">
                Buscar
              </label>
              <div className={styles.searchContainer}>
                <div className={styles.searchIcon}>
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
                  className={styles.searchInput}
                  placeholder="Buscar"
                  value={filters.query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />
              </div>
              <button
                id="actionsDropdownButton"
                onClick={handleClickFilter}
                data-dropdown-toggle="actionsDropdown"
                className={styles.filterButton}
                type="button"
                aria-label="Filtrar resultados"
              >
                <FunnelIcon className={styles.buttonIcon} />
              </button>
            </div>
            <div className={styles.actionContainer}>
              <div className={styles.buttonGroup}>
                {activeTab === "smarters" ? (
                  <>
                    <button
                      id="importExcelButton"
                      onClick={handleClickImport}
                      className={styles.actionButton}
                      type="button"
                    >
                      <ArrowUpTrayIcon className={styles.buttonIcon} />
                      <span className={styles.buttonText}>Cargar Excel de Smarters</span>
                    </button>
                    <button
                      id="actionsDropdownButton"
                      onClick={handleClick}
                      data-dropdown-toggle="actionsDropdown"
                      className={styles.actionButton}
                      type="button"
                    >
                      <PlusIcon className={styles.buttonIcon} />
                      <span className={styles.buttonText}>Agregar Smarter</span>
                    </button>
                  </>
                ) : (
                  <button
                    id="uploadAbsencesButton"
                    onClick={handleClickImportAbsences}
                    className={styles.actionButton}
                    type="button"
                  >
                    <ArrowUpTrayIcon className={styles.buttonIcon} />
                    <span className={styles.buttonText}>Cargar Excel de Ausencias</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto"></div>
        </div>
      </ScrollSection>

      {/* Tabs para cambiar entre Smarters y Ausencias */}
      <div className="border-b border-gray-200 mb-4">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "smarters"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("smarters")}
            >
              Smarters
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "absences"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("absences")}
            >
              Ausencias
            </button>
          </li>
        </ul>
      </div>

      <ScrollSection id="table-section">
        {activeTab === "smarters" ? (
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
        ) : (
          <AbsencesTable ref={absencesTableRef} />
        )}
      </ScrollSection>

      <div className="fixed bottom-5 right-5">
        <ScrollToLink to="search-section" className={styles.scrollToTop}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.scrollToTopIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </ScrollToLink>
      </div>
    </div>
  );
}
