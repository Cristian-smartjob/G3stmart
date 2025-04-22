'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hook'
import { fetch as fetchPreInvoiceDetail, unAssign } from '@/lib/features/preinvoicesdetail'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { PreInvoice, PreInvoiceDetail } from '@/interface/common'
import PreInvoiceDetailTable from '../Table/PreInvoiceDetailTable'
import Badge from '../core/Badge'
import PreInvoceStat from '../core/PreInvoiceStat'
import TabSelector, { Selector } from '../core/TabSelector'
import AssignToPreInvoceModal from '../modals/AssignToPreInvoceModal'
import { assign } from '@/lib/features/preinvoicesdetail'
import { formatCurrency } from '@/utils/data'
import { ArrowDownIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import { selectAll } from '@/lib/features/preinvoicesdetail'
import { CheckboxStatus } from '@/interface/ui'
import UnAssignToPreInvoceModal from '../modals/UnAssignToPreInvoceModal'
import DownloadPreInvoiceModal from '../modals/DownloadPreInvoiceModal'

import * as ReducerPreInvoices from '@/lib/features/preinvoices'
import ProgressBar from '../core/ProgressBar'
import { Label } from 'flowbite-react'
import AprovePreinvoiceButton from '../buttons/AprovePreinvoiceButton'
import RejectPreinvoiceButton from '../buttons/RejectPreinvoiceButton'
import CompleteBillButton from '../buttons/CompleteBillButton'


const tabs: Selector[] = [
  { id:1, label: 'Todas',  },
  { id:2 ,label: 'Asignados', },
  { id: 3, label: 'No asignados',  },
]

export default function PreinvoceDetail() {

  const { id } = useParams();
  
  const preInvoices = useSelector<RootState, PreInvoice[]>(state => state.preInvoices.list)
  const isLoadingAssignOrUnassign = useSelector<RootState, boolean>(state => state.preInvoicesDetail.isLoadingAssignOrUnassign)
  const progressAssignOrUnassign = useSelector<RootState, number>(state => state.preInvoicesDetail.progressAssignOrUnassign)
  const totalAssignOrUnassign = useSelector<RootState, number>(state => state.preInvoicesDetail.totalAssignOrUnassign)

  const preInvoice = preInvoices.find(item => item.id === Number(id))


  const detailsRoot = useSelector<RootState, PreInvoiceDetail[]>(state => state.preInvoicesDetail.list)
  const details = detailsRoot.filter(item => {
    return  item.status === "ASSIGN"
  })

  const haveASelected = detailsRoot.find(item => item.isSelected)

  const total = details.reduce((acc: number, item: PreInvoiceDetail) => acc + item.value * item.total_consume_days / item.billable_days, 0);

  const [selected, setSelected] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showModalDownload, setShowModalDownload] = useState(false)
  const [showModalUnassign, setShowModalUnassign] = useState(false)
  
  
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPreInvoiceDetail(Number(id)))
  }, [dispatch])


  return (
    <>
    
      <AssignToPreInvoceModal isOpen={showModal} onAssign={() => {
        const selectedItems = detailsRoot.filter(item => item.isSelected).map(item => item.id)
        dispatch(assign({preInvoce: Number(id), smartersIds: selectedItems}))
        setShowModal(false)
      }} setIsOpen={() => {
        setShowModal(false)
      }} />

      <UnAssignToPreInvoceModal isOpen={showModalUnassign} onAssign={() => {
        const selectedItems = detailsRoot.filter(item => item.isSelected).map(item => item.id)
        dispatch(unAssign({preInvoce: Number(id), smartersIds: selectedItems}))
        setShowModalUnassign(false)
      }} setIsOpen={() => {
        setShowModalUnassign(false)
      }} />

    
      <DownloadPreInvoiceModal isOpen={showModalDownload} onAssign={() => {
        if(id !== undefined){
          dispatch(ReducerPreInvoices.update({
            id: Number(id),
            status: 'DOWNLOADED'
          }))
        }
        setShowModalDownload(false)
      }} setIsOpen={() => {
        setShowModalDownload(false)
      }} />




      <main>
        
        <div className="relative isolate overflow-hidden ">
          {/* Secondary navigation */}
          <header className="pb-4 pt-6 sm:pb-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
              <div>
                <h1 className="text-base text-xl font-semibold text-gray-900">Prefactura {preInvoice?.Client.name} {preInvoice?.month} / {preInvoice?.year}</h1>
                
                {preInvoice?.Contact !== null ? (
                  <p className='text-sm'>Contraparte {preInvoice?.Contact.name} {preInvoice?.Contact.lastName}</p>
                ) : null}
                
                <div className='mt-6'>
                <Badge status={preInvoice?.status || "PENDING"} />
                </div>
              </div>
             
              <div className='ml-auto flex  gap-x-4'>
              
                

              {preInvoice?.status === "PENDING" ? (
                     <>
                      <a
                      href="#"
                      className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      
                      onClick={() => {
                         
                      }}
                    >
                      <CalculatorIcon aria-hidden="true" className="-ml-1.5 size-5" />
                      Recalcular
                    </a>
              <a
              href="#"
              className="ml-auto flex items-center gap-x-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

              onClick={() => {
                setShowModalDownload(true)
              }}
            >
              <ArrowDownIcon aria-hidden="true" className="-ml-1.5 size-5" />
              descargar prefactura
            </a>
                     </>
              ) : null}

              {preInvoice?.status === "APPROVED" ? (
                <CompleteBillButton preinvoiceId={Number(id)} />
              ) : null}

              {preInvoice?.status === "DOWNLOADED" ? (
                 <>
                 <RejectPreinvoiceButton preinvoiceId={Number(id)} />
                 <AprovePreinvoiceButton preinvoiceId={Number(id)}  />
                 </>
              ) : null}
        

              </div>
            </div>
          </header>

          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
              <PreInvoceStat 
                name='Total a facturar'
                value={`${formatCurrency(total)}`}
                statIdx={0}
              />
              <PreInvoceStat 
                name='Número factura'
                value={preInvoice?.preinvoice_number === undefined ? 'No asignado': `${preInvoice?.preinvoice_number}`}
                statIdx={0}
              />
              <PreInvoceStat 
                name='Número HES'
                value={preInvoice?.hes_number === null ? 'No asignado': `${preInvoice?.hes_number}`}
                statIdx={0}
              />
              <PreInvoceStat 
                name='Número OC'
                value={preInvoice?.oc_number === null ? 'No asignado': `${preInvoice?.oc_number}`}
                statIdx={0}
              />
            </dl>
          </div>

          <div
            aria-hidden="true"
            className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
          >
            <div
              style={{
                clipPath:
                  'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
              }}
              className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
            />
          </div>
        </div>

        <div className="space-y-16 xl:space-y-20">
          <PreInvoiceDetailTable 
              typeFilter={selected} 
              showCheckbox={selected !== 1}
              bottomContent={
                <TabSelector 
                  selected={selected} 
                  onSelect={value => { 
                    dispatch(selectAll(CheckboxStatus.Off))
                    setSelected(value)
                  }} 
                  labels={tabs} />}
              rightContent={

                  <>
                    {selected === 3 && haveASelected && !isLoadingAssignOrUnassign ? (
                            <button 
                                type="button" 
                                className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => {
                                    setShowModal(true)
                                }}
                                >
                            
                            Asignar selección
                            </button>
                    ) : null}

                    {selected === 2 && haveASelected && !isLoadingAssignOrUnassign ? (
                            <button 
                                type="button" 
                                className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => {
                                  setShowModalUnassign(true)
                                }}
                                >
                            
                            Quitar selección
                            </button>
                    ) : null}

                    {isLoadingAssignOrUnassign ? (
                      <div className='w-full'>
                        <Label>Asignando</Label>
                        <ProgressBar progress={progressAssignOrUnassign / totalAssignOrUnassign * 100} />
                      </div>
                    ) : null}
                
                
                  </>
          
              } 
          />
        </div>
      </main>
    </>
  )
}
