
import PeopleTable from '@/components/pages/PeopleTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personas',
}

export default function People() {

  return (
    <PeopleTable />
  )
}