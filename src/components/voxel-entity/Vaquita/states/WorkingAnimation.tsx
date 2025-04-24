"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
// import { useGameContext } from "@/contexts/game-context"
import type * as THREE from "three";

export default function WorkingAnimation() {
  const rightArmRef = useRef<THREE.Mesh>(null);
  const pickaxeRef = useRef<THREE.Group>(null);
  const animationTime = useRef(0);
  // const { setAction } = useGameContext()

  useFrame((state, delta) => {
    if (!rightArmRef.current || !pickaxeRef.current) return;

    // Increment animation time
    animationTime.current += delta;

    // Animate arm with pickaxe
    rightArmRef.current.rotation.x = Math.sin(animationTime.current * 8) * 0.8;

    // Reset after 3 seconds
    if (animationTime.current > 3) {
      // setAction("idle")
      animationTime.current = 0;
    }
  });

  return (
    <>
      {/* Right arm with animation */}
      <mesh ref={rightArmRef} castShadow position={[0.4, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Left arm (static) */}
      <mesh castShadow position={[-0.4, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Legs (static) */}
      <mesh castShadow position={[-0.2, 0.2, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh castShadow position={[0.2, 0.2, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Pickaxe for working */}
      <group ref={pickaxeRef} position={[0.5, 0.7, 0.2]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.25, 0.15, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.05]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
      </group>

      {/* Body bobbing animation */}
      <BodyBobAnimation speed={8} amplitude={0.1} />
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

    // Apply bobbing to the parent (cow body)
    parentRef.current.parent.position.y =
      0.1 + Math.abs(Math.sin(animationTime.current * speed)) * amplitude;
  });

  return <group ref={parentRef} />;
}
