"use client";

export const CarComplete = () => {
  return (
    <group>
      {/* Cuerpo */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.8]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.6]} />
        <meshStandardMaterial color="#B91C1C" />
      </mesh>
    </group>
  );
};
