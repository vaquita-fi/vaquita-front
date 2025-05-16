import React, { useState } from "react";
import DepositModal from "./DepositModal";
import { useDeposit } from "@/hooks/useDeposit";

const SavingsForm = () => {
  const { handleDeposit, isLoading, isError, error } = useDeposit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepositAmount, setCurrentDepositAmount] = useState<number>(10);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full gap-2 mx-4 mb-4">
        <button
          onClick={handleOpenModal}
          disabled={isLoading}
          className="py-2 w-full bg-success hover:bg-[#28A745] text-black rounded-md flex flex-col items-center justify-center border-[1px] border-black border-b-5"
        >
          <span className="text-2xl font-semibold">
            {currentDepositAmount} USDC
          </span>
          <span className="font-semibold text-md">Deposit</span>
        </button>

        {isError && <p className="text-red-500">Error: {error?.message}</p>}
      </div>

      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDepositConfirm={async (amount: number) => {
          await handleDeposit(amount);
          setCurrentDepositAmount(amount);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default SavingsForm;
