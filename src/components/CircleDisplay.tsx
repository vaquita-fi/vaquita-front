import React from "react";
import CowField from "./CowField";
interface CowData {
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
const CircleDisplay = ({ cows }: { cows: CowData[] }) => {
  return (
    <div className="flex justify-center mb-6 relative ">
      <CowField cows={cows} />
    </div>
  );
};

export default CircleDisplay;
