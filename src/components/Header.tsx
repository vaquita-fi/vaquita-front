import React from "react";

const Header = ({ walletAddress }: { walletAddress: string }) => {
  return (
    <div className="flex justify-between items-center p-2">
      <h1 className="text-3xl font-bold">Vaquita</h1>
      <div className="px-4 py-2 border border-black rounded-full text-sm">
        {walletAddress}
      </div>
    </div>
  );
};

export default Header;
