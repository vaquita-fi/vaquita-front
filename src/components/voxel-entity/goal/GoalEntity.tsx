// import { GoalModelFactory } from "../goalmodels/GoalModelFactory";

import { GoalProgressStage, GoalType } from "@/types/Goal";
import { GoalModelFactory } from "./GoalModelFactory";
import { GoalProgressLabel } from "@/components/ui/GoalProgressBar";

interface Props {
  type: GoalType;
  stage: GoalProgressStage;
  progressPercentage: number;
}

export const GoalEntity = ({ type, stage, progressPercentage }: Props) => {
  return (
    <group position={[5.5, 0, 5.5]}>
      <GoalModelFactory type={type} stage={stage} />
      <GoalProgressLabel percentage={progressPercentage} />
    </group>
  );
};
