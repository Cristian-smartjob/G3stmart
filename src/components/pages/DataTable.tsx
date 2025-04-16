'use client'

import { DataTables } from "@/lib/features/data";
import GenericDataTable from "./GenericDataTable";

export default function DataTable(){

  return (
      <GenericDataTable title="AFPs" type={DataTables.AFPInstitution} />
  )
}