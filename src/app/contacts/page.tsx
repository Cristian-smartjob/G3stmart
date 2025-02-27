
import ContactTable from '@/components/pages/ContactTable'
import PeopleTable from '@/components/pages/PeopleTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactos',
}

export default function People() {

  return (
    <ContactTable />
  )
}