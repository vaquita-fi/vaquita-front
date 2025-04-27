import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("vaquita");

    // Prueba simple: contar documentos en la colección "goals"
    const goalsCount = await db.collection("goals").countDocuments();

    return NextResponse.json({
      success: true,
      message: `Connected successfully. Goals in DB: ${goalsCount}`,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({
      success: false,
      error: "MongoDB connection failed",
    }, { status: 500 });
  }
}
