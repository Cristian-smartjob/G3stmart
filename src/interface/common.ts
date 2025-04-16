import { CurrencyType } from "@prisma/client";

export interface Client {
  id: number;
  name: string;
  currencyTypeId?: number;
  billableDay?: number;
  rut?: string;
  address?: string;
  companyName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  currencyType?: {
    id: number;
    name: string;
  };
  // Otras relaciones como contacts, people, etc.
}

export interface Contact {
  id: number;
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  clientId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  client?: Client;
}

export interface PreInvoice {
  id: number;
  clientId?: number;
  contactId?: number;
  total?: number;
  status: string;
  ocNumber?: string;
  hesNumber?: string;
  invoiceNumber?: string;
  month: number;
  year: number;
  value: number;
  rejectNote?: string;
  ocAmount?: number;
  edpNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  client?: Client;
  contact?: Contact;
}

export interface PreInvoiceDetail {
  id: number;
  preInvoiceId?: number;
  personId?: number;
  status: string;
  value: number;
  currency_type?: number;
  billableDays: number;
  leaveDays: number;
  totalConsumeDays: number;
  createdAt?: Date;
  updatedAt?: Date;
  CurrencyType?: CurrencyType;
  preInvoice?: PreInvoice;
}

export interface AFPInstitution {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PreInvoiceUpdate {
  id: number;
  status: string;
  ocNumber?: string;
  hesNumber?: string;
  invoiceNumber?: string;
  rejectNote?: string;
  ocAmount?: number;
  edpNumber?: string;
  client?: Client;
} 