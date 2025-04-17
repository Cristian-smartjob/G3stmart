'use client'

import { useEffect, useState } from "react";
import { fetch } from "@/lib/features/users";
import { useAppDispatch } from "@/lib/hook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import PreInvoiceDetailRow from "./row/PreInvoceDetailRow";
import GenericModal from "../modals/GenericModal";
import LeaveDaysCalendar from "../core/LeaveDaysCalendar";
import TabSelector, { Selector } from "../core/TabSelector";
import MainTable from "./MainTable";
import { CheckboxStatus } from "@/interface/ui";
import { selectAll, selectItem, PreInvoiceDetail as ReduxPreInvoiceDetail } from "@/lib/features/preinvoicesdetail";
import TableSkeleton from "../core/TableSkeleton";
import { Prisma } from "@prisma/client";

// Definir la interfaz para usar con los componentes de UI
interface UIPreInvoiceDetail {
  id: number;
  preInvoiceId?: number | null;
  personId?: number | null;
  status: string;
  value: number | string;
  currency_type?: number | null;
  billableDays?: number | string;
  billable_days?: number | string;
  leaveDays?: number | string;
  leave_days?: number | string;
  totalConsumeDays?: number | string;
  total_consume_days?: number | string;
  isSelected?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  person?: {
    id: number;
    name: string;
    lastName: string;
    dni: string | null;
    country: string | null;
    jobTitle?: {
      id: number;
      name: string;
    } | null;
  } | null;
  People?: {
    id: number;
    name: string;
    last_name: string;
    dni: string | null;
    country: string | null;
    job_title_name?: string;
  } | null;
}

// Función para adaptar el tipo de Redux al tipo de UI
const adaptToUIDetail = (item: ReduxPreInvoiceDetail): UIPreInvoiceDetail => {
  return {
    ...item,
    value: item.value.toString(),
    billableDays: item.billableDays.toString(),
    leaveDays: item.leaveDays.toString(),
    totalConsumeDays: item.totalConsumeDays.toString(),
  };
};

// Función para adaptar el tipo de UI al tipo de Redux
const adaptToReduxDetail = (item: UIPreInvoiceDetail): ReduxPreInvoiceDetail => {
  // Crear un objeto mínimo que cumpla con los requisitos
  const reduxItem: ReduxPreInvoiceDetail = {
    id: item.id,
    status: item.status,
    preInvoiceId: item.preInvoiceId || null,
    personId: item.personId || null,
    // Convertir campos al tipo Decimal que espera Redux
    value: typeof item.value === 'string' ? new Prisma.Decimal(item.value) : new Prisma.Decimal(item.value.toString()),
    billableDays: typeof item.billableDays === 'string' ? new Prisma.Decimal(item.billableDays) : 
                 item.billable_days ? new Prisma.Decimal(item.billable_days.toString()) : 
                 new Prisma.Decimal(0),
    leaveDays: typeof item.leaveDays === 'string' ? new Prisma.Decimal(item.leaveDays) : 
              item.leave_days ? new Prisma.Decimal(item.leave_days.toString()) : 
              new Prisma.Decimal(0),
    totalConsumeDays: typeof item.totalConsumeDays === 'string' ? new Prisma.Decimal(item.totalConsumeDays) : 
                     item.total_consume_days ? new Prisma.Decimal(item.total_consume_days.toString()) : 
                     new Prisma.Decimal(0),
    currency_type: item.currency_type || null,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    isSelected: item.isSelected
  };
  
  return reduxItem;
};

const header = [
  "Smarter",
  "Cargo",
  /*
  "Rut",
  "Pais",*/
  "Tarifa / mes",
  "Día / mes facturable",
  "Días de ausencia",
  "Total día mes consumidos",
  "HH mes consumidos",
  "Total por cobrar (UF)",
  "Total por cobrar (CLP)",
]

const tabs: Selector[] = [
  { id:1, label: 'Datos' },
  { id:2, label: 'Días fuera' },
]

