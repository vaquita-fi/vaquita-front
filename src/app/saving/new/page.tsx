"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useCreateGoal } from "@/hooks/goals/useCreateGoal";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { GoalType } from "@/types/Goal";

export default function NewGoalPage() {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  const router = useRouter();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [durationDays, setDurationDays] = useState(90);
  const [goalType, setGoalType] = useState<GoalType>("empty");

  const createGoalMutation = useCreateGoal(address || "");

  const handleSubmit = async () => {
    if (!address) return;
    try {
      const result = await createGoalMutation.mutateAsync({
        name,
        targetAmount,
        durationDays,
        type: goalType,
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
    <div className="flex flex-col items-center justify-center px-4 h-dvh">
      <div className="flex flex-col w-full max-w-md gap-6 p-6 border-none shadow-sm rounded-xl">
        <h1 className="text-2xl font-bold text-center">New Saving Goal</h1>

        <Input
          type="text"
          label="Goal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="number"
          label="Target amount (USDC)"
          value={targetAmount.toString()}
          onChange={(e) => setTargetAmount(Number(e.target.value))}
        />

        <Select
          selectedKeys={[durationDays.toString()]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            setDurationDays(Number(value));
          }}
          aria-label="Select duration"
        >
          <SelectItem key="30">1 month</SelectItem>
          <SelectItem key="90">3 months</SelectItem>
          <SelectItem key="180">6 months</SelectItem>
          <SelectItem key="365">1 year</SelectItem>
        </Select>

        <Select
          selectedKeys={[goalType]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as GoalType;
            setGoalType(value);
          }}
          aria-label="Select goal type"
        >
          <SelectItem key="airplane">Airplane</SelectItem>
          <SelectItem key="smartphone">Smartphone</SelectItem>
          <SelectItem key="car">Car</SelectItem>
          <SelectItem key="web-summit">Web Summit</SelectItem>
          <SelectItem key="empty">Other</SelectItem>
        </Select>

        <Button
          onPress={handleSubmit}
          isLoading={createGoalMutation.isPending}
          isDisabled={isButtonDisabled}
          className="w-full py-6 text-xl font-bold text-black border border-b-4 border-black rounded-md shadow-md bg-primary"
        >
          Create Goal
        </Button>

        {createGoalMutation.isError && (
          <p className="text-sm text-center text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
