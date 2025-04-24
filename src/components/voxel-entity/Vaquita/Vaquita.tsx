"use client";

import WalkingAnimation from "./states/WalkingAnimation";
import WorkingAnimation from "./states/WorkingAnimation";
import SleepingAnimation from "./states/SleepingAnimation";
import { VaquitaState } from "@/types/Vaquita";

interface VaquitaProps {
  state: VaquitaState;
  position?: [number, number, number];
  direction?: [number, number];
}

export const Vaquita = ({
  state,
  position = [0, 0, 0],
  direction = [0, 1],
}: VaquitaProps) => {
  if (state === "walking")
    return <WalkingAnimation position={position} direction={direction} />;
  if (state === "working") return <WorkingAnimation />;
  if (state === "sleeping") return <SleepingAnimation />;
  return null;
};
