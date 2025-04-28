export interface ClientForm {
  id?: number;
  name?: string;
  company_name?: string | null;
  rut?: string | null;
  currency_type_id?: number | null;
  address?: string | null;
  locality?: string | null;
  sublocality?: string | null;
  administrative_area_level_1?: string | null;
  administrative_area_level_2?: string | null;
  country?: string | null;
  billable_day?: number | null;
  margin_percentage?: number | null;
}

export interface PeopleForm {
  name?: string;
  last_name?: string;

  dni?: string;
  corporate_name?: string;
  corporate_email?: string;
  contract_type?: string;
  contract_start?: string;
  contract_end?: string;
  contract_client_end?: string;

  role_id?: number;
  is_active?: boolean;
  causal?: string;
  reason?: string;
  client_id?: number;
  remote?: string;
  job_title_id?: number;
  seniority_id?: number;
  technical_stacks_id?: number;
  sales_manager?: string;
  search_manager?: string;
  delivery_manager?: string;

  email?: string;
  phone?: string;
  address?: string;
  locality?: string;
  sublocality?: string;
  administrative_area_level_1?: string;
  country?: string;
  nationality?: string;

  afp_institution_id?: number;
  health_institution_id?: number;
  bank?: string;
  account_number?: number;

  salary_currency_type_id?: number;
  net_salary?: number;
  fee_currency_type_id?: number;
  service_fee?: number;
  fee?: boolean;
  billable_day?: number;
  laptop_currency_type_id?: number;
  laptop_bonus?: number;
  comment?: string;
}

export interface ContactForm {
  id?: number;
  name?: string;
  email?: string | null;
  phone?: string | null;
  client_id?: number | null;
  clientId?: number | null;
}

export interface PreinvoiceForm {
  client_id?: number;
  contact_id?: number;
  month?: number;
  year?: number;
  billable_day?: number;
}

export interface AssignLeaveDaysForm {
  start_date: string;
  end_date: string;
  smarter_id: number;
}
