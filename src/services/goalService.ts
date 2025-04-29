"use client";

import { Goal } from "@/types/Goal";
import { fetcher } from "@/utils/fetcher";

export const createGoal = (address: string, targetAmount: number, durationDays: number, name: string) =>
  fetcher<{ goalId: string }>("/api/create-goal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, targetAmount, durationDays, name }),
  });

export const depositToGoal = (address: string, goalId: string, amount: number) =>
  fetcher<{ depositId: string }>("/api/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, goalId, amount }),
  });

export const withdrawFromGoal = (address: string, goalId: string, depositId?: string) =>
  fetcher("/api/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, goalId, depositId }),
  });

export const getGoals = (address: string) =>
  fetcher<{ goals: Goal[] }>(`/api/get-goals?address=${address}`).then(res => res.goals || []);