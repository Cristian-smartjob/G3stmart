import Selector from "@/components/core/Selector"
import { Client, DataTables, GenericDataMap } from "@/interface/common"
import { RootState } from "@/lib/store"

import { useSelector } from "react-redux"

export default function Peoplesalary(){

  const genericDataMap = useSelector<RootState, GenericDataMap>(state => state.data.list)
  const clients = useSelector<RootState, Client[]>(state => state.clients.list)
  const currencies = genericDataMap[DataTables.CurrencyType]

    return (
<>

<section aria-labelledby="payment-heading" className="mt-10">
                    <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
                      Asignación cliente
                    </h2>
      
                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                     
                      <div className="col-span-3 sm:col-span-4">
                      <Selector 
                        title='Cliente' 
                        items={(clients || []).map(item => ({id:item.id, label: `${item.name} (${item.CurrencyType.name})`}))}
                        onChange={() => {
                          
                        }}
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-4">
                         <label htmlFor="name-on-card" className="block text-sm/6 font-medium text-gray-700">
                           Tarifa
                         </label>
                         <div className="mt-2">
                         <input
                           id="corporateEmail"
                           name="corporateEmail"
                           type="text"
                           autoComplete="text"
                           className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                         />
                       </div>
                       </div>
                    </div>
                  </section>

       <section aria-labelledby="payment-heading" className="mt-10">
                     <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
                       Detalles Salariales
                     </h2>
       
                     <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                       
                     <div className="col-span-3 sm:col-span-4">
                       <Selector 
                         title='Moneda' 
                         items={currencies.map(item => ({id:item.id, label: item.name}))}
                         onChange={() => {
                           
                         }}
                         />
                       </div>

                       <div className="col-span-3 sm:col-span-4">
                         <label htmlFor="name-on-card" className="block text-sm/6 font-medium text-gray-700">
                           Salario (bruto)
                         </label>
                         <div className="mt-2">
                         <input
                           id="corporateEmail"
                           name="corporateEmail"
                           type="text"
                           autoComplete="text"
                           className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                         />
                       </div>
                       </div>

                       <div className="col-span-3 sm:col-span-4">
                         <label htmlFor="name-on-card" className="block text-sm/6 font-medium text-gray-700">
                           Bono laptop
                         </label>
                         <div className="mt-2">
                         <input
                           id="corporateEmail"
                           name="corporateEmail"
                           type="text"
                           autoComplete="text"
                           className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                         />
                       </div>
                       </div>
                      
                     </div>
                   </section>
                    
                  </>
    )
}