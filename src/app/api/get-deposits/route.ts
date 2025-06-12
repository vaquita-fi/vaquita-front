import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Deposit } from "@/types/Goal";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ success: false, error: "Address is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("vaquita");

    const deposits = await db.collection<Deposit>("deposits").find({ address }).toArray();

    return NextResponse.json({ success: true, deposits });
  } catch (error) {
    console.error("[GET_DEPOSITS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
