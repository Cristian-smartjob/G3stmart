"use client";
import Selector from "../core/Selector";
// Definir las interfaces que necesitamos localmente si no se pueden importar
interface Client {
  id: number;
  name: string;
  billableDay?: number | null;
  billable_day?: number | null;
  // Propiedades adicionales genéricas
  [key: string]: number | string | null | undefined;
}

interface Contact {
  id: number;
  name: string;
  last_name?: string;
  lastName?: string;
  client?: Client;
  Client?: Client;
  clientId?: number;
  // Propiedades adicionales genéricas
  [key: string]: number | string | Client | null | undefined;
}

import { useEffect, useState } from "react";
import { createPreInvoice } from "@/app/actions/preInvoices";
import SimpleSelector from "../core/SimpleSelector";
import { Formik, FormikHelpers } from "formik";
import { SelectorItem } from "@/interface/ui";
import { months } from "@/utils/constants";
import { PreinvoiceForm } from "@/interface/form";
import * as Yup from "yup";
import ErrorAlert from "../core/ErrorAlert";
import { useRouter } from "next/navigation";

// Inicializamos con un objeto vacío pero con propiedades definidas para evitar valores null
const initialValues: PreinvoiceForm = {
  client_id: undefined,
  contact_id: undefined,
  month: undefined,
  year: undefined,
  billable_day: undefined,
};

const currentYear = new Date().getFullYear();

const validationSchema = Yup.object({
  client_id: Yup.number().required("Debes seleccionar un cliente"),
  contact_id: Yup.number().required("Debes seleccionar un contacto"),
  month: Yup.number().required("Debes debes seleccionar un mes"),
  year: Yup.number().required("Debes debes seleccionar un año"),
});

const data = Array(3)
  .fill(null)
  .map((item, index) => ({
    id: index + 1,
    label: `${currentYear - 1 + index}`,
    value: currentYear - 1 + index,
  }));

const dataMonths = months.map((item, index) => ({ id: index, label: item, value: item }));

interface Props {
  onSave: () => void;
}

export default function AddPreInvoiceForm({ onSave }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Cargar clientes y contactos desde el servidor
  useEffect(() => {
    const loadClients = async () => {
      setIsLoadingClient(true);
      try {
        // En una implementación real, usaríamos server actions para esto
        // Esto es solo un placeholder
        const response = await fetch("/api/clients");
        const result = await response.json();
        // Extraer los datos del objeto respuesta
        setClients(result.data || []);
      } catch (error) {
        console.error("Error cargando clientes:", error);
        setClients([]);
      } finally {
        setIsLoadingClient(false);
      }
    };

    const loadContacts = async () => {
      setIsLoading(true);
      try {
        // En una implementación real, usaríamos server actions para esto
        // Esto es solo un placeholder
        const response = await fetch("/api/contacts");
        const result = await response.json();
        // Extraer los datos del objeto respuesta
        setContacts(result.data || []);
      } catch (error) {
        console.error("Error cargando contactos:", error);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
    loadContacts();
  }, []);

  // Función para obtener la propiedad adecuada del cliente independientemente de su estructura
  const getClientId = (contact: Contact): number | undefined => {
    // Intentar acceder a las diferentes formas en que podría estar disponible el ID del cliente
    if (contact.client?.id) return contact.client.id;
    if (contact.Client?.id) return contact.Client.id;
    if (contact.clientId) return contact.clientId;
    return undefined;
  };

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (values: PreinvoiceForm, { setSubmitting }: FormikHelpers<PreinvoiceForm>) => {
    setFormError(null);
    setSubmitting(true);

    try {
      // Verificar que tenemos todos los datos necesarios
      if (!values.client_id || !values.contact_id || !values.month || !values.year) {
        console.error("Faltan datos requeridos en el formulario:", values);
        setFormError("Por favor completa todos los campos requeridos.");
        return;
      }

      // Asegurarnos de que los datos son números
      const formData: PreinvoiceForm = {
        client_id: Number(values.client_id),
        contact_id: Number(values.contact_id),
        month: Number(values.month),
        year: Number(values.year),
        billable_day: values.billable_day ? Number(values.billable_day) : undefined,
      };

      console.log("Enviando datos de prefactura:", formData);
      await createPreInvoice(formData);
      console.log("Prefactura creada exitosamente");
      onSave();
    } catch (error: unknown) {
      console.error("Error creating preInvoice:", error);

      let errorMessage: string;

      if (error instanceof Error) {
        console.log("Error message:", error.message);
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        console.log("Error object message:", (error as { message: string }).message);
        errorMessage = (error as { message: string }).message;
      } else {
        console.log("Unknown error type:", error);
        errorMessage = "No se pudo crear la prefactura. Por favor, intenta nuevamente más tarde.";
      }

      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (error: string) => {
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
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, setFieldValue, isSubmitting, handleSubmit, touched }) => (
            <form className="px-4 sm:px-6 lg:col-start-1 lg:row-start-1" onSubmit={handleSubmit}>
              <div className="mx-auto max-w-lg lg:max-w-none">
                <section aria-labelledby="contact-info-heading">
                  <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
                    Información General
                  </h2>

                  <div className="mt-6">
                    <Selector
                      title="Cliente"
                      isLoading={isLoadingClient}
                      items={(clients || []).map((item) => ({ id: item.id, label: item.name }))}
                      onChange={(item: SelectorItem | null) => {
                        if (item !== null) {
                          const client = clients.find((it) => it.id === item.id);
                          setFieldValue("client_id", item.id);
                          // Manejo flexible para diferentes formatos de propiedad
                          setFieldValue("billable_day", client?.billableDay || client?.billable_day);
                        }
                      }}
                    />
                    {touched.client_id && errors.client_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Selector
                      title="Contraparte (debes selecionar un cliente)"
                      isLoading={isLoading}
                      items={(contacts || [])
                        .filter((item) => getClientId(item) === values.client_id)
                        .map((item) => ({
                          id: item.id,
                          label: `${item.name} ${item.lastName || item.last_name || ""}`,
                        }))}
                      onChange={(item: SelectorItem | null) => {
                        if (item !== null) {
                          setFieldValue("contact_id", item.id);
                        }
                      }}
                    />
                    {touched.contact_id && errors.contact_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.contact_id}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p>Mes / año facturación</p>
                    <div className=" grid grid-cols-2 gap-4">
                      <div className="p-2">
                        <SimpleSelector
                          title="Mes"
                          items={dataMonths}
                          value={dataMonths.find((item) => item.id === (values.month || 0) - 1) || null}
                          onChange={(item: SelectorItem) => {
                            setFieldValue("month", item.id + 1);
                          }}
                        />
                        {touched.month && errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
                      </div>
                      <div className="p-2">
                        <SimpleSelector
                          title="Año"
                          items={data}
                          value={data.find((item) => item.value === values.year) || null}
                          onChange={(item: SelectorItem) => {
                            setFieldValue("year", item.value);
                          }}
                        />
                        {touched.year && errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {Object.values(errors).length > 0 ? (
                  <div className="mt-4">
                    <ErrorAlert message={Object.values(errors).join(", ")} />
                  </div>
                ) : null}

                {formError && <div className="mt-4">{renderError(formError)}</div>}

                <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
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
