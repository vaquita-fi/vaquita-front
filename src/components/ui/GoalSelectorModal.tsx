"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
interface Goal {
  goalId: string;
  name: string;
  targetAmount: number;
  depositedAmount: number;
  progressPercent: number;
}

interface GoalSelectorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  goals: Goal[];
  onSelectGoal: (goalId: string) => void;
  onCreateGoal: () => void;
  hideCloseButton?: boolean;
}

export default function GoalSelectorModal({
  isOpen,
  onOpenChange,
  goals,
  onSelectGoal,
  onCreateGoal,
  hideCloseButton = false,
}: GoalSelectorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!hideCloseButton}
      hideCloseButton={hideCloseButton}
      closeButton={
        <Image src="/close-circle.svg" alt="close" width={44} height={44} />
      }
    >
      <ModalContent className="bg-background">
        {() => (
          <>
            <ModalHeader className="text-2xl font-bold text-center ">
              Choose or create a world
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-4 py-4 overflow-x-auto">
                <div
                  onClick={onCreateGoal}
                  className="min-w-[250px] py-10 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-white hover:bg-gray-100 cursor-pointer flex-shrink-0 text-center"
                >
                  <h3 className="flex items-center justify-center gap-2 mb-2 text-lg font-bold text-primary">
                    <IoIosAddCircleOutline /> Create new
                  </h3>
                  <p className="text-sm">Start a new savings goal</p>
                </div>

                {goals.length > 0 ? (
                  goals.map((goal) => (
                    <div
                      key={goal.goalId}
                      onClick={() => onSelectGoal(goal.goalId)}
                      className="min-w-[250px] p-4 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer flex-shrink-0 text-center"
                    >
                      <h3 className="text-lg font-semibold">{goal.name}</h3>
                      <p className="mt-2 text-sm">
                        Target: {goal.targetAmount} USDC
                      </p>
                      <p className="text-sm">
                        Saved: {goal.depositedAmount} USDC
                      </p>
                      <p className="text-sm">
                        Progress: {goal.progressPercent}%
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="w-full text-sm text-center text-gray-500">
                      You don&apos;t have any goals worlds yet.
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
