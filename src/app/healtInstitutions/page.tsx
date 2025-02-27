import HealthInstitutionTable from '@/components/pages/HealthInstitutionTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Isapres',
}

export default function HealtInstitutionsPage() {

  return (
    <HealthInstitutionTable />
  )
}