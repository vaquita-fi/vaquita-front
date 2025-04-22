"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getTileTopY } from "@/utils/helpers";

interface TreeProps {
  position: [number, number, number];
  beingWorked: boolean;
  variant: number;
}
type Debris = {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
};

export default function Tree({ position, beingWorked, variant }: TreeProps) {
  const trunkRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Mesh>(null);
  const mainTreeHeight = 1;
  const spawnTimer = useRef(0);
  const gravity = 9.8;
  const [debris, setDebris] = useState<Debris[]>([]);

  const baseY = getTileTopY();

  useFrame((_, delta) => {
    // spawn each second
    if (beingWorked) {
      spawnTimer.current += delta;
      if (spawnTimer.current >= 1) {
        spawnTimer.current = 0;

        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 0.3;
        const vx = Math.cos(angle) * speed;
        const vz = Math.sin(angle) * speed;
        const vy = 2.5 + Math.random() * 2;

        setDebris((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            position: [0, mainTreeHeight, 0],
            velocity: [vx, vy, vz],
          },
        ]);
      }
    } else {
      spawnTimer.current = 0;
    }

    // update each cube
    setDebris(
      (prev) =>
        prev
          .map((d) => {
            const [x, y, z] = d.position;
            const [vx, vy, vz] = d.velocity;

            const newVy = vy - gravity * delta;

            return {
              ...d,
              position: [x + vx * delta, y + newVy * delta, z + vz * delta] as [
                number,
                number,
                number
              ],
              velocity: [vx, newVy, vz] as [number, number, number],
            };
          })
          .filter((d) => d.position[1] > 0) // remove when hits ground
    );
  });

  if (variant === 0) {
    return (
      <group position={position} rotation={[0, 1, 0]}>
        {/* Trunk: altura 1, centrado en baseY + 0.5 */}
        <mesh ref={trunkRef} position={[0, baseY, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="brown" />
        </mesh>

        <mesh ref={leavesRef} position={[0, baseY, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial color="#9FFD53" />
        </mesh>

        <mesh ref={leavesRef} position={[0, baseY + 0.3, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.4]} />
          <meshStandardMaterial color="#9FFD53" />
        </mesh>

        <mesh ref={leavesRef} position={[0, baseY + 0.6, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color="#9FFD53" />
        </mesh>

        {debris.map((d) => (
          <mesh key={d.id} position={d.position} scale={0.8} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#9FFD53" />
          </mesh>
        ))}
      </group>
    );
  }

  if (variant === 1) {
    return (
      <group position={position} rotation={[0, 1, 0]}>
        <mesh ref={trunkRef} position={[0, baseY, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="brown" />
        </mesh>

        <mesh ref={leavesRef} position={[0, baseY + 0.2, 0]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.6]} />
          <meshStandardMaterial color="#9FFD53" />
        </mesh>
      </group>
    );
  }
  return (
    <group position={position} rotation={[0, 0, 0]}>
      <mesh ref={trunkRef} position={[0, baseY, 0]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>

      <mesh ref={leavesRef} position={[0, baseY + 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.6]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>

      <mesh ref={leavesRef} position={[0.2, baseY + 0.4, 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.5]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    </group>
  );
}
