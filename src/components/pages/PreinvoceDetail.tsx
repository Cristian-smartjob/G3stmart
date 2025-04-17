"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hook";
import {
  unAssign,
  fetch as fetchPreInvoiceDetails,
  fetchSuccessfull,
} from "@/lib/features/preinvoicesdetail";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PreInvoice, PreInvoiceDetail } from "@/interface/common";
import PreInvoiceDetailTable from "../Table/PreInvoiceDetailTable";
import Badge from "../core/Badge";
import PreInvoceStat from "../core/PreInvoiceStat";
import TabSelector, { Selector } from "../core/TabSelector";
import AssignToPreInvoceModal from "../modals/AssignToPreInvoceModal";
import { assign } from "@/lib/features/preinvoicesdetail";
import { formatCurrency } from "@/utils/data";
import { ArrowDownIcon, CalculatorIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { selectAll } from "@/lib/features/preinvoicesdetail";
import { CheckboxStatus } from "@/interface/ui";
import UnAssignToPreInvoceModal from "../modals/UnAssignToPreInvoceModal";
import DownloadPreInvoiceModal from "../modals/DownloadPreInvoiceModal";

import * as ReducerPreInvoices from "@/lib/features/preinvoices";
import ProgressBar from "../core/ProgressBar";
import { Label } from "flowbite-react";
import AprovePreinvoiceButton from "../buttons/AprovePreinvoiceButton";
import RejectPreinvoiceButton from "../buttons/RejectPreinvoiceButton";
import CompleteBillButton from "../buttons/CompleteBillButton";
import Link from "next/link";
import { fetchPreInvoices as fetchPreInvoicesAction } from "@/app/actions/preInvoices";
import { updatePreInvoice } from "@/app/actions/preInvoices";

const tabs: Selector[] = [
  { id: 1, label: "Todas" },
  { id: 2, label: "Asignados" },
  { id: 3, label: "No asignados" },
];

export default function PreinvoceDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  console.log('Renderizando PreinvoceDetail con ID:', id);

  const preInvoices = useSelector<RootState, PreInvoice[]>(
    (state) => state.preInvoices.list
  );
  const isLoadingAssignOrUnassign = useSelector<RootState, boolean>(
    (state) => state.preInvoicesDetail.isLoadingAssignOrUnassign
  );
  const progressAssignOrUnassign = useSelector<RootState, number>(
    (state) => state.preInvoicesDetail.progressAssignOrUnassign
  );
  const totalAssignOrUnassign = useSelector<RootState, number>(
    (state) => state.preInvoicesDetail.totalAssignOrUnassign
  );

  const preInvoice = preInvoices.find((item) => item.id === Number(id));
  
  const detailsRoot = useSelector<RootState, PreInvoiceDetail[]>(
    (state) => {
      console.log('Consultando estado de detalles en Redux:', 
                  state.preInvoicesDetail.list.length, 
                  'elementos, isLoading:', 
                  state.preInvoicesDetail.isLoading);
      return state.preInvoicesDetail.list;
    }
  );
  const details = detailsRoot.filter((item) => {
    return item.status === "ASSIGN";
  });

  const haveASelected = detailsRoot.find((item) => item.isSelected);

  const total = details.reduce((acc: number, item: PreInvoiceDetail) => {
    const value =
      typeof item.value === "number"
        ? item.value
        : Number(item.value.toString());
    const totalConsumeDays =
      typeof item.totalConsumeDays === "number"
        ? item.totalConsumeDays
        : Number(item.totalConsumeDays.toString());
    const billableDays =
      typeof item.billableDays === "number"
        ? item.billableDays
        : Number(item.billableDays.toString());
    return acc + (value * totalConsumeDays) / billableDays;
  }, 0);

  const [selected, setSelected] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModalDownload, setShowModalDownload] = useState(false);
  const [showModalUnassign, setShowModalUnassign] = useState(false);

  // Añadir estado local para la prefactura actual
  const [currentPreInvoice, setCurrentPreInvoice] = useState<PreInvoice | null>(null);

  // useEffect para monitorear el montaje y desmontaje
  useEffect(() => {
    console.log('PreinvoceDetail montado');
    
    return () => {
      console.log('PreinvoceDetail desmontado');
    };
  }, []);

  // Inicializar el estado al cargar el componente
  useEffect(() => {
    // Inicializar el estado con un arreglo vacío para evitar problemas
    dispatch(fetchSuccessfull([]));
    
    console.log('Componente PreinvoceDetail inicializado');
  }, [dispatch]);

  // Cargar los detalles de prefactura cuando cambie el ID
  useEffect(() => {
    // Intentar convertir el ID a número de manera segura
    let numericId: number;
    
    if (typeof id === 'string') {
      numericId = Number(id);
    } else if (Array.isArray(id)) {
      numericId = Number(id[0]);
    } else if (id) { // Si id existe pero es de otro tipo
      numericId = Number(String(id));
    } else {
      numericId = 0;
    }
    
    console.log('Cargando detalles de prefactura para ID:', id, 'convertido a:', numericId);
    
    if (!isNaN(numericId) && numericId > 0) {
      console.log('Dispatching fetchPreInvoiceDetails con ID:', numericId);
      dispatch(fetchPreInvoiceDetails(numericId));
    } else {
      console.error('ID inválido para detalles de prefactura:', id);
    }
  }, [id, dispatch]);

  // Cargar la prefactura directamente usando server actions
  useEffect(() => {
    const loadPreInvoice = async () => {
      try {
        console.log('Cargando prefactura con ID:', id);
        const allPreInvoices = await fetchPreInvoicesAction();
        const foundPreInvoice = allPreInvoices.find(item => item.id === Number(id));
        
        if (foundPreInvoice) {
          console.log('Prefactura encontrada con estado:', foundPreInvoice.status);
          setCurrentPreInvoice(foundPreInvoice);
        } else {
          console.log('No se encontró la prefactura con ID:', id);
        }
      } catch (error) {
        console.error('Error al cargar la prefactura:', error);
      }
    };
    
    loadPreInvoice();
  }, [id, showModalDownload]); // Añadir dependencia para recargar cuando el modal se cierre

  // Usar currentPreInvoice en lugar de preInvoice del store cuando renderizamos
  const activePreInvoice = currentPreInvoice || preInvoice;

  return (
    <>
      <AssignToPreInvoceModal
        isOpen={showModal}
        onAssign={() => {
          const selectedItems = detailsRoot
            .filter((item) => item.isSelected)
            .map((item) => item.id);
          dispatch(
            assign({ preInvoce: Number(id), smartersIds: selectedItems })
          );
          setShowModal(false);
        }}
        setIsOpen={() => {
          setShowModal(false);
        }}
      />

      <UnAssignToPreInvoceModal
        isOpen={showModalUnassign}
        onAssign={() => {
          const selectedItems = detailsRoot
            .filter((item) => item.isSelected)
            .map((item) => item.id);
          dispatch(
            unAssign({ preInvoce: Number(id), smartersIds: selectedItems })
          );
          setShowModalUnassign(false);
        }}
        setIsOpen={() => {
          setShowModalUnassign(false);
        }}
      />

      <DownloadPreInvoiceModal
        isOpen={showModalDownload}
        onAssign={async () => {
          if (id !== undefined) {
            console.log('Intentando actualizar el estado a DOWNLOADED para id:', id);
            
            try {
              // 1. Usar la API REST
              const apiResponse = await fetch(`/api/preinvoices/${id}/status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'DOWNLOADED' }),
              });
              
              const apiResult = await apiResponse.json();
              console.log('Respuesta de la API:', apiResult);
              
              if (apiResponse.ok) {
                // 2. Actualizar el estado local en Redux
                dispatch(
                  ReducerPreInvoices.update({
                    id: Number(id),
                    status: "DOWNLOADED",
                  })
                );
                
                // 3. También actualizar usando server action
                try {
                  const serverActionResult = await updatePreInvoice(Number(id), { 
                    id: Number(id), 
                    status: "DOWNLOADED" 
                  });
                  console.log('Resultado de server action:', serverActionResult);
                } catch (serverError) {
                  console.error('Error en server action:', serverError);
                }
                
                // 4. Recargar la prefactura para asegurar que los cambios se reflejen
                const refreshedInvoices = await fetchPreInvoicesAction();
                const updated = refreshedInvoices.find(inv => inv.id === Number(id));
                console.log('Estado actualizado de la prefactura:', updated?.status);
                setCurrentPreInvoice(updated || null);
                
                // 5. Redirigir a /preinvoice
                window.location.href = '/preinvoice';
                return;
              } else {
                console.error('Error en la respuesta de la API:', apiResult);
              }
            } catch (error) {
              console.error('Error al actualizar el estado:', error);
            }
          }
          setShowModalDownload(false);
        }}
        setIsOpen={() => {
          setShowModalDownload(false);
        }}
      />

      <main>
        <div className="relative isolate overflow-hidden ">
          {/* Secondary navigation */}
          <header className="pb-4 pt-6 sm:pb-6">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
              <Link
                href="/preinvoice"
                className="inline-flex items-center justify-center rounded-md bg-blue-700 p-2 text-white shadow-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Volver a Prefacturas</span>
              </Link>
              
              <div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Prefactura / Contraparte
                  </h1>

                  <div className="mt-2">
                    <Badge status={activePreInvoice?.status || "PENDING"} />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    {activePreInvoice?.client?.name} {activePreInvoice?.month} /{" "}
                    {activePreInvoice?.year}
                  </h2>

                  {activePreInvoice?.contact !== null ? (
                    <p className="text-sm">
                      Contraparte {activePreInvoice?.contact?.name}{" "}
                      {activePreInvoice?.contact?.lastName}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="ml-auto flex  gap-x-4">
                {/* Botón para recargar detalles manualmente */}
                <button
                  type="button"
                  onClick={() => {
                    if (id) {
                      console.log('Recargando detalles manualmente');
                      dispatch(fetchPreInvoiceDetails(Number(id)));
                    }
                  }}
                  className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Recargar detalles
                </button>
                
                {activePreInvoice?.status === "PENDING" ? (
                  <>
                    <a
                      href="#"
                      className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {}}
                    >
                      <CalculatorIcon
                        aria-hidden="true"
                        className="-ml-1.5 size-5"
                      />
                      Recalcular
                    </a>
                    <a
                      href="#"
                      className="ml-auto flex items-center gap-x-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        setShowModalDownload(true);
                      }}
                    >
                      <ArrowDownIcon
                        aria-hidden="true"
                        className="-ml-1.5 size-5"
                      />
                      descargar prefactura
                    </a>
                  </>
                ) : null}

                {activePreInvoice?.status === "APPROVED" ? (
                  <CompleteBillButton preinvoiceId={Number(id)} />
                ) : null}

                {activePreInvoice?.status === "DOWNLOADED" ? (
                  <>
                    <RejectPreinvoiceButton preinvoiceId={Number(id)} />
                    <AprovePreinvoiceButton preinvoiceId={Number(id)} />
                  </>
                ) : null}
              </div>
            </div>
          </header>

          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
              <PreInvoceStat
                name="Total a facturar"
                value={`${formatCurrency(total)}`}
                statIdx={0}
              />
              <PreInvoceStat
                name="Número factura"
                value={
                  activePreInvoice?.invoiceNumber === undefined
                    ? "No asignado"
                    : `${activePreInvoice?.invoiceNumber}`
                }
                statIdx={0}
              />
              <PreInvoceStat
                name="Número HES"
                value={
                  activePreInvoice?.hesNumber === null
                    ? "No asignado"
                    : `${activePreInvoice?.hesNumber}`
                }
                statIdx={0}
              />
              <PreInvoceStat
                name="Número OC"
                value={
                  activePreInvoice?.ocNumber === null
                    ? "No asignado"
                    : `${activePreInvoice?.ocNumber}`
                }
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
                  "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
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
                onSelect={(value) => {
                  dispatch(selectAll(CheckboxStatus.Off));
                  setSelected(value);
                }}
                labels={tabs}
              />
            }
            rightContent={
              <>
                {selected === 3 &&
                haveASelected &&
                !isLoadingAssignOrUnassign ? (
                  <button
                    type="button"
                    className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Asignar selección
                  </button>
                ) : null}

                {selected === 2 &&
                haveASelected &&
                !isLoadingAssignOrUnassign ? (
                  <button
                    type="button"
                    className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setShowModalUnassign(true);
                    }}
                  >
                    Quitar selección
                  </button>
                ) : null}

                {isLoadingAssignOrUnassign ? (
                  <div className="w-full">
                    <Label>Asignando</Label>
                    <ProgressBar
                      progress={
                        (progressAssignOrUnassign / totalAssignOrUnassign) * 100
                      }
                    />
                  </div>
                ) : null}
              </>
            }
          />
        </div>
      </main>
    </>
  );
}
