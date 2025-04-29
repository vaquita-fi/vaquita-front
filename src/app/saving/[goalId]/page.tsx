"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useGoal } from "@/hooks/goals/useGoal";
import { useParams } from "next/navigation";
import SavingDashboard from "@/components/ui/SavingDashboard";

export default function SavingGroupPage() {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const { goalId } = useParams() as { goalId: string };

  const { data: goal, isLoading, isError } = useGoal(address || "", goalId);
  if (isLoading) {
    return <div>Cargando objetivo...</div>;
  }
  if (isError || !goal) {
    return <div>Error cargando objetivo.</div>;
  }

  return <SavingDashboard goalId={goalId} />;
}
