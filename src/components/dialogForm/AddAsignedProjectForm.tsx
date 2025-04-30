import {  DialogTitle } from '@headlessui/react'
import { Formik } from 'formik';
import { CalendarIcon } from '@heroicons/react/24/outline'
import {  useState } from 'react';
import { useAppDispatch } from '@/lib/hook';
import { assign } from '@/lib/features/leaveDays';
import { Datepicker, Label } from "flowbite-react"
import { calcularDiasHabiles } from '@/utils/date';



interface Props {
    title: string;
    smarterId: number;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AddAsignedProjectForm({ title, smarterId, setIsOpen }: Props) {


    const dispatch = useAppDispatch()
    const [days, setDays] = useState(0)

    const initialValues: {
        start_date: Date;
        end_date: Date;
        smarter_id: number;
      } = {
        start_date: new Date(),
        end_date: new Date(),
        smarter_id: smarterId
      }
  


    const validate = (start_date: Date, end_date: Date) => {
      const currentDays = calcularDiasHabiles(start_date, end_date)
      setDays(currentDays)
    }
  

  return (
 
      <Formik
       initialValues={initialValues}
       onSubmit={(values) => {
        

        dispatch(assign({
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          smarter_id: values.smarter_id
        }))

        setIsOpen(false)

        
       }}
     >
       {({
        values,
         handleSubmit,
         setFieldValue
       }) => (
        <form onSubmit={handleSubmit}>
        <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                <CalendarIcon aria-hidden="true" className="size-6 text-green-600" />
              </div>
              <div className="mt-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  {title}
                </DialogTitle>
                <div className="mt-2 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="gap-y-2">
                      <Label>Fecha de inicio</Label>
                      <Datepicker language='es-CL' onChange={(date: (Date | null)) => {
                          if(date !== null){
                            setFieldValue("start_date", date)
                            validate(date, values.end_date)
                          }
                      }} />
                    </div>
                    <div className="gap-y-2">
                      <Label>Fecha de término</Label>
                      <Datepicker language='es-CL' onChange={(date: (Date | null)) => {
                          if(date !== null){
                            setFieldValue("end_date", date)
                            validate(values.start_date, date)
                          }
                      }} />
                    </div>
                  </div>
                  <div className='mt-4'>
                    <p>Días de ausencia: {days}</p>
                  </div>
                </div>
              </div>
             
            </div>
            <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4 gap-x-4">
             
              <button
                type="button"
                data-autofocus
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                
              >
                Asignar dias de ausencia
              </button>
            </div>
        </form>
       )}
     </Formik>
       
 
  )
}
