import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Deposit } from "@/types/Goal";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("vaquita");

    const count = await db.collection<Deposit>("deposits").distinct("address").then(addresses => addresses.length);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("[COUNT_USERS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
