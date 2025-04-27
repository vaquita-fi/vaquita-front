import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Goal } from "@/types/Goal"; // Opcional: si tienes el tipo definido

export async function DELETE(req: Request) {
  try {
    const { address, goalId } = await req.json();

    if (!address || !goalId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const goal = await db.collection<Goal>("goals").findOne({ address, goalId });

    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    if (goal.depositedAmount > 0) {
      return NextResponse.json({ success: false, error: "Cannot cancel goal with remaining funds" }, { status: 400 });
    }

    const anyDepositActive = goal.deposits?.some((deposit) => !deposit.withdrawn);
    if (anyDepositActive) {
      return NextResponse.json({ success: false, error: "Cannot cancel goal with active deposits" }, { status: 400 });
    }

    const result = await db.collection("goals").updateOne(
      { address, goalId },
      { $set: { status: "cancelled" } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: "Goal update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Goal cancelled successfully" });
  } catch (error) {
    console.error("[CANCEL_GOAL_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
