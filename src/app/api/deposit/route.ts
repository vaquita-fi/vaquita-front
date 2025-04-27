import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { Deposit, Goal } from "@/types/Goal";

export async function POST(req: Request) {
  try {
    const { address, goalId, amount } = await req.json();

    if (!address || !goalId || !amount) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const goal = await db.collection<Goal>("goals").findOne({ address, goalId });

    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    const depositId = uuidv4();
    const newDeposit: Deposit = {
      depositId,
      amount,
      timestamp: new Date(),
      withdrawn: false,
    };

    // Update goal cleanly
    await db.collection<Goal>("goals").updateOne(
      { address, goalId },
      {
        $push: { deposits: newDeposit },
        $inc: { depositedAmount: amount },
      }
    );

    return NextResponse.json({ success: true, depositId });
  } catch (error) {
    console.error("[DEPOSIT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
