'use client'

import { update } from '@/lib/features/preinvoices';
import { useAppDispatch } from '@/lib/hook';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import { updatePreInvoice } from '@/app/actions/preInvoices';

interface Props {
    isOpen:boolean;
    setIsOpen: () => void;
    preinvoiceId: number;
}

export default function CompleteBillModal({ isOpen, setIsOpen, preinvoiceId}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numberBill: '',
    numberHes: '',
    numberOc: '',
    ocAmount: ''
  });
  
  const dispatch = useAppDispatch();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlerUpdate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('Iniciando completado de facturación para ID:', preinvoiceId, 'con datos:', formData);
    
    try {
      // 1. Actualizar en Redux
      dispatch(update({
        id: preinvoiceId,
        status: "COMPLETED"
      }));
      console.log('Estado actualizado en Redux');
      
      // 2. Actualizar en el servidor usando server action
      try {
        const result = await updatePreInvoice(preinvoiceId, { 
          id: preinvoiceId, 
          status: "COMPLETED",
          invoiceNumber: formData.numberBill,
          hesNumber: formData.numberHes,
          ocNumber: formData.numberOc,
          ocAmount: formData.ocAmount ? Number(formData.ocAmount) : undefined
        });
        console.log('Facturación completada en servidor:', result);
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
            status: 'COMPLETED',
            invoiceNumber: formData.numberBill,
            hesNumber: formData.numberHes,
            ocNumber: formData.numberOc,
            ocAmount: formData.ocAmount ? Number(formData.ocAmount) : undefined
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
      console.error('Error general en la facturación:', error);
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
                                     id="numberBill"
                                     name="numberBill"
                                     type="text"
                                     value={formData.numberBill}
                                     onChange={handleInputChange}
                                     className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-700">
                                Número HES
                            </label>
                            <div className="mt-2">
                                <input
                                    id="numberHes"
                                    name="numberHes"
                                    type="text"
                                    value={formData.numberHes}
                                    onChange={handleInputChange}
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
                                    id="numberOc"
                                    name="numberOc"
                                    type="text"
                                    value={formData.numberOc}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-700">
                                Monto OC
                            </label>
                            <div className="mt-2">
                                <input
                                    id="ocAmount"
                                    name="ocAmount"
                                    type="number"
                                    value={formData.ocAmount}
                                    onChange={handleInputChange}
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
                disabled={isLoading}
                onClick={() => {
                  setIsOpen();
                  handlerUpdate();
                }}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 ${
                  isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isLoading ? 'Procesando...' : 'Completar facturación'}
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
