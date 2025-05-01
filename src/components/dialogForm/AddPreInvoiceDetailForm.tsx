import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { fetch } from "@/lib/features/users";
import { Formik } from 'formik';

const initialValues: {
  oc_number?: number;
  hes_number?: number;
  preinvoice_number?: number;
  status: string;
} = {
 status: 'APPROVED'
}

export default function AddPreInvoiceDetailForm() {



  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])


  return (
    <div className="bg-white">
      <div className="relative mx-auto grid max-w-7xl gap-x-16  xl:gap-x-48">
      <Formik
       initialValues={initialValues}
       
       onSubmit={(values, { setSubmitting }) => {
         console.log('values', values)
    
           //dispatch(create(values as PreInvoice))
          setSubmitting(true)

         
       }}
     >
       {({
         handleChange,
         handleBlur,
         handleSubmit,
       }) => (
        <form className="px-4 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16" onSubmit={handleSubmit}>
        <div className="mx-auto max-w-lg lg:max-w-none">
          <section aria-labelledby="contact-info-heading">
            

      
            <div className="mt-6">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                Número Factura
            </label>
            <div className="mt-2">
                <input
                id="preinvoice_number"
                name="preinvoice_number"
                type="number"
                autoComplete="number"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            {/*errors.name !== undefined ? (
                <div className='mt-2'>
                <ErrorAlert message={errors.name || ""} />
                </div>
            ) : null*/}
            
            </div>

            <div className="mt-6">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                Número OC
            </label>
            <div className="mt-2">
                <input
                id="oc_number"
                name="oc_number"
                type="number"
                autoComplete="number"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            {/*errors.name !== undefined ? (
                <div className='mt-2'>
                <ErrorAlert message={errors.name || ""} />
                </div>
            ) : null*/}
            
            </div>


            <div className="mt-6">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                Número HES
            </label>
            <div className="mt-2">
                <input
                id="hes_number"
                name="hes_number"
                type="number"
                autoComplete="number"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            {/*errors.name !== undefined ? (
                <div className='mt-2'>
                <ErrorAlert message={errors.name || ""} />
                </div>
            ) : null*/}
            
            </div>


          </section>


          <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
            >
              Aprobar
            </button>
            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
              
            </p>
          </div>
        </div>
      </form>
       )}
     </Formik>
       
      </div>
    </div>
  )
}
