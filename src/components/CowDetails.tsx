"use client";

import { useState } from "react";
import Cow from "./Cow";
import { getCowName } from "@/lib/cowNames";
import { CgSandClock } from "react-icons/cg";

interface CowData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  counter: number;
  createdAt?: Date;
}

interface CowDetailsProps {
  cow: CowData;
  onClose: () => void;
}

export default function CowDetails({ cow, onClose }: CowDetailsProps) {
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const createdAt = cow.createdAt || new Date();
  const lifeTime = Math.floor((Date.now() - createdAt.getTime()) / 1000);
  const progress = (cow.counter / 1000) * 100;

  // Calcular si han pasado 6 meses
  const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000; // aproximadamente 6 meses en milisegundos
  const timeElapsed = Date.now() - createdAt.getTime();
  const isReadyToWithdraw = timeElapsed >= sixMonthsInMs;

  // Obtener nombre de la vaquita basado en su ID
  const cowName = getCowName(cow.id);

  const handleWithdrawClick = () => {
    setShowWithdrawConfirm(true);
  };

  const handleWithdrawConfirm = () => {
    setShowWithdrawConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#FFF8E7] rounded-3xl w-[320px] border-2 border-black">
        {!showWithdrawConfirm ? (
          <div>
            <div className="flex justify-between items-center px-4 py-2">
              <div className="flex justify-center items-center gap-2 ">
                <h3 className="text-2xl font-bold">{cowName}</h3>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 bg-primary rounded-full flex items-center justify-center border border-black hover:bg-[#e89538]"
              >
                ✕
              </button>
            </div>
            <div className="bg-primary flex">
              {" "}
              <div className="flex w-full  py-2 px-2 border-t-[1px] border-b-4 border-black justify-center">
                <CgSandClock size={24} /> Ends in 24 days
              </div>
            </div>

            <div className="flex items-center justify-center py-4">
              <Cow size={96} />
              <div className="flex flex-col items-center justify-center ">
                <div className="text-2xl font-bold">35 USDC</div>
                <div className="text-lg">Saved</div>
              </div>
            </div>
            <div className="px-4">
              <div className="flex justify-between text-sm">
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#E6E6E6] rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xl p-4">
              <span>Life of time: </span>
              <span className="font-bold">{lifeTime} seconds</span>
            </p>

            <div className="w-full flex justify-center px-4 pb-4">
              <button
                onClick={handleWithdrawClick}
                className="w-full py-3 border-2 border-b-4 border-black rounded-xl text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center px-4 py-2">
              <div className="flex justify-center items-center gap-2 ">
                <h3 className="text-2xl font-bold">{cowName}</h3>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 bg-primary rounded-full flex items-center justify-center border border-black hover:bg-[#e89538]"
              >
                ✕
              </button>
            </div>
            <div className="bg-primary flex">
              {" "}
              <div className="flex w-full  py-2 px-2 border-t-[1px] border-b-4 border-black justify-center">
                <CgSandClock size={24} /> Ends in 24 days
              </div>
            </div>

            <div className="flex items-center justify-center py-4">
              <Cow size={96} />
              <div className="flex flex-col items-center justify-center ">
                <div className="text-2xl font-bold">35 USDC</div>
                <div className="text-lg">Saved</div>
              </div>
            </div>

            <p className="text-xl p-4 text-center">
              {isReadyToWithdraw
                ? `${cowName} is ready to receive the funds`
                : `Withdrawing now will affect ${cowName} :(`}
            </p>
            <div className="w-full flex justify-center px-4 pb-4">
              <button
                onClick={handleWithdrawConfirm}
                className="w-full py-3 border-2 border-b-4 border-black rounded-xl text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
