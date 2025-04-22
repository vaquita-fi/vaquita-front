"use client";

export const Working = () => {
  return (
    <mesh castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f97316" /> {/* orange */}
    </mesh>
  );
};
