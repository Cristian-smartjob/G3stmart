export interface People {
  id: number;
  name: string;
  last_name: string;
  email: string;
  corporate_email: string;
  role_id: number;
  dni: string;
  address: string;
  sublocality: string;
  locality: string;
  administrative_area_level_1: string;
  country: string;
  nationality: string;
  afp_institution_id: number;
  health_institution_id: number;
  seniority_id: number;
  net_salary: number;
  currency_type_id: number;
  job_title_id: number;
  fee: number;
  birth: string;
  client_id: number;
  phone: string;
  billable_day: number;
  created_at?: string;
  updated_at?: string;
  job_title_name?: string;
}

export interface Contact {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  Client: Client;
}

export interface JobTitle {
  id: number;
  name: string;
}

export interface PreInvoice {
  id: number;
  status: string;
  oc_number: number;
  hes_number: number;
  month: number;
  year: number;
  preinvoice_number: number;
  Client: Client;
  Contact: Contact;
  value: number;
  reject_note: string;
}

export type PreInvoiceUpdate = Partial<PreInvoice>;

export interface PreInvoiceDetail {
  id: number;
  value: number;
  People: People;
  status: string | null;
  isSelected?: boolean;
  billable_days: number;
  leave_days: number;
  total_consume_days: number;
}

export interface AssignedProject {
  id?: number;
  project_id: number;
  smarter_id: number;
  price_id: number;
}

export interface Client {
  id: number;
  name: string;
  razonSocial: string;
  rut: string;
  billable_day: number;
  address: string;
  locality: string;
  sublocality: string;
  administrative_area_level_1: string;
  administrative_area_level_2: string;
  country: string;
  CurrencyType: CurrencyType;
}

export interface Project {
  id: number;
  name: string;
  Client: Client;
}

export interface Price {
  id: number;
  name: string;
  description: string;
  value: number;
  CurrencyType?: CurrencyType;
}

export interface CurrencyType {
  id: number;
  name: string;
  symbol: string;
}

export interface AFPInstitution {
  id: number;
  name: string;
}

export interface HealthInstitution {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Seniority {
  id: number;
  name: string;
}

export type GenericDataMap = {
  [DataTables.AFPInstitution]: AFPInstitution[];
  [DataTables.HealthInstitution]: HealthInstitution[];
  [DataTables.Seniority]: Seniority[];
  [DataTables.Role]: Role[];
  [DataTables.Price]: Price[];
  [DataTables.CurrencyType]: CurrencyType[];
  [DataTables.JobTitle]: JobTitle[];
};

export enum DataTables {
  AFPInstitution = "AFPInstitution",
  HealthInstitution = "HealthInstitution",
  Seniority = "Seniority",
  Role = "Role",
  Price = "Price",
  CurrencyType = "CurrencyType",
  JobTitle = "JobTitle",
}
