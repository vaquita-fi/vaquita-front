import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Goal } from "@/types/Goal";


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("vaquita");

    // Fetch all goals
    const goals = await db.collection<Goal>("goals").find().toArray();

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error("[GET_GOALS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
