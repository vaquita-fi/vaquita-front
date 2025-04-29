"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { useGoal } from "./useGoal"; // tu hook actual
import {  GoalType } from "@/types/Goal";
import { VaquitaData } from "@/types/Vaquita";
import { depositToGoal, withdrawFromGoal } from "@/services/goalService";

export function useGoalDetails(goalId: string) {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const queryClient = useQueryClient();

  const { data: goal, isLoading, isError } = useGoal(address || "", goalId);

  const cows: VaquitaData[] =
    goal?.deposits.map((deposit) => ({
      id: deposit.depositId,
      position: { x: 8, y: -0.3, z: 8 },
      createdAt: new Date(deposit.timestamp),
      amount: deposit.amount.toString(),
      state: "walking",
      status: deposit.withdrawn ? "inactive" : "active",
    })) || [];

  const totalSaved = goal?.depositedAmount ?? 0;
  const totalCows = cows.filter((c) => c.status === "active").length;
  const targetAmount = goal?.targetAmount ?? 0;
  const goalType: GoalType = goal?.type ?? "airplane";

  const depositMutation = useMutation({
    mutationFn: (amount: number) =>
      depositToGoal(address || "", goalId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal", address, goalId] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (depositId: string) =>
      withdrawFromGoal(address || "", goalId, depositId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal", address, goalId] });
    },
  });

  const handleDeposit = async (amount: number) => {
    await depositMutation.mutateAsync(amount);
  };

  const withdrawVaquita = async (depositId: string) => {
    await withdrawMutation.mutateAsync(depositId);
  };

  return {
    goal,
    cows,
    totalSaved,
    totalCows,
    targetAmount,
    goalType,
    isLoading,
    isError,
    handleDeposit,
    withdrawVaquita,
  };
}
