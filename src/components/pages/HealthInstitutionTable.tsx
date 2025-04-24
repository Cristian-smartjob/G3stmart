'use client'

import { DataTables } from "@/lib/features/data";
import GenericDataTable from "./GenericDataTable";

export default function HealthInstitutionTable(){

  return (
      <GenericDataTable title="Isapres" type={DataTables.HealthInstitution} />
  )
}