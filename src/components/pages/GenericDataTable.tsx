"use client";

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/data";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { DataTables, GenericDataMap } from "@/interface/common";
import { RootState } from "@/lib/store";
import DataItemRow from "../Table/DataItemRow";

import Tabbar from "../core/Tabbar";
import { SidebarItem } from "@/interface/ui";
import MainTable from "../Table/MainTable";
import TableSkeleton from "../core/TableSkeleton";

const header = ["id", "name"];

interface Props {
  title: string;
  type: DataTables;
}

export default function GenericDataTable({ title, type }: Props) {
  const tabs: SidebarItem[] = [
    { name: "Afps", href: "/data", icon: null, current: type === DataTables.AFPInstitution },
    { name: "Isapres", href: "/healtInstitutions", icon: null, current: type === DataTables.HealthInstitution },
    { name: "Seniority", href: "/seniority", icon: null, current: type === DataTables.Seniority },
  ];

  const genericDataMap = useSelector<RootState, GenericDataMap>((state) => state.data.list);
  const genericIsLoadingDataMap = useSelector<RootState, { [key: string]: boolean }>(
    (state) => state.data.isLoadingData
  );
  const genericErrorDataMap = useSelector<RootState, { [key: string]: boolean }>((state) => state.data.errorData || {});
  const afpInstitutions = genericDataMap[type] || [];
  const isLoading = genericIsLoadingDataMap[type] || false;
  const hasError = genericErrorDataMap[type] || false;
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetch(type));
  }, [dispatch]);

  return (
    <div className="">
      <div className="pt-6 px-4">
        <Tabbar items={tabs} />
      </div>
      <div className="overflow-x-auto">
        <MainTable
          title={title}
          count={afpInstitutions.length}
          page={currentPage}
          header={header}
          showCheckbox={false}
          onChangeSelectAll={() => {}}
          onSelectPage={(page) => {
            setCurrentPage(page);
          }}
          onNext={() => {
            const page = Math.min(Math.ceil(afpInstitutions.length / 10), currentPage + 1);
            setCurrentPage(page);
          }}
          onPrev={() => {
            const page = Math.max(1, currentPage - 1);
            setCurrentPage(page);
          }}
        >
          <>
            <TableSkeleton isLoading={isLoading && afpInstitutions.length <= 0} size={2} />

            {!isLoading && hasError && (
              <tr>
                <td colSpan={header.length} className="px-3 py-4 text-center text-red-500">
                  Error loading data. Please try again later.
                </td>
              </tr>
            )}

            {!isLoading && !hasError && afpInstitutions.length === 0 && (
              <tr>
                <td colSpan={header.length} className="px-3 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}

            {afpInstitutions.map((item) => (
              <DataItemRow key={item.id} item={item} />
            ))}
          </>
        </MainTable>
      </div>
    </div>
  );
}