interface Props {
  typeFilter: number;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  showCheckbox?: boolean;
}

export default function PreInvoiceDetailTable({ typeFilter, rightContent, bottomContent, showCheckbox }: Props){

  const [currentPage, setCurrentPage] = useState(1)

  const detailsRoot = useSelector<RootState, ReduxPreInvoiceDetail[]>(state => state.preInvoicesDetail.list)
  const isLoading = useSelector<RootState, boolean>(state => state.preInvoicesDetail.isLoading)
  const checkboxStatus = useSelector<RootState, CheckboxStatus>(state => state.preInvoicesDetail.allSelectedStatus)

  console.log('PreInvoiceDetailTable: detailsRoot recibidos:', detailsRoot.length, 'isLoading:', isLoading);

  // Convertir los detalles al tipo UI para usar en la tabla
  const uiDetailsRoot = detailsRoot.map(adaptToUIDetail);

  const details = uiDetailsRoot.filter(item => {
    if(typeFilter === 1){
      return true
    } else if(typeFilter === 2){
      return item.status === "ASSIGN"
    }else {
      return item.status === "NO_ASSIGN"
    }
  })

  console.log('PreInvoiceDetailTable: details filtrados por tipo', typeFilter, ':', details.length);

  const [menu, setMenu] = useState(1)
  const [isOpen, setIsOpen] = useState(false)


  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetch())
  }, [dispatch])

  

  // const handleActionPress = (item: PreInvoiceDetail) => {
  //   setIsOpen(true)
  // }

  const handlerChangeSelectAll = (value: CheckboxStatus) => {
    dispatch(selectAll(value))
  }

  const handlerChangeSelectItem = (item: UIPreInvoiceDetail, value: CheckboxStatus) => {
    const newItem = {
      ...item,
      isSelected: value === CheckboxStatus.On
    }
    
    // Convertir de UI a Redux y luego dispatch
    dispatch(selectItem(adaptToReduxDetail(newItem)))
  }


  return (
      <div className="overflow-x-auto">
        
        <GenericModal isOpen={isOpen} onClose={() => {
          setIsOpen(false)
        }}>
          <div>
            <TabSelector labels={tabs} selected={menu}  onSelect={(index: number) => {
              setMenu(index)
                          
                }}  />
            <div className="mt-6">
            <LeaveDaysCalendar />
            </div>
          </div>
        </GenericModal>
        
       

         <MainTable 
                   title="Detalle" 
                   count={details.length} 
                   page={currentPage}
                   header={header} 
                   showCheckbox={showCheckbox} 
                   checkboxStatus={checkboxStatus}
                   onChangeSelectAll={handlerChangeSelectAll}
                   rightContent={rightContent}
                   bottomContent={bottomContent}
                   onSelectPage={page => {
                     setCurrentPage(page)
                   }}
                   onNext={() => {
                     const page = Math.min(Math.ceil(details.length / 10), currentPage + 1)
                     setCurrentPage(page)
                   }}
                   onPrev={() => {
                       const page = Math.max(1, currentPage - 1)
                       setCurrentPage(page)
                   }}
                   >
                   <>

                   <TableSkeleton
                    isLoading={isLoading && details.length <= 0}
                    size={6}
                    />

                   {details.length === 0 && !isLoading ? (
                     <tr>
                       <td colSpan={header.length + (showCheckbox ? 1 : 0)} className="px-4 py-3 text-center text-gray-500">
                         No hay datos para mostrar
                       </td>
                     </tr>
                   ) : (
                     (details.slice((Math.max(0, currentPage - 1)) * 10, currentPage * 10)).map(item => (
                       <PreInvoiceDetailRow 
                          key={item.id} 
                          showCheckbox={showCheckbox}
                          onChangeCheckBox={handlerChangeSelectItem}
                          item={item} 
                          onClick={() => {}} 
                         />
                      ))
                   )}
                   </>
                 </MainTable>
        
      </div>
  )
}