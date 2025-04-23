// import { GoalModelFactory } from "../goalmodels/GoalModelFactory";

import { GoalProgressStage, GoalType } from "@/types/Goal";
import { GoalModelFactory } from "./GoalModelFactory";

interface Props {
  type: GoalType;
  stage: GoalProgressStage;
  position?: [number, number, number];
}

export const GoalEntity = ({ type, stage, position }: Props) => {
  return (
    <group position={position}>
      <GoalModelFactory type={type} stage={stage} />
    </group>
  );
};
