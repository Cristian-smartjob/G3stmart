'use client'

import { update } from '@/lib/features/preinvoices';
import { useAppDispatch } from '@/lib/hook';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

interface Props {
    isOpen:boolean;
    setIsOpen: () => void;
    preinvoiceId: number;
}



export default function CompleteBillModal({ isOpen, setIsOpen, preinvoiceId}: Props) {
 

   const dispatch = useAppDispatch()
  
    const handlerUpdate = () => {
  
      dispatch(update({
        id: preinvoiceId,
        status: "APPROVED"
      }))
    }
   
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon aria-hidden="true" className="size-6 text-green-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Confirmar facturación 
                </DialogTitle>
                <div className="mt-2">
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                                Número factura
                            </label>
                            <div className="mt-2">
                                <input
                                     id="number_bill"
                                     name="number_bill"
                                      type="number"
                                     autoComplete="number"
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
                                Número HES
                            </label>
                            <div className="mt-2">
                                <input
                                    id="number_hes"
                                    name="number_hes"
                                     type="number"
                                    autoComplete="number"
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                                Número OC
                            </label>
                            <div className="mt-2">
                                <input
                                    id="number_oc"
                                    name="number_oc"
                                     type="number"
                                    autoComplete="number"
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
                                Monto OC
                            </label>
                            <div className="mt-2">
                                <input
                                    id="oc_amount"
                                    name="oc_amount"
                                    type="number"
                                    autoComplete="number"
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                
                                />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen()
                  handlerUpdate()
                }}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              >
                Aprobar
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setIsOpen()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
