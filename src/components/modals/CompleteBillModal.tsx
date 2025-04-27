"use client";

import { update } from "@/lib/features/preinvoices";
import { useAppDispatch } from "@/lib/hook";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPreInvoices } from "@/app/actions/preInvoices";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PreInvoice } from "@/interface/common";
import { formatToMoneyString } from "@/utils/data";

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
  preinvoiceId: number;
}

export default function CompleteBillModal({ isOpen, setIsOpen, preinvoiceId }: Props) {
  // Referencia para verificar si es la primera renderización
  const firstRender = useRef(true);
  const fetchedData = useRef(false);

  console.log("CompleteBillModal renderizado con preinvoiceId:", preinvoiceId, "isOpen:", isOpen);

  // Obtener la preinvoice actual desde el store Redux
  const preInvoices = useSelector<RootState, PreInvoice[]>((state) => {
    console.log("Estado actual de preInvoices:", state.preInvoices);
    return state.preInvoices.list;
  });

  const currentPreInvoice = preInvoices.find((invoice) => invoice.id === preinvoiceId);

  // Estado para guardar la prefactura obtenida directamente
  const [directPreInvoice, setDirectPreInvoice] = useState<PreInvoice | null>(null);

  // Usamos la prefactura de cualquiera de las dos fuentes
  const invoiceData = directPreInvoice || currentPreInvoice;

  console.log("PreInvoice encontrada:", currentPreInvoice);
  console.log("DirectPreInvoice:", directPreInvoice);
  console.log("InvoiceData final:", invoiceData);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numberBill: "",
    numberHes: "",
    numberOc: "",
    ocAmount: "",
  });

  // Añadir un nuevo estado para validación del formulario
  const [isFormValid, setIsFormValid] = useState(false);
  // Estado para mensajes de error de validación
  const [validationError, setValidationError] = useState<string | null>(null);

  // Cargar los detalles de la prefactura
  // const preInvoiceDetails = useSelector<RootState, PreInvoiceDetail[]>((state) => {
  //   return state.preInvoicesDetail.list.filter(
  //     (detail) => detail.status === "ASSIGN" && detail.preInvoiceId === preinvoiceId
  //   );
  // });

  // Agregar variables para el cálculo del margen y validación
  const [maxAllowedAmount, setMaxAllowedAmount] = useState<number | null>(null);
  // const [totalToInvoice, setTotalToInvoice] = useState<number>(0);
  const [isMarginValid, setIsMarginValid] = useState(true);

  // Calcular el total real a facturar basado en los detalles
  // const calculateTotalAmount = useCallback(() => {
  //   if (!preInvoiceDetails.length) return 0;

  //   return preInvoiceDetails.reduce((acc, item) => {
  //     const value = typeof item.value === "number" ? item.value : Number(item.value.toString());
  //     const totalConsumeDays =
  //       typeof item.totalConsumeDays === "number" ? item.totalConsumeDays : Number(item.totalConsumeDays.toString());
  //     const billableDays =
  //       typeof item.billableDays === "number" ? item.billableDays : Number(item.billableDays.toString());
  //     return acc + (value * totalConsumeDays) / billableDays;
  //   }, 0);
  // }, [preInvoiceDetails]);

  // Verificar si el monto excede el margen permitido
  const validateMargin = useCallback(() => {
    // Si no hay datos de factura o el cliente no tiene margen definido, no se puede validar.
    // Consideramos el margen válido para no bloquear innecesariamente.
    if (
      !invoiceData ||
      !invoiceData.client ||
      invoiceData.client.marginPercentage === null ||
      invoiceData.client.marginPercentage === undefined ||
      invoiceData.value === null ||
      invoiceData.value === undefined
    ) {
      if (!isMarginValid) {
        setIsMarginValid(true); // Asegura que sea válido si antes no lo era
      }
      if (validationError) {
        setValidationError(null); // Limpia error si existía
      }
      return true;
    }

    // Convertir valores a números, asegurando valores predeterminados
    const baseValue = Number(invoiceData.value);
    const marginPercent = Number(invoiceData.client.marginPercentage || 0);
    const ocAmountValue = formData.ocAmount !== "" ? Number(formData.ocAmount) : null; // null si está vacío
    console.log("ocAmountValue:", ocAmountValue);

    // Calcular el margen absoluto y los límites
    const marginAmount = baseValue * (marginPercent / 100);
    const minValue = baseValue - marginAmount;
    const maxValue = baseValue + marginAmount;

    setMaxAllowedAmount(marginAmount);

    let isValid = false;
    let errorMessage = null;

    // Validar solo si ocAmountValue es un número válido
    if (ocAmountValue !== null) {
      isValid = ocAmountValue >= minValue && ocAmountValue <= maxValue;
      if (!isValid) {
        errorMessage = `El Monto OC (${formatToMoneyString(
          ocAmountValue
        )}) está fuera del rango permitido. Mínimo: ${formatToMoneyString(minValue)}, Máximo: ${formatToMoneyString(
          maxValue
        )}. Margen: ${marginPercent}%.`;
      }
    } else {
      // Si el campo está vacío, se considera inválido para evitar completar sin monto.
      isValid = false;
      errorMessage = "El Monto OC no puede estar vacío.";
    }

    // Actualizar estado de validez SOLO si ha cambiado
    if (isValid !== isMarginValid) {
      setIsMarginValid(isValid);
    }

    // Actualizar mensaje de error SOLO si ha cambiado
    if (errorMessage !== validationError) {
      setValidationError(errorMessage);
    }

    return isValid;
  }, [
    invoiceData,
    formData.ocAmount,
    isMarginValid, // Dependencia clave para evitar bucles
    validationError, // Dependencia clave para evitar bucles
  ]);

  // Cargar los datos directamente de la API cuando se abre el modal
  useEffect(() => {
    const loadPreInvoiceData = async () => {
      if (isOpen && preinvoiceId && !fetchedData.current) {
        console.log("Cargando datos de prefactura directamente desde API para ID:", preinvoiceId);
        try {
          // Intenta cargar desde la API
          const response = await fetch(`/api/preinvoices/${preinvoiceId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("Datos obtenidos de API:", data);
            if (data && data.data) {
              setDirectPreInvoice(data.data);
              fetchedData.current = true;
            }
          } else {
            console.error("Error al obtener prefactura desde API:", response.statusText);

            // Intenta cargar datos usando la acción del servidor como respaldo
            try {
              console.log("Intentando obtener datos mediante server action...");
              const allPreInvoices = await fetchPreInvoices();
              const foundInvoice = allPreInvoices.find((inv) => inv.id === preinvoiceId);
              if (foundInvoice) {
                console.log("Prefactura encontrada mediante server action:", foundInvoice);
                setDirectPreInvoice(foundInvoice);
                fetchedData.current = true;
              }
            } catch (serverActionError) {
              console.error("Error al obtener prefactura mediante server action:", serverActionError);
            }
          }
        } catch (error) {
          console.error("Error al cargar prefactura:", error);
        }
      }
    };

    loadPreInvoiceData();
  }, [isOpen, preinvoiceId]);

  // Actualizar formData cuando se abre el modal o cambia la preinvoice seleccionada
  useEffect(() => {
    if (isOpen) {
      console.log("Modal abierto, datos actuales del formulario:", formData);
      console.log("InvoiceData disponible:", invoiceData);

      if (invoiceData) {
        // Usar el campo value de la prefactura para el monto OC
        const ocAmountValue = invoiceData.value
          ? String(invoiceData.value)
          : invoiceData.ocAmount
          ? String(invoiceData.ocAmount)
          : "";

        const newFormData = {
          numberBill: "", // Número de factura siempre vacío
          numberHes: invoiceData.hesNumber || "",
          numberOc: invoiceData.ocNumber || "",
          ocAmount: ocAmountValue, // Usar value como valor inicial
        };

        console.log("Actualizando formulario con:", newFormData);
        setFormData(newFormData);
      }
    }
  }, [isOpen, invoiceData]);

  // Log cuando cambia formData
  useEffect(() => {
    if (!firstRender.current) {
      console.log("formData actualizado:", formData);
    } else {
      firstRender.current = false;
    }
  }, [formData]);

  // useEffect para validar el margen cuando cambian valores relevantes
  useEffect(() => {
    if (isOpen && preinvoiceId) {
      validateMargin();
    }
  }, [formData.ocAmount, invoiceData?.client?.marginPercentage, isOpen, preinvoiceId, validateMargin]);

  // Agregar un useEffect para inicializar la validación
  useEffect(() => {
    // Validar el formulario completo, incluyendo número de factura y margen
    const isValidNumberBill = formData.numberBill.length >= 8;
    setIsFormValid(isValidNumberBill && isMarginValid);
  }, [formData.numberBill, isMarginValid]);

  const dispatch = useAppDispatch();

  // En una aplicación real, este valor vendría del contexto de autenticación
  // Por ahora usamos un valor estático para simular el usuario actual
  const currentUser = "Miguel Carrizo";

  // Modificar la función handleInputChange para validar el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Cambiando campo ${name} a ${value}`);

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Validar que el número de factura tenga al menos 8 caracteres
    const isValidNumberBill = newFormData.numberBill.length >= 8;
    // No llamamos a validateMargin() aquí para evitar actualizaciones en cascada
    setIsFormValid(isValidNumberBill && isMarginValid);
  };

  const handlerUpdate = async () => {
    if (isLoading) return;

    // Verificar el margen solo una vez antes de proceder
    if (!validateMargin()) return;

    setIsLoading(true);

    try {
      // Usar solo la API REST para actualización
      const apiResponse = await fetch(`/api/preinvoices/${preinvoiceId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          invoiceNumber: formData.numberBill,
          hesNumber: formData.numberHes,
          ocNumber: formData.numberOc,
          ocAmount: formData.ocAmount ? Number(formData.ocAmount) : undefined,
          completedBy: currentUser,
        }),
      });

      if (apiResponse.ok) {
        // Solo si la API fue exitosa, actualizar Redux
        dispatch(
          update({
            id: preinvoiceId,
            status: "COMPLETED",
            invoiceNumber: formData.numberBill,
            hesNumber: formData.numberHes,
            ocNumber: formData.numberOc,
            ocAmount: formData.ocAmount ? Number(formData.ocAmount) : undefined,
            completedBy: currentUser,
          })
        );

        // Cerrar el modal primero
        setIsOpen();

        // Recargar la página con un retraso
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Error al llamar a la API");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error general en la facturación:", error);
      setIsLoading(false);
    }
  };

  // Determinar los valores a mostrar en cada campo
  const displayValues = {
    numberBill: formData.numberBill,
    numberHes: formData.numberHes || invoiceData?.hesNumber || "",
    numberOc: formData.numberOc || invoiceData?.ocNumber || "",
    ocAmount:
      formData.ocAmount ||
      (invoiceData?.value ? String(invoiceData.value) : invoiceData?.ocAmount ? String(invoiceData.ocAmount) : ""),
  };

  // Mostrar información del margen
  const marginInfo =
    invoiceData?.client?.marginPercentage !== null && invoiceData?.client?.marginPercentage !== undefined
      ? `${
          typeof invoiceData.client.marginPercentage === "object"
            ? Number(invoiceData.client.marginPercentage.toString())
            : Number(invoiceData.client.marginPercentage)
        }%`
      : "No definido";

  console.log("Valores a mostrar en inputs:", displayValues);

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
                <DocumentTextIcon aria-hidden="true" className="size-6 text-green-600" />
              </div>

              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Confirmar facturación
                </DialogTitle>
                <div className="mt-2">
                  {/* Información sobre margen y total */}
                  <div className="bg-gray-50 rounded-md p-3 mb-4 text-left">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Margen permitido:</span> {marginInfo},{" "}
                      {formatToMoneyString(maxAllowedAmount)}
                    </p>
                  </div>

                  {/* Mostrar error de validación si existe */}
                  {validationError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 text-left">
                      <p className="text-sm">{validationError}</p>
                    </div>
                  )}

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
                          value={displayValues.numberBill}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 ${
                            formData.numberBill.length > 0 && formData.numberBill.length < 8
                              ? "outline-red-500"
                              : "outline-gray-300"
                          } placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                        />
                        {formData.numberBill.length > 0 && formData.numberBill.length < 8 && (
                          <p className="mt-1 text-sm text-red-500">
                            El número de factura debe tener al menos 8 caracteres
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">
                        Número HES
                      </label>
                      <div className="mt-2">
                        <input
                          id="numberHes"
                          name="numberHes"
                          type="text"
                          value={displayValues.numberHes}
                          onChange={handleInputChange}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm/6 font-medium text-gray-700">
                        Número OC
                      </label>
                      <div className="mt-2">
                        <input
                          id="numberOc"
                          name="numberOc"
                          type="text"
                          value={displayValues.numberOc}
                          onChange={handleInputChange}
                          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm/6 font-medium text-gray-700">
                        Monto OC
                      </label>
                      <div className="mt-2">
                        <input
                          id="ocAmount"
                          name="ocAmount"
                          type="number"
                          step="0.01"
                          value={displayValues.ocAmount}
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
                disabled={isLoading || !isFormValid || !isMarginValid}
                onClick={() => {
                  handlerUpdate();
                  setIsOpen();
                }}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 ${
                  isLoading || !isFormValid || !isMarginValid
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {isLoading ? "Procesando..." : "Completar facturación"}
              </button>
              <button
                type="button"
                data-autofocus
                disabled={isLoading}
                onClick={() => setIsOpen()}
                className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
