"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useCreateGoal } from "@/hooks/goals/useCreateGoal";
import { Input, Button } from "@heroui/react";

export default function NewGoalPage() {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const router = useRouter();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [durationDays, setDurationDays] = useState(90);

  const createGoalMutation = useCreateGoal(address || "");

  const handleSubmit = async () => {
    if (!address) return;
    try {
      const result = await createGoalMutation.mutateAsync({
        name,
        targetAmount,
        durationDays,
      });
      if (result?.goalId) {
        router.push(`/saving/${result.goalId}`);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const isButtonDisabled =
    !name ||
    targetAmount <= 0 ||
    durationDays <= 0 ||
    createGoalMutation.isPending;

  return (
    <div className="flex flex-col w-full max-w-md gap-6 p-4 mx-auto">
      <h1 className="text-2xl font-bold text-center">
        Nuevo objetivo de ahorro
      </h1>

      <Input
        type="text"
        placeholder="Nombre del objetivo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Monto objetivo (USDC)"
        value={targetAmount.toString()}
        onChange={(e) => setTargetAmount(Number(e.target.value))}
      />

      <select
        className="p-2 border rounded"
        value={durationDays}
        onChange={(e) => setDurationDays(Number(e.target.value))}
      >
        <option value={30}>1 mes</option>
        <option value={90}>3 meses</option>
        <option value={180}>6 meses</option>
        <option value={365}>1 año</option>
      </select>

      <Button
        onPress={handleSubmit}
        isLoading={createGoalMutation.isPending}
        isDisabled={isButtonDisabled}
      >
        Crear objetivo
      </Button>

      {createGoalMutation.isError && (
        <p className="text-sm text-center text-red-500">
          Ocurrió un error. Intente nuevamente.
        </p>
      )}
    </div>
  );
}
