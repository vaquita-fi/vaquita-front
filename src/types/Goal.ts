export type GoalProgressStage = "base" | "partial" | "half" | "almost" | "complete";
export type GoalType = "airplane" | "smartphone" | "car" | "empty";

export interface Deposit {
    depositId: string;
    amount: number;
    timestamp: Date;
    withdrawn: boolean;
}
  
export interface Goal {
    _id?: string;
    goalId: string;
    walletAddress: string;
    targetAmount: number;
    durationDays: number;
    name: string;
    depositedAmount: number;
    progressPercent: number;
    status: "active" | "completed" | "cancelled";
    createdAt: Date;
    deposits: Deposit[];
    interestsAccumulated: number;
    type: GoalType;
    rewardsClaimed: {
        "25": boolean;
        "50": boolean;
        "75": boolean;
        "100": boolean;
    }
    participants: {
        walletAddress: string;
        depositedAmount: number;
    }[];
    beneficiaryAddress?: string;
    mode?: "individual" | "collaborative";
}
  