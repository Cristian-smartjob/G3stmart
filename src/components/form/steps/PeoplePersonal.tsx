import Selector from "@/components/core/Selector"
import countries from "@/data/countries.json"
import { SelectorItem } from "@/interface/ui";
import { Datepicker } from "flowbite-react"

const countryData = countries.data.map((item, index) => ({id: index, label: item.name}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
   handleBlur: {
           (e: React.FocusEvent<any>): void;
           <T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
       };
    handleChange: {
        (e: React.ChangeEvent<any>): void;
        <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    },
    onSelectorField: (field: string, value: string | number) => void;
}
 /* eslint-enable @typescript-eslint/no-explicit-any */

export default function PeoplePersonal({handleBlur, handleChange, onSelectorField}: Props){

    return (

        <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
            Información de la persona
            </h2>

            <div className="mt-6">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                Nombre
            </label>
            <div className="mt-2">
                <input
                id="name"
                name="name"
                type="text"
                autoComplete="text"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            
            </div>

            <div className="mt-6">
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                Apellido
            </label>
            <div className="mt-2">
                <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="text"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>

            </div>

        
            <div className="mt-6">
            
            <div className="mt-2">
                <Selector 
                    title='Nacionalidad' 
                    items={countryData}
                    onChange={(item: SelectorItem | null) => {
                        if(item !== null){
                            onSelectorField("nationality", item?.label)
                        }
                    }}
                />
            </div>

            </div>


            <div className="mt-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fecha de nacimiento
                </label>
                <Datepicker language="es" onChange={item => {
                    if(item !== null){
                        onSelectorField("birth", item?.toISOString())
                    }
                }} />
            </div>
            
        </section>
    )
}