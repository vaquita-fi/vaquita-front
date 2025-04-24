import {  TILE_HEIGHT } from "@/lib/config";
export const positionKey = (x: number, z: number) => `${x},${z}`;
export const getTileTopY = (): number => TILE_HEIGHT / 2;