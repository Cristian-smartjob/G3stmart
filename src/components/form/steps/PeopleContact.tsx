import { usePlacesWidget } from "react-google-autocomplete";
import countries from "@/data/countries.json"
const countryData = countries.data.map((item, index) => ({id: index, label: item.name}))

interface Props {
   handleBlur: {
           (e: React.FocusEvent<any>): void;
           <T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
       };
    handleChange: {
        (e: React.ChangeEvent<any>): void;
        <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    }
}

export default function PeopleContact({handleBlur, handleChange}: Props){


    const { ref } = usePlacesWidget({
        apiKey: "", //TODO ADD API KEY
        options: {
            types: ['address'], 
          },
        onPlaceSelected: (place) => {
            console.log(place)
        },
        
      })

    return (

        <section aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900 mt-6">
            Información de contacto
            </h2>

        
            <div className="mt-6">
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">
                Correo (Personal)
            </label>
            <div className="mt-2">
                <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            </div>

            <div className="mt-6">
            <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-700">
                Telefono (Personal)
            </label>
            <div className="mt-2">
                <input
                id="phone"
                name="phone"
                type="phone"
                autoComplete="phone"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </div>
            </div>

            <div className="mt-6">
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">
                    Dirección residencia
                </label>
                <div className="mt-2">
                    <input
                    id="position"
                    name="position"
                    type="position"
                    autoComplete="position"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={ref}
                    />
                </div>
            </div>          
        </section>
    )
}