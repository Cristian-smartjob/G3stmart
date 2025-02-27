
import Selector from '../core/Selector'
import { useSelector } from 'react-redux'
import { Client, Contact, PreInvoice } from '@/interface/common'
import { RootState } from '@/lib/store'
import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { fetch as FetchClients } from "@/lib/features/clients";
import { fetch as FetchContacts } from "@/lib/features/contacts";
import { create } from '@/lib/features/preinvoices'
import SimpleSelector from '../core/SimpleSelector'
import { Formik } from 'formik';
import { SelectorItem } from '@/interface/ui'
import { months } from '@/utils/constants'
import { PreinvoiceForm } from '@/interface/form'

const initialValues: PreinvoiceForm = {}
const currentYear = new Date().getFullYear()

const data =  Array(3).fill(null).map((item, index) => (  {
  id: index + 1,
  label: `${currentYear - 1 + index}`,
  value: currentYear - 1 + index
}))

const dataMonths = months.map((item, index) => ({id: index, label: item, value: item}))

export default function AddPreInvoiceForm() {


  const clients = useSelector<RootState, Client[]>(state => state.clients.list)
  const contacts = useSelector<RootState, Contact[]>(state => state.contacts.list)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(FetchClients())
  }, [dispatch])

  useEffect(() => {
    dispatch(FetchContacts())
  }, [dispatch])


  return (
    <div className="bg-white">

      <div className="relative mx-auto grid max-w-7xl gap-x-16 8 xl:gap-x-48">
      
      <Formik
       initialValues={initialValues}     
       onSubmit={(values, { setSubmitting }) => {
       
          dispatch(create(values as PreinvoiceForm))
          setSubmitting(true)

         
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
        <form className="px-4 sm:px-6 lg:col-start-1 lg:row-start-1" onSubmit={handleSubmit}>
        <div className="mx-auto max-w-lg lg:max-w-none">
          <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
              Información General
            </h2>

      
            <div className="mt-6">
              <Selector 
                title='Cliente' 
                items={(clients || []).map(item => ({id:item.id, label: item.name}))}
                onChange={(item: SelectorItem | null) => {
                  if(item !== null){
                    const client = clients.find(it => it.id === item.id)
                    setFieldValue("client_id", item.id)
                    setFieldValue("billable_day", client?.billable_day)
                  }
                }}
                />
            </div>

            <div className="mt-6">
              <Selector 
                title='Contraparte' 
                items={(contacts || []).filter(item => item.Client.id === values.client_id).map(item => ({id:item.id, label: `${item.name} ${item.last_name}`}))}
                onChange={(item: SelectorItem | null) => {
                  if(item !== null){
                    setFieldValue("contact_id", item.id)
                  }
                }}
                />
            </div>
              
            <div className="mt-6">
            <p>Mes / año facturación</p>
            <div className=" grid grid-cols-2 gap-4">
            
              <div className="p-2">
                  <SimpleSelector 
                    title='Mes' 
                    items={dataMonths} 
                    value={dataMonths.find(item => item.id === values.month - 1) || {id: 1, label: "Febrero", value: currentYear}}
                    onChange={(item: SelectorItem) => {
                      setFieldValue("month", item.id + 1)
                    }}  
                  />
              </div>
              <div className="p-2">
            
            
       
                <SimpleSelector 
                    title='Año' 
                    items={data} 
                    value={data.find(item => item.value === values.year) || {id: 2, label: currentYear, value: currentYear}}
                    onChange={(item: SelectorItem) => {
                      setFieldValue("year", item.value)
                    }}  
                  />
           
            
              </div>
            </div>
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
