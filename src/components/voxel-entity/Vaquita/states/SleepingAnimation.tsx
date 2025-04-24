"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Text } from "@react-three/drei";

interface SleepingAnimationProps {
  position: { x: number; y: number; z: number };
  direction: [number, number];
  scale?: number;
}

const SleepingAnimation = ({
  position,
  scale = 0.5,
  direction,
}: SleepingAnimationProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const baseColor = "#fff3e1";
  const bodyColor = "#E4D9C9";
  const spotColor = "#6f4e37";
  const helmetColor = "#FBA71A";
  const noseColor = "#e88e29";
  const hoofColor = "#3a2b1b";

  // Optional: bobbing Zzz
  useFrame(() => {
    if (!groupRef.current) return;

    // Align sleeping direction
    const angle = Math.atan2(direction[0], direction[1]);
    groupRef.current.rotation.y = angle;

    // Animate "zzz"
    groupRef.current.children.forEach((child) => {
      if (child.name === "zzz") {
        child.position.y = 2.2 + Math.sin(Date.now() * 0.002) * 0.1;
      }
    });
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      scale={scale}
    >
      {/* Head */}
      <group position={[0, 1.15, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>

        {/* Closed Eyes */}
        <group position={[0, 0, 0]}>
          <mesh position={[-0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.01, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.01, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>

        {/* Nose */}
        <group position={[0, -0.05, 0]}>
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
        <mesh position={[-0.3, 0.12, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.3, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>

        {/* Helmet */}
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.1, 0.07]}>
            <boxGeometry args={[0.55, 0.11, 0.65]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
          <mesh position={[0, 0.2, 0.03]}>
            <boxGeometry args={[0.55, 0.25, 0.55]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
        </group>
      </group>

      {/* Body */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.25, 0.5, 0.21]}>
          <boxGeometry args={[0.15, 0.4, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.1, 0.5, 0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[-0.2, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.4, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[-0.1, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.2, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
      </group>

      {/* Legs (no animation) */}
      <group ref={leftLegRef} position={[-0.15, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.15, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Arms (no animation) */}
      <group ref={leftArmRef} position={[-0.4, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.4, 0.5, 0]}>
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
      <group position={[0, 0.1, -0.15]}>
        <mesh position={[0, 0, -0.1]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0, -0.05, -0.15]} rotation={[-1, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0, -0.1, -0.2]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color={helmetColor} />
        </mesh>
      </group>

      <group name="zzz" position={[0, 0, 0]}>
        <Text
          fontSize={0.3}
          color="#000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
          position={[0, -0.3, 0]}
        >
          Zzz
        </Text>
      </group>
    </group>
  );
};

export default SleepingAnimation;
