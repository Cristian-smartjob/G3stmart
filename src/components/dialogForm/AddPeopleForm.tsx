import { DataTables } from "@/lib/features/data";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hook";
import { fetch } from "@/lib/features/data";
import { useFormik } from "formik";

import { fetch as FetchClients } from "@/lib/features/clients";
import { PeopleForm } from "@/interface/form";
import PeoplePersonal from "../form/steps/PeoplePersonal";
import PeopleImposition from "../form/steps/PeopleImposition";
import TabSelector, { Selector } from "../core/TabSelector";
import Peoplesalary from "../form/steps/PeopleSalary";
import PeopleSmarter from "../form/steps/PeopleSmarter";
import PeopleContact from "../form/steps/PeopleContact";

const initialValues: PeopleForm = {};

const tabs: Selector[] = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Contacto" },
  { id: 3, label: "Smarter" },
  { id: 4, label: "Previsional" },
  { id: 5, label: "Cliente" },
];

export default function AddPeopleForm() {
  const dispatch = useAppDispatch();
  const [menu, setMenu] = useState(1);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    dispatch(fetch(DataTables.AFPInstitution));
    dispatch(fetch(DataTables.HealthInstitution));
    dispatch(fetch(DataTables.Role));
    dispatch(fetch(DataTables.CurrencyType));
    dispatch(fetch(DataTables.JobTitle));
    dispatch(fetch(DataTables.Seniority));
    dispatch(FetchClients());
  }, [dispatch]);

  const handlerClick = async () => {
    setMenu(Math.min(5, menu + 1));
    /*
    const currentScheme = stepsSchemas[menu - 1]


    try{
      const result = await currentScheme.validate(formik.values, { abortEarly:false, strict: true })
      console.log('formik.values', formik.values)
      setErrors(null)
      setMenu(Math.min(5, menu + 1))
    }catch(e){
      if (e instanceof Yup.ValidationError) {
   
        const errors: string[] = e.errors; 
        setErrors((errors || []).join(","));
      } else {
        setErrors('Ocurrió un error inesperado');
      }
    }*/
  };

  return (
    <div className="bg-white">
      <div className="relative mx-auto grid max-w-7xl gap-x-16  xl:gap-x-48">
        <form
          className="lg:col-start-1 lg:row-start-1 "
          onSubmit={formik.handleSubmit}
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <TabSelector
              labels={tabs}
              selected={menu}
              onSelect={(index: number) => {
                if (index <= menu) {
                  setMenu(index);
                }
              }}
            />

            {menu === 1 ? (
              <PeoplePersonal
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
                onSelectorField={(field, value) => {
                  formik.setFieldValue(field, value);
                }}
              />
            ) : null}

            {menu === 2 ? (
              <PeopleContact
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
              />
            ) : null}

            {menu === 3 ? (
              <PeopleSmarter
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
              />
            ) : null}

            {menu === 4 ? <PeopleImposition /> : null}

            {menu === 5 ? <Peoplesalary /> : null}

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="button"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
                onClick={handlerClick}
              >
                {menu === 4 ? "Guardar" : "Continuar"}
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left"></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
