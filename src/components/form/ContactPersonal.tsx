import { useSelector } from "react-redux";
import Selector from "../core/Selector";
import { RootState } from "@/lib/store";
import { Client } from "@/interface/common";
import { SelectorItem } from "@/interface/ui";
import { ContactForm } from "@/interface/form";

interface Props {
   handleBlur: {
           (e: React.FocusEvent<HTMLInputElement>): void;
           <T = string | React.FocusEvent<HTMLInputElement>>(fieldOrEvent: T): T extends string ? (e: React.FocusEvent<HTMLInputElement>) => void : void;
       };
    handleChange: {
        (e: React.ChangeEvent<HTMLInputElement>): void;
        <T = string | React.ChangeEvent<HTMLInputElement>>(field: T): T extends React.ChangeEvent<HTMLInputElement> ? void : (e: string | React.ChangeEvent<HTMLInputElement>) => void;
    },
    onSelectorField: (field: string, value: string | number) => void;
    values: ContactForm;
}

export default function ContactPersonal({handleBlur, handleChange, onSelectorField, values}: Props){



    const clients = useSelector<RootState, Client[]>(state => state.clients.list)
    const isLoading = useSelector<RootState, boolean>(state => state.clients.isLoading)

    const selectedClient = clients.find(item => item.id === values.client_id)

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
                            value={values.name}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-700">
                        Apellido
                    </label>
                    <div className="mt-2">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="text"
                            value={values.lastName}
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
                            value={values.email ?? ''}
                            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-700">
                        Telefono
                    </label>
                    <div className="mt-2">
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            autoComplete="text"
                            value={values.phone ?? ''}
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
                    items={(clients || []).map(item => ({id:item.id, label: `${item.name}`}))}
                    value={selectedClient === undefined ? null : {
                        id: selectedClient.id,
                        label: selectedClient.name
                    }}
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