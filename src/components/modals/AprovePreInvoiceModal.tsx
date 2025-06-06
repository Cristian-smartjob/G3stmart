'use client'

import { update } from '@/lib/features/preinvoices';
import { useAppDispatch } from '@/lib/hook';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import { updatePreInvoice } from '@/app/actions/preInvoices';
import { useSearchParams } from 'next/navigation';

interface Props {
    isOpen:boolean;
    setIsOpen: () => void;
    preinvoiceId: number;
}

export default function AprovePreInvoiceModal({ isOpen, setIsOpen, preinvoiceId}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const returnTabId = searchParams.get('returnTabId') || '1';

  const handlerUpdate = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // 1. Actualizar en Redux
      dispatch(update({
        id: preinvoiceId,
        status: "APPROVED"
      }));
      // 2. Actualizar en el servidor usando server action
      try {
        const result = await updatePreInvoice(preinvoiceId, { 
          id: preinvoiceId,
          status: "APPROVED"
        });
        console.log('Prefactura aprobada en servidor:', result);
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
          body: JSON.stringify({ status: 'APPROVED' }),
        });

        const apiResult = await apiResponse.json();
        console.log('Respuesta de la API:', apiResult);
      } catch (error) {
        console.error('Error al llamar a la API:', error);
      }

      // Redirigir a la lista de prefacturas después de completar todo, preservando la pestaña activa
      setTimeout(() => {
        window.location.href = `/preinvoice?tabId=${returnTabId}`;
      }, 500);
    } catch (error) {
      console.error('Error general en la aprobación:', error);
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
                  Aprobar prefactura 
                </DialogTitle>
                <div className="mt-2">

                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsOpen();
                  handlerUpdate();
                }}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 ${
                  isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Aprobar'}
              </button>
              <button
                type="button"
                data-autofocus
                disabled={isLoading}
                onClick={() => setIsOpen()}
                className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
