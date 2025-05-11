import { useCallback, useEffect, useState } from "react";
import SelectorChips from "../core/SelectorChips";
import ComboboxComponent from "../core/ComboboxComponent";
import { useSelector } from "react-redux";
import { Client } from "@/interface/common";
import { RootState } from "@/lib/store";
import { ComboBoxItem } from "@/interface/ui";
import { PeopleTableFilters, FilterPeopleProps } from "@/components/pages/PeopleTable/types";
import { Button } from "flowbite-react";

export default function FilterPeople({ filters, onUpdateFilters, onClose }: FilterPeopleProps) {
  const clients = useSelector<RootState, Client[]>((state) => state.clients.list);

  // Estado local para los filtros
  const [localFilters, setLocalFilters] = useState<PeopleTableFilters>({
    query: filters.query,
    clients: filters.clients || [],
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  // Sincronizar los filtros locales si los externos cambian
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Manejador para seleccionar un cliente
  const handleSelect = (item: ComboBoxItem) => {
    setLocalFilters((prev) => ({
      ...prev,
      clients: [...prev.clients, item],
    }));
  };

  // Manejador para eliminar un cliente
  const handleCancel = (current: ComboBoxItem) => {
    setLocalFilters((prev) => ({
      ...prev,
      clients: prev.clients.filter((item) => item.id !== current.id),
    }));
  };

  // Manejador para cambiar la fecha de inicio
  const handleStartDateChange = (date: Date | null) => {
    console.log("Fecha de inicio seleccionada:", date);
    setLocalFilters((prev) => ({
      ...prev,
      startDate: date,
    }));
  };

  // Manejador para cambiar la fecha de término
  const handleEndDateChange = (date: Date | null) => {
    console.log("Fecha de término seleccionada:", date);
    setLocalFilters((prev) => ({
      ...prev,
      endDate: date,
    }));
  };

  // Manejador para aplicar los filtros
  const handleApplyFilters = useCallback(() => {
    console.log("Aplicando filtros:", localFilters);
    onUpdateFilters(localFilters);
    onClose();
  }, [localFilters, onUpdateFilters, onClose]);

  // Manejador para limpiar los filtros
  const handleClearFilters = useCallback(() => {
    const emptyFilters: PeopleTableFilters = {
      query: filters.query, // Mantener el query de búsqueda
      clients: [],
      startDate: null,
      endDate: null,
    };
    setLocalFilters(emptyFilters);
    onUpdateFilters(emptyFilters);
  }, [filters.query, onUpdateFilters]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Filtros avanzados</h3>

      <div className="mb-6">
        <div className="p-4-justify-center">
          <ComboboxComponent
            title="Filtrar por cliente"
            list={(clients || []).map((item) => ({ id: item.id, label: item.name }))}
            onSelect={(item: ComboBoxItem) => {
              handleSelect(item);
            }}
          />
          <div className="mt-4">
            <SelectorChips items={localFilters.clients} onClose={handleCancel} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="start-date" className="font-medium">
            Fecha de inicio
          </label>
          <input
            type="date"
            id="start-date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={localFilters.startDate ? new Date(localFilters.startDate).toISOString().split("T")[0] : ""}
            onChange={(e) => handleStartDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="end-date" className="font-medium">
            Fecha de término
          </label>
          <input
            type="date"
            id="end-date"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={localFilters.endDate ? new Date(localFilters.endDate).toISOString().split("T")[0] : ""}
            onChange={(e) => handleEndDateChange(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-4 mb-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm text-blue-800 dark:text-blue-100">
          <p>
            <strong>Nota:</strong> Los filtros se aplicarán cuando hagas clic en el botón &ldquo;Aplicar filtros&rdquo;
            de abajo.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-x-4">
        <Button color="light" onClick={handleClearFilters} className="flex-1">
          Limpiar filtros
        </Button>
        <Button
          color="blue"
          onClick={handleApplyFilters}
          className="flex-1 font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
