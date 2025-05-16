export type GameType = "normal" | "competitive";
export type GoalProgressStage = "base" | "partial" | "half" | "almost" | "complete";
export type GoalType = "airplane" | "smartphone" | "car" | "empty" | "web-summit";

export interface Deposit {
  depositId: string;
  address: string;
  amount: number;
  timestamp: Date;
  withdrawn: boolean;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}


export interface Goal {
    _id?: string;
    address: string;
    targetAmount: number;
    depositedAmount: number;
    deposit?: Deposit;  // Single deposit field
    createdAt: Date;
    status: "active" | "completed" | "cancelled";
}
