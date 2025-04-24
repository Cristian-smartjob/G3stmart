import { prisma } from "../connection/prisma";
import type { Prisma, Role } from "@prisma/client";
import { BaseRepository } from "./baseRepository";

/**
 * Repository for Role entity
 */
export class RoleRepository extends BaseRepository<Role, number, Prisma.RoleCreateInput, Prisma.RoleUpdateInput> {
  protected getModel() {
    return prisma.role;
  }

  protected getModelName(): string {
    return "role";
  }

  /**
   * Find roles by name (case insensitive)
   */
  async findByName(name: string): Promise<Role[]> {
    return prisma.role.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }

  /**
   * Get count of people assigned to a role
   */
  async getPeopleCount(roleId: number): Promise<number> {
    return prisma.people.count({
      where: {
        roleId,
      },
    });
  }

  /**
   * Get all roles with people count
   */
  async findAllWithPeopleCount(): Promise<(Role & { peopleCount: number })[]> {
    const roles = await prisma.role.findMany();

    const rolesWithCount = await Promise.all(
      roles.map(async (role: Role) => {
        const peopleCount = await this.getPeopleCount(role.id);
        return {
          ...role,
          peopleCount,
        };
      })
    );

    return rolesWithCount;
  }
}
