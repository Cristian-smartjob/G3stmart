import Selector from "@/components/core/Selector";

import { DataTables, GenericDataMap } from "@/lib/features/data";
import { RootState } from "@/lib/store";
import { Datepicker } from "flowbite-react";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  handleBlur: {
    (e: React.FocusEvent<any>): void;
    <T = string | any>(fieldOrEvent: T): T extends string
      ? (e: any) => void
      : void;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function PeopleSmarter({ handleBlur, handleChange }: Props) {
  const genericDataMap = useSelector<RootState, GenericDataMap>(
    (state) => state.data.list
  );
  const jobTitles = (genericDataMap[DataTables.JobTitle] ?? []) as {
    id: string | number;
    name: string;
  }[];
  const seniorities = (genericDataMap[DataTables.Seniority] ?? []) as {
    id: string | number;
    name: string;
  }[];
  const afpInstitutions = (genericDataMap[DataTables.AFPInstitution] ?? []) as {
    id: string | number;
    name: string;
  }[];

  return (
    <section aria-labelledby="contact-info-heading">
      <h2
        id="contact-info-heading"
        className="text-lg font-medium text-gray-900 mt-6"
      >
        Información de la persona
      </h2>

      <div className="mt-6">
        <label
          htmlFor="name"
          className="block text-sm/6 font-medium text-gray-700"
        >
          Correo (Smartjob)
        </label>
        <div className="mt-2">
          <input
            id="corporativeEmail"
            name="corporativeEmail"
            type="email"
            autoComplete="email"
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {/*errors.name !== undefined ? (
                <div className='mt-2'>
                <ErrorAlert message={errors.name || ""} />
                </div>
            ) : null*/}
      </div>

      <div className="mt-6">
        <Selector
          title="Cargo"
          items={jobTitles.map((item) => ({
            id: Number(item.id),
            label: item.name,
          }))}
          onChange={() => {}}
        />
      </div>

      <div className="mt-6">
        <Selector
          title="Seniority"
          items={seniorities.map((item) => ({
            id: Number(item.id),
            label: item.name,
          }))}
          onChange={() => {}}
        />
      </div>

      <div className="mt-6">
        <Selector
          title="AFP"
          items={afpInstitutions.map((item) => ({
            id: Number(item.id),
            label: item.name,
          }))}
          onChange={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de ingreso
          </label>
          <Datepicker language="es" minDate={new Date()} />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de termino
          </label>
          <Datepicker language="es" minDate={new Date()} />
        </div>
      </div>
    </section>
  );
}
