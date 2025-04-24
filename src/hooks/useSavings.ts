import { useState, useCallback } from 'react';
import { VaquitaData } from '@/types/Vaquita';

export const useSavings = (initialCows: VaquitaData[] = []) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [cows, setCows] = useState<VaquitaData[]>(initialCows);

  const handleDeposit = useCallback((amount: number) => {
    
    setTotalSaved((prevTotalSaved) => prevTotalSaved + amount);


    const newCow: VaquitaData = {
      id: Date.now().toString(), 
      position: {x: 8, y: 0, z: 8},
      createdAt: new Date(),
      amount: String(amount),
      state: "walking",
      status: "active",
    };

    setCows((prevCows) => [...prevCows, newCow]);

  }, []);

  return {
    totalSaved,
    cows,
    handleDeposit,
  };
}; 