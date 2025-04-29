"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { depositToGoal } from "@/services/goalService";

export function useDepositGoal(address: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string; amount: number }) =>
      depositToGoal(address, goalId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goal", address, variables.goalId] });
      queryClient.invalidateQueries({ queryKey: ["goals", address] });
    },
  });
}
