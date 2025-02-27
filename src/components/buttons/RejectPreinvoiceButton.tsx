import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import RejectPreinvoiceModal from "../modals/RejectPreinvoiceModal";

interface Props {
    preinvoiceId: number;
}

export default function RejectPreinvoiceButton({ preinvoiceId }: Props){

    const [showModal, setShowModal] = useState(false)

    const handlerClick = () => {
        setShowModal(true)
    }

    return (
        <>
            <RejectPreinvoiceModal 
                isOpen={showModal} 
                preinvoiceId={preinvoiceId}
                setIsOpen={() => {setShowModal(false)}} />
            <a
                href="#"
                className="ml-auto flex items-center gap-x-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={handlerClick}
            >
                <TrashIcon aria-hidden="true" className="-ml-1.5 size-5" />
                rechazar
            </a>
        </>
    )
}