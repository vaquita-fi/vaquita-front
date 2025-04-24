import { useMemo } from "react";
import { GoalProgressStage } from "@/types/Goal";

interface UseGoalProgressProps {
  totalSaved: number;
  goalTarget: number;
}

export const useGoalProgress = ({
  totalSaved,
  goalTarget,
}: UseGoalProgressProps) => {
  const percentage = useMemo(() => {
    if (goalTarget === 0) return 0;
    return Math.floor(Math.min((totalSaved / goalTarget) * 100, 100));
  }, [totalSaved, goalTarget]);
  const stage: GoalProgressStage = useMemo(() => {
    if (percentage === 100) return "complete";
    if (percentage >= 75) return "almost";
    if (percentage >= 50) return "half";
    if (percentage >= 25) return "partial";
    return "base";
  }, [percentage]);

  return { percentage, stage };
};
