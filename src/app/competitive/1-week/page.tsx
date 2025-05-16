"use client";

import SavingsForm from "@/components/ui/SavingsForm";
import { Map } from "@/components/scene/Map";
import { useDeposits } from "@/hooks/useDeposits";
import { Button, Card, CardBody } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { LuFlame, LuUsersRound } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { useWithdraw } from "@/hooks/useWithdraw";

const weekOptions = [
  { key: "1-week", label: "1 week" },
  { key: "2-weeks", label: "2 weeks" },
  { key: "3-weeks", label: "3 weeks" },
];

const Page = () => {
  const { myDeposits, otherDeposits, isLoading, isError, error } =
    useDeposits();
  const { handleWithdraw, isPending: isWithdrawing } = useWithdraw();

  if (isLoading || isWithdrawing) return <p>Loading deposits...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  console.log("My Deposits:", myDeposits);
  console.log("Other Deposits:", otherDeposits);

  const onWithdraw = (depositId: string) => {
    console.log(`Withdrawing deposit ID: ${depositId}`);
    handleWithdraw(depositId);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* Top Stats */}
      <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full ">
        <div className="flex items-center justify-between w-full max-w-lg gap-2 mx-4 ">
          <Card className="px-4 bg-background">
            <CardBody className="flex flex-row items-center justify-center gap-2">
              <LuFlame size={20} className="text-primary" />
              <p className="text-lg ">200</p>
            </CardBody>
          </Card>

          <Card className="px-4 bg-background">
            <CardBody className="flex flex-row items-center justify-center gap-2">
              <TbMoneybag size={20} className="text-success" />
              <p className="text-lg ">{100}</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Map Component */}
      <Map
        totalSaved={0}
        goalTarget={0}
        goalType={"web-summit"}
        myDeposits={myDeposits}
        othercows={otherDeposits}
        onWithdraw={onWithdraw}
      />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 flex flex-col items-center justify-center w-full ">
        <div className="left-0 z-10 flex justify-center w-full max-w-lg bottom-4">
          <div className="flex items-center justify-between w-full gap-4 mx-4 mb-2">
            <Dropdown className="w-2/3 bg-background">
              <DropdownTrigger className="w-full bg-background">
                <Button>Open Menu</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dynamic Actions"
                items={weekOptions}
                disabledKeys={["2-weeks", "3-weeks"]}
              >
                {(item) => (
                  <DropdownItem key={item.key}>{item.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

            <Card className="w-1/3 bg-background">
              <CardBody className="flex flex-row items-center justify-center gap-2">
                <LuUsersRound size={20} />
                <p className="text-sm">1030</p>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="left-0 z-10 flex justify-center w-full max-w-lg bottom-4">
          <SavingsForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
