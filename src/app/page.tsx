"use client";

import { Map } from "@/components/scene/Map";
// import ActionButtons from "@/components/ui/ActionButtons";
// import CowField from "@/components/Cow/CowField";
import Header from "@/components/ui/Header";
import SavingsForm from "@/components/ui/SavingsForm";
import StatsPanel from "@/components/ui/StatsPanel";
import TopBar from "@/components/ui/TopBar";
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
      <div className="flex flex-col justify-between w-full h-full max-w-md border-2 border-black bg-background">
        <div>
          <Header walletAddress={walletAddress} />
          <TopBar />
          {/* <ActionButtons /> */}
          <StatsPanel totalSaved={totalSaved} totalStaked={totalStaked} />
        </div>
        {/* <CowField cows={cows} /> */}
        <main className="w-full h-full">
          <Map />
        </main>
        <SavingsForm
          handleDeposit={handleDepositClick}
          countCows={cows.length}
        />
      </div>
    </main>
  );
}
