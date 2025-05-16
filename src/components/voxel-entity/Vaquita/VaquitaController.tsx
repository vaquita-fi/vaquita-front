"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Vaquita } from "./Vaquita";
import { VaquitaBrain } from "@/lib/ai/VaquitaBrain";
import {
  VaquitaControllerProps,
  VaquitaData,
  VaquitaState,
} from "@/types/Vaquita";
import { getTileTopY } from "@/utils/helpers";
import { useTerrain } from "@/hooks/useTerrain";
import { getNextValidTile } from "@/lib/navigation";
import { useThree } from "@react-three/fiber";

export const VaquitaController = ({
  cow,
  onSelect,
}: VaquitaControllerProps & { cow: VaquitaData[] }) => {
  const ref = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const { tileTypes } = useTerrain();

  const [scale, setScale] = useState(0.5);
  const [direction, setDirection] = useState<[number, number]>([0, 1]);
  const [state, setState] = useState<VaquitaState>("walking");

  const brainRef = useRef(new VaquitaBrain("walking", [0, 0]));
  const currentPosition = useRef(new THREE.Vector3(0, getTileTopY(), 0));
  const targetPosition = useRef(new THREE.Vector3(0, getTileTopY(), 0));

  const activeDeposits = useMemo(
    () => cow.filter((d) => d.status === "active"),
    [cow]
  );
  const isActive = activeDeposits.length > 0;

  // Default position if inactive or no deposits
  const cowPosition = isActive
    ? activeDeposits[0].position
    : { x: 0, y: 0, z: 0 };
  const cowStatus = isActive ? activeDeposits[0].status : "inactive";
  const cowState = isActive ? activeDeposits[0].state : "walking";

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (!isActive) {
      ref.current.position.copy(currentPosition.current);
      return;
    }

    if (cowState === "withdrawing") {
      ref.current.position.copy(targetPosition.current);
      return;
    }

    if (brainRef.current.shouldChangeState()) {
      const nextState = brainRef.current.nextState();
      setState(nextState);
    }

    if (brainRef.current.state === "walking") {
      const distance = currentPosition.current.distanceTo(
        targetPosition.current
      );

      if (distance < 0.05) {
        const nextStep = getNextValidTile(
          [Math.floor(cowPosition.x), Math.floor(cowPosition.z)],
          tileTypes
        );
        targetPosition.current.set(nextStep[0], getTileTopY(), nextStep[1]);

        const newDirection: [number, number] = [
          nextStep[0] - Math.floor(cowPosition.x),
          nextStep[1] - Math.floor(cowPosition.z),
        ];
        setDirection(newDirection);

        brainRef.current.updatePosition(nextStep);
      }

      currentPosition.current.lerp(targetPosition.current, delta * 2);
      ref.current.position.copy(currentPosition.current);
    } else {
      ref.current.position.copy(targetPosition.current);
    }
  });

  return (
    <group
      ref={ref}
      onClick={() => isActive && onSelect?.(activeDeposits)}
      onPointerOver={() => {
        if (isActive) {
          setScale(0.55);
          gl.domElement.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setScale(0.5);
        gl.domElement.style.cursor = "default";
      }}
    >
      <Vaquita
        status={cowStatus}
        state={state}
        direction={direction}
        // check this later, about the positin in axes y
        position={{
          x: 0,
          y: -0.3,
          z: 0,
        }}
        scale={scale}
      />
    </group>
  );
};
