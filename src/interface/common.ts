import { CurrencyType } from "@prisma/client";
import { Prisma } from "@prisma/client";
type Decimal = Prisma.Decimal;

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
  clientId?: number | null;
  contactId?: number | null;
  total?: number | Decimal | null;
  status: string;
  ocNumber?: string | null;
  hesNumber?: string | null;
  invoiceNumber?: string | null;
  month: number;
  year: number;
  value: number | Decimal;
  rejectNote?: string | null;
  ocAmount?: number | Decimal | null;
  edpNumber?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  client?: Client;
  contact?: Contact;
}

export interface PreInvoiceDetail {
  id: number;
  preInvoiceId?: number | null;
  personId?: number | null;
  status: string;
  value: number | Decimal;
  currency_type?: number | null;
  billableDays: number | Decimal;
  leaveDays: number | Decimal;
  totalConsumeDays: number | Decimal;
  isSelected?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
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