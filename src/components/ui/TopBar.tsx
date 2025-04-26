import React from "react";

const TopBar = () => {
  return (
    <>
      <div className="flex justify-around w-full overflow-hidden text-sm font-semibold text-black border-gray-700 bg-success whitespace-nowrap">
        <p>PRE-ALPHA: Small amounts only</p>
        <p>PRE-ALPHA: Small amounts only</p>
      </div>
      <div className="flex items-center justify-center py-2 text-lg font-bold border-b-2 border-black border-t-1 bg-primary">
        Goal: Travel to Bolivia 🇧🇴✈️
      </div>
    </>
  );
};

export default TopBar;
