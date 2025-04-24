"use client";
import { useEffect, useState } from "react";
import { fetchPreInvoices } from "@/app/actions/preInvoices";
import type { PreInvoice } from "../../interface/common";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState(1);
  const [preInvoices, setPreInvoices] = useState<PreInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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
          count={preInvoices.length}
          page={currentPage}
          header={header}
          showCheckbox={false}
          onClickEmpty={handlerNewItem}
          bottomContent={
            <TabSelector
              selected={selected}
              onSelect={(value) => {
                setSelected(value);
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
            const page = Math.min(Math.ceil(filteredPreInvoices.length / 10), currentPage + 1);
            setCurrentPage(page);
          }}
          onPrev={() => {
            const page = Math.max(1, currentPage - 1);
            setCurrentPage(page);
          }}
        >
          <>
            <TableSkeleton isLoading={isLoading && filteredPreInvoices.length <= 0} size={6} />
            {filteredPreInvoices.map((item) => (
              <PreInvoiceItemRow key={item.id} item={item} />
            ))}
          </>
        </MainTable>
      </div>
    </>
  );
}
