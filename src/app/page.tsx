"use client";

import ActionButtons from "@/components/ActionButtons";
import CowField from "@/components/Cow/CowField";
import Header from "@/components/Header";
import SavingsForm from "@/components/SavingsForm";
import StatsPanel from "@/components/StatsPanel";
import TopBar from "@/components/TopBar";
import { useSavings } from "@/hooks/useSavings";
import { useState } from "react";

export default function Home() {
  const {
    totalSaved,
    totalStaked,
    cows,
    handleDeposit: hookHandleDeposit,
  } = useSavings();
  const [walletAddress] = useState("0X1234...abcd");

  const handleDepositClick = () => {
    const depositAmount = 10;

    hookHandleDeposit(depositAmount);
  };

  return (
    <main className="flex flex-col items-center h-screen overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="flex flex-col justify-around w-full h-full max-w-md border-2 border-black bg-background">
        <div>
          <Header walletAddress={walletAddress} />
          <TopBar />
          {/* <ActionButtons /> */}
          <StatsPanel totalSaved={totalSaved} totalStaked={totalStaked} />
        </div>
        <CowField cows={cows} />
        <SavingsForm
          handleDeposit={handleDepositClick}
          countCows={cows.length}
        />
      </div>
    </main>
  );
}
