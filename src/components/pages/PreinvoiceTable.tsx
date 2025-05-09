"use client";
import { useEffect, useState } from "react";
import { fetchPreInvoices } from "@/app/actions/preInvoices";
import type { PreInvoice } from "../../interface/common";
import { useSearchParams } from "next/navigation";

import AddPreInvoiceForm from "../dialogForm/AddPreInvoiceForm";
import Search from "../Table/Search/SearchBar";
import GenericModal from "../modals/GenericModal";
import MainTable from "../Table/MainTable";
import TabSelector, { Selector } from "../core/TabSelector";
import PreInvoiceItemRow from "../Table/row/PreInvoiceItemRow";
import TableSkeleton from "../core/TableSkeleton";
import LoadingPreInvoiceModal from "../modals/LoadingPreInvoiceModal";

const header = ["Cliente", "Contraparte", "Mes / Año", "Valor", "Acciones", "Status"];

const tabs: Selector[] = [
  { id: 1, label: "Todas" },
  { id: 2, label: "Pendientes", value: "PENDING" },
  { id: 3, label: "Descargados", value: "DOWNLOADED" },
  { id: 4, label: "Aprobados", value: "APPROVED" },
  { id: 5, label: "Rechazados", value: "REJECTED" },
  { id: 6, label: "Facturados", value: "COMPLETED" },
];

export default function PreinvoiceTable() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState(1);
  const [preInvoices, setPreInvoices] = useState<PreInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Inicializar la pestaña seleccionada según parámetros de URL o localStorage
  useEffect(() => {
    const tabIdFromURL = searchParams.get('tabId');
    if (tabIdFromURL) {
      const parsedTabId = parseInt(tabIdFromURL);
      // Verificar que el tabId sea válido
      if (!isNaN(parsedTabId) && tabs.some(tab => tab.id === parsedTabId)) {
        setSelected(parsedTabId);
      }
    } else {
      const savedTabId = localStorage.getItem('preinvoiceSelectedTab');
      if (savedTabId) {
        const parsedSavedTabId = parseInt(savedTabId);
        if (!isNaN(parsedSavedTabId) && tabs.some(tab => tab.id === parsedSavedTabId)) {
          setSelected(parsedSavedTabId);
        }
      }
    }
  }, [searchParams]);

  // Guardar la pestaña seleccionada en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('preinvoiceSelectedTab', selected.toString());
  }, [selected]);

  const selectedTab = tabs.find((item) => item.id === selected);

  const filteredPreInvoices = preInvoices.filter((item) => {
    if (selected === 1) return true;
    return item.status === selectedTab?.value;
  });

  // Carga inicial de datos
  useEffect(() => {
    const loadPreInvoices = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPreInvoices();
        setPreInvoices(data);
      } catch (error) {
        console.error("Error cargando prefacturas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreInvoices();
  }, []);

  const handlerNewItem = () => {
    setShowDialog(true);
  };

  const handlerClose = async () => {
    setShowDialog(false);
    // Actualizamos la lista de prefacturas después de crear una nueva
    setIsLoading(true);
    try {
      const data = await fetchPreInvoices();
      setPreInvoices(data);
    } catch (error) {
      console.error("Error recargando prefacturas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormComplete = async () => {
    setIsFormSubmitting(false);
    await handlerClose();
  };

  const hanlderSearch = () => {};

  return (
    <>
      <GenericModal isOpen={showDialog} onClose={handlerClose}>
        <AddPreInvoiceForm onSave={handleFormComplete} />
      </GenericModal>

      <LoadingPreInvoiceModal isOpen={isFormSubmitting} />

      <div>
        <Search buttonAddTitle="Agregar prefactura" buttonAddOnClick={handlerNewItem} onSearch={hanlderSearch} />

        <MainTable
          title="Prefacturas"
          count={filteredPreInvoices.length}
          page={currentPage}
          header={header}
          showCheckbox={false}
          onClickEmpty={handlerNewItem}
          bottomContent={
            <TabSelector
              selected={selected}
              onSelect={(value) => {
                setSelected(value);
                setCurrentPage(1);
              }}
              labels={tabs}
            />
          }
          emptyTitle="Agregar prefactura"
          isEmpty={!isLoading && filteredPreInvoices.length <= 0}
          onChangeSelectAll={() => {}}
          onSelectPage={(page) => {
            setCurrentPage(page);
          }}
          onNext={() => {
            const maxPage = Math.max(1, Math.ceil(filteredPreInvoices.length / 10));
            const page = Math.min(maxPage, currentPage + 1);
            setCurrentPage(page);
          }}
          onPrev={() => {
            const page = Math.max(1, currentPage - 1);
            setCurrentPage(page);
          }}
        >
          <>
            <TableSkeleton isLoading={isLoading && filteredPreInvoices.length <= 0} size={6} />
            {filteredPreInvoices.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
              <PreInvoiceItemRow 
                key={item.id} 
                item={item}
                selectedTabId={selected}
              />
            ))}
          </>
        </MainTable>
      </div>
    </>
  );
}
