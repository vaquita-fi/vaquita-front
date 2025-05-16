import { Button } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import { LuUsersRound } from "react-icons/lu";
import React from "react";
import { LuFlame } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";

const GameStats = () => {
  const totalSaved = 0;
  return (
    <div className="absolute left-0 z-10 flex justify-around w-full px-4 top-4">
      <div className="flex justify-between w-full">
        <Tooltip
          content="Number of participants in the game"
          color="warning"
          radius="sm"
          delay={1000}
          placement="bottom"
        >
          <Button className="flex items-center justify-center w-auto gap-1 bg-transparent bg-white border-2 border-black rounded-md border-t-1 border-r-1 border-l-1">
            <LuUsersRound size={20} />
            <p className="text-lg ">20</p>
          </Button>
        </Tooltip>
        <Tooltip
          content="Total of days saving"
          color="warning"
          radius="sm"
          delay={1000}
          placement="bottom"
        >
          <Button className="flex items-center justify-center w-auto gap-1 bg-transparent bg-white border-2 border-black rounded-md border-t-1 border-r-1 border-l-1">
            <LuFlame size={20} className="text-primary" />
            <p className="text-lg text-primary">2</p>
          </Button>
        </Tooltip>
        <Tooltip
          content="Total amount saved by all participants USDC"
          color="warning"
          radius="sm"
          delay={1000}
          placement="bottom"
        >
          <Button className="flex items-center justify-center w-auto gap-1 bg-transparent bg-white border-2 border-black rounded-md border-t-1 border-r-1 border-l-1">
            <TbMoneybag size={20} className="text-success" />
            <p className="text-lg text-success">1{totalSaved} </p>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default GameStats;
