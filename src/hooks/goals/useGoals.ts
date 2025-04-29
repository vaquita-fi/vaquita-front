"use client";

import { useQuery } from "@tanstack/react-query";
import { Goal } from "@/types/Goal";
import { getGoals } from "@/services/goalService";

export function useGoals(address: string) {
  return useQuery<Goal[]>({
    queryKey: ["goals", address],
    queryFn: () => getGoals(address),
    enabled: !!address,
  });
}
