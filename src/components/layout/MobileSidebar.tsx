'use client'

import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { SidebarItem } from '@/interface/ui'
import { Dispatch, SetStateAction } from 'react'
import Image from "next/image"

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  navigation: SidebarItem[];
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}


export default function MobileSidebar({ navigation, sidebarOpen, setSidebarOpen }: Props) {
  return (
    <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <Image
                    alt="SmartJob"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-50 text-indigo-600'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              {item.icon && (
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                    'size-6 shrink-0',
                                  )}
                                />
                              )}
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
  )
}
