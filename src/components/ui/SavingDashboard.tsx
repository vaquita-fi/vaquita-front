"use client";

// import { Objective } from "@/types/Objective";
import { Map } from "@/components/scene/Map";
// import { useSavings } from "@/hooks/useSavings";
import Header from "./Header/Header";
import TopBar from "./TopBar";
import StatsPanel from "./StatsPanel";
import SavingsForm from "./SavingsForm";
import { useGoalDetails } from "@/hooks/goals/useGoalDetails";
import LoginButton from "./LoginButton";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function SavingDashboard({
  goalId,
  onOpenGoalModal,
}: {
  goalId?: string;
  onOpenGoalModal: () => void;
}) {
  const {
    totalSaved,
    cows,
    name,
    handleDeposit,
    withdrawVaquita,
    totalCows,
    targetAmount,
    goalType,
    isLoading,
    isError,
  } = useGoalDetails(goalId || "");
  const { ready, login, authenticated } = usePrivy();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading goal. Please try again.</div>;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full max-w-3xl border-2 border-black bg-background">
      {/* Header + Topbar */}
      <div className="relative bottom-0 left-0">
        <Header />
        <TopBar descriptionGoal={name} onOpenGoalModal={onOpenGoalModal} />
      </div>

      {/* Stats de progreso */}
      <StatsPanel
        totalSaved={totalSaved}
        totalCows={totalCows}
        totalRemaining={Number(targetAmount) - totalSaved}
        targetAmount={Number(targetAmount)}
      />

      {/* Mapa de las vaquitas */}
      <Map
        totalSaved={totalSaved}
        goalTarget={Number(targetAmount)}
        goalType={goalType}
        mycows={cows}
        onWithdraw={withdrawVaquita}
      />

      {/* Formulario de depósito */}
      <div className="relative bottom-0 left-0">
        {authenticated ? (
          <SavingsForm handleDeposit={handleDeposit} />
        ) : (
          <LoginButton
            ready={ready}
            login={() => {
              login();
              router.push("/saving");
            }}
          />
        )}
      </div>
    </div>
  );
}
