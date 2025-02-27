
import DataTable from '@/components/pages/DataTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AFPs',
}

export default function UsersPage() {

  return (
    <DataTable />
  )
}