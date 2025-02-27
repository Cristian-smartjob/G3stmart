'use client'

import { SidebarItem } from '@/interface/ui'
import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
    navigation: SidebarItem[];
    currentMenu?: string;
}

export default function Sidebar({ navigation, currentMenu }: Props) {

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div className="flex h-16 shrink-0 items-center">
            <img
            alt="Smartjob"
            src="http://localhost:3000/logo.png"
            className="h-8 w-auto"
            />
        </div>
        <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
                <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                    <li key={item.name}>
                    <Link
                        href={item.href}
                        className={classNames(
                        item.href === currentMenu
                            ? 'bg-gray-50 text-primary'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                        )}
                    >   
                    {item.icon == null ? null : (
                         <item.icon
                         aria-hidden="true"
                         className={classNames(
                            item.href === currentMenu ? 'text-secondary' : 'text-gray-400 group-hover:text-secondary',
                             'size-6 shrink-0',
                         )}
                         />
                    )}
                       
                        {item.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </li>
            
            <li className="-mx-6 mt-auto">
                <Link
                href="#"
                className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50"
                >
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-50"
                />
                <span className="sr-only">Tu perfil</span>
                <span aria-hidden="true">Jorge Acosta</span>
                </Link>
            </li>
            </ul>
        </nav>
        </div>
    </div>
  )
}
