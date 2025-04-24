"use client";

import WalkingAnimation from "./states/WalkingAnimation";
import WorkingAnimation from "./states/WorkingAnimation";
import SleepingAnimation from "./states/SleepingAnimation";
import WithdrawAnimation from "./states/WithdrawAnimation";
import { VaquitaState, VaquitaStatus } from "@/types/Vaquita";

interface VaquitaProps {
  state: VaquitaState;
  status: VaquitaStatus;
  position: { x: number; y: number; z: number };
  direction: [number, number];
  scale: number;
}

export const Vaquita = ({
  state,
  position,
  direction,
  scale,
  status,
}: VaquitaProps) => {
  if (status === "inactive") {
    return <WithdrawAnimation position={position} scale={scale} />;
  }
  if (state === "walking")
    return (
      <WalkingAnimation
        position={position}
        direction={direction}
        scale={scale}
      />
    );
  if (state === "working")
    return (
      <WorkingAnimation
        position={position}
        direction={direction}
        scale={scale}
      />
    );
  if (state === "sleeping")
    return (
      <SleepingAnimation
        position={position}
        direction={direction}
        scale={scale}
      />
    );
  return null;
};
