"use client";

export const SmartphoneComplete = () => {
  return (
    <group>
      {/* Pantalla */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.1]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>

      {/* Botón inferior */}
      <mesh position={[0, 0.05, 0.06]}>
        <boxGeometry args={[0.1, 0.1, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};
