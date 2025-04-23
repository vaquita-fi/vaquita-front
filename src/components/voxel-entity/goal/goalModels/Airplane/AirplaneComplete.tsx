"use client";
export const AirplaneComplete = () => {
  return (
    <group>
      {/* Cuerpo */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#FACC15" />
      </mesh>

      {/* Alas */}
      <mesh position={[0, 0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>

      <mesh position={[0, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>

      {/* Cola */}
      <mesh position={[-0.85, 0.7, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
    </group>
  );
};
