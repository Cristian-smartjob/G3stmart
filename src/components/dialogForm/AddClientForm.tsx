import Selector from "../core/Selector";
import MultipleSelector from "../core/MultipleSelector";
import { useSelector } from "react-redux";
import { DataTables, GenericDataMap } from "@/lib/features/data";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hook";
import { fetch } from "@/lib/features/users";
import { fetch as FetchData } from "@/lib/features/data";
import { fetch as FetchContacts, Contact } from "@/lib/features/contacts";
import { SelectorItem } from "@/interface/ui";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";
import { ClientForm } from "@/interface/form";
import { Client } from "@/interface/common";
import { create, update } from "@/lib/features/clients";
import ErrorAlert from "../core/ErrorAlert";

const validationSchema = Yup.object({
  name: Yup.string().required("Debes elegir un nombre"),
  rut: Yup.string().required("Debes proporcionar un Rut"),
  address: Yup.string().required("Debes proporcionar una dirección"),
  billable_day: Yup.number().required("Debes proporcionar un día de facturación"),
  company_name: Yup.string().required("Debes proporcionar una razón social"),
  currency_type_id: Yup.number().required("Debes elegir una moneda"),
  margin_percentage: Yup.number().nullable(),
});

interface Props {
  onSave: () => void;
  isEditMode?: boolean;
  selectedClient?: Client | null;
}

