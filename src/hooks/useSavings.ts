import { useState, useCallback } from 'react';
import { CowData } from '@/types/Cow';
import { getRandomPosition, getRandomVelocity } from '@/utils/helpers';

const INITIAL_INTEREST_RATE = 0.0001; // Ejemplo


export const useSavings = (initialCows: CowData[] = []) => {
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [cows, setCows] = useState<CowData[]>(initialCows);

  const handleDeposit = useCallback((amount: number) => {
    // Actualizar total ahorrado
    setTotalSaved((prevTotalSaved) => prevTotalSaved + amount);

    // Calcular y actualizar interés acumulado (usando el estado anterior para el cálculo inmediato)
    setTotalStaked(() => {
       // Necesitamos el valor *antes* de este depósito para calcular el interés correctamente
       const currentSavedForInterestCalc = totalSaved; // Captura el valor actual antes de la actualización del estado
       const newInterest = Number.parseFloat(
         ((currentSavedForInterestCalc + amount) * INITIAL_INTEREST_RATE).toFixed(2) // Usamos el valor actualizado para calcular
       );
       // Aquí podrías decidir si el interés se suma al anterior o lo reemplaza
       // Por ahora, parece que lo reemplaza según la lógica original:
       return newInterest;
       // Si quisieras sumarlo: return prevTotalStaked + newInterest;
    });
    const position = getRandomPosition();
    const velocity = getRandomVelocity();
    // Añadir nueva vaca
    const newCow: CowData = {
      id: Date.now(), // Usar un método más robusto para IDs si es necesario
      x: position.x,
      y: position.y,
      vx: velocity.vx,
      vy: velocity.vy,
      counter: 1,
      createdAt: new Date(),
      // Rellenar las demás propiedades de CowData con valores por defecto o vacíos
      amount: String(amount), // Guardar el monto depositado
      amountWithdrawn: "0",
      companyId: "",
      contractAddress: "",
      crypto: "USDC", // O la moneda correspondiente
      customerPublicKey: "", // Podría venir de otro estado/contexto
      depositId: `dep_${Date.now()}`, // ID único para el depósito
      ownerUserId: "", // Podría venir de otro estado/contexto
      rewardWithdrawn: "0",
      state: "STAKED", // Estado inicial
      status: "ACTIVE", // Estado inicial
      timestamp: Date.now(),
      transactionHash: "", // Se obtendría de una transacción real
      updatedAt: new Date(),
      _id: `cow_${Date.now()}`, // ID único para la vaca
    };

    setCows((prevCows) => [...prevCows, newCow]);

  }, [totalSaved]); // Dependencia de totalSaved para el cálculo del interés

  return {
    totalSaved,
    totalStaked,
    cows,
    setCows, // Exponer setCows si es necesario para otras operaciones (ej. remover vaca)
    handleDeposit,
  };
}; 