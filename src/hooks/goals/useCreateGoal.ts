"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGoal } from "@/services/goalService";

export function useCreateGoal(address: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, targetAmount, durationDays }: { name: string; targetAmount: number; durationDays: number }) =>
      createGoal(address, targetAmount, durationDays, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", address] });
    },
  });
}
