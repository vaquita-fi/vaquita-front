import React from "react";

const SavingsForm = ({ handleDeposit }: { handleDeposit: () => void }) => {
  return (
    <div className="grid grid-cols-2 gap-4 ">
      <button
        onClick={handleDeposit}
        className="h-16 bg-[#7AB259] hover:bg-[#6A9F4A] text-black rounded-lg flex flex-col items-center justify-center"
      >
        +<span className="text-lg font-semibold">Deposit</span>
      </button>
      <button className="h-16 bg-[#FFF8E7] text-black border-2 border-black rounded-lg flex flex-col items-center justify-center">
        {/* <BarChart3 size={24} /> */}
        barchart
        <span className="text-lg font-semibold">Progress</span>
      </button>
    </div>
  );
};

export default SavingsForm;
