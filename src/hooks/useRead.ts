import { useAccount } from "wagmi";
import { getPublicClient } from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import AavePool from "../abis/AavePool.json";
import VaquitaPool from "../abis/VaquitaPool.json";
import { useQuery } from "@tanstack/react-query";
import { Deposit } from "@/types/Goal";
import USDC from "../abis/USDC.json";
import { ethers } from "ethers";

const useRead = () => {
  const { address } = useAccount();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  const usdc = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS;
  const poolAddress = process.env.NEXT_PUBLIC_AAVE_POOL_CONTRACT_ADDRESS;
  const vaquitaPool = process.env.NEXT_PUBLIC_VAQUITA_POOL_CONTRACT_ADDRESS;

  const getReservedData = async () => {
    if (!address) return;
    return await client.readContract({
      address: poolAddress as `0x${string}`,
      abi: AavePool,
      functionName: 'getReserveData',
      args: [usdc]
    });
  };

  const getDeposit = async (depositId: string) => {
    if (!address || !vaquitaPool) return;
    return await client.readContract({
      address: vaquitaPool as `0x${string}`,
      abi: VaquitaPool,
      functionName: 'getPosition',
      args: [depositId]
    });
  };

  const getAccruedInterest = async () => {
    // call to api/get-goals
    console.log('getAccruedInterest address: ', address);
    const deposits = await fetch(`/api/get-deposits?address=${address}`);
    const depositsData = await deposits.json();
    console.log('depositsData: ', depositsData);

    // iterate deposits, call getDeposit for each deposit and show aTokensReceived
    const totalATokensReceived = await Promise.all(
      depositsData.deposits.map(async (deposit: Deposit) => {
        const bytes32Value = ethers.zeroPadValue("0x" + deposit.depositId.replace(/-/g, ""), 32);
        const position : any = await getDeposit(bytes32Value);
        return position ? BigInt(position[2]) : BigInt(0); // ensure BigInt
      })
    ).then(results => results.reduce((acc, curr) => acc + curr, BigInt(0)))
    .catch(error => {
      console.error('Error getting accrued interest: ', error);
      return BigInt(0);
    });
    console.log('totalATokensReceived: ', totalATokensReceived);

    const reservedData : any = await getReservedData();
    console.log('reservedData: ', reservedData);

    // calculate the accrued interest
    const accruedInterest = totalATokensReceived * BigInt(reservedData.liquidityIndex) / BigInt(1e27);
    console.log('accruedInterest: ', accruedInterest);

    // return the accrued interest
    return (Number(accruedInterest) / 1e6).toFixed(2);
  };

  const getTVL = async () => {
    const tvl = await client.readContract({
      address: vaquitaPool as `0x${string}`,
      abi: VaquitaPool,
      functionName: 'totalDeposits',
    });
    console.log('tvl: ', tvl);
    return BigInt(tvl as number) / BigInt(1e6);
  };

  return { getAccruedInterest, getTVL };
};

export { useRead };