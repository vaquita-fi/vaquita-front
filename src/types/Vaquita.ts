export type VaquitaState = "walking" | "working" | "sleeping";

export interface VaquitaControllerProps {
    id: string;
    startPosition: [number, number, number];
}

export interface Vaquita {
  id: string;
  position: [number, number, number];
  state: VaquitaState;
}