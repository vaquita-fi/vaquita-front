import { Button } from "@heroui/react";
import { useAccount } from "wagmi";
import React from "react";

const TopBar = ({
  descriptionGoal,
  onOpenGoalModal,
}: {
  descriptionGoal: string;
  onOpenGoalModal: () => void;
}) => {
    const { address } = useAccount();
    return (
    <>
      <div className="flex justify-around w-full overflow-hidden text-sm font-semibold text-black border-gray-700 bg-success whitespace-nowrap">
        <p>PRE-ALPHA: Small amounts only</p>
        <p>PRE-ALPHA: Small amounts only</p>
      </div>
      {address ? (
        <Button
          className="flex items-center justify-center w-full py-2 text-lg font-bold border-b-2 border-black rounded-none border-t-1 bg-primary"
          onPress={onOpenGoalModal}
        >
          {descriptionGoal || "Select or create a goal"}
        </Button>
      ) : (
        <div className="flex items-center justify-center w-full py-2 text-lg font-bold border-b-2 border-black rounded-none border-t-1 bg-primary">
          Vaquita
        </div>
      )}
    </>
  );
};

export default TopBar;
