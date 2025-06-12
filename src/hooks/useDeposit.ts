"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useChainId, useContractRead, useContractWrite, useReadContract, useSignTypedData } from "wagmi";
import { useWriteContract } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { v4 as uuidv4 } from "uuid";
import USDC from "../abis/USDC.json";
import VaquitaPool from "../abis/VaquitaPool.json";
import { useWagmiConfig } from "./useWagmiConfig";
import { ethers } from "ethers";
import { parseErc6492Signature, parseUnits } from "viem";

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
  const chainId = useChainId();
  const { writeContractAsync, isPending: isWritePending, error: writeError } = useWriteContract();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  const queryClient = useQueryClient();
  const poolAddress = process.env.NEXT_PUBLIC_VAQUITA_POOL_CONTRACT_ADDRESS;
  const usdcAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS;

  const mutation = useMutation({
    mutationFn: depositToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["tvl"] });
      queryClient.invalidateQueries({ queryKey: ["accruedInterest"] });
      queryClient.invalidateQueries({ queryKey: ["numberOfUsers"] });
    },
  });

  const getNonce = async () => {
    if (!address || !usdcAddress) return;
    return await client.readContract({
      address: usdcAddress as `0x${string}`,
      abi: USDC,
      functionName: 'nonces',
      args: [address]
    });
  };
  
  const { signTypedDataAsync } = useSignTypedData()

  const handleDeposit = async (amount: number) => {
    if (!address || !poolAddress || !usdcAddress) {
      console.error("Missing wallet or contract addresses.");
      return;
    }
    console.log('handleDeposit amount: ', amount);
    
    // 1. Get USDC decimals (assume 6 for USDC, or fetch if needed)
    const decimals = 6;
    const parsedAmount = parseUnits(amount.toString(), decimals);

    // You may need to adjust this if Pool contract expects bytes32 ids
    const depositId = uuidv4();
    const bytes32Value = ethers.zeroPadValue("0x" + depositId.replace(/-/g, ""), 32);
    console.log('bytes32Value: ', bytes32Value);
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const nonce = await getNonce();
    console.log('nonce: ', nonce);

    try {
      const permitSignature = await signTypedDataAsync({
        domain: {
          name: 'USDC',
          version: '2',
          chainId: chainId,
          verifyingContract: usdcAddress as `0x${string}`
        },
        types: {
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
          ]
        },
        primaryType: 'Permit',
        message: {
          owner: address,
          spender: poolAddress as `0x${string}`,
          value: parsedAmount,
          nonce: BigInt(nonce?.toString() || '0'),
          deadline: BigInt(deadline)
        }
      });

      const parsedSignature = parseErc6492Signature(permitSignature).signature;

      // 2. Deposit to Pool
      const depositHash = await writeContractAsync({
        address: poolAddress as `0x${string}`,
        abi: VaquitaPool,
        functionName: "deposit",
        args: [bytes32Value, parsedAmount, BigInt(deadline), parsedSignature],
      });
      
      await client.waitForTransactionReceipt({ hash: depositHash, confirmations: 1 });

      // 3. Call API to register deposit
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