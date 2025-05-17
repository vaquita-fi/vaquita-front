"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { v4 as uuidv4 } from "uuid";
import USDCABI from "../abi/USDCABI.json";
import PoolABI from "../abi/VaquitaPoolABI.json";
import { useWagmiConfig } from "./useWagmiConfig";
import { ethers } from "ethers";

interface DepositPayload {
  address: string;
  amount: number;
  depositId: string;
}

const depositToGoal = async ({ address, amount, depositId }: DepositPayload) => {
  const response = await fetch("/api/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount, depositId }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.deposit;
};

export const useDeposit = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: depositToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
    },
  });

  const poolAddress = process.env.NEXT_PUBLIC_VAQUITA_POOL_CONTRACT_ADDRESS;
  const usdcAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS;

  const handleDeposit = async (amount: number) => {
    if (!address || !poolAddress || !usdcAddress) {
      console.error("Missing wallet or contract addresses.");
      return;
    }
    console.log('handleDeposit amount: ', amount);

    // You may need to adjust this if Pool contract expects bytes32 ids
    const depositId = uuidv4();
    const bytes32Value = ethers.zeroPadValue("0x" + depositId.replace(/-/g, ""), 32);
    try {
      // 1. Get USDC decimals (assume 6 for USDC, or fetch if needed)
      const decimals = 6;
      const amountToApprove = BigInt(Math.floor(amount * 10 ** decimals));

      // 2. Approve USDC for Pool
      const approveHash = await writeContractAsync({
        address: usdcAddress as `0x${string}`,
        abi: USDCABI,
        functionName: "approve",
        args: [poolAddress, amountToApprove],
      });
      await client.waitForTransactionReceipt({ hash: approveHash, confirmations: 1 });

      // 3. Deposit to Pool
      const depositHash = await writeContractAsync({
        address: poolAddress as `0x${string}`,
        abi: PoolABI,
        functionName: "deposit",
        args: [bytes32Value, amountToApprove],
      });
      await client.waitForTransactionReceipt({ hash: depositHash, confirmations: 1 });

      // 4. Call API to register deposit
      await mutation.mutateAsync({ address, amount, depositId });
      console.log(`Deposit successful: ${amount} USDC to ${address}`);
    } catch (error) {
      console.error("Deposit error:", error);
    }
  };

  return {
    handleDeposit,
    isLoading: isWritePending || mutation.isPending,
    isError: !!(writeError || mutation.isError),
    error: writeError || mutation.error,
  };
};
