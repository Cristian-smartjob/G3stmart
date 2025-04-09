import { prisma } from "../connection/prisma";
import type {} from "../prisma/index";
import type {
  Prisma,
  Client,
  JobTitle,
  Role,
  Seniority,
  AFPInstitution,
  HealthInstitution,
  LeaveDays,
} from "../prisma/index";
import { FilterCondition } from "../types/database.types";

export interface PeopleWithRelations {
  id: number;
  name: string;
  lastName: string;
  email: string | null;
  corporateEmail: string | null;
  roleId: number | null;
  dni: string | null;
  address: string | null;
  sublocality: string | null;
  locality: string | null;
  administrativeArea: string | null;
  country: string | null;
  nationality: string | null;
  afpInstitutionId: number | null;
  healthInstitutionId: number | null;
  seniorityId: number | null;
  netSalary: number | null;
  currencyTypeId: number | null;
  jobTitleId: number | null;
  fee: number | null;
  birth: Date | null;
  clientId: number | null;
  phone: string | null;
  billableDay: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  client?: Client | null;
  jobTitle?: JobTitle | null;
  role?: Role | null;
  seniority?: Seniority | null;
  afpInstitution?: AFPInstitution | null;
  healthInstitution?: HealthInstitution | null;
  leaveDays?: LeaveDays[];
}

export interface People {
  id: number;
  name: string;
  lastName: string;
  email: string | null;
  corporateEmail: string | null;
  roleId: number | null;
  dni: string | null;
  address: string | null;
  sublocality: string | null;
  locality: string | null;
  administrativeArea: string | null;
  country: string | null;
  nationality: string | null;
  afpInstitutionId: number | null;
  healthInstitutionId: number | null;
  seniorityId: number | null;
  netSalary: number | null;
  currencyTypeId: number | null;
  jobTitleId: number | null;
  fee: number | null;
  birth: Date | null;
  clientId: number | null;
  phone: string | null;
  billableDay: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface PeopleWithJobTitle {
  id: number;
  name: string;
  lastName: string;
  email: string | null;
  corporateEmail: string | null;
  roleId: number | null;
  dni: string | null;
  address: string | null;
  sublocality: string | null;
  locality: string | null;
  administrativeArea: string | null;
  country: string | null;
  nationality: string | null;
  afpInstitutionId: number | null;
  healthInstitutionId: number | null;
  seniorityId: number | null;
  netSalary: { toNumber: () => number } | null;
  currencyTypeId: number | null;
  jobTitleId: number | null;
  fee: { toNumber: () => number } | null;
  birth: Date | null;
  clientId: number | null;
  phone: string | null;
  billableDay: { toNumber: () => number } | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  jobTitle: { name: string } | null;
}

export interface PeopleWithAllJoins extends PeopleWithJobTitle {
  client: {
    id: number;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    address: string | null;
    currencyTypeId: number | null;
    billableDay: { toNumber: () => number } | null;
    rut: string | null;
    companyName: string | null;
  } | null;
  role: {
    id: number;
    name: string;
  } | null;
  afpInstitution: {
    id: number;
    name: string;
  } | null;
  healthInstitution: {
    id: number;
    name: string;
  } | null;
  seniority: {
    id: number;
    name: string;
  } | null;
  currencyType: {
    id: number;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    symbol?: string;
  } | null;
}

export interface PeopleWithAllRelations {
  id: number;
  name: string;
  lastName: string;
  email: string | null;
  corporateEmail: string | null;
  roleId: number | null;
  dni: string | null;
  address: string | null;
  sublocality: string | null;
  locality: string | null;
  administrativeArea: string | null;
  country: string | null;
  nationality: string | null;
  afpInstitutionId: number | null;
  healthInstitutionId: number | null;
  seniorityId: number | null;
  netSalary: number | null;
  currencyTypeId: number | null;
  jobTitleId: number | null;
  fee: number | null;
  birth: Date | null;
  clientId: number | null;
  phone: string | null;
  billableDay: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  jobTitleName: string | null;
  clientName: string | null;
  roleName: string | null;
  afpInstitutionName: string | null;
  healthInstitutionName: string | null;
  seniorityName: string | null;
  currencyTypeName: string | null;
}

export class PeopleRepository {
  async findWithJobTitle(conditions: FilterCondition[] = []): Promise<PeopleWithJobTitle[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      switch (operator) {
        case "=":
          where[column] = value;
          break;
        case ">":
          where[column] = { gt: value };
          break;
        case ">=":
          where[column] = { gte: value };
          break;
        case "<":
          where[column] = { lt: value };
          break;
        case "<=":
          where[column] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[column] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[column] = value;
      }
    });

    const result = await prisma.people.findMany({
      where,
      include: {
        jobTitle: true,
      },
    });

