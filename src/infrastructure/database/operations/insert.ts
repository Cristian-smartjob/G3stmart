import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function executeInsert(
  table: string,
  data: Record<string, string | number | boolean>
) {
  try {
    // @ts-expect-error - Dynamic table access
    const result = await prisma[table].create({
      data,
    });
    return { data: result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error executing insert" };
  }
} 