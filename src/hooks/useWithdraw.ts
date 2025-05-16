"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface WithdrawPayload {
  depositId: string;
}

const withdrawDeposit = async ({ depositId }: WithdrawPayload) => {
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
    try {
      await mutation.mutateAsync({ depositId });
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  return {
    handleWithdraw,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
