import { useQuery } from "@tanstack/react-query";
import { useRead } from "./useRead";
import { useCallback } from "react";

// TVL
export function useTVL() {
  const { getTVL } = useRead();
  return useQuery({
    queryKey: ["tvl"],
    queryFn: getTVL,
  });
}

// Accrued Interest
export function useAccruedInterest() {
  const { getAccruedInterest } = useRead();
  return useQuery({
    queryKey: ["accruedInterest"],
    queryFn: getAccruedInterest,
  });
}

// Number of Users
export function useNumberOfUsers() {
  const getNumberOfUsers = useCallback(async () => {
    const count = await fetch(`/api/count-users`);
    const countData = await count.json();
    return countData.count;
  }, []);
  return useQuery({
    queryKey: ["numberOfUsers"],
    queryFn: getNumberOfUsers,
  });
} 