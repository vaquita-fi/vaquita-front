"use client";

export const Walking = () => {
  return (
    <mesh castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#007BFF" /> {/* blue */}
    </mesh>
  );
};
