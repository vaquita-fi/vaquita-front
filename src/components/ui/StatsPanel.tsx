import { Button } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import React from "react";
import { LiaCalendarTimes } from "react-icons/lia";
import { PiCow } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";

const StatsPanel = ({
  totalSaved,
  totalCows,
  totalRemaining,
  targetAmount,
}: {
  totalSaved: number;
  totalCows: number;
  totalRemaining: number;
  targetAmount: number;
}) => {
  return (
    <div className="relative bottom-0 left-0">
      <div className="absolute left-0 z-10 flex justify-center w-full top-4">
        <div className="flex justify-between w-full gap-8 mx-8 ">
          <Tooltip
            content="Time left to complete your savings goal"
            color="warning"
            radius="sm"
            delay={1000}
          >
            <Button className="flex items-center justify-center w-auto gap-1 py-2 bg-transparent border-b-2 border-black rounded-md hover:bg-primary border-t-1 border-r-1 border-l-1">
              <LiaCalendarTimes size={20} />
              <p className="text-sm ">{totalRemaining} days</p>
            </Button>
          </Tooltip>
          <Tooltip
            content="Total amount you've saved so far"
            color="warning"
            radius="sm"
            delay={1000}
          >
            <Button className="flex items-center justify-center w-auto gap-1 py-2 bg-transparent border-b-2 border-black rounded-md hover:bg-primary border-t-1 border-r-1 border-l-1">
              <TbMoneybag size={20} />
              <p className="text-sm">
                {targetAmount} / {totalSaved} USDC
              </p>
            </Button>
          </Tooltip>
          <Tooltip
            content="Number of cows working toward your goal"
            color="warning"
            radius="sm"
            delay={1000}
          >
            <Button className="flex items-center justify-center w-auto gap-1 py-2 bg-transparent border-b-2 border-black rounded-md hover:bg-primary border-t-1 border-r-1 border-l-1">
              <PiCow size={20} />
              <p className="text-sm">{totalCows}</p>
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
