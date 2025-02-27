'use client'

import { DataTables } from "@/interface/common";
import GenericDataTable from "./GenericDataTable";

export default function DataTable(){

  return (
      <GenericDataTable title="AFPs" type={DataTables.AFPInstitution} />
  )
}