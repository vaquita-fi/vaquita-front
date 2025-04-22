"use client";

export const Sleeping = () => {
  return (
    <mesh castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFC107" /> {/* yellow */}
    </mesh>
  );
};
