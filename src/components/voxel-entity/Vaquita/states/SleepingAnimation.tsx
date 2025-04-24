"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
// import { useGameContext } from "@/contexts/game-context"
import type * as THREE from "three";

export default function SleepingAnimation() {
  const sleepZRef = useRef<THREE.Group>(null);
  const animationTime = useRef(0);
  // const { setAction } = useGameContext()

  useFrame((state, delta) => {
    if (!sleepZRef.current) return;

    // Increment animation timea
    animationTime.current += delta;

    // Animate the Z symbol floating up and down
    sleepZRef.current.position.y =
      2.2 + Math.sin(animationTime.current * 2) * 0.1;

    // Reset after 3 seconds
    if (animationTime.current > 3) {
      // setAction("idle")
      animationTime.current = 0;
    }
  });

  return (
    <>
      {/* Sleep Z symbol */}
      <group ref={sleepZRef} position={[0.5, 2, 0]}>
        <Text
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 4, 0]}
          fontSize={0.5}
          color="#4169E1"
          anchorX="center"
          anchorY="middle"
        >
          Z
        </Text>
      </group>

      {/* Body bobbing animation */}
      <BodyBobAnimation speed={1.5} amplitude={0.05} />
    </>
  );
}

// Shared component for body movement
function BodyBobAnimation({ speed = 1, amplitude = 0.1 }) {
  const parentRef = useRef<THREE.Group>(null);
  const animationTime = useRef(0);

  useFrame((state, delta) => {
    if (!parentRef.current || !parentRef.current.parent) return;

    animationTime.current += delta;

    // Apply gentle bobbing to the parent (cow body)
    parentRef.current.parent.position.y =
      0.1 + Math.sin(animationTime.current * speed) * amplitude;
  });

  return <group ref={parentRef} />;
}
