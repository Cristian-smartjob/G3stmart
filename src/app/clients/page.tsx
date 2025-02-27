
import ClientTable from '@/components/pages/ClientTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clientes',
}

export default function People() {

  return (
    <ClientTable />
  )
}