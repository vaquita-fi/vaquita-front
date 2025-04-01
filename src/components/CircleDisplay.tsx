import React from "react";
import CowField from "./CowField";
interface ICows {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  counter: number;
  createdAt: Date;
}
const CircleDisplay = ({ cows }: { cows: ICows[] }) => {
  return (
    <div className="flex justify-center mb-6 relative ">
      <CowField cows={cows} />
    </div>
  );
};

export default CircleDisplay;
