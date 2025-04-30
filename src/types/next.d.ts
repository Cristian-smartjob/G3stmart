import { NextRequest, NextResponse } from 'next/server';

declare module 'next/server' {
  interface NextApiRoute {
    (request: NextRequest, context: { params: { [key: string]: string } }): Promise<NextResponse>;
  }
} 