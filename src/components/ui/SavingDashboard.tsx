"use client";

// import { Objective } from "@/types/Objective";
import { Map } from "@/components/scene/Map";
// import { useSavings } from "@/hooks/useSavings";
import Header from "./Header/Header";
import TopBar from "./TopBar";
import StatsPanel from "./StatsPanel";
import SavingsForm from "./SavingsForm";
import { useGoalDetails } from "@/hooks/goals/useGoalDetails";

export default function SavingDashboard({ goalId }: { goalId: string }) {
  const {
    totalSaved,
    cows,
    handleDeposit,
    withdrawVaquita,
    totalCows,
    targetAmount,
    goalType,
    isLoading,
    isError,
  } = useGoalDetails(goalId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !goalId) {
    return <div>Error loading goal. Please try again.</div>;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
      {/* Header + Topbar */}
      <div className="relative bottom-0 left-0">
        <Header />
        <TopBar />
      </div>

      {/* Stats de progreso */}
      <StatsPanel
        totalSaved={totalSaved}
        totalCows={totalCows}
        totalRemaining={Number(targetAmount) - totalSaved}
      />

      {/* Mapa de las vaquitas */}
      <Map
        totalSaved={totalSaved}
        goalTarget={Number(targetAmount)}
        goalType={goalType}
        cows={cows}
        onWithdraw={withdrawVaquita}
      />

      {/* Formulario de depósito */}
      <div className="relative bottom-0 left-0">
        <SavingsForm handleDeposit={handleDeposit} />
      </div>
    </div>
  );
}
