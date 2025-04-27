"use client";
// Eliminamos los imports no utilizados
import { useEffect, useState } from "react";
import { createPreInvoice } from "@/app/actions/preInvoices";
import { Formik, FieldProps } from "formik";
import { months } from "@/utils/constants";
import { PreinvoiceForm } from "@/interface/form";
import * as Yup from "yup";
import ErrorAlert from "../core/ErrorAlert";
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
}

const AutocompleteField = ({ field, options, placeholder, onChange, value, className }: AutocompleteFieldProps) => {
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
      setIsSubmitting(false);
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
                      options={contacts.map((contact) => ({
                        value: contact.id,
                        label: contact.name,
                      }))}
                      placeholder="Seleccione un contacto"
                      onChange={(option?: Option) => {
                        setFieldValue("contact_id", option?.value);
                      }}
                      value={
                        contacts
                          .filter((contact) => contact.id === values.contact_id)
                          .map((contact) => ({
                            value: contact.id,
                            label: contact.name,
                          }))[0]
                      }
                      className={`block w-full border ${
                        touched.contact_id && errors.contact_id ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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

                {Object.values(errors).length > 0 ? (
                  <div className="mt-4">
                    <ErrorAlert message={Object.values(errors).join(", ")} />
                  </div>
                ) : null}

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
