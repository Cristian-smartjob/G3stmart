import AbsencesUploadForm from "@/components/pages/absences/AbsencesUploadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cargar Ausencias",
};

export default function AbsencesPage() {
  return <AbsencesUploadForm />;
}
