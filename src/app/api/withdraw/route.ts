import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Deposit } from "@/types/Goal";

export async function POST(req: Request) {
  try {
    const { depositId } = await req.json();
    console.log("Deposit ID:", depositId);
    if (!depositId) {
      return NextResponse.json({ success: false, error: "Deposit ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const deposit = await db.collection<Deposit>("deposits").findOne({ depositId });

    if (!deposit) {
      return NextResponse.json({ success: false, error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.withdrawn) {
      return NextResponse.json({ success: false, error: "Deposit already withdrawn" }, { status: 400 });
    }

    await db.collection("deposits").updateOne(
      { depositId },
      { $set: { withdrawn: true } }
    );

    return NextResponse.json({ success: true, message: "Deposit withdrawn successfully" });
  } catch (error) {
    console.error("[WITHDRAW_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
