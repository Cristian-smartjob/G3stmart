import Selector from "@/components/core/Selector";
import { DataTables, GenericDataMap } from "@/interface/common";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function PeopleImposition(){

   
    const genericDataMap = useSelector<RootState, GenericDataMap>(state => state.data.list)
    const afpInstitutions = genericDataMap[DataTables.AFPInstitution]
    const isapreInstitutions = genericDataMap[DataTables.HealthInstitution]


    return (
        <section aria-labelledby="payment-heading" className="mt-10">
            <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
            Detalles previsionales
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
            <div className="col-span-3 sm:col-span-4">
                
                <div className="mt-6">
                    <Selector 
                    title='AFP' 
                    items={afpInstitutions.map(item => ({id:item.id, label: item.name}))}
                    onChange={() => {

                    }}
                />
                </div>
                <div className='mt-6'>
                <Selector 
                title='Isapre' 
                items={isapreInstitutions.map(item => ({id:item.id, label: item.name}))}
                onChange={() => {
                
                }}
                />
                </div>
            </div>
            </div>
        </section>
    )
}