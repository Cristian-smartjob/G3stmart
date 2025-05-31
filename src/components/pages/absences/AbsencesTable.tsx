"use client";

import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import TableSkeleton from "@/components/core/TableSkeleton";
import MainTable from "@/components/Table/MainTable";
import { differenceInDays, format } from "date-fns";

interface Absence {
  id: number;
  person_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  leave_type: string | null;
  person: {
    id: number;
    name: string;
    lastName: string;
    dni: string;
    client: {
      id: number;
      name: string;
    } | null;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AbsencesResponse {
  data: Absence[];
  pagination: PaginationInfo;
}

export interface AbsencesTableRef {
  refreshData: () => void;
}

const AbsencesTable = forwardRef<AbsencesTableRef>((props, ref) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const header = ["Nombre", "RUT", "Fecha inicio", "Fecha término", "Días", "Motivo", "Tipo", "Empresa"];

  const fetchAbsences = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/absences?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al obtener ausencias");
      }
      const data: AbsencesResponse = await response.json();
      setAbsences(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching absences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Exponer la función de recarga a través de ref
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      fetchAbsences(pagination.page, pagination.limit);
    },
  }));

  useEffect(() => {
    fetchAbsences(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  // Calcular la cantidad de días entre dos fechas
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1; // +1 porque es inclusivo
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <MainTable
      title="Ausencias"
      count={pagination.total}
      page={pagination.page}
      header={header}
      showCheckbox={false}
      onChangeSelectAll={() => {}}
      onSelectPage={(page) => {
        setPagination((prev) => ({ ...prev, page }));
      }}
      onNext={() => {
        if (pagination.page < pagination.totalPages) {
          setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      }}
      onPrev={() => {
        if (pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      }}
    >
      <>
        <TableSkeleton isLoading={isLoading && absences.length <= 0} size={7} />

        {!isLoading &&
          absences.map((absence) => (
            <tr key={absence.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {absence.person.name} {absence.person.lastName}
              </td>
              <td className="px-4 py-3">{absence.person.dni}</td>
              <td className="px-4 py-3">{formatDate(absence.start_date)}</td>
              <td className="px-4 py-3">{formatDate(absence.end_date)}</td>
              <td className="px-4 py-3">{calculateDays(absence.start_date, absence.end_date)}</td>
              <td className="px-4 py-3">{absence.reason || "-"}</td>
              <td className="px-4 py-3">{absence.leave_type || "-"}</td>
              <td className="px-4 py-3">{absence.person.client?.name || "-"}</td>
            </tr>
          ))}

        {!isLoading && absences.length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-3 text-center">
              No hay registros de ausencias
            </td>
          </tr>
        )}
      </>
    </MainTable>
  );
});

AbsencesTable.displayName = "AbsencesTable";

export default AbsencesTable;
