"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useGoal } from "@/hooks/goals/useGoal";
import { useParams, useRouter } from "next/navigation";
import SavingDashboard from "@/components/ui/SavingDashboard";
import GoalSelectorModal from "@/components/ui/GoalSelectorModal";
import { useDisclosure } from "@heroui/react";
import { useGoals } from "@/hooks/goals/useGoals";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function SavingGroupPage() {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const { goalId } = useParams() as { goalId: string };
  const { data: goal, isLoading, isError } = useGoal(address || "", goalId);
  const router = useRouter();
  const {
    data: goals = [],
    isLoading: isLoadingGoals,
    isError: isErrorGoals,
  } = useGoals(address || "");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleSelectGoal = (goalId: string) => {
    router.push(`/saving/${goalId}`);
    onOpenChange();
  };

  const handleCreateGoal = () => {
    router.push("/saving/new");
    onOpenChange();
  };

  if (isLoading || isLoadingGoals || !goal) {
    return <LoadingScreen message="Loading your worlds..." />;
  }
  if (isError || !goal || isErrorGoals) {
    return <div>Error loading goal.</div>;
  }

  return (
    <>
      <SavingDashboard goalId={goalId} onOpenGoalModal={onOpen} />
      <GoalSelectorModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        goals={goals}
        onSelectGoal={handleSelectGoal}
        onCreateGoal={handleCreateGoal}
      />
    </>
  );
}
