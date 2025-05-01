import { prisma } from "../../connection/prisma";
import { snakeToCamelCase } from "../../utils/prismaUtils";

interface FilterCondition {
  column: string;
  operator: string;
  value: string | number | boolean | unknown[];
}

interface DynamicPrismaModel {
  findMany: (args: { where?: Record<string, unknown>; select?: Record<string, boolean> }) => Promise<unknown[]>;
  findUnique: (args: { where: { id: number } }) => Promise<unknown | null>;
  create: (args: { data: unknown }) => Promise<unknown>;
  update: (args: { where: { id: number }; data: unknown }) => Promise<unknown>;
  delete: (args: { where: { id: number } }) => Promise<unknown>;
}

export class GenericRepository<T> {
  protected tableName: string;
  protected modelName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.modelName = tableName.toLowerCase();
  }

  protected conditionsToPrismaWhere(conditions: FilterCondition[] = []): Record<string, unknown> {
    if (conditions.length === 0) return {};

    const where: Record<string, unknown> = {};

    conditions.forEach((condition) => {
      const column = snakeToCamelCase(condition.column);
      const { operator, value } = condition;

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
        case "IN":
          where[column] = { in: value as unknown[] };
          break;
        case "NOT IN":
          where[column] = { notIn: value as unknown[] };
          break;
        case "IS NULL":
          where[column] = null;
          break;
        case "IS NOT NULL":
          where[column] = { not: null };
          break;
        default:
          console.warn(`Operator ${operator} may not be fully supported in Prisma conversion`);
          where[column] = value;
      }
    });

    return where;
  }

  protected getModel(): DynamicPrismaModel {
    const prismaAny = (prisma as unknown) as Record<string, unknown>;

    if (!prismaAny[this.modelName]) {
      throw new Error(`Model ${this.tableName} not found in Prisma schema`);
    }

    return prismaAny[this.modelName] as unknown as DynamicPrismaModel;
  }

  async find(columns: string = "*", conditions: FilterCondition[] = []): Promise<T[]> {
    const where = this.conditionsToPrismaWhere(conditions);

    // Si columns es "*", obtenemos todos los campos
    // De lo contrario, parseamos la lista de columnas
    let select: Record<string, boolean> | undefined;

    if (columns !== "*") {
      select = {};
      columns.split(",").forEach((col) => {
        const trimmedCol = snakeToCamelCase(col.trim());
        if (trimmedCol) {
          select![trimmedCol] = true;
        }
      });
    }

    const model = this.getModel();

    const result = await model.findMany({
      where,
      ...(select ? { select } : {}),
    });

    return result as T[];
  }

  async findById(id: number): Promise<T | null> {
    const model = this.getModel();

    const result = await model.findUnique({
      where: { id },
    });

    return result as T | null;
  }

  async create(data: Partial<T>): Promise<T> {
    const model = this.getModel();

    const result = await model.create({
      data: data as unknown,
    });

    return result as T;
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const model = this.getModel();

    const result = await model.update({
      where: { id },
      data: data as unknown,
    });

    return result as T;
  }

  async delete(id: number): Promise<boolean> {
    try {
      const model = this.getModel();

      await model.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      return false;
    }
  }
}
