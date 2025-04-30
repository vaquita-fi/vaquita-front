"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useGoals } from "@/hooks/goals/useGoals";
import { useDisclosure } from "@heroui/react";
import GoalSelectorModal from "@/components/ui/GoalSelectorModal";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Page() {
  const { user, ready } = usePrivy();
  const address = user?.wallet?.address;
  const { data: goals = [], isLoading, isError } = useGoals(address || "");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (address) {
      onOpen();
    }
  }, [address, onOpen]);

  const handleSelectGoal = (goalId: string) => {
    router.push(`/saving/${goalId}`);
    onOpenChange();
  };

  const handleCreateGoal = () => {
    router.push("/saving/new");
    onOpenChange();
  };

  if (!ready) {
    return <LoadingScreen message="Preparing your session..." />;
  }

  if (!address) {
    return (
      <LoadingScreen message="Connect your wallet to view your saving worlds." />
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Loading your worlds..." />;
  }

  if (isError) {
    return <LoadingScreen message="Error loading your saving worlds." />;
  }

  return (
    <GoalSelectorModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      goals={goals}
      onSelectGoal={handleSelectGoal}
      onCreateGoal={handleCreateGoal}
      hideCloseButton={true}
    />
  );
}
