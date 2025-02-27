'use client'

import { DataTables } from "@/interface/common";
import GenericDataTable from "./GenericDataTable";

export default function HealthInstitutionTable(){

  return (
      <GenericDataTable title="Isapres" type={DataTables.HealthInstitution} />
  )
}