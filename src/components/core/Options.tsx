import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/20/solid'

interface Props {
  onPressItem: (option: string) => void;
}

export default function Options({ onPressItem }: Props) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
      <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem >
            <a
              href="#"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              onClick={() => onPressItem("edit")}
            >
              <PencilSquareIcon
                aria-hidden="true"
                className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500"
              />
              Editar
            </a>
          </MenuItem>
        </div>
      
      
        <div className="py-1">
          <MenuItem >
            <a
              href="#"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
              onClick={() => onPressItem("delete")}
            >
              <TrashIcon aria-hidden="true" className="mr-3 size-5 text-gray-400 group-data-[focus]:text-gray-500" />
              Eliminar
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
