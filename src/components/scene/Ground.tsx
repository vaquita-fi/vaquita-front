"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { MAP_SIZE, TILE_HEIGHT, TILE_SIZE } from "@/lib/config";
import { useTerrain } from "@/hooks/useTerrain";
import { positionKey } from "@/utils/helpers";

export const Ground = () => {
  const { tileTypes } = useTerrain();

  const grid = useMemo(() => {
    const group = new THREE.Group();

    for (let x = 0; x < MAP_SIZE; x++) {
      for (let z = 0; z < MAP_SIZE; z++) {
        const key = positionKey(x, z);
        const type = tileTypes.get(key) ?? "empty";
        const isGoalTile = type === "goal";
        const color = isGoalTile
          ? "#FF9B00" // Goal tile
          : type === "tree"
          ? "#C1583A"
          : type === "rock"
          ? "#A4876A"
          : type === "water"
          ? "#6FF2F1"
          : "#A1CD5A";

        const isWater = type === "water";

        const height = isWater ? TILE_HEIGHT * 0.8 : TILE_HEIGHT;
        const y = isWater ? -TILE_HEIGHT / 2 - 0.1 : -TILE_HEIGHT / 2;

        const tile = new THREE.Mesh(
          new THREE.BoxGeometry(TILE_SIZE, height, TILE_SIZE),
          new THREE.MeshLambertMaterial({
            color,
          })
        );

        tile.receiveShadow = type !== "water";

        tile.position.set(x, y, z);
        group.add(tile);
      }
    }

    return group;
  }, [tileTypes]);

  return <primitive object={grid} />;
};