export default function AddClientForm({ onSave, isEditMode = false, selectedClient = null }: Props) {
  const genericDataMap = useSelector<RootState, GenericDataMap>((state) => state.data.list);
  const currencies = (genericDataMap[DataTables.CurrencyType] ?? []) as { id: string | number; name: string }[];
  const contacts = useSelector<RootState, Contact[]>((state) => state.contacts.list);
  const [selectedCurrency, setSelectedCurrency] = useState<SelectorItem | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<SelectorItem[]>([]);
  const [formikRef, setFormikRef] = useState<FormikProps<ClientForm> | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);

  // Inicializar valores con los datos del cliente seleccionado si estamos en modo edición
  const initialValues: ClientForm = {
    id: isEditMode && selectedClient ? selectedClient.id : undefined,
    name: isEditMode && selectedClient ? selectedClient.name : "",
    rut: isEditMode && selectedClient && selectedClient.rut ? selectedClient.rut : "",
    address: isEditMode && selectedClient && selectedClient.address ? selectedClient.address : "",
    billable_day:
      isEditMode && selectedClient && selectedClient.billableDay ? Number(selectedClient.billableDay) : undefined,
    company_name: isEditMode && selectedClient && selectedClient.companyName ? selectedClient.companyName : "",
    currency_type_id: isEditMode && selectedClient ? selectedClient.currencyTypeId || undefined : undefined,
    margin_percentage:
      isEditMode && selectedClient && selectedClient.marginPercentage ? Number(selectedClient.marginPercentage) : null,
    selected_contact_ids: isEditMode && selectedClient ? selectedClient.selectedContactIds || [] : [],
  };

  const dispatch = useAppDispatch();

  // Cargar usuarios
  useEffect(() => {
    dispatch(fetch());
  }, [dispatch]);

  // Cargar los tipos de moneda
  useEffect(() => {
    dispatch(FetchData(DataTables.CurrencyType));
  }, [dispatch]);

  // Cargar contactos
  useEffect(() => {
    dispatch(FetchContacts());
  }, [dispatch]);

  // Actualizar el objeto de moneda seleccionada cuando cambian los datos o se cargan las monedas
  useEffect(() => {
    if (isEditMode && selectedClient && selectedClient.currencyTypeId && currencies.length > 0) {
      const currencyObj = currencies.find((c) => Number(c.id) === Number(selectedClient.currencyTypeId));
      if (currencyObj) {
        const currencyItem = {
          id: Number(currencyObj.id),
          label: currencyObj.name,
        };
        setSelectedCurrency(currencyItem);

        // Si el formulario ya está inicializado, actualizar el valor de currency_type_id
        if (formikRef && formInitialized) {
          formikRef.setFieldValue("currency_type_id", currencyItem.id);
        }
      }
    }
  }, [isEditMode, selectedClient, currencies, formikRef, formInitialized]);

  // Actualizar contactos seleccionados cuando cambian los datos o se cargan los contactos
  useEffect(() => {
    if (isEditMode && selectedClient && selectedClient.selectedContactIds && contacts.length > 0) {
      const clientContacts = contacts.filter(
        (contact) => contact.clientId === selectedClient.id && selectedClient.selectedContactIds?.includes(contact.id)
      );

      const contactItems = clientContacts.map((contact) => ({
        id: contact.id,
        label: contact.name,
      }));

      setSelectedContacts(contactItems);

      // Si el formulario ya está inicializado, actualizar el valor
      if (formikRef && formInitialized) {
        formikRef.setFieldValue("selected_contact_ids", selectedClient.selectedContactIds);
      }
    }
  }, [isEditMode, selectedClient, contacts, formikRef, formInitialized]);

  return (
    <div className="bg-white">
      <div className="relative mx-auto grid max-w-7xl gap-x-16 lg:px-8 xl:gap-x-48">
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, {}) => {
            if (isEditMode) {
              dispatch(
                update({
                  ...values,
                  billable_day: Math.min(30, values.billable_day || 30),
                })
              );
            } else {
              dispatch(
                create({
                  ...values,
                  billable_day: Math.min(30, values.billable_day || 30),
                })
              );
            }
            onSave();
          }}
        >
          {(formikProps) => {
            // Guardar referencia al formik para actualizar valores
            if (!formikRef) {
              setFormikRef(formikProps);
              setFormInitialized(true);
            }

            const { values, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = formikProps;

            return (
              <form className="px-4 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0" onSubmit={handleSubmit}>
                <div className="mx-auto max-w-lg lg:max-w-none">
                  <section aria-labelledby="contact-info-heading">
                    <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
                      {isEditMode ? "Editar Cliente" : "Información General"}
                    </h2>

                    <div className="mt-6 flex space-x-6">
                      <div className="w-1/2">
                        <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                          Nombre
                        </label>
                        <div className="mt-2">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="text"
                            value={values.name || ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <label htmlFor="rut" className="block text-sm/6 font-medium text-gray-700">
                          Rut
                        </label>
                        <div className="mt-2">
                          <input
                            id="rut"
                            name="rut"
                            type="text"
                            autoComplete="text"
                            value={values.rut || ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-6">
                      <div className="w-1/2">
                        <label htmlFor="company_name" className="block text-sm/6 font-medium text-gray-700">
                          Razón social
                        </label>
                        <div className="mt-2">
                          <input
                            id="company_name"
                            name="company_name"
                            type="text"
                            autoComplete="text"
                            value={values.company_name || ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <label htmlFor="address" className="block text-sm/6 font-medium text-gray-700">
                          Dirección
                        </label>
                        <div className="mt-2">
                          <input
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="text"
                            value={values.address || ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-6">
                      <div className="w-1/2">
                        <label htmlFor="billable_day" className="block text-sm/6 font-medium text-gray-700">
                          Día de facturación
                        </label>
                        <div className="mt-2">
                          <input
                            id="billable_day"
                            name="billable_day"
                            type="number"
                            autoComplete="number"
                            value={values.billable_day || ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>

                      <div className="w-1/2">
                        <Selector
                          title="Moneda de cobro"
                          items={currencies.map((item) => ({ id: Number(item.id), label: item.name }))}
                          value={selectedCurrency}
                          onChange={(item: SelectorItem | null) => {
                            setFieldValue("currency_type_id", item?.id);
                            setSelectedCurrency(item);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-6">
                      <div className="w-1/2">
                        <label htmlFor="margin_percentage" className="block text-sm/6 font-medium text-gray-700">
                          Porcentaje de margen (%)
                        </label>
                        <div className="mt-2">
                          <input
                            id="margin_percentage"
                            name="margin_percentage"
                            type="number"
                            step="0.01"
                            autoComplete="number"
                            value={values.margin_percentage !== null ? values.margin_percentage : ""}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ej: 10.5"
                          />
                        </div>
                      </div>

                      <div className="w-1/2">{/* Espacio para otro campo si es necesario en el futuro */}</div>
                    </div>

                    {/* Selector múltiple de contactos - solo en modo edición */}
                    {isEditMode && (
                      <div className="mt-6">
                        <MultipleSelector
                          title="Contactos seleccionados para facturación"
                          items={contacts
                            .filter((contact) => contact.clientId === selectedClient?.id)
                            .map((contact) => ({
                              id: contact.id,
                              label: contact.name,
                            }))}
                          value={selectedContacts}
                          onChange={(selectedItems: SelectorItem[]) => {
                            setSelectedContacts(selectedItems);
                            setFieldValue(
                              "selected_contact_ids",
                              selectedItems.map((item) => item.id)
                            );
                          }}
                          placeholder="Buscar y seleccionar contactos..."
                        />
                      </div>
                    )}

                    {Object.values(errors).length > 0 ? (
                      <div className="mt-4">
                        <ErrorAlert message={Object.values(errors).join(", ")} />
                      </div>
                    ) : null}
                  </section>

                  <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
                    >
                      {isEditMode ? "Actualizar" : "Guardar"}
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left"></p>
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
