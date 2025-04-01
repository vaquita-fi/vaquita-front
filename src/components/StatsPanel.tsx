import React from "react";
import { BiBarChartAlt2 } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";

const StatsPanel = ({
  totalSaved,
  interestEarned,
}: {
  totalSaved: number;
  interestEarned: number;
}) => {
  return (
    <div className="flex justify-between mb-6 gap-2">
      <div className="flex-1 flex items-center pr-4 gap-2 bg-white">
        <BsCoin size={32} />
        <p className="text-2xl font-bold">{totalSaved} USDC</p>
      </div>

      <div className="flex-1 flex items-center pl-4 gap-2 bg-white">
        <BiBarChartAlt2 size={32} />
        <p className="text-2xl font-bold">+{interestEarned} USDC</p>
      </div>
    </div>
  );
};

export default StatsPanel;
