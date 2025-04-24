'use client'

import { DataTables } from "@/lib/features/data";
import GenericDataTable from "./GenericDataTable";

export default function SeniorityTable(){

  return (
      <GenericDataTable title="Seniorities" type={DataTables.Seniority} />
  )
}