"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { Text } from "@react-three/drei";
import type * as THREE from "three";

interface WebSummitModelProps {
  direction?: [number, number];
  position?: { x: number; y: number; z: number };
  scale?: number;
}

const WebSummitModel = ({
  direction = [1, 0],
  position = { x: 0, y: 0, z: 0 },
  scale = 0.5,
}: WebSummitModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  useEffect(() => {
    const moving = direction[0] !== 0 || direction[1] !== 0;
    if (moving) {
      targetRotation.current = Math.atan2(direction[0], direction[1]);
    }
  }, [direction]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      delta * 10
    );
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      scale={scale}
    >
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[5, 0.3, 1]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
      {/* pared */}
      <mesh position={[-0.5, 0.15, -0.2]}>
        <boxGeometry args={[3.5, 3.3, 0.3]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>

      {/* Texto "web" */}
      <Text
        position={[-1.2, 1.4, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        web
      </Text>

      {/* Texto "summit" */}
      <Text
        position={[-0.6, 0.8, 0]}
        fontSize={0.7}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        summit
      </Text>

      {/* Texto "RIO" */}
      <Text
        position={[-1.9, 0.15, 0.51]}
        fontSize={0.3}
        color="#fef3c7"
        anchorX="left"
        anchorY="middle"
      >
        RIO
      </Text>

      {/* Pirámides */}
      <mesh position={[2.1, 0.7, 0]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshStandardMaterial color="#FDBA74" />
      </mesh>
      <mesh position={[1.5, 0.9, 0]}>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
    </group>
  );
};

export default WebSummitModel;
