import { Popover, } from "flowbite-react";
import { EnvelopeIcon, PhoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'


export default function PeoplePopOver(){
    return (
        <>
   <Popover
      aria-labelledby="default-popover"
      content={
        <>
        <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">Jorge Acosta</h3>
                <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Contacto
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">Generente</p>
            </div>
            {/*<img alt="" src={person.imageUrl} className="size-10 shrink-0 rounded-full bg-gray-300" />*/}
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:transmigrado@gmail.com`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <EnvelopeIcon aria-hidden="true" className="size-5 text-gray-400" />
                  Correo
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel: +56930805525`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <PhoneIcon aria-hidden="true" className="size-5 text-gray-400" />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </>
      }
    >
     <button
        type="button"
        className="rounded-full p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <QuestionMarkCircleIcon aria-hidden="true" className="size-5 text-gray-300 hover:text-white" />
      </button>
    </Popover>

        </>
    )
}