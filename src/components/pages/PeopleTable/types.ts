import { PeopleWithAllRelations } from "@/types/people";
import { ComboBoxItem } from "@/interface/ui";

/**
 * Propiedades necesarias para el filtrado de personas
 */
export interface PersonFilterProperties {
  /** ID de la compañía o cliente */
  companyId?: string | number;
  /** ID alternativo del cliente */
  clientId?: string | number;
  /** Relación con el cliente */
  client?: { id: number; name: string } | null;
  /** Fecha de inicio */
  startDate?: Date | string | null;
  /** Fecha de inicio de contrato */
  contractStart?: Date | string | null;
  /** Fecha de inicio (nombre alternativo) */
  fechaInicio?: Date | string | null;
  /** Fecha de creación */
  createdAt?: Date | string | null;
  /** Fecha de finalización */
  endDate?: Date | string | null;
  /** Fecha de fin de contrato */
  contractEnd?: Date | string | null;
  /** Fecha de término (nombre alternativo) */
  fechaTermino?: Date | string | null;
}

/**
 * Filtros aplicados a la tabla de personas
 */
export interface PeopleTableFilters {
  /** Texto de búsqueda para filtrar por nombre y otros campos */
  query: string;
  /** Clientes seleccionados para filtrar */
  clients: ComboBoxItem[];
  /** Fecha de inicio mínima */
  startDate: Date | null;
  /** Fecha de término máxima */
  endDate: Date | null;
}

/**
 * Estados del componente PeopleTable
 */
export interface PeopleTableState {
  /** Página actual en la paginación */
  currentPage: number;
  /** Indica si se debe mostrar el diálogo para agregar persona */
  showDialog: boolean;
  /** Indica si se debe mostrar el diálogo de filtros */
  showFilterDialog: boolean;
  /** Indica si se debe mostrar el modal de importación */
  showImportModal: boolean;
  /** Indica si se debe mostrar el modal de importación de ausencias */
  showAbsencesModal: boolean;
  /** Indica si se debe mostrar el modal de asignación de proyecto */
  isOpen: boolean;
  /** La persona seleccionada para alguna acción */
  selectedSmarter: PeopleWithAllRelations | undefined;
  /** Filtros aplicados a la tabla */
  filters: PeopleTableFilters;
}

/**
 * Props para los componentes de la tabla de personas
 */
export interface PeopleTableProps {
  /** Encabezados de la tabla */
  header: string[];
}

/**
 * Props para el componente de filtro de personas
 */
export interface FilterPeopleProps {
  /** Filtros actuales */
  filters: PeopleTableFilters;
  /** Función para actualizar los filtros */
  onUpdateFilters: (filters: PeopleTableFilters) => void;
  /** Función para cerrar el diálogo de filtros */
  onClose: () => void;
}

/**
 * Resultado de usar el hook usePeopleTable
 */
export interface UsePeopleTableResult {
  /** Lista de usuarios/personas */
  users: PeopleWithAllRelations[];
  /** Indica si se están cargando los datos */
  isLoading: boolean;
  /** Página actual en la paginación */
  currentPage: number;
  /** Indica si se debe mostrar el diálogo para agregar persona */
  showDialog: boolean;
  /** Indica si se debe mostrar el diálogo de filtros */
  showFilterDialog: boolean;
  /** Indica si se debe mostrar el modal de importación */
  showImportModal: boolean;
  /** Indica si se debe mostrar el modal de importación de ausencias */
  showAbsencesModal: boolean;
  /** Indica si se debe mostrar el modal de asignación de proyecto */
  isOpen: boolean;
  /** Función para establecer si el modal de asignación debe mostrarse */
  setIsOpen: (value: boolean) => void;
  /** La persona seleccionada para alguna acción */
  selectedSmarter: PeopleWithAllRelations | undefined;
  /** Filtros actuales aplicados a la tabla */
  filters: PeopleTableFilters;
  /** Función para actualizar el texto de búsqueda */
  setQuery: (value: string) => void;
  /** Función para actualizar todos los filtros */
  updateFilters: (filters: Partial<PeopleTableFilters>) => void;
  /** Lista de usuarios filtrados según todos los criterios */
  filteredUsers: PeopleWithAllRelations[];
  /** Función para manejar el clic en el botón de agregar */
  handleClick: () => void;
  /** Función para manejar el clic en el botón de filtro */
  handleClickFilter: () => void;
  /** Función para manejar el clic en el botón de importación */
  handleClickImport: () => void;
  /** Función para manejar el clic en el botón de importación de ausencias */
  handleClickImportAbsences: () => void;
  /** Función para cerrar el diálogo de agregar */
  handlerClose: () => void;
  /** Función para cerrar el diálogo de filtros */
  handlerCloseFilter: () => void;
  /** Función para cerrar el diálogo de importación */
  handlerCloseImport: () => void;
  /** Función para cerrar el diálogo de importación de ausencias */
  handlerCloseImportAbsences: () => void;
  /** Función para manejar la acción sobre una persona */
  handleActionPress: (item: PeopleWithAllRelations) => void;
  /** Función para establecer la página actual */
  setCurrentPage: (page: number) => void;
}
