
import Selector from '../core/Selector'
import { useSelector } from 'react-redux'
import { Client } from '@/interface/common'
import { RootState } from '@/lib/store'
import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { fetch } from "@/lib/features/clients";

export default function AddProjectForm() {


  const clients = useSelector<RootState, Client[]>(state => state.clients.list)


  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])


  return (
    <div className="bg-white">

      <div className="relative mx-auto grid max-w-7xl gap-x-16  lg:px-8 xl:gap-x-48">
      

        <form className="px-4 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
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
                  />
                </div>
              </div>


              <div className="mt-6">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                  Descripción
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

         

              <div className="mt-6">
                <Selector title='Cliente' items={(clients || []).map(item => ({id:item.id, label: `${item.name}`}))} />
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
      </div>
    </div>
  )
}
