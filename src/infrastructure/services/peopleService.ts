import { peopleRepository } from "../database/repositories";
import type { People, LeaveDays, Client, JobTitle, Role, Seniority, AFPInstitution, HealthInstitution } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class PeopleService {
  async getAllPeople(): Promise<People[]> {
    return peopleRepository.findAll();
  }

  async getPersonById(id: number): Promise<(People & {
    client: Client | null;
    jobTitle: JobTitle | null;
    role: Role | null;
    seniority: Seniority | null;
    afpInstitution: AFPInstitution | null;
    healthInstitution: HealthInstitution | null;
    leaveDays: LeaveDays[];
  }) | null> {
    return peopleRepository.findById(id);
  }

  async createPerson(personData: {
    name: string;
    lastName: string;
    email?: string;
    corporateEmail?: string;
    roleId?: number;
    dni?: string;
    address?: string;
    sublocality?: string;
    locality?: string;
    administrativeArea?: string;
    country?: string;
    nationality?: string;
    afpInstitutionId?: number;
    healthInstitutionId?: number;
    seniorityId?: number;
    netSalary?: number;
    currencyTypeId?: number;
    jobTitleId?: number;
    fee?: number;
    birth?: Date;
    clientId?: number;
    phone?: string;
    billableDay?: number;
  }): Promise<People> {
    const data: Prisma.PeopleCreateInput = {
      name: personData.name,
      lastName: personData.lastName,
    };

    if (personData.email !== undefined) data.email = personData.email;
    if (personData.corporateEmail !== undefined) data.corporateEmail = personData.corporateEmail;
    if (personData.dni !== undefined) data.dni = personData.dni;
    if (personData.address !== undefined) data.address = personData.address;
    if (personData.sublocality !== undefined) data.sublocality = personData.sublocality;
    if (personData.locality !== undefined) data.locality = personData.locality;
    if (personData.administrativeArea !== undefined) data.administrativeArea = personData.administrativeArea;
    if (personData.country !== undefined) data.country = personData.country;
    if (personData.nationality !== undefined) data.nationality = personData.nationality;
    if (personData.netSalary !== undefined) data.netSalary = personData.netSalary;
    if (personData.fee !== undefined) data.fee = Boolean(personData.fee);
    if (personData.birth !== undefined) data.birth = personData.birth;
    if (personData.phone !== undefined) data.phone = personData.phone;
    if (personData.billableDay !== undefined) data.billableDay = personData.billableDay;

    if (personData.roleId) {
      data.role = { connect: { id: personData.roleId } };
    }
    if (personData.afpInstitutionId) {
      data.afpInstitution = { connect: { id: personData.afpInstitutionId } };
    }
    if (personData.healthInstitutionId) {
      data.healthInstitution = { connect: { id: personData.healthInstitutionId } };
    }
    if (personData.seniorityId) {
      data.seniority = { connect: { id: personData.seniorityId } };
    }
    if (personData.currencyTypeId) {
      data.feeCurrencyType = { connect: { id: personData.currencyTypeId } };
    }
    if (personData.jobTitleId) {
      data.jobTitle = { connect: { id: personData.jobTitleId } };
    }
    if (personData.clientId) {
      data.client = { connect: { id: personData.clientId } };
    }

    return peopleRepository.create(data);
  }

  async updatePerson(
    id: number,
    personData: Partial<{
      name: string;
      lastName: string;
      email?: string;
      corporateEmail?: string;
      roleId?: number;
      dni?: string;
      address?: string;
      sublocality?: string;
      locality?: string;
      administrativeArea?: string;
      country?: string;
      nationality?: string;
      afpInstitutionId?: number;
      healthInstitutionId?: number;
      seniorityId?: number;
      netSalary?: number;
      currencyTypeId?: number;
      jobTitleId?: number;
      fee?: number;
      birth?: Date;
      clientId?: number;
      phone?: string;
      billableDay?: number;
    }>
  ): Promise<People> {
    const data: Prisma.PeopleUpdateInput = {};

    if (personData.name !== undefined) data.name = personData.name;
    if (personData.lastName !== undefined) data.lastName = personData.lastName;
    if (personData.email !== undefined) data.email = personData.email;
    if (personData.corporateEmail !== undefined) data.corporateEmail = personData.corporateEmail;
    if (personData.dni !== undefined) data.dni = personData.dni;
    if (personData.address !== undefined) data.address = personData.address;
    if (personData.sublocality !== undefined) data.sublocality = personData.sublocality;
    if (personData.locality !== undefined) data.locality = personData.locality;
    if (personData.administrativeArea !== undefined) data.administrativeArea = personData.administrativeArea;
    if (personData.country !== undefined) data.country = personData.country;
    if (personData.nationality !== undefined) data.nationality = personData.nationality;
    if (personData.netSalary !== undefined) data.netSalary = personData.netSalary;
    if (personData.fee !== undefined) data.fee = Boolean(personData.fee);
    if (personData.birth !== undefined) data.birth = personData.birth;
    if (personData.phone !== undefined) data.phone = personData.phone;
    if (personData.billableDay !== undefined) data.billableDay = personData.billableDay;

    if (personData.roleId !== undefined) {
      data.role = personData.roleId ? { connect: { id: personData.roleId } } : { disconnect: true };
    }
    if (personData.afpInstitutionId !== undefined) {
      data.afpInstitution = personData.afpInstitutionId
        ? { connect: { id: personData.afpInstitutionId } }
        : { disconnect: true };
    }
    if (personData.healthInstitutionId !== undefined) {
      data.healthInstitution = personData.healthInstitutionId
        ? { connect: { id: personData.healthInstitutionId } }
        : { disconnect: true };
    }
    if (personData.seniorityId !== undefined) {
      data.seniority = personData.seniorityId ? { connect: { id: personData.seniorityId } } : { disconnect: true };
    }
    if (personData.currencyTypeId !== undefined) {
      data.feeCurrencyType = personData.currencyTypeId
        ? { connect: { id: personData.currencyTypeId } }
        : { disconnect: true };
    }
    if (personData.jobTitleId !== undefined) {
      data.jobTitle = personData.jobTitleId ? { connect: { id: personData.jobTitleId } } : { disconnect: true };
    }
    if (personData.clientId !== undefined) {
      data.client = personData.clientId ? { connect: { id: personData.clientId } } : { disconnect: true };
    }

    return peopleRepository.update(id, data);
  }

  async deletePerson(id: number): Promise<People> {
    return peopleRepository.delete(id);
  }

  async searchPeopleByName(name: string): Promise<People[]> {
    return peopleRepository.findByName(name);
  }

  async getPeopleByClient(clientId: number): Promise<People[]> {
    return peopleRepository.findByClient(clientId);
  }

  async addLeaveDay(
    personId: number,
    leaveDayData: {
      startDate: Date;
      endDate: Date;
      reason?: string;
    }
  ): Promise<LeaveDays> {
    return peopleRepository.addLeaveDay(personId, leaveDayData);
  }
}
