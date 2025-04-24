"use client";

import { Text } from "@react-three/drei";

interface GoalProgressLabelProps {
  percentage: number;
}

export const GoalProgressLabel = ({ percentage }: GoalProgressLabelProps) => {
  const barWidth = 2; // ancho total de la barra
  const barHeight = 0.15;
  const filledWidth = (percentage / 100) * barWidth;

  return (
    <group position={[0, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="white"
      >
        {Math.round(percentage)}%
      </Text>

      {/* Fondo barra */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[barWidth, barHeight, 0.1]} />
        <meshStandardMaterial color="#C4BBAF" />
      </mesh>

      {/* Progreso */}
      <mesh position={[-barWidth / 2 + filledWidth / 2, 0, 0.01]}>
        <boxGeometry args={[filledWidth + 0.05, barHeight + 0.05, 0.13]} />
        <meshStandardMaterial color="#FF9B00" />
      </mesh>
    </group>
  );
};
