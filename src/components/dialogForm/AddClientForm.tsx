
import Selector from '../core/Selector'
import { useSelector } from 'react-redux'
import { CurrencyType, DataTables, GenericDataMap, People } from '@/interface/common'
import { RootState } from '@/lib/store'
import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { fetch } from "@/lib/features/users";
import { fetch as FetchData} from "@/lib/features/data"
import { SelectorItem } from '@/interface/ui'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ClientForm } from '@/interface/form'
import { create } from '@/lib/features/clients'


const validationSchema = Yup.object({
  name: Yup.string().required('Debes elegir un nombre'),
  currency_type_id: Yup.number().required('Debes elegir un contacto'),
  main_contact_id: Yup.number().required('Debes elegir una moneda'),
});

const invoicesTypes = [
  {
    id: 1,
    label: "Por hora"
  },
  {
    id: 2,
    label: "Por mes"
  },
  {
    id: 3,
    label: "Por dias habiles"
  }
]

export default function AddClientForm() {


  const genericDataMap = useSelector<RootState, GenericDataMap>(state => state.data.list)
  const currencies = genericDataMap[DataTables.CurrencyType]

  const initialValues: ClientForm = {}

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])

  useEffect(() => {
    dispatch(FetchData(DataTables.CurrencyType))
  }, [dispatch])


  return (
    <div className="bg-white">

      <div className="relative mx-auto grid max-w-7xl gap-x-16  lg:px-8 xl:gap-x-48">
      
<Formik
       initialValues={initialValues}
       validationSchema={validationSchema}
       onSubmit={(values, { setSubmitting }) => {
      
       
         dispatch(create(values))
         
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         setFieldValue
       }) => (
  
        <form className="px-4 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16" onSubmit={handleSubmit}>
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
                Información General
              </h2>

              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Nombre
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Rut
                </label>
                <div className="mt-2">
                  <input
                    id="rut"
                    name="rut"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Razón social
                </label>
                <div className="mt-2">
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Dirección 
                </label>
                <div className="mt-2">
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Día de facturación 
                </label>
                <div className="mt-2">
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>


              <div className='mt-6'>
                 <Selector 
                    title='Moneda de cobro' 
                    items={currencies.map(item => ({id: item.id, label: `${item.name}`}))}
                    onChange={(item: SelectorItem | null) => {
                      setFieldValue("currency_type_id", item?.id)
                    }}
                  />
              </div>

              <div className='mt-6'>
                 <Selector 
                    title='Tipo de facturación' 
                    items={invoicesTypes}
                    onChange={(item: SelectorItem | null) => {
                      //setFieldValue("currency_type_id", item?.id)
                    }}
                  />
              </div>
            

            </section>


            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
              >
                Guardar
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
