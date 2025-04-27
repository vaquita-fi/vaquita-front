import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { address, goalId } = await req.json();

    if (!address || !goalId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const goal = await db.collection("goals").findOne({ address, goalId });

    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    const { depositedAmount, targetAmount } = goal;

    const newProgressPercent = Math.min(
      Math.round((depositedAmount / targetAmount) * 100),
      100
    );

    await db.collection("goals").updateOne(
      { address, goalId },
      { $set: { progressPercent: newProgressPercent } }
    );

    return NextResponse.json({ success: true, progressPercent: newProgressPercent });
  } catch (error) {
    console.error("[UPDATE_PROGRESS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
