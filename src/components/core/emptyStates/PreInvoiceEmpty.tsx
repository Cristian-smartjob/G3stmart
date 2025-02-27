import { PlusIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid'

interface Props {
    onAction: () => void;
}

export default function PreInvoiceEmpty({ onAction }: Props) {
  return (
    <div className="text-center p-6">
      
      <CurrencyDollarIcon className='mx-auto size-12 text-gray-400' />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No se han creado facturas</h3>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onAction}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
          Agregar prefactura
        </button>
      </div>
    </div>
  )
}
