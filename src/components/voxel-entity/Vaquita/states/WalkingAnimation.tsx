"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type * as THREE from "three";

interface VaquitaModelProps {
  direction?: [number, number];
  position?: [number, number, number];
  scale?: number;
}

const VaquitaModel = ({
  direction = [0, 1],
  position = [0, 0, 0],
  scale = 1,
}: VaquitaModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [isMoving, setIsMoving] = useState(true);
  const walkCycle = useRef(0);
  const targetRotation = useRef(0);

  const baseColor = "#fff3e1";
  const spotColor = "#6f4e37";
  const helmetColor = "#FBA71A";
  const noseColor = "#e88e29";
  const hoofColor = "#3a2b1b";

  useEffect(() => {
    const moving = direction[0] !== 0 || direction[1] !== 0;
    setIsMoving(moving);
    if (moving) {
      targetRotation.current = Math.atan2(direction[0], direction[1]);
    }
  }, [direction]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth rotation
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      delta * 10
    );

    // Animate limbs
    if (
      leftLegRef.current &&
      rightLegRef.current &&
      leftArmRef.current &&
      rightArmRef.current
    ) {
      if (isMoving) {
        walkCycle.current += delta * 10;
        leftLegRef.current.rotation.x = Math.sin(walkCycle.current) * 0.3;
        rightLegRef.current.rotation.x =
          Math.sin(walkCycle.current + Math.PI) * 0.3;
        leftArmRef.current.rotation.x =
          Math.sin(walkCycle.current + Math.PI) * 0.2;
        rightArmRef.current.rotation.x = Math.sin(walkCycle.current) * 0.2;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
        walkCycle.current = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Head */}
      <group position={[0, 1.15, 0]}>
        {/* Head */}
        <mesh>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        {/* Eyes */}
        <group position={[0, 0, 0]}>
          <mesh position={[-0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.15, 0]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.15, 0]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        {/* Nose */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, -0.1, 0.3]}>
            <boxGeometry args={[0.5, 0.22, 0.1]} />
            <meshStandardMaterial color={noseColor} />
          </mesh>

          <mesh position={[-0.12, -0.1, 0.35]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>

          <mesh position={[0.12, -0.1, 0.35]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        {/* Ears */}
        <mesh position={[-0.35, 0.12, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.35, 0.1, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>

        {/* Helmet */}
        <group position={[0, 0.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.65, 0.1, 0.65]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
          <mesh position={[0, 0, 0.35]}>
            <boxGeometry args={[0.5, 0.1, 0.1]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.65]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
          <mesh position={[0, 0.1, -0.05]}>
            <boxGeometry args={[0.65, 0.15, 0.55]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.4]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
        </group>
      </group>

      {/* Body */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0.25, 0.6, 0.21]}>
          <boxGeometry args={[0.15, 0.15, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[-0.2, 0.3, -0.21]}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.2, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.2, -0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.45, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.45, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, 0.2, -0.35]}>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color={spotColor} />
      </mesh>
      <mesh position={[0, 0.2, -0.5]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={helmetColor} />
      </mesh>
    </group>
  );
};

export default VaquitaModel;
