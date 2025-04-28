import type {
  People,
  JobTitle,
  Client as ClientModel,
  Role,
  AFPInstitution,
  HealthInstitution,
  Seniority,
  CurrencyType,
  TechnicalsStacks,
} from "@prisma/client";

export type PeopleWithAllRelations = People & {
  jobTitle: JobTitle | null;
  client: ClientModel | null;
  role: Role | null;
  afpInstitution: AFPInstitution | null;
  healthInstitution: HealthInstitution | null;
  seniority: Seniority | null;
  salaryCurrencyType: CurrencyType | null;
  feeCurrencyType: CurrencyType | null;
  laptopCurrencyType: CurrencyType | null;
  technicalStacks: TechnicalsStacks | null;
};
