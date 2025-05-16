import { Deposit } from "@/types/Goal";
import { VaquitaData } from "@/types/Vaquita";

export const mapDepositsToVaquitas = (deposits: Deposit[]): VaquitaData[] => {
  return deposits.map((deposit, index) => {
    const gridSize = 5; // Adjust this to control spacing
    const x = (index % gridSize) * 2;
    const z = Math.floor(index / gridSize) * 2;

    return {
      id: deposit.depositId,
      position: { x, y: 0, z },
      state: "walking",
      amount: deposit.amount.toString(),
      createdAt: new Date(deposit.timestamp),
      status: deposit.withdrawn ? "inactive" : "active",
    };
  });
};
