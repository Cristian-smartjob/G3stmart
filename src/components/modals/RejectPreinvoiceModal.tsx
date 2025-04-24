'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {  TrashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useAppDispatch } from '@/lib/hook'
import { update } from '@/lib/features/preinvoices'
import { updatePreInvoice } from '@/app/actions/preInvoices'

interface Props {
    isOpen:boolean;
    setIsOpen: () => void;
    preinvoiceId: number;
}

export default function RejectPreinvoiceModal({ isOpen, preinvoiceId, setIsOpen}: Props) {
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handlerUpdate = async () => {
    if (isLoading || note === "") return;
    
    setIsLoading(true);
    console.log('Iniciando rechazo de prefactura ID:', preinvoiceId, 'con nota:', note);
    
    try {
      // 1. Actualizar en Redux
      dispatch(update({
        id: preinvoiceId,
        rejectNote: note,
        status: "REJECTED"
      }));
      console.log('Estado actualizado en Redux');
      
      // 2. Actualizar en el servidor usando server action
      try {
        const result = await updatePreInvoice(preinvoiceId, { 
          id: preinvoiceId, 
          status: "REJECTED",
          rejectNote: note
        });
        console.log('Prefactura rechazada en servidor:', result);
      } catch (error) {
        console.error('Error al actualizar en el servidor:', error);
      }
      
      // 3. Actualizar usando API REST
      try {
        const apiResponse = await fetch(`/api/preinvoices/${preinvoiceId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status: 'REJECTED',
            rejectNote: note 
          }),
        });
        
        const apiResult = await apiResponse.json();
        console.log('Respuesta de la API:', apiResult);
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }
      
      // Redirigir a la lista de prefacturas después de completar todo
      setTimeout(() => {
        window.location.href = '/preinvoice';
      }, 500);
    } catch (error) {
      console.error('Error general en el rechazo:', error);
      setIsLoading(false);
    }
  }
 

  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
                <TrashIcon aria-hidden="true" className="size-6 text-red-600" />
              </div>
              <div className="mt-3 text-start sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Rechazar prefactura
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    se cancelara esta prefactura
                  </p>
                  <div className="col-span-full mt-6">
              <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                Nota
              </label>
              <div className="mt-2">
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={note}
                  onChange={event => {
                    setNote(event.target.value)
                  }}
                />
              </div>
             
            </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>{
                  setIsOpen()
                  handlerUpdate()
                }}
                disabled={note === "" || isLoading}
                className={
                  clsx(
                    (note === "" || isLoading) ? "opacity-50 cursor-not-allowed" : "opacity-100",
                    "inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2")
                }
              >
                {isLoading ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                type="button"
                data-autofocus
                disabled={isLoading}
                onClick={() => {
                  setIsOpen()
                }}
                className={clsx(
                  isLoading ? "opacity-50 cursor-not-allowed" : "",
                  "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                )}
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
