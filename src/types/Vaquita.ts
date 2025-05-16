export type VaquitaState = "walking" | "working" | "sleeping" | "withdrawing";
export type VaquitaStatus = "active" | "inactive";

export interface VaquitaControllerProps {
    cow: VaquitaData[]; // Ahora es un array
    onSelect: (cows: VaquitaData[]) => void;
}

export interface VaquitaPosition {
  x: number;
  y: number;
  z: number;
}

export interface VaquitaData {
  id: string;
  position: VaquitaPosition;
  state: VaquitaState;
  amount: string;
  createdAt: Date;
  status: VaquitaStatus;
}

