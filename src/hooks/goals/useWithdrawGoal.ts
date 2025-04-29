"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawFromGoal } from "@/services/goalService";

export function useWithdrawGoal(address: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, depositId }: { goalId: string; depositId?: string }) =>
      withdrawFromGoal(address, goalId, depositId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goal", address, variables.goalId] });
      queryClient.invalidateQueries({ queryKey: ["goals", address] });
    },
  });
}
