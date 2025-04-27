import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Goal } from "@/types/Goal";

export async function POST(req: Request) {
  try {
    const { address, goalId, depositId } = await req.json();

    if (!address || !goalId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const goal = await db.collection<Goal>("goals").findOne({ address, goalId });

    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    if (depositId) {
      const deposit = goal.deposits.find((d) => d.depositId === depositId);

      if (!deposit || deposit.withdrawn) {
        return NextResponse.json({ success: false, error: "Deposit not found or already withdrawn" }, { status: 400 });
      }

      await db.collection("goals").updateOne(
        { address, goalId, "deposits.depositId": depositId },
        {
          $set: {
            "deposits.$.withdrawn": true,
          },
          $inc: {
            depositedAmount: -deposit.amount,
          },
        }
      );

      return NextResponse.json({ success: true, message: "Deposit withdrawn successfully" });
    } else {
      const withdrawableDeposits = goal.deposits.filter((d) => !d.withdrawn);

      if (withdrawableDeposits.length === 0) {
        return NextResponse.json({ success: false, error: "No deposits available to withdraw" }, { status: 400 });
      }

      const totalAmount = withdrawableDeposits.reduce((sum, d) => sum + d.amount, 0);

      await db.collection("goals").updateOne(
        { address, goalId },
        {
          $set: {
            "deposits.$[].withdrawn": true,
          },
          $inc: {
            depositedAmount: -totalAmount,
          },
        }
      );

      return NextResponse.json({ success: true, message: "All deposits withdrawn successfully" });
    }
  } catch (error) {
    console.error("[WITHDRAW_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
