'use client'

import { useState } from 'react'
import {
  Bars3Icon,
  UsersIcon,
  DocumentCurrencyDollarIcon,
  CircleStackIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import MobileSidebar from './MobileSidebar'
import Sidebar from './Sidebar'

const navigation = [

  { name: 'Personas', href: '/people', icon: UsersIcon, current: true },
  { name: 'Contactos', href: '/contacts', icon: UsersIcon, current: false },
  { name: 'Datos', href: '/data', icon: CircleStackIcon, current: false },
  { name: 'Prefacturas', href: '/preinvoice', icon: DocumentCurrencyDollarIcon, current: false },
  //{ name: 'Notas de crédito', href: '/credit_notes', icon: DocumentCurrencyDollarIcon, current: false },
  //{ name: 'Proyectos', href: '/projects', icon: FolderOpenIcon, current: false },
  { name: 'Clientes', href: '/clients', icon: UserCircleIcon, current: false },
]

interface Props {
    children: React.ReactNode;
    currentMenu?: string;
}

export default function MainLayout({ children, currentMenu }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        
        <MobileSidebar navigation={navigation} />
        <Sidebar navigation={navigation} currentMenu={currentMenu} />

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Abrir sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-gray-900">Dashboard</div>
          <a href="#">
            <span className="sr-only">Tu perfil</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-gray-50"
            />
          </a>
        </div>
        <main className="lg:pl-72">
          <div className="">{children}</div>
        </main>
      </div>
    </>
  )
}
