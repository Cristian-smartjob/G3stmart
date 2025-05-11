import PeopleTable from "@/components/pages/PeopleTable/index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personas",
};

export default function People() {
  return <PeopleTable />;
}
