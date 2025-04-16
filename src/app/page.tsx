"use client";

import ActionButtons from "@/components/ActionButtons";
import CowField from "@/components/Cow/CowField";
import Header from "@/components/Header";
import SavingsForm from "@/components/SavingsForm";
import StatsPanel from "@/components/StatsPanel";
import TopBar from "@/components/TopBar";
import { CowData } from "@/types/Cow";
import { useState } from "react";

export default function Home() {
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [cows, setCows] = useState<
    {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      counter: number;
      createdAt: Date;
    }[]
  >([]);
  const [walletAddress] = useState("0X1234...abcd");

  const getRandomPosition = () => {
    // Usar dimensiones del contenedor rectangular
    const width = 300; // Ancho aproximado del contenedor
    const height = 400; // Alto aproximado del contenedor

    // Generar posiciones aleatorias dentro del rectángulo
    const x = (Math.random() - 0.5) * (width - 80); // 80 es el doble del tamaño de la vaca
    const y = (Math.random() - 0.5) * (height - 80);

    return { x, y };
  };

  const handleDeposit = () => {
    const depositAmount = 10;
    setTotalSaved((prev) => prev + depositAmount);

    const newInterest = Number.parseFloat(
      ((totalSaved + depositAmount) * 0.0001).toFixed(2)
    );
    setTotalStaked(newInterest);

    // Usar la nueva función
    const position = getRandomPosition();
    setCows((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        counter: 1,
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <main className="flex flex-col items-center h-screen overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="w-full max-w-md bg-[#FFF8E7] h-full flex flex-col justify-around border-2 border-black">
        <div>
          <Header walletAddress={walletAddress} />
          <TopBar />
          <StatsPanel totalSaved={totalSaved} totalStaked={totalStaked} />
        </div>
        <CowField cows={cows as CowData[]} />
        <SavingsForm handleDeposit={handleDeposit} countCows={cows.length} />
      </div>
      <ActionButtons />
    </main>
  );
}
