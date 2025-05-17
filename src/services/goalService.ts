"use client";

import { Goal, GoalType } from "@/types/Goal";
import { fetcher } from "@/utils/fetcher";

export const createGoal = (address: string, targetAmount: number, durationDays: number, name: string, type: GoalType) =>
  fetcher<{ goalId: string }>("/api/create-goal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, targetAmount, durationDays, name, type }),
  });

export const depositToGoal = (address: string, goalId: string, amount: number, depositId: string) =>
  fetcher<{ depositId: string }>("/api/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, goalId, amount, depositId }),
  });

export const withdrawFromGoal = (address: string, goalId: string, depositId?: string) =>
  fetcher("/api/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, goalId, depositId }),
  });

export const getGoals = (address: string) =>
  fetcher<{ goals: Goal[] }>(`/api/get-goals?address=${address}`).then(res => res.goals || []);

export const fetchGoals = async () => {
  try {
    const res = await fetch("/api/goals");
    const data = await res.json();
    console.log("All Goals:", data.goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
  }
};

