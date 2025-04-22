import { roleRepository } from "../database/repositories";
import type { Role } from "../database/prisma";
import type { Prisma } from "../database/prisma";

export class RoleService {
  async getAllRoles(): Promise<Role[]> {
    return roleRepository.findAll();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return roleRepository.findById(id);
  }

  async createRole(roleData: { name: string }): Promise<Role> {
    const data: Prisma.RoleCreateInput = {
      name: roleData.name,
    };

    return roleRepository.create(data);
  }

  async updateRole(
    id: number,
    roleData: {
      name: string;
    }
  ): Promise<Role> {
    const data: Prisma.RoleUpdateInput = {
      name: roleData.name,
    };

    return roleRepository.update(id, data);
  }

  async deleteRole(id: number): Promise<Role> {
    return roleRepository.delete(id);
  }

  async searchRolesByName(name: string): Promise<Role[]> {
    return roleRepository.findByName(name);
  }

  async getRolesWithPeopleCount(): Promise<(Role & { peopleCount: number })[]> {
    return roleRepository.findAllWithPeopleCount();
  }

  async getPeopleCountByRole(roleId: number): Promise<number> {
    return roleRepository.getPeopleCount(roleId);
  }
}
