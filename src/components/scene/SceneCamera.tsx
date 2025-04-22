"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const SceneCamera = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(18, 10, 10);
    camera.lookAt(6, 0, 6);
  }, [camera]);

  return null;
};
