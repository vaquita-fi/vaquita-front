import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { address, targetAmount, durationDays, name } = await req.json();

    if (!address || !targetAmount || !durationDays || !name) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const goalId = uuidv4();
    const createdAt = new Date();

    const newGoal = {
      goalId,
      address,
      targetAmount,
      durationDays,
      name,
      depositedAmount: 0,
      progressPercent: 0,
      status: "active",
      createdAt,
      deposits: [],
      interestsAccumulated: 0
    };

    await db.collection("goals").insertOne(newGoal);

    return NextResponse.json({ success: true, goalId });
  } catch (error) {
    console.error("[CREATE_GOAL_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
