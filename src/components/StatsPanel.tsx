import Image from "next/image";
import React from "react";

const StatsPanel = ({
  totalSaved,
  totalStaked,
}: {
  totalSaved: number;
  totalStaked: number;
}) => {
  return (
    <div className="flex justify-between mb-6 gap-2 border-t-[1px] border-b-[1px] border-black">
      <div className="flex-1 items-center gap-2 border-r-[1px]  border-black py-2">
        <p className="text-sm flex justify-center ">Total Staked</p>
        <div className=" flex justify-center gap-2 items-center ">
          <Image src="/icons/vault.svg" alt="Gift" width={30} height={30} />
          <p className="text-lg font-bold">{totalStaked} USDC</p>
        </div>
      </div>

      <div className="flex-1 items-center gap-2 border-black py-2">
        <p className="text-sm flex justify-center">Total Saved</p>
        <div className="flex justify-center gap-2 items-center ">
          <Image src="/icons/BsCoin.svg" alt="Gift" width={30} height={30} />
          <p className="text-lg font-bold">{totalSaved} USDC</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
