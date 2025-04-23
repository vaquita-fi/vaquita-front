"use client";

import { Map } from "@/components/scene/Map";
import Header from "@/components/ui/Header/Header";
import SavingsForm from "@/components/ui/SavingsForm";
import TopBar from "@/components/ui/TopBar";
import { useSavings } from "@/hooks/useSavings";
import StatsPanel from "@/components/ui/StatsPanel";

export default function Home() {
  const { totalSaved, cows, handleDeposit: hookHandleDeposit } = useSavings();

  const handleDepositClick = () => {
    const depositAmount = 10;

    hookHandleDeposit(depositAmount);
  };

  return (
    <main className="flex flex-col items-center h-dvh overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
        <div className="relative bottom-0 left-0">
          <Header />
          <TopBar />
          {/* <ActionButtons /> */}
        </div>
        <StatsPanel
          totalSaved={totalSaved}
          totalCows={cows.length}
          totalRemaining={90}
        />

        <Map />
        <div className="relative bottom-0 left-0">
          <SavingsForm handleDeposit={handleDepositClick} />
        </div>
      </div>
    </main>
  );
}
