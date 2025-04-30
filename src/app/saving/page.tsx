"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useGoals } from "@/hooks/goals/useGoals";
import { useDisclosure } from "@heroui/react";
import GoalSelectorModal from "@/components/ui/GoalSelectorModal";
import Image from "next/image";

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

  const LoadingScreen = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-center h-dvh">
      <Image src="/loading.svg" alt="Loading" width={300} height={300} />
      <p className="text-lg text-gray-600 ">{message}</p>
    </div>
  );

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
