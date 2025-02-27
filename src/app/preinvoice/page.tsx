import PreinvoiceTable from '@/components/pages/PreinvoiceTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prefacturas',
}

export default function People() {

  return (
    <PreinvoiceTable />
  )
}