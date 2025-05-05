import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type EnvVars = {
  DATABASE_URL: string | undefined;
  NODE_ENV: string | undefined;
  AZURE_ENV: string | undefined;
  AZURE_WEBSITE_NAME: string | undefined;
  AZURE_WEBSITE_INSTANCE_ID: string | undefined;
  DATABASE_URL_EXISTS: boolean;
  DATABASE_URL_LENGTH: number;
  DATABASE_URL_STARTS_WITH: string;
  PRISMA_CONNECTION?: string;
};

export async function GET() {
  try {
    // Intentar crear una instancia de Prisma para verificar la conexión
    const prisma = new PrismaClient();
    
    // Obtener información detallada del entorno
    const envVars: EnvVars = {
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      AZURE_ENV: process.env.AZURE_ENV,
      AZURE_WEBSITE_NAME: process.env.AZURE_WEBSITE_NAME,
      AZURE_WEBSITE_INSTANCE_ID: process.env.AZURE_WEBSITE_INSTANCE_ID,
      // Información adicional que puede ser útil
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL?.substring(0, 10) || 'no existe',
    };

    // Intentar una conexión simple con Prisma
    try {
      await prisma.$connect();
      envVars.PRISMA_CONNECTION = 'success';
    } catch (error) {
      envVars.PRISMA_CONNECTION = `error: ${error instanceof Error ? error.message : 'unknown error'}`;
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json(envVars);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error desconocido',
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    }, { status: 500 });
  }
} 