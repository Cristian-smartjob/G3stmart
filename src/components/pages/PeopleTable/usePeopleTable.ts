import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/users";
import { fetch as FetchClients } from "@/lib/features/clients";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PeopleWithAllRelations } from "@/types/people";
import { PeopleTableState, PeopleTableFilters, UsePeopleTableResult, PersonFilterProperties } from "./types";

// Función auxiliar para normalizar texto (quitar tildes y convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Función para verificar si una fecha está dentro de un rango
function isDateInRange(date: Date | string | null | undefined, startDate: Date | null, endDate: Date | null): boolean {
  if (!date) return true; // Si no hay fecha, no filtramos
  if (!startDate && !endDate) return true; // Si no hay límites, no filtramos

  let dateObj: Date;

  try {
    // Convertir el valor a objeto Date si es un string
    dateObj = date instanceof Date ? date : new Date(date);

    // Validar que la fecha es válida
    if (isNaN(dateObj.getTime())) {
      console.log("Fecha inválida:", date);
      return true; // Si la fecha es inválida, no la filtramos
    }

    // Verificar límite inferior
    if (startDate) {
      // Establecer la hora a 00:00:00 para comparar solo fechas
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);

      if (dateObj < startOfDay) {
        console.log("Fecha menor que límite inferior:", { date: dateObj, startDate: startOfDay });
        return false;
      }
    }

    // Verificar límite superior
    if (endDate) {
      // Establecer la hora a 23:59:59 para comparar solo fechas
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      if (dateObj > endOfDay) {
        console.log("Fecha mayor que límite superior:", { date: dateObj, endDate: endOfDay });
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error al procesar fecha:", date, error);
    return true; // En caso de error, no filtramos
  }
}

function filterPeople(
  people: PeopleWithAllRelations[] | undefined,
  filters: PeopleTableFilters
): PeopleWithAllRelations[] {
  console.log("Filtrando personas con filtros:", filters);

  if (!people || !Array.isArray(people)) {
    return [];
  }

  const filtered = people.filter((person) => {
    if (!person) return false;

    // Aplicar filtro de texto de búsqueda (query)
    if (filters.query && filters.query.trim() !== "") {
      const normalizedQuery = normalizeText(filters.query);
      const searchTerms = normalizedQuery
        .split(/\s+/)
        .filter((term) => term.length > 0)
        .map((term) => normalizeText(term));

      if (searchTerms.length > 0) {
        // Extraer valores relevantes y normalizarlos
        const normalizedValues: string[] = [];

        Object.keys(person).forEach((key) => {
          const value = person[key as keyof PeopleWithAllRelations];
          if (typeof value === "string" && value.trim() !== "") {
            normalizedValues.push(normalizeText(value));
          }
        });

        // Concatenar todos los valores en un solo texto para buscar
        const allValues = normalizedValues.join(" ");

        // Verificar que todos los términos de búsqueda están presentes en algún lugar
        const matchesText = searchTerms.every((term) => allValues.includes(term));

        if (!matchesText) return false;
      }
    }

    // Aplicar filtro de clientes
    if (filters.clients && filters.clients.length > 0) {
      const clientIds = filters.clients.map((client) => client.id);
      const personWithProps = person as PeopleWithAllRelations & PersonFilterProperties;

      // Intentar obtener el ID del cliente de varias propiedades posibles
      let foundClientId = null;

      // Verificar propiedad 'client' (relación)
      if (personWithProps.client && personWithProps.client.id) {
        foundClientId = personWithProps.client.id;
      }
      // Verificar propiedades directas clientId o companyId
      else if (personWithProps.clientId) {
        foundClientId = personWithProps.clientId;
      } else if (personWithProps.companyId) {
        foundClientId = personWithProps.companyId;
      }

      console.log("Evaluando cliente:", {
        persona: person.id,
        foundClientId,
        clientIds,
        personWithClient: personWithProps.client,
        personWithClientId: personWithProps.clientId,
      });

      // Si la persona no tiene compañía o su compañía no está en los filtros, excluirla
      if (!foundClientId || !clientIds.includes(Number(foundClientId))) {
        return false;
      }
    }

    // Aplicar filtros de fecha
    const personWithProps = person as PeopleWithAllRelations & PersonFilterProperties;
    const startDate =
      personWithProps.startDate ||
      personWithProps.contractStart ||
      personWithProps.fechaInicio ||
      personWithProps.createdAt;
    const endDate = personWithProps.endDate || personWithProps.contractEnd || personWithProps.fechaTermino;

    console.log("Evaluando fechas:", {
      persona: person.id,
      personStartDate: startDate,
      personEndDate: endDate,
      filterStartDate: filters.startDate,
      filterEndDate: filters.endDate,
    });

    if (!isDateInRange(startDate, filters.startDate, null)) {
      return false;
    }

    if (!isDateInRange(endDate, null, filters.endDate)) {
      return false;
    }

    // La persona pasó todos los filtros
    return true;
  });

  console.log(`Filtrado completado: ${filtered.length} de ${people.length} personas pasan los filtros`);
  return filtered;
}

/**
 * Hook personalizado para manejar la lógica de la tabla de personas
 * @returns El estado y las funciones para controlar la tabla de personas
 */
export const usePeopleTable = (): UsePeopleTableResult => {
  const users = useSelector<RootState, PeopleWithAllRelations[]>((state) => state.users.list);
  const isLoading = useSelector<RootState, boolean>((state) => state.users.isLoading);

  // Estado inicial del componente
  const [state, setState] = useState<PeopleTableState>({
    currentPage: 1,
    showDialog: false,
    showFilterDialog: false,
    showImportModal: false,
    showAbsencesModal: false,
    isOpen: false,
    selectedSmarter: undefined,
    filters: {
      query: "",
      clients: [],
      startDate: null,
      endDate: null,
    },
  });

  const filteredUsers = filterPeople(users, state.filters);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetch());
    dispatch(FetchClients());
  }, [dispatch]);

  const handleClick = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showDialog: true }));
  };

  const handleClickFilter = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showFilterDialog: true }));
  };

  const handleClickImport = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showImportModal: true }));
  };

  const handleClickImportAbsences = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showAbsencesModal: true }));
  };

  const handlerClose = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showDialog: false }));
  };

  const handlerCloseFilter = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showFilterDialog: false }));
  };

  const handlerCloseImport = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showImportModal: false }));
  };

  const handlerCloseImportAbsences = () => {
    setState((prev: PeopleTableState) => ({ ...prev, showAbsencesModal: false }));
  };

  const handleActionPress = (item: PeopleWithAllRelations) => {
    setState((prev: PeopleTableState) => ({
      ...prev,
      selectedSmarter: item,
      isOpen: true,
    }));
  };

  const setCurrentPage = (page: number) => {
    setState((prev: PeopleTableState) => ({ ...prev, currentPage: page }));
  };

  const setQuery = (query: string) => {
    setState((prev: PeopleTableState) => ({
      ...prev,
      filters: {
        ...prev.filters,
        query,
      },
    }));
  };

  const updateFilters = (newFilters: Partial<PeopleTableFilters>) => {
    console.log("Actualizando filtros:", newFilters);
    setState((prev: PeopleTableState) => {
      const updatedFilters = {
        ...prev.filters,
        ...newFilters,
      };
      console.log("Filtros actualizados:", updatedFilters);
      return {
        ...prev,
        currentPage: 1, // Resetear a la primera página cuando se actualizan filtros
        filters: updatedFilters,
      };
    });
  };

  const setIsOpen = (isOpen: boolean) => {
    setState((prev: PeopleTableState) => ({ ...prev, isOpen }));
  };

  return {
    users,
    isLoading,
    currentPage: state.currentPage,
    showDialog: state.showDialog,
    showFilterDialog: state.showFilterDialog,
    showImportModal: state.showImportModal,
    showAbsencesModal: state.showAbsencesModal,
    isOpen: state.isOpen,
    setIsOpen,
    selectedSmarter: state.selectedSmarter,
    filters: state.filters,
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
  };
};
