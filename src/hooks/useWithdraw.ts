"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import PoolABI from "../abi/VaquitaPoolABI.json";
import { useWagmiConfig } from "./useWagmiConfig";
import { ethers } from "ethers";

interface WithdrawPayload {
  depositId: string;
}

const withdrawDeposit = async ({ depositId }: WithdrawPayload) => {
  console.log("withdrawDeposit depositId", depositId);
  const response = await fetch("/api/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ depositId }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.message;
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  const poolAddress = process.env.NEXT_PUBLIC_VAQUITA_POOL_CONTRACT_ADDRESS;

  const mutation = useMutation({
    mutationFn: withdrawDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
    },
    onError: (error: Error) => {
      console.error("Withdraw error:", error.message);
    },
  });

  const handleWithdraw = async (depositId: string) => {
    if (!address || !poolAddress) {
      console.error("Missing wallet address or contract address.");
      return;
    }
    const bytes32Value = ethers.zeroPadValue("0x" + depositId.replace(/-/g, ""), 32);
    try {
      // 1. Withdraw from Pool contract using wagmi
      const transactionHash = await writeContractAsync({
        address: poolAddress as `0x${string}`,
        abi: PoolABI,
        functionName: "withdraw",
        args: [bytes32Value],
      });
      // 2. Wait for transaction confirmation
      await client.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: 1,
      });
      // 3. Call API to register withdrawal
      await mutation.mutateAsync({ depositId });
      console.log(`Withdrawal successful: ${depositId}`);
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  return {
    handleWithdraw,
    isPending: isWritePending || mutation.isPending,
    isError: !!(writeError || mutation.isError),
    error: writeError || mutation.error,
  };
};
