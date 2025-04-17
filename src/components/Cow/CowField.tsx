"use client";

import { useRef, useEffect, useState } from "react";
import { useCowMovement } from "@/hooks/useCowMovement";
import { CowData } from "@/types/Cow";
import MovingCow from "../MovingCow";
import CowDetails from "./CowDetails";

export interface CowFieldProps {
  cows: CowData[];
}

export default function CowField({ cows: initialCows }: CowFieldProps) {
  const [localCows, setLocalCows] = useState<CowData[]>(initialCows);
  const [selectedCow, setSelectedCow] = useState<CowData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Usar el hook personalizado
  useCowMovement(setLocalCows, containerRef as React.RefObject<HTMLDivElement>);

  // Efecto para sincronizar vacas
  useEffect(() => {
    setLocalCows((prev) => {
      const existingCowIds = new Set(prev.map((cow) => cow.id));
      const newCows = initialCows.filter((cow) => !existingCowIds.has(cow.id));
      return [...prev, ...newCows];
    });
  }, [initialCows]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div className="absolute w-full h-full bg-primary" ref={containerRef}>
        {localCows.map((cow) => (
          <MovingCow
            key={cow.id}
            cow={cow}
            containerWidth={containerRef.current?.offsetWidth || 0}
            containerHeight={containerRef.current?.offsetHeight || 0}
            onClick={() => setSelectedCow(cow)}
          />
        ))}
      </div>

      {selectedCow && (
        <CowDetails cow={selectedCow} onClose={() => setSelectedCow(null)} />
      )}
    </div>
  );
}
