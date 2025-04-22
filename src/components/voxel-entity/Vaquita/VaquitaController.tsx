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
    Math.floor(startPosition[0]),
    Math.floor(startPosition[2]),
  ]);
  console.log(id);

  const [state, setState] = useState<VaquitaState>("walking");

  const { tileTypes } = useTerrain();

  const brainRef = useRef(new VaquitaBrain("walking", gridPos));
  const lastMoveTime = useRef(performance.now());

  useFrame(() => {
    if (!ref.current) return;

    // Si la IA decide cambiar de estado
    if (brainRef.current.shouldChangeState()) {
      const next = brainRef.current.nextState();
      setState(next);
    }

    // Movimiento en bloques solo si está caminando
    if (brainRef.current.state === "walking") {
      const now = performance.now();
      if (now - lastMoveTime.current > 1000) {
        const nextStep = getNextValidTile(gridPos, tileTypes);

        ref.current.position.set(nextStep[0], getTileTopY(), nextStep[1]);
        setGridPos(nextStep);
        brainRef.current.updatePosition(nextStep);
        lastMoveTime.current = now;
      }
    }

    // Si está en working o sleeping, lo mantenemos en su posición actual
  });

  return (
    <group ref={ref} position={[gridPos[0], 0.5, gridPos[1]]}>
      <Vaquita state={state} />
    </group>
  );
};
