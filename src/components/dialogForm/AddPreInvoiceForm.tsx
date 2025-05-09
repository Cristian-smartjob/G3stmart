"use client";
// Eliminamos los imports no utilizados
import { useEffect, useState, useRef } from "react";
import { createPreInvoice } from "@/app/actions/preInvoices";
import { Formik, FieldProps } from "formik";
import { months } from "@/utils/constants";
import { PreinvoiceForm } from "@/interface/form";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Field } from "formik";

// Definir interfaces para los tipos
interface Client {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  name: string;
  lastName?: string;
  client_id?: number | null;
  clientId?: number | null;
}

interface Option {
  value: number;
  label: string;
}

// Componente AutocompleteField tipado
interface AutocompleteFieldProps extends FieldProps {
  options: Option[];
  placeholder: string;
  onChange: (option: Option | undefined) => void;
  value?: Option;
  className: string;
  disabled?: boolean;
}

const AutocompleteField = ({
  field,
  options,
  placeholder,
  onChange,
  value,
  className,
  disabled,
}: AutocompleteFieldProps) => {
  return (
    <select
      {...field}
      className={className}
      value={value ? value.value : ""}
      onChange={(e) => {
        const selectedOption = options.find((option) => option.value.toString() === e.target.value);
        if (onChange) {
          onChange(selectedOption);
        }
      }}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const initialValues: PreinvoiceForm = {
  client_id: undefined,
  contact_id: undefined,
  month: currentMonth,
  year: currentYear,
};

const validationSchema = Yup.object({
  client_id: Yup.number().required("Debes seleccionar un cliente"),
  contact_id: Yup.number().required("Debes seleccionar un contacto"),
  month: Yup.number().required("Debes debes seleccionar un mes"),
  year: Yup.number().required("Debes debes seleccionar un año"),
});

// Transformar los meses a objetos con value y label para el selector
const monthOptions: Option[] = months.map((monthName, index) => ({
  value: index + 1,
  label: monthName,
}));

const yearOptions: Option[] = Array(3)
  .fill(null)
  .map((_, index) => ({
    value: currentYear - 1 + index,
    label: `${currentYear - 1 + index}`,
  }));

interface Props {
  onSave: () => void;
}

export default function AddPreInvoiceForm({ onSave }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar clientes y contactos desde el servidor
  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch("/api/clients");
        const result = await response.json();
        setClients(result.data || []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setClients([]);
      }
    };

    const loadContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        const result = await response.json();
        setContacts(result.data || []);
      } catch (error) {
        console.error("Error cargando contactos:", error);
        setContacts([]);
      }
    };

    loadClients();
    loadContacts();
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: PreinvoiceForm) => {
    setIsSubmitting(true);
    try {
      // Preparamos los datos para enviar
      const postData = {
        client_id: values.client_id,
        contact_id: values.contact_id,
        month: values.month,
        year: values.year,
      };

      await createPreInvoice(postData);
      if (onSave) onSave();
      router.push("/preinvoice");
    } catch (error: unknown) {
      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;

        // Verificar si es un error de duplicado
        if (errorMessage.includes("Ya existe una prefactura para este cliente en el período seleccionado")) {
          setIsDuplicateError(true);
          setCountdown(5);

          // Iniciar la cuenta regresiva
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
          }

          countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (countdownTimerRef.current) {
                  clearInterval(countdownTimerRef.current);
                  countdownTimerRef.current = null;
                }
                onSave(); // Cerrar el modal cuando el contador llegue a 0
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message: string }).message;

        // También verificamos aquí para objetos error con propiedad message
        if (errorMessage.includes("Ya existe una prefactura para este cliente en el período seleccionado")) {
          setIsDuplicateError(true);
          setCountdown(5);

          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
          }

          countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (countdownTimerRef.current) {
                  clearInterval(countdownTimerRef.current);
                  countdownTimerRef.current = null;
                }
                onSave();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        errorMessage = "No se pudo crear la prefactura. Por favor, intenta nuevamente más tarde.";
      }

      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpiar el temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const renderError = (error: string) => {
    if (isDuplicateError) {
      // Calcular el porcentaje de progreso para el círculo
      const progressPercentage = (countdown / 5) * 100;
      const circumference = 2 * Math.PI * 18; // 2πr donde r es el radio (18)
      const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

      return (
        <div className="rounded-md bg-red-50 p-4 shadow-md border border-red-200 animate-bounce-once">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-red-500 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800">¡Prefactura duplicada!</h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-3 font-medium">{error}</p>
                <div className="bg-red-100 rounded-lg p-3 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Círculo de progreso animado */}
                      <div className="relative inline-flex mr-3">
                        <svg className="w-10 h-10" viewBox="0 0 40 40">
                          {/* Círculo base */}
                          <circle
                            className="text-red-200"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="18"
                            cx="20"
                            cy="20"
                          />
                          {/* Círculo de progreso */}
                          <circle
                            className="text-red-600 transition-all duration-300 ease-in-out"
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="18"
                            cx="20"
                            cy="20"
                            transform="rotate(-90 20 20)"
                          />
                          {/* Texto del contador */}
                          <text
                            x="50%"
                            y="50%"
                            dy=".3em"
                            textAnchor="middle"
                            className="text-red-600 font-medium text-xl"
                          >
                            {countdown}
                          </text>
                        </svg>
                      </div>
                      <span className="text-red-600 font-medium">
                        Este modal se cerrará automáticamente en {countdown} {countdown === 1 ? 'segundo' : 'segundos'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error.includes("no tiene smarters asociados")) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">No se puede crear la prefactura</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => router.push("/people")}
                    className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Ir a gestión de smarters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="relative mx-auto grid max-w-7xl gap-x-16 8 xl:gap-x-48">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={handleSubmit}
        >
          {({ values, errors, setFieldValue, isSubmitting: formikIsSubmitting, handleSubmit, touched }) => (
            <form className="px-4 sm:px-6 lg:col-start-1 lg:row-start-1" onSubmit={handleSubmit}>
              <div className="mx-auto max-w-lg lg:max-w-none">
                <section aria-labelledby="contact-info-heading">
                  <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
                    Información General
                  </h2>

                  <div className="mt-6">
                    <Field
                      name="client_id"
                      component={AutocompleteField}
                      options={clients.map((client) => ({
                        value: client.id,
                        label: client.name,
                      }))}
                      placeholder="Seleccione un cliente"
                      onChange={(option?: Option) => {
                        setFieldValue("client_id", option?.value);
                        // Limpiar contacto cuando cambia el cliente
                        setFieldValue("contact_id", undefined);
                      }}
                      value={
                        clients
                          .filter((client) => client.id === values.client_id)
                          .map((client) => ({
                            value: client.id,
                            label: client.name,
                          }))[0]
                      }
                      className={`block w-full border ${
                        touched.client_id && errors.client_id ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {touched.client_id && errors.client_id && (
                      <p className="mt-2 text-sm text-red-600">{errors.client_id}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Field
                      name="contact_id"
                      component={AutocompleteField}
                      options={
                        // Filtrar contactos por el cliente seleccionado
                        contacts
                          .filter((contact) => {
                            const cId = contact.client_id ?? contact.clientId;
                            return values.client_id ? cId === values.client_id : false;
                          })
                          .map((contact) => ({
                            value: contact.id,
                            label: `${contact.name} ${contact.lastName ?? ""}`.trim(),
                          }))
                      }
                      placeholder="Seleccione un contacto"
                      onChange={(option?: Option) => {
                        setFieldValue("contact_id", option?.value);
                      }}
                      value={
                        contacts
                          .filter((contact) => contact.id === values.contact_id)
                          .map((contact) => ({
                            value: contact.id,
                            label: `${contact.name} ${contact.lastName ?? ""}`.trim(),
                          }))[0]
                      }
                      className={`block w-full border ${
                        touched.contact_id && errors.contact_id ? "border-gray-300" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        !values.client_id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                      }`}
                      disabled={!values.client_id}
                    />
                    {touched.contact_id && errors.contact_id && (
                      <p className="mt-2 text-sm text-red-600">{errors.contact_id}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p>Mes / año facturación</p>
                    <div className=" grid grid-cols-2 gap-4">
                      <div className="p-2">
                        <Field
                          name="month"
                          component="select"
                          className={`block w-full border ${
                            touched.month && errors.month ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Seleccione un mes</option>
                          {monthOptions.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </Field>
                        {touched.month && errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
                      </div>
                      <div className="p-2">
                        <Field
                          name="year"
                          component="select"
                          className={`block w-full border ${
                            touched.year && errors.year ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Seleccione un año</option>
                          {yearOptions.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </Field>
                        {touched.year && errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {Object.values(errors).length > 0 ? <div className="mt-4"></div> : null}

                {formError && <div className="mt-4">{renderError(formError)}</div>}

                <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting || formikIsSubmitting || Object.keys(errors).length > 0}
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || formikIsSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                  <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left"></p>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
