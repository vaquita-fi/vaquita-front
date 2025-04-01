"use client";

import Cow from "./Cow";

// import { X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Cow from "@/components/cow";

interface CowData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  counter: number;
  createdAt?: Date;
}

interface CowDetailsProps {
  cow: CowData;
  onClose: () => void;
}

export default function CowDetails({ cow, onClose }: CowDetailsProps) {
  // Calcular tiempo de vida
  const createdAt = cow.createdAt || new Date();
  const lifeTime = Math.floor((Date.now() - createdAt.getTime()) / 1000); // en segundos

  // Calcular velocidad
  const speed = Math.sqrt(cow.vx * cow.vx + cow.vy * cow.vy).toFixed(2);

  // Calcular dirección (en grados)
  const direction = (Math.atan2(cow.vy, cow.vx) * (180 / Math.PI)).toFixed(0);

  // Calcular posición relativa
  const position = `(${cow.x.toFixed(0)}, ${cow.y.toFixed(0)})`;

  // Calcular progreso del contador
  const progress = (cow.counter / 1000) * 100;

  return (
    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
      <div className="bg-[#FFF8E7] rounded-xl p-4 w-[250px] border-2 border-black">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">
            Vaquita #{cow.id.toString().slice(-4)}
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-transparent"
          >
            x
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16">
            <Cow size={64} hasHat={false} />
          </div>
          <div className="text-center bg-[#F9A03F] p-3 rounded-full border border-black">
            <span className="text-2xl font-bold">{cow.counter}</span>
            <div className="text-xs">Contador</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Tiempo de vida:</span>
            <span>{lifeTime} segundos</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Velocidad:</span>
            <span>{speed} px/s</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Dirección:</span>
            <span>{direction}°</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Posición:</span>
            <span>{position}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs mb-1 flex justify-between">
            <span>Progreso del contador</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#7AB259] h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
