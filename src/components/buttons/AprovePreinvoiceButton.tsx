import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AprovePreInvoiceModal from "../modals/AprovePreInvoiceModal";

interface Props {
    preinvoiceId: number;
}

export default function AprovePreinvoiceButton({ preinvoiceId }: Props){

    const [showModal, setShowModal] = useState(false)

    const handlerClick = () => {
        setShowModal(true)
    }

    return (
        <>
            <AprovePreInvoiceModal preinvoiceId={preinvoiceId} isOpen={showModal} setIsOpen={() => {setShowModal(false)}} />
                
            <a
                href="#"
                className="ml-auto flex items-center gap-x-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handlerClick}
            >
                <CheckBadgeIcon aria-hidden="true" className="-ml-1.5 size-5" />
                aprobar
            </a>
        </>
    )
}