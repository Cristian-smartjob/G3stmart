
import SeniorityTable from '@/components/pages/SeniorityTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seniorities',
}

export default function HealtInstitutionsPage() {

  return (
    <SeniorityTable />
  )
}