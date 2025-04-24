"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Vaquita } from "./Vaquita";
import { VaquitaBrain } from "@/lib/ai/VaquitaBrain";
import { VaquitaControllerProps, VaquitaState } from "@/types/Vaquita";
import { getTileTopY } from "@/utils/helpers";
import { useTerrain } from "@/hooks/useTerrain";
import { getNextValidTile } from "@/lib/navigation";

export const VaquitaController = ({
  id,
  startPosition,
}: VaquitaControllerProps) => {
  const ref = useRef<THREE.Group>(null);

  const [gridPos, setGridPos] = useState<[number, number]>([
    Math.floor(startPosition.x),
    Math.floor(startPosition.z),
  ]);
  const [state, setState] = useState<VaquitaState>("walking");
  const [direction, setDirection] = useState<[number, number]>([0, 1]);

  const { tileTypes } = useTerrain();
  const brainRef = useRef(new VaquitaBrain("walking", gridPos));
  const currentPosition = useRef(
    new THREE.Vector3(gridPos[0], getTileTopY(), gridPos[1])
  );
  const targetPosition = useRef(
    new THREE.Vector3(gridPos[0], getTileTopY(), gridPos[1])
  );

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (brainRef.current.shouldChangeState()) {
      const next = brainRef.current.nextState();
      setState(next);
    }

    if (brainRef.current.state === "walking") {
      const distance = currentPosition.current.distanceTo(
        targetPosition.current
      );

      if (distance < 0.05) {
        const nextStep = getNextValidTile(gridPos, tileTypes);
        targetPosition.current.set(nextStep[0], getTileTopY(), nextStep[1]);
        const dir: [number, number] = [
          nextStep[0] - gridPos[0],
          nextStep[1] - gridPos[1],
        ];
        setDirection(dir);
        setGridPos(nextStep);
        brainRef.current.updatePosition(nextStep);
      }

      currentPosition.current.lerp(targetPosition.current, delta * 2);
      ref.current.position.copy(currentPosition.current);
    } else {
      ref.current.position.copy(targetPosition.current);
    }
  });

  return (
    <group ref={ref} position={[gridPos[0], getTileTopY(), gridPos[1]]}>
      <Vaquita state={state} direction={[6, 6]} position={[6, 1, 6]} />
    </group>
  );
};
