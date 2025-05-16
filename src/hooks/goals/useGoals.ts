import { useEffect, useState } from "react";
import { Goal } from "@/types/Goal";

interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/goals");
      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        return;
      }

      const fetchedGoals: Goal[] = data.goals;
      setGoals(fetchedGoals);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to fetch goals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, isLoading, error };
};
