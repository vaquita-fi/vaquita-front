"use client";
import { OrbitControls } from "@react-three/drei";

export const SceneControls = () => {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      minDistance={10}
      maxDistance={18}
      target={[6, 0, 6]}
      minPolarAngle={0.2 * Math.PI} // ≈ 36°
      maxPolarAngle={0.5 * Math.PI} // 90° (no mirar desde abajo)
    />
  );
};
