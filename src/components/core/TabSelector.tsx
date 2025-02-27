
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'


export interface Selector {
    id: number;
    label: string;
    value?: string;
}

interface Props{ 
    labels: Selector[];
    selected: number;
    onSelect: (index: number) => void;
}

export default function TabSelector({ labels, selected, onSelect  }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
       
        <select
          defaultValue={labels.find((tab) => tab.id === selected)?.id}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
         
        >
          {labels.map((tab) => (
            <option key={tab.id}>{tab.label}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <nav aria-label="Tabs" className="flex space-x-4">
          {labels.map((tab) => (
            <a
              key={tab.id}
              href={"#"}
              aria-current={ tab.id === selected ? 'page' : undefined}
              className={clsx(
                tab.id === selected ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
              onClick={() => {
                onSelect(tab.id)
              }}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
