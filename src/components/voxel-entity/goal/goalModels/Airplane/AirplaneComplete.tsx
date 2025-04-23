"use client";

export const AirplaneComplete = () => {
  return (
    <group>
      {/* Cuerpo */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.5, 0.5]} />
        <meshStandardMaterial color="#FACC15" />
      </mesh>

      {/* Alas */}
      <mesh position={[0, 0.5, -0.75]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>

      <mesh position={[0, 0.5, 0.75]}>
        <boxGeometry args={[1.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>

      {/* Cola */}
      <mesh position={[-0.9, 1, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
    </group>
  );
};
