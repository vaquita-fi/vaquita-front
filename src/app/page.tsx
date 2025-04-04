"use client";

import ActionButtons from "@/components/ActionButtons";
import CircleDisplay from "@/components/CircleDisplay";
import Header from "@/components/Header";
import SavingsForm from "@/components/SavingsForm";
import StatsPanel from "@/components/StatsPanel";
import TopBar from "@/components/TopBar";
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
    setTotalStaked(newInterest);

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
    <main className="flex flex-col items-center h-screen overflow-hidden bg-gradient-to-r from-[#CEEDFB] to-[#E8DFFC]">
      <div className="w-full max-w-md bg-[#FFF8E7] h-full flex flex-col justify-around border-2 border-black">
        <div>
          <Header walletAddress={walletAddress} />
          <TopBar />
          <ActionButtons />
          <StatsPanel totalSaved={totalSaved} totalStaked={totalStaked} />
        </div>
        <CircleDisplay cows={cows} />
        <SavingsForm handleDeposit={handleDeposit} countCows={cows.length} />
      </div>
    </main>
  );
}
