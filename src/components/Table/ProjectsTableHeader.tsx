'use client'
import { Table } from "flowbite-react";

export default function ProjectsTableHeader(){
  return (
    <Table.Head>
      <Table.HeadCell>ID</Table.HeadCell>
      <Table.HeadCell>Nombre</Table.HeadCell>
    </Table.Head>
  )
}