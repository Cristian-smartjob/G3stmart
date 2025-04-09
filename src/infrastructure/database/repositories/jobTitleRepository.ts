import { prisma } from "../connection/prisma";
import type { Prisma } from "../prisma/index";
import type { JobTitle } from "../prisma/index";

export class JobTitleRepository {
  async findAll(): Promise<JobTitle[]> {
    return prisma.jobTitle.findMany();
  }

  async findById(id: number): Promise<JobTitle | null> {
    return prisma.jobTitle.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.JobTitleCreateInput): Promise<JobTitle> {
    return prisma.jobTitle.create({
      data,
    });
  }

  async update(id: number, data: Prisma.JobTitleUpdateInput): Promise<JobTitle> {
    return prisma.jobTitle.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<JobTitle> {
    return prisma.jobTitle.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<JobTitle[]> {
    return prisma.jobTitle.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }

  async getPeopleCount(jobTitleId: number): Promise<number> {
    return prisma.people.count({
      where: {
        jobTitleId,
      },
    });
  }
}
