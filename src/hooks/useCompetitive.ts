import { useState } from 'react';

const useCompetitive = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [totalOfVaquitas, setTotalOfVaquitas] = useState<any[]>([]);
  const [rachaDiasAhorrando, setRachaDiasAhorrando] = useState(0);
  const [totalAhorrado, setTotalAhorrado] = useState(0);

  const deposit = (id: string, amount: number) => {
    // Lógica de depósito
    console.log(`Deposit ${amount} for ${id}`);
  };

  const withdraw = (id: string, amount: number) => {
    // Lógica de retiro
    console.log(`Withdraw ${amount} for ${id}`);
  };

  return {
    numberOfPlayers,
    totalOfVaquitas,
    rachaDiasAhorrando,
    totalAhorrado,
    deposit,
    withdraw,
  };
};

export default useCompetitive;
