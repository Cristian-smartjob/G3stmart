/*import { FilterCondition } from "@/infrastructure/database/types/database.types";
import { NextResponse } from "next/server";
import { executeUpdate } from "@/infrastructure/database/operations/update";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, data, conditions } = body;

    if (!table) {
      return NextResponse.json({ error: "Table is required" }, { status: 400 });
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    if (!conditions || conditions.length === 0) {
      return NextResponse.json({ error: "At least one condition is required for updates" }, { status: 400 });
    }

    const result = await executeUpdate(table, data, conditions as FilterCondition[]);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error in update API route:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
*/