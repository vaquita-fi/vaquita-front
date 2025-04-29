"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { Goal } from "@/types/Goal";

export function useGoal(address: string, goalId: string) {
  return useQuery<Goal>({
    queryKey: ["goal", address, goalId],
    queryFn: async () => {
      const res = await fetcher<{ goal: Goal }>(`/api/get-goal?address=${address}&goalId=${goalId}`);
      return res.goal;
    },
    enabled: !!address && !!goalId,
  });
}
