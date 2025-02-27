'use client'

import { DataTables } from "@/interface/common";
import GenericDataTable from "./GenericDataTable";

export default function SeniorityTable(){

  return (
      <GenericDataTable title="Seniorities" type={DataTables.Seniority} />
  )
}