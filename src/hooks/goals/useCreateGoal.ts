"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoal } from "@/services/goalService";
import { GoalType } from "@/types/Goal";

export function useCreateGoal(address: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, targetAmount, durationDays, type }: { name: string; targetAmount: number; durationDays: number; type: GoalType }) =>
      createGoal(address, targetAmount, durationDays, name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", address] });
    },
  });
}
