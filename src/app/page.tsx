"use client";

import ActionButtons from "@/components/ActionButtons";
import CircleDisplay from "@/components/CircleDisplay";
import SavingsForm from "@/components/SavingsForm";
import StatsPanel from "@/components/StatsPanel";
import TopBar from "@/components/TopBar";
import { useState } from "react";

export default function Home() {
  const [totalSaved, setTotalSaved] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
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

  // Función para calcular una posición aleatoria dentro del círculo
  const getRandomPositionInCircle = () => {
    // Radio del círculo es aproximadamente 150px
    const radius = 140;
    // Ángulo aleatorio
    const angle = Math.random() * 2 * Math.PI;
    // Distancia aleatoria desde el centro (raíz cuadrada para distribución uniforme)
    const distance = Math.sqrt(Math.random()) * radius;

    // Convertir coordenadas polares a cartesianas
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);

    return { x, y };
  };

  const handleDeposit = () => {
    // Simular un depósito de 10 USDC
    const depositAmount = 10;
    setTotalSaved((prev) => prev + depositAmount);

    // Calcular interés (0.01% del total)
    const newInterest = Number.parseFloat(
      ((totalSaved + depositAmount) * 0.0001).toFixed(2)
    );
    setInterestEarned(newInterest);

    // Crear una nueva vaquita con posición aleatoria y velocidad MUY LENTA
    const position = getRandomPositionInCircle();
    setCows((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 0.3, // Velocidad mucho más lenta (reducida 6-7 veces)
        vy: (Math.random() - 0.5) * 0.3, // Velocidad mucho más lenta
        counter: 1, // Iniciar contador en 1
        createdAt: new Date(), // Guardar la fecha de creación
      },
    ]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black h-screen bg-linear-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="w-full max-w-md p-4 gap-4 bg-[#FFF8E7] h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-4xl font-bold">Vaquita</h1>
          <div className="px-4 py-2 border border-black rounded-full text-sm">
            {walletAddress}
          </div>
        </div>
        <TopBar />
        <ActionButtons />
        <StatsPanel totalSaved={totalSaved} interestEarned={interestEarned} />
        <CircleDisplay cows={cows} />
        <SavingsForm handleDeposit={handleDeposit} />
      </div>
    </main>
  );
}
