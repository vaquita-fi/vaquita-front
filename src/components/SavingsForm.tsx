import React from "react";
import { PiCow } from "react-icons/pi";

const SavingsForm = ({
  handleDeposit,
  countCows,
}: {
  handleDeposit: () => void;
  countCows: number;
}) => {
  return (
    <div className="flex flex-col justify-center items-center mb-4 gap-2">
      <div className="flex gap-2 w-2/3">
        <div className="w-2/3 py-2 border-[1px] border-b-4 border-black rounded-md flex justify-center items-center">
          6 months
        </div>
        <div className="flex w-1/3 py-2 border-[1px] border-b-4 border-black rounded-md justify-center items-center gap-1">
          <PiCow size={24} />
          {countCows}
        </div>
      </div>
      <button
        onClick={handleDeposit}
        className="py-2 w-2/3 bg-success hover:bg-[#28A745] text-black rounded-md flex flex-col items-center justify-center border-[1px] border-black border-b-4"
      >
        <span className="text-2xl font-semibold">10 USDC</span>
        <span className="text-md font-semibold">Deposit</span>
      </button>
    </div>
  );
};

export default SavingsForm;
