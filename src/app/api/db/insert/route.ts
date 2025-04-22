import { NextResponse } from "next/server";
import { executeInsert } from "@/lib/dbServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, data } = body;

    if (!table) {
      return NextResponse.json({ error: "Table is required" }, { status: 400 });
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    const result = await executeInsert(table, data);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error in insert API route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
