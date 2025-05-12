/**
 * @jest-environment jsdom
 */
import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import PeopleTable from "./index";
import { usePeopleTable } from "./usePeopleTable";

// Definir las interfaces para los componentes mockeados
interface ChildrenProps {
  children: ReactNode;
}

interface TableProps extends ChildrenProps {
  title: string;
}

interface ItemProps {
  item: {
    id: number;
    name: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

// Mock del hook personalizado para evitar dependencias de Redux
jest.mock("./usePeopleTable", () => ({
  usePeopleTable: jest.fn(),
}));

// Mock de los componentes que no queremos probar realmente
jest.mock("../../modals/AssignProjectModal", () => ({
  __esModule: true,
  default: () => <div data-testid="assign-project-modal">Mock AssignProjectModal</div>,
}));

jest.mock("../../dialog/GenericDialog", () => ({
  __esModule: true,
  default: ({ children }: ChildrenProps) => <div data-testid="generic-dialog">{children}</div>,
}));

jest.mock("../../modals/GenericModal", () => ({
  __esModule: true,
  default: ({ children }: ChildrenProps) => <div data-testid="generic-modal">{children}</div>,
}));

jest.mock("../../modals/ImportExcelModal", () => ({
  __esModule: true,
  default: () => <div data-testid="import-excel-modal">Mock ImportExcelModal</div>,
}));

jest.mock("../../Table/MainTable", () => {
  return {
    __esModule: true,
    default: ({ children, title }: TableProps) => (
      <div data-testid="main-table">
        <h2>{title}</h2>
        <div>{children}</div>
      </div>
    ),
  };
});

jest.mock("../../Table/PeopleItemRow", () => {
  return {
    __esModule: true,
    default: ({ item }: ItemProps) => <div data-testid={`person-row-${item.id}`}>{item.name}</div>,
  };
});

// Mock del archivo CSS
jest.mock("./PeopleTable.module.css", () => ({}), { virtual: true });

describe("PeopleTable Component", () => {
  // Datos de prueba
  const mockPeople = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com" },
    { id: 2, name: "María García", email: "maria@example.com" },
  ];

  // Funciones mock
  const mockSetQuery = jest.fn();
  const mockHandleActionPress = jest.fn();
  const mockSetCurrentPage = jest.fn();

  beforeEach(() => {
    // Limpiar todos los mocks entre pruebas
    jest.clearAllMocks();

    // Configurar el valor devuelto por nuestro hook usePeopleTable
    (usePeopleTable as jest.Mock).mockReturnValue({
      isLoading: false,
      currentPage: 1,
      showDialog: false,
      showFilterDialog: false,
      showImportModal: false,
      isOpen: false,
      setIsOpen: jest.fn(),
      selectedSmarter: undefined,
      setQuery: mockSetQuery,
      filteredUsers: mockPeople,
      handleClick: jest.fn(),
      handleClickFilter: jest.fn(),
      handleClickImport: jest.fn(),
      handlerClose: jest.fn(),
      handlerCloseFilter: jest.fn(),
      handlerCloseImport: jest.fn(),
      handleActionPress: mockHandleActionPress,
      setCurrentPage: mockSetCurrentPage,
    });
  });

  it("debe renderizar el componente con los datos proporcionados", () => {
    render(<PeopleTable />);

    // Verificar que el título de la tabla es correcto
    expect(screen.getByText("Smarters")).toBeInTheDocument();

    // Verificar que se renderizan las filas de personas
    expect(screen.getByTestId("person-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("person-row-2")).toBeInTheDocument();

    // Verificar que los nombres de las personas son correctos
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("María García")).toBeInTheDocument();
  });
});
