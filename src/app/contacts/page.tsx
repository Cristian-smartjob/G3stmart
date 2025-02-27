
import ContactTable from '@/components/pages/ContactTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactos',
}

export default function People() {

  return (
    <ContactTable />
  )
}