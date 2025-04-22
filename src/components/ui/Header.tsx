"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
const Header = ({ walletAddress }: { walletAddress: string }) => {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) return <p>Cargando...</p>;
  if (authenticated) return <button onClick={logout}>Cerrar sesión</button>;

  return <button onClick={login}>Iniciar sesión</button>;
  // return (
  //   <div className="flex items-center justify-between p-2">
  //     <h1 className="text-3xl font-bold">Vaquita</h1>
  //     <div className="px-4 py-2 text-sm border border-black rounded-full">
  //       {walletAddress}
  //     </div>
  //   </div>
  // );
};

export default Header;
