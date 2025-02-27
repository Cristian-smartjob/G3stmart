import ProjectsTable from '@/components/pages/ProjectsTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyectos',
}

export default function People() {

  return (
    <ProjectsTable />
  )
}