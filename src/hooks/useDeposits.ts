"use client";

import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";

export interface Deposit {
  depositId: string;
  address: string;
  amount: number;
  timestamp: Date;
  withdrawn: boolean;
}

const fetchDeposits = async (): Promise<Deposit[]> => {
  const response = await fetch("/api/deposit");
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.deposits;
};

export const useDeposits = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address?.toLowerCase();

  const { data: deposits = [], isLoading, isError, error } = useQuery({
    queryKey: ["deposits"],
    queryFn: fetchDeposits
  });

  const myDeposits = deposits.filter((deposit: Deposit) => deposit.address.toLowerCase() === address);
  const otherDeposits = deposits.filter((deposit: Deposit) => deposit.address.toLowerCase() !== address);

  return {
    myDeposits,
    otherDeposits,
    isLoading,
    isError,
    error,
  };
};
