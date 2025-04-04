"use client";

import { useRef, useEffect, useState } from "react";
import Cow from "./Cow";
import CowDetails from "./CowDetails";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

interface CowData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  counter: number;
  createdAt?: Date;
  amount: string;
  amountWithdrawn: string;
  companyId: string;
  contractAddress: string;
  crypto: string;
  customerPublicKey: string;
  depositId: string;
  ownerUserId: string;
  rewardWithdrawn: string;
  state: string;
  status: string;
  timestamp: number;
  transactionHash: string;
  updatedAt: Date;
  _id: string;
}

export interface CowFieldProps {
  cows: CowData[];
}

export default function CowField({ cows: initialCows }: CowFieldProps) {
  const [localCows, setLocalCows] = useState<CowData[]>(initialCows);
  const [selectedCow, setSelectedCow] = useState<CowData | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastCounterUpdateRef = useRef<number>(Date.now());
  const circleRadius = 140; // Radio del círculo
  const frameRate = 30; // Reducir la velocidad de actualización (30 fps en lugar de 60)
  const lastFrameTimeRef = useRef<number>(0);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Actualizar localCows cuando cambia cows (props)
  useEffect(() => {
    setLocalCows((prevCows) => {
      // Mantener las vaquitas existentes con sus posiciones actualizadas
      // y añadir las nuevas vaquitas
      const existingCowIds = new Set(prevCows.map((cow) => cow.id));
      const newCows = initialCows.filter((cow) => !existingCowIds.has(cow.id));
      return [...prevCows, ...newCows];
    });
  }, [initialCows]);

  // Efecto para manejar la animación y el contador
  useEffect(() => {
    const updateCows = (timestamp: number) => {
      // Limitar la velocidad de actualización para movimiento más lento
      if (timestamp - lastFrameTimeRef.current < 1000 / frameRate) {
        animationRef.current = requestAnimationFrame(updateCows);
        return;
      }

      lastFrameTimeRef.current = timestamp;

      // Actualizar contadores cada 2 segundos
      const now = Date.now();
      const shouldUpdateCounter = now - lastCounterUpdateRef.current >= 2000;

      if (shouldUpdateCounter) {
        lastCounterUpdateRef.current = now;
      }

      setLocalCows((prevCows) =>
        prevCows.map((cow) => {
          // Calcular nueva posición
          let newX = cow.x + cow.vx;
          let newY = cow.y + cow.vy;
          let newVx = cow.vx;
          let newVy = cow.vy;

          // Calcular distancia desde el centro
          const distance = Math.sqrt(newX * newX + newY * newY);

          // Si la vaquita se sale del círculo, rebota
          if (distance > circleRadius) {
            // Normalizar el vector de posición
            const nx = newX / distance;
            const ny = newY / distance;

            // Reflejar la velocidad (rebote)
            const dotProduct = nx * newVx + ny * newVy;
            newVx = newVx - 2 * dotProduct * nx;
            newVy = newVy - 2 * dotProduct * ny;

            // Ajustar posición para que esté dentro del círculo
            newX = nx * (circleRadius - 5); // 5px dentro del borde
            newY = ny * (circleRadius - 5);
          }

          // Añadir un poco de aleatoriedad al movimiento ocasionalmente (pero menos frecuente)
          if (Math.random() < 0.005) {
            // Reducido de 0.02 a 0.005
            newVx += (Math.random() - 0.5) * 0.1; // Reducido de 0.5 a 0.1
            newVy += (Math.random() - 0.5) * 0.1;

            // Limitar la velocidad máxima
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 0.5) {
              // Reducido de 2 a 0.5
              newVx = (newVx / speed) * 0.5;
              newVy = (newVy / speed) * 0.5;
            }
          }

          // Actualizar contador si es necesario
          let newCounter = cow.counter;
          if (shouldUpdateCounter && newCounter < 1000) {
            newCounter += 1;
          }

          return {
            ...cow,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            counter: newCounter,
          };
        })
      );

      // Actualizar la vaca seleccionada si existe
      if (selectedCow) {
        const updatedSelectedCow = localCows.find(
          (cow) => cow.id === selectedCow.id
        );
        if (updatedSelectedCow) {
          setSelectedCow(updatedSelectedCow);
        }
      }

      animationRef.current = requestAnimationFrame(updateCows);
    };

    animationRef.current = requestAnimationFrame(updateCows);

    // Limpiar animación al desmontar
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedCow]);

  const handleCowClick = (cow: CowData) => {
    setSelectedCow(cow);
  };

  const handleCloseDetails = () => {
    setSelectedCow(null);
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Orange circle */}
      <div className="absolute w-full h-full rounded-full bg-[#F9A03F] border-[1px] border-black border-b-8"></div>

      {/* Dynamically placed cows */}
      {localCows.map((cow) => (
        <div
          key={cow.id}
          className="absolute cursor-pointer"
          style={{
            left: `calc(50% + ${cow.x}px)`,
            top: `calc(50% + ${cow.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => handleCowClick(cow)}
        >
          <div className="relative">
            <Cow size={40} />
            <div className="absolute px-2 py-1 text-xs font-bold transform -translate-x-1/2 border border-black rounded-full -top-6 left-1/2 bg-accent">
              {cow.counter}
            </div>
          </div>
        </div>
      ))}

      {/* Cow details modal */}
      {selectedCow && (
        <CowDetails cow={selectedCow} onClose={handleCloseDetails} />
      )}
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
