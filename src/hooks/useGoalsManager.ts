"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Goal } from "@/types/Goal";

export function useGoalsManager(walletAddress: string) {
  const queryClient = useQueryClient();

  const [rewardsUnlocked, setRewardsUnlocked] = useState<
    { milestone: number; rewardAmount: number }[]
  >([]);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const { data: goals = [], refetch: refetchGoals, isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["goals", walletAddress],
    queryFn: async () => {
      const res = await fetch(`/api/get-goals?address=${walletAddress}`);
      const data = await res.json();
      return (data.goals || []).filter((goal: Goal) => goal.status === "active");
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async ({ name, amount, duration }: { name: string; amount: number; duration: number }) => {
      await fetch("/api/create-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          name,
          targetAmount: amount,
          durationDays: duration,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", walletAddress] });
    },
  });

  const depositMutation = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, goalId, amount }),
      });
    },
    onSuccess: (_, { goalId }) => {
      updateProgress(goalId);
    },
  });

  const withdrawAllMutation = useMutation({
    mutationFn: async (goalId: string) => {
      await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, goalId }),
      });
    },
    onSuccess: (_, goalId) => {
      updateProgress(goalId);
    },
  });

  const withdrawDepositMutation = useMutation({
    mutationFn: async ({ goalId, depositId }: { goalId: string; depositId: string }) => {
      await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, goalId, depositId }),
      });
    },
    onSuccess: (_, { goalId }) => {
      updateProgress(goalId);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      await fetch("/api/delete-goal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, goalId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", walletAddress] });
    },
  });

  const updateProgress = async (goalId: string) => {
    await fetch("/api/update-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: walletAddress, goalId }),
    });
    queryClient.invalidateQueries({ queryKey: ["goals", walletAddress] });
    await checkRewards(goalId);
  };

  const checkRewards = async (goalId: string) => {
    const res = await fetch("/api/calculate-rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: walletAddress, goalId }),
    });
    const data = await res.json();
    if (data.success && data.rewards.length > 0) {
      setRewardsUnlocked(data.rewards);
      setRewardModalOpen(true);
    }
  };

  return {
    goals,
    goalsLoading,
    rewardsUnlocked,
    rewardModalOpen,
    setRewardModalOpen,
    fetchGoals: refetchGoals,
    createGoal: createGoalMutation.mutate,
    deposit: depositMutation.mutate,
    withdrawAll: withdrawAllMutation.mutate,
    withdrawDeposit: withdrawDepositMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    updateProgress,
  };
}
