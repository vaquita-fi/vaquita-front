"use client";

import { GoalType, GoalProgressStage } from "@/types/Goal";
import { AirplaneComplete } from "./goalModels/Airplane/AirplaneComplete";
import { CarComplete } from "./goalModels/Car/CarComplete";
import { SmartphoneComplete } from "./goalModels/Smartphone/SmartphoneComplete";

interface Props {
  type: GoalType;
  stage: GoalProgressStage;
}

export const GoalModelFactory = ({ type, stage }: Props) => {
  if (type === "airplane") {
    if (stage === "complete") return <AirplaneComplete />;
  }

  if (type === "car") {
    if (stage === "complete") return <CarComplete />;
  }

  if (type === "smartphone") {
    if (stage === "complete") return <SmartphoneComplete />;
  }

  return null;
};
