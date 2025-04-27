import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Goal } from "@/types/Goal";

export async function POST(req: Request) {
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

    const progress = goal.progressPercent;
    const rewardsClaimed = goal.rewardsClaimed || { "25": false, "50": false, "75": false, "100": false };
    const rewardsToGive: { milestone: number; rewardAmount: number }[] = [];

    const interest = goal.interestsAccumulated;
    const milestones = [25, 50, 75, 100];
    for (const milestone of milestones) {
      const milestoneKey = milestone.toString() as keyof typeof rewardsClaimed;
      if (progress >= milestone && !rewardsClaimed[milestoneKey]) {
        // Calculamos reward proporcional al hito
        const rawReward = interest * (milestone / 100);
        const rewardAmount = rawReward > 0 ? Math.max(rawReward, 0.01) : 0;
        
        console.log(rewardAmount)

        rewardsToGive.push({ milestone, rewardAmount });
        rewardsClaimed[milestoneKey] = true; // Marcar como reclamado
      }
    }

    await db.collection("goals").updateOne(
      { address, goalId },
      { $set: { rewardsClaimed } }
    );

    return NextResponse.json({ success: true, rewards: rewardsToGive });
  } catch (error) {
    console.error("[CALCULATE_REWARDS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
