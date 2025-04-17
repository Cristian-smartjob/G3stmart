"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import AddAsignedProjectForm from "../dialogForm/AddAsignedProjectForm";
import type { People, JobTitle, Client, Role, AFPInstitution, HealthInstitution, Seniority, CurrencyType } from "@prisma/client";

// Definir el tipo de PeopleWithAllRelations según lo que necesitamos
type PeopleWithAllRelations = People & {
  jobTitle: JobTitle | null;
  client: Client | null;
  role: Role | null;
  afpInstitution: AFPInstitution | null;
  healthInstitution: HealthInstitution | null;
  seniority: Seniority | null;
  currencyType: CurrencyType | null;
};

interface Props {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
  smarter?: PeopleWithAllRelations;
}

export default function AssignProjectModal({ isOpen, setIsOpen, smarter }: Props) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <AddAsignedProjectForm
              title={`Asignar días de ausencia a ${smarter?.name} ${smarter?.lastName}`}
              smarterId={smarter?.id || 0}
              setIsOpen={setIsOpen}
            />
            <p className="px-3 font-semibold ">
              {smarter?.name} {smarter?.lastName}
            </p>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
