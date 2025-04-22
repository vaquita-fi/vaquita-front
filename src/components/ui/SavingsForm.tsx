import React, { useState } from "react";
import { PiCow } from "react-icons/pi";
import DepositModal from "./DepositModal";

interface SavingsFormProps {
  countCows: number;
  handleDeposit: (amount: number) => void;
}

const SavingsForm: React.FC<SavingsFormProps> = ({
  countCows,
  handleDeposit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepositAmount, setCurrentDepositAmount] = useState<number>(10);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDeposit = (amount: number) => {
    handleDeposit(amount);
    setCurrentDepositAmount(amount);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <div className="flex w-2/3 gap-2">
          <div className="w-2/3 py-2 border-[1px] border-b-4 border-black rounded-md flex justify-center items-center">
            3 months
          </div>
          <div className="flex w-1/3 py-2 border-[1px] border-b-4 border-black rounded-md justify-center items-center gap-1">
            <PiCow size={24} />
            {countCows}
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="py-2 w-2/3 bg-success hover:bg-[#28A745] text-black rounded-md flex flex-col items-center justify-center border-[1px] border-black border-b-5"
        >
          <span className="text-2xl font-semibold">
            {currentDepositAmount} USDC
          </span>
          <span className="font-semibold text-md">Deposit</span>
        </button>
      </div>

      <DepositModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDepositConfirm={handleConfirmDeposit}
      />
    </>
  );
};

export default SavingsForm;
