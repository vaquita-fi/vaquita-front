// src/components/MovingCow.tsx
import { CowData } from "../types/Cow";
import Cow from "./Cow/Cow";

interface MovingCowProps {
  cow: CowData;
  containerWidth: number;
  containerHeight: number;
  onClick: () => void;
}

export default function MovingCow({
  cow,
  containerWidth,
  containerHeight,
  onClick,
}: MovingCowProps) {
  console.log(containerHeight);
  console.log(containerWidth);
  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${cow.x + containerWidth / 2}px`,
        top: `${cow.y + containerHeight / 2}px`,
      }}
      onClick={onClick}
    >
      <div className="relative">
        <Cow size={40} />
        <div className="absolute px-2 py-1 text-xs font-bold -translate-x-1/2 border border-black rounded-full -top-6 left-1/2 bg-accent">
          {cow.counter}
        </div>
      </div>
    </div>
  );
}
