import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CompleteBillModal from "../modals/CompleteBillModal";

interface Props {
  preinvoiceId: number;
}

export default function CompleteBillButton({ preinvoiceId }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handlerClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <CompleteBillModal
        preinvoiceId={preinvoiceId}
        isOpen={showModal}
        setIsOpen={() => {
          setShowModal(false);
        }}
      />

      <a
        href="#"
        className="ml-auto flex items-center gap-x-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handlerClick}
      >
        <DocumentTextIcon aria-hidden="true" className="-ml-1.5 size-5" />
        Facturar
      </a>
    </>
  );
}
