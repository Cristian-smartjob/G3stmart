import { prisma } from "../connection/prisma";

/**
 * Verifica si un nombre de tabla existe como modelo en Prisma
 * @param tableName Nombre de la tabla/modelo a verificar
 * @returns El cliente Prisma para ese modelo
 * @throws Error si el modelo no existe
 */
export function getModelFromTableName(tableName: string): unknown {
  const modelName = tableName.toLowerCase();

  const prismaAny = (prisma as unknown) as Record<string, unknown>;
  if (!prismaAny[modelName]) {
    throw new Error(`Model ${tableName} not found in Prisma schema`);
  }

  return prismaAny[modelName];
}

/**
 * Convierte nombres de campo de snake_case (SQL) a camelCase (Prisma)
 * @param fieldName Nombre del campo en snake_case
 * @returns Nombre del campo en camelCase
 */
export function snakeToCamelCase(fieldName: string): string {
  return fieldName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convierte nombres de campo de camelCase (Prisma) a snake_case (SQL)
 * @param fieldName Nombre del campo en camelCase
 * @returns Nombre del campo en snake_case
 */
export function camelToSnakeCase(fieldName: string): string {
  return fieldName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
