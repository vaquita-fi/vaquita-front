"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface WithdrawAnimationProps {
  position: { x: number; y: number; z: number };
  scale?: number;
}

const WithdrawAnimation = ({
  position,
  scale = 10,
}: WithdrawAnimationProps) => {
  const crossRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (crossRef.current) {
      crossRef.current.rotation.y += delta * 0.5; // ligera animación (opcional)
    }
  });

  return (
    <group position={[position.x, position.y - 0.2, position.z]} scale={scale}>
      {/* Base (e.g., grave) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#677922" />
      </mesh>

      {/* Cross */}
      <mesh ref={crossRef} position={[0, 0.25, 0]}>
        <boxGeometry args={[0.09, 1.2, 0.09]} />
        <meshStandardMaterial color="#593012" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.09, 0.1, 0.5]} />
        <meshStandardMaterial color="#593012" />
      </mesh>
    </group>
  );
};

export default WithdrawAnimation;
