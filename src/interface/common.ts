import { CurrencyType } from "@prisma/client";
import { Prisma } from "@prisma/client";
type Decimal = Prisma.Decimal;

export interface Client {
  id: number;
  name: string;
  currencyTypeId?: number | null;
  billableDay?: number | Decimal | null;
  rut?: string | null;
  address?: string | null;
  companyName?: string | null;
  marginPercentage?: number | Decimal | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
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
  client?: Client;
  contactId?: number | null;
  contact?: Contact;
  total?: number | Decimal | null;
  status: string;
  ocNumber?: string | null;
  hesNumber?: string | null;
  invoiceNumber?: string | null;
  month?: number;
  year?: number;
  value?: number | Decimal;
  rejectNote?: string | null;
  ocAmount?: number | Decimal | null;
  edpNumber?: string | null;
  completedBy?: string | null;
  completedAt?: Date | null;
  ufValueUsed?: number | Decimal | null;
  ufDateUsed?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
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
  completedBy?: string;
  completedAt?: Date;
  client?: Client;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  createdAt: Date;
}

export interface AssignedProject {
  projectId: number;
  userId: number;
}
