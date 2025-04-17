'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface Props {
    isOpen: boolean;
    setIsOpen: () => void;
    onAssign: () => Promise<void>;
}

export default function DownloadPreInvoiceModal({ isOpen, setIsOpen, onAssign}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await onAssign();
      setIsProcessing(false);
    } catch (err) {
      console.error('Error en DownloadPreInvoiceModal:', err);
      setError('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.');
      setIsProcessing(false);
    }
  };

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
                {isProcessing ? (
                  <ArrowPathIcon aria-hidden="true" className="size-6 text-green-600 animate-spin" />
                ) : (
                  <CheckIcon aria-hidden="true" className="size-6 text-green-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Descargar prefactura
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    al generar este paso, ya no podras editar la prefactura
                  </p>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 ${
                  isProcessing 
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setIsOpen()}
                disabled={isProcessing}
                className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
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
