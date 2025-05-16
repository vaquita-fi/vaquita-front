"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";

interface DepositPayload {
  address: string;
  amount: number;
}

const depositToGoal = async ({ address, amount }: DepositPayload) => {
  const response = await fetch("/api/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, amount }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.deposit;
};

export const useDeposit = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: depositToGoal,
    onSuccess: () => {
      // Invalidate the "deposits" query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
    },
  });

  const handleDeposit = async (amount: number) => {
    if (!address) {
      console.error("User address not found.");
      return;
    }

    try {
      await mutation.mutateAsync({ address, amount });
      console.log(`Deposit successful: ${amount} USDC to ${address}`);
    } catch (error) {
      console.error("Deposit error:", error);
    }
  };

  return {
    handleDeposit,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
