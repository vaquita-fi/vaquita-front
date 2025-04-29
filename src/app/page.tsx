"use client";

// import { Map } from "@/components/scene/Map";
import Header from "@/components/ui/Header/Header";
// import SavingsForm from "@/components/ui/SavingsForm";
import TopBar from "@/components/ui/TopBar";

export default function Home() {
  // const {
  //   totalSaved,
  //   cows,
  //   handleDeposit: hookHandleDeposit,
  //   withdrawVaquita,
  //   totalCows,
  // } = useSavings();
  return (
    <main className="flex flex-col items-center h-dvh overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
        <div className="relative bottom-0 left-0">
          <Header />
          <TopBar />
          {/* <ActionButtons /> */}
        </div>
        {/* <StatsPanel
          totalSaved={totalSaved}
          totalCows={totalCows}
          totalRemaining={90}
        />

        <Map
          totalSaved={totalSaved}
          goalTarget={200}
          goalType="airplane"
          cows={cows}
          onWithdraw={withdrawVaquita}
        />
        <div className="relative bottom-0 left-0">
          <SavingsForm handleDeposit={hookHandleDeposit} />
        </div> */}
      </div>
    </main>
  );
}
