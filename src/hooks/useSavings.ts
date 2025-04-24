import { useState, useCallback } from 'react';
import { VaquitaData } from '@/types/Vaquita';

export const useSavings = (initialCows: VaquitaData[] = []) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [cows, setCows] = useState<VaquitaData[]>(initialCows);
  const totalCows = cows.filter((cow) => cow.status === "active").length;


  const handleDeposit = useCallback((amount: number) => {
    setTotalSaved((prevTotalSaved) => prevTotalSaved + amount);
    const newCow: VaquitaData = {
      id: Date.now().toString(), 
      position: {x: 8, y: -0.3, z: 8},
      createdAt: new Date(),
      amount: String(amount),
      state: "walking",
      status: "active",
    };
    setCows((prevCows) => [...prevCows, newCow]);
  }, []);

  const withdrawVaquita = useCallback((id: string) => {
    setCows((prev) =>
      prev.map((cow) =>
        cow.id === id ? { ...cow, status: "inactive" } : cow
      )
    );

    const cow = cows.find((c) => c.id === id);
    if (cow) {
      setTotalSaved((prev) => prev - Number(cow.amount));
    }

    setTimeout(() => {
      setCows((prev) => prev.filter((cow) => cow.id !== id));
    }, 60000);
  }, [cows]);

  return {
    totalSaved,
    cows,
    totalCows,
    handleDeposit,
    withdrawVaquita
  };
}; 