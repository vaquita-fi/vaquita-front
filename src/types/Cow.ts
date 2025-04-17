export interface CowData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  counter: number;
  createdAt: Date;
  amount: string;
  amountWithdrawn: string;
  companyId: string;
  contractAddress: string;
  crypto: string;
  customerPublicKey: string;
  depositId: string;
  ownerUserId: string;
  rewardWithdrawn: string;
  state: string;
  status: string;
  timestamp: number;
  transactionHash: string;
  updatedAt: Date;
  _id: string;
}
export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}