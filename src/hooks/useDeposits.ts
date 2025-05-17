"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

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
  console.log('useDeposits');
  const { address } = useAccount();
  console.log('useDeposits address', address);
  const lowerAddress = address?.toLowerCase();
  console.log('address', lowerAddress);

  const { data: deposits = [], isLoading, isError, error } = useQuery({
    queryKey: ["deposits", lowerAddress],
    queryFn: () => fetchDeposits()
  });

  const myDeposits = deposits.filter((deposit: Deposit) => deposit.address.toLowerCase() === lowerAddress);
  const otherDeposits = deposits.filter((deposit: Deposit) => deposit.address.toLowerCase() !== lowerAddress);

  return {
    myDeposits,
    otherDeposits,
    isLoading,
    isError,
    error,
  };
};
