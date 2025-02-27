import { useSelector } from "react-redux";
import Selector from "../core/Selector";
import { RootState } from "@/lib/store";
import { Client } from "@/interface/common";
import { SelectorItem } from "@/interface/ui";



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

export default function ContactPersonal({handleBlur, handleChange, onSelectorField}: Props){



    const clients = useSelector<RootState, Client[]>(state => state.clients.list)
    const isLoading = useSelector<RootState, boolean>(state => state.clients.isLoading)

    return (

        <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
                Información de la persona
            </h2>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
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

                <div>
                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
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
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-700">
                        Correo
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="text"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
                        Telefono
                    </label>
                    <div className="mt-2">
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            autoComplete="text"
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <Selector 
                    title='Cliente' 
                    isLoading={isLoading}
                    items={(clients || []).map(item => ({id:item.id, label: `${item.name}`}))}
                    onChange={(item: SelectorItem | null) => {
                        if(item !== null){
                            onSelectorField("client_id", item.id)
                        }
                    }}
                />
            </div>

        </section>
    )
}