export interface ClientForm {
  id?: number;
  name?: string;
  company_name?: string;
  rut?: string;
  currency_type_id?: number;
  address?: string;
  locality?: string;
  sublocality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  country?: string;
  billable_day?: number;
}

export interface PeopleForm {
  name?: string;
  last_name?: string;

  corporate_email?: string;

  email?: string;
  phone?: string;
  address?: string;
  locality?: string;
  sublocality?: string;
  administrative_area_level_1?: string;
  administrative_area_level_2?: string;
  country?: string;

  dni?: string;
  nationality?: string;
  role?: number;
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
