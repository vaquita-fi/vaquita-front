import { mockTrees, mockRocks, mockWater } from "@/lib/mockData";
import { positionKey } from "@/utils/helpers";
import { TileType } from "@/types/Terrain";

export const useTerrain = () => {
  const tileTypes = new Map<string, TileType>();

  mockTrees.forEach(({ position }) =>
    tileTypes.set(positionKey(position[0], position[2]), "tree")
  );
  mockRocks.forEach(({ position }) =>
    tileTypes.set(positionKey(position[0], position[2]), "rock")
  );
  mockWater.forEach(({ position }) =>
    tileTypes.set(positionKey(position[0], position[2]), "water")
  );

  return {
    tileTypes,
    trees: mockTrees,
    rocks: mockRocks,
    water: mockWater,
  };
};