    return result.map((person) => ({
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      email: person.email,
      corporateEmail: person.corporateEmail,
      roleId: person.roleId,
      dni: person.dni,
      address: person.address,
      sublocality: person.sublocality,
      locality: person.locality,
      administrativeArea: person.administrativeArea,
      country: person.country,
      nationality: person.nationality,
      afpInstitutionId: person.afpInstitutionId,
      healthInstitutionId: person.healthInstitutionId,
      seniorityId: person.seniorityId,
      netSalary: person.netSalary,
      currencyTypeId: person.currencyTypeId,
      jobTitleId: person.jobTitleId,
      fee: person.fee,
      birth: person.birth,
      clientId: person.clientId,
      phone: person.phone,
      billableDay: person.billableDay,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
      jobTitle: person.jobTitle,
    }));
  }

  async findWithAllJoins(conditions: FilterCondition[] = []): Promise<PeopleWithAllRelations[]> {
    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const { column, operator, value } = condition;

      switch (operator) {
        case "=":
          where[column] = value;
          break;
        case ">":
          where[column] = { gt: value };
          break;
        case ">=":
          where[column] = { gte: value };
          break;
        case "<":
          where[column] = { lt: value };
          break;
        case "<=":
          where[column] = { lte: value };
          break;
        case "LIKE":
        case "ILIKE":
          where[column] = {
            contains: String(value).replace(/%/g, ""),
            mode: operator === "ILIKE" ? "insensitive" : "default",
          };
          break;
        default:
          where[column] = value;
      }
    });

    const result = await prisma.people.findMany({
      where,
      include: {
        jobTitle: true,
        client: true,
        role: true,
        afpInstitution: true,
        healthInstitution: true,
        seniority: true,
        currencyType: true,
      },
    });
    return result.map((person) => ({
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      email: person.email,
      corporateEmail: person.corporateEmail,
      roleId: person.roleId,
      dni: person.dni,
      address: person.address,
      sublocality: person.sublocality,
      locality: person.locality,
      administrativeArea: person.administrativeArea,
      country: person.country,
      nationality: person.nationality,
      afpInstitutionId: person.afpInstitutionId,
      healthInstitutionId: person.healthInstitutionId,
      seniorityId: person.seniorityId,
      netSalary: person.netSalary?.toNumber() || null,
      currencyTypeId: person.currencyTypeId,
      jobTitleId: person.jobTitleId,
      fee: person.fee?.toNumber() || null,
      birth: person.birth,
      clientId: person.clientId,
      phone: person.phone,
      billableDay: person.billableDay?.toNumber() || null,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
      jobTitleName: person.jobTitle?.name || null,
      clientName: person.client?.name || null,
      roleName: person.role?.name || null,
      afpInstitutionName: person.afpInstitution?.name || null,
      healthInstitutionName: person.healthInstitution?.name || null,
      seniorityName: person.seniority?.name || null,
      currencyTypeName: person.currencyType?.name || null,
    }));
  }

  async findAll(): Promise<People[]> {
    const result = await prisma.people.findMany();
    return result.map((person) => ({
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      email: person.email,
      corporateEmail: person.corporateEmail,
      roleId: person.roleId,
      dni: person.dni,
      address: person.address,
      sublocality: person.sublocality,
      locality: person.locality,
      administrativeArea: person.administrativeArea,
      country: person.country,
      nationality: person.nationality,
      afpInstitutionId: person.afpInstitutionId,
      healthInstitutionId: person.healthInstitutionId,
      seniorityId: person.seniorityId,
      netSalary: person.netSalary?.toNumber() || null,
      currencyTypeId: person.currencyTypeId,
      jobTitleId: person.jobTitleId,
      fee: person.fee?.toNumber() || null,
      birth: person.birth,
      clientId: person.clientId,
      phone: person.phone,
      billableDay: person.billableDay?.toNumber() || null,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    }));
  }

  async findById(id: number): Promise<PeopleWithRelations | null> {
    const result = await prisma.people.findUnique({
      where: { id },
      include: {
        client: true,
        jobTitle: true,
        role: true,
        seniority: true,
        afpInstitution: true,
        healthInstitution: true,
        leaveDays: true,
      },
    });

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      lastName: result.lastName,
      email: result.email,
      corporateEmail: result.corporateEmail,
      roleId: result.roleId,
      dni: result.dni,
      address: result.address,
      sublocality: result.sublocality,
      locality: result.locality,
      administrativeArea: result.administrativeArea,
      country: result.country,
      nationality: result.nationality,
      afpInstitutionId: result.afpInstitutionId,
      healthInstitutionId: result.healthInstitutionId,
      seniorityId: result.seniorityId,
      netSalary: result.netSalary?.toNumber() || null,
      currencyTypeId: result.currencyTypeId,
      jobTitleId: result.jobTitleId,
      fee: result.fee?.toNumber() || null,
      birth: result.birth,
      clientId: result.clientId,
      phone: result.phone,
      billableDay: result.billableDay?.toNumber() || null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      client: result.client,
      jobTitle: result.jobTitle,
      role: result.role,
      seniority: result.seniority,
      afpInstitution: result.afpInstitution,
      healthInstitution: result.healthInstitution,
      leaveDays: result.leaveDays,
    };
  }

  async create(data: Omit<Prisma.PeopleCreateInput, "leaveDays" | "preInvoiceDetails">): Promise<People> {
    const result = await prisma.people.create({
      data,
    });

    return {
      id: result.id,
      name: result.name,
      lastName: result.lastName,
      email: result.email,
      corporateEmail: result.corporateEmail,
      roleId: result.roleId,
      dni: result.dni,
      address: result.address,
      sublocality: result.sublocality,
      locality: result.locality,
      administrativeArea: result.administrativeArea,
      country: result.country,
      nationality: result.nationality,
      afpInstitutionId: result.afpInstitutionId,
      healthInstitutionId: result.healthInstitutionId,
      seniorityId: result.seniorityId,
      netSalary: result.netSalary?.toNumber() || null,
      currencyTypeId: result.currencyTypeId,
      jobTitleId: result.jobTitleId,
      fee: result.fee?.toNumber() || null,
      birth: result.birth,
      clientId: result.clientId,
      phone: result.phone,
      billableDay: result.billableDay?.toNumber() || null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: number, data: Prisma.PeopleUpdateInput): Promise<People> {
    const result = await prisma.people.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      name: result.name,
      lastName: result.lastName,
      email: result.email,
      corporateEmail: result.corporateEmail,
      roleId: result.roleId,
      dni: result.dni,
      address: result.address,
      sublocality: result.sublocality,
      locality: result.locality,
      administrativeArea: result.administrativeArea,
      country: result.country,
      nationality: result.nationality,
      afpInstitutionId: result.afpInstitutionId,
      healthInstitutionId: result.healthInstitutionId,
      seniorityId: result.seniorityId,
      netSalary: result.netSalary?.toNumber() || null,
      currencyTypeId: result.currencyTypeId,
      jobTitleId: result.jobTitleId,
      fee: result.fee?.toNumber() || null,
      birth: result.birth,
      clientId: result.clientId,
      phone: result.phone,
      billableDay: result.billableDay?.toNumber() || null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: number): Promise<People> {
    const result = await prisma.people.delete({
      where: { id },
    });

    return {
      id: result.id,
      name: result.name,
      lastName: result.lastName,
      email: result.email,
      corporateEmail: result.corporateEmail,
      roleId: result.roleId,
      dni: result.dni,
      address: result.address,
      sublocality: result.sublocality,
      locality: result.locality,
      administrativeArea: result.administrativeArea,
      country: result.country,
      nationality: result.nationality,
      afpInstitutionId: result.afpInstitutionId,
      healthInstitutionId: result.healthInstitutionId,
      seniorityId: result.seniorityId,
      netSalary: result.netSalary?.toNumber() || null,
      currencyTypeId: result.currencyTypeId,
      jobTitleId: result.jobTitleId,
      fee: result.fee?.toNumber() || null,
      birth: result.birth,
      clientId: result.clientId,
      phone: result.phone,
      billableDay: result.billableDay?.toNumber() || null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByName(name: string): Promise<People[]> {
    const result = await prisma.people.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return result.map((person) => ({
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      email: person.email,
      corporateEmail: person.corporateEmail,
      roleId: person.roleId,
      dni: person.dni,
      address: person.address,
      sublocality: person.sublocality,
      locality: person.locality,
      administrativeArea: person.administrativeArea,
      country: person.country,
      nationality: person.nationality,
      afpInstitutionId: person.afpInstitutionId,
      healthInstitutionId: person.healthInstitutionId,
      seniorityId: person.seniorityId,
      netSalary: person.netSalary?.toNumber() || null,
      currencyTypeId: person.currencyTypeId,
      jobTitleId: person.jobTitleId,
      fee: person.fee?.toNumber() || null,
      birth: person.birth,
      clientId: person.clientId,
      phone: person.phone,
      billableDay: person.billableDay?.toNumber() || null,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    }));
  }

  async findByClient(clientId: number): Promise<People[]> {
    const result = await prisma.people.findMany({
      where: {
        clientId,
      },
      include: {
        jobTitle: true,
        seniority: true,
      },
    });

    return result.map((person) => ({
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      email: person.email,
      corporateEmail: person.corporateEmail,
      roleId: person.roleId,
      dni: person.dni,
      address: person.address,
      sublocality: person.sublocality,
      locality: person.locality,
      administrativeArea: person.administrativeArea,
      country: person.country,
      nationality: person.nationality,
      afpInstitutionId: person.afpInstitutionId,
      healthInstitutionId: person.healthInstitutionId,
      seniorityId: person.seniorityId,
      netSalary: person.netSalary?.toNumber() || null,
      currencyTypeId: person.currencyTypeId,
      jobTitleId: person.jobTitleId,
      fee: person.fee?.toNumber() || null,
      birth: person.birth,
      clientId: person.clientId,
      phone: person.phone,
      billableDay: person.billableDay?.toNumber() || null,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    }));
  }

  async addLeaveDay(personId: number, data: Omit<Prisma.LeaveDaysCreateInput, "person">): Promise<LeaveDays> {
    return prisma.leaveDays.create({
      data: {
        ...data,
        person: {
          connect: { id: personId },
        },
      },
    });
  }
}
