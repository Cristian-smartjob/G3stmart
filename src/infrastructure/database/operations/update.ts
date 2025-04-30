import { FilterCondition } from "../types/database.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function executeUpdate(
  table: string,
  data: Record<string, string | number | boolean>,
  conditions: FilterCondition[]
) {
  try {
    const where = conditions.reduce((acc, condition) => {
      return { ...acc, [condition.column]: condition.value };
    }, {});

    // @ts-expect-error - Dynamic table access
    const result = await prisma[table].updateMany({
      where,
      data,
    });

    return { data: result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error executing update" };
  }
} 