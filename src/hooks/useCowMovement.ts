import { useRef, useEffect } from 'react';
import { CowData } from '../types/Cow';

// Constantes
const FRAME_RATE = 30;
const COW_SIZE = 40;
const MIN_DISTANCE_MULTIPLIER = 1.2;
const REPULSION_FORCE = 0.5;
const MAX_SPEED = 0.5;
const RANDOM_MOVEMENT_CHANCE = 0.005;
const RANDOM_MOVEMENT_FORCE = 0.1;
const COUNTER_UPDATE_INTERVAL = 2000;

// Tipos
interface Position {
  x: number;
  y: number;
}

interface Velocity {
  vx: number;
  vy: number;
}

// Funciones auxiliares
const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const limitSpeed = (velocity: Velocity): Velocity => {
  const speed = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy);
  if (speed > MAX_SPEED) {
    return {
      vx: (velocity.vx / speed) * MAX_SPEED,
      vy: (velocity.vy / speed) * MAX_SPEED,
    };
  }
  return velocity;
};

const handleCollision = (
  currentCow: Position & Velocity,
  otherCow: Position,
  minDistance: number
): { newPosition: Position; newVelocity: Velocity } => {
  const dx = currentCow.x - otherCow.x;
  const dy = currentCow.y - otherCow.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= minDistance) {
    return { 
      newPosition: { x: currentCow.x, y: currentCow.y },
      newVelocity: { vx: currentCow.vx, vy: currentCow.vy }
    };
  }

  const angle = Math.atan2(dy, dx);
  const overlap = minDistance - distance;

  // Calcular nueva velocidad con repulsión
  const newVx = currentCow.vx + Math.cos(angle) * REPULSION_FORCE;
  const newVy = currentCow.vy + Math.sin(angle) * REPULSION_FORCE;

  // Ajustar posición para evitar superposición
  const newX = currentCow.x + (dx / distance) * overlap * 0.5;
  const newY = currentCow.y + (dy / distance) * overlap * 0.5;

  return {
    newPosition: { x: newX, y: newY },
    newVelocity: { vx: newVx, vy: newVy }
  };
};

const handleBoundaryCollision = (
  position: Position,
  velocity: Velocity,
  bounds: { maxX: number; maxY: number }
): { newPosition: Position; newVelocity: Velocity } => {
  let { x, y } = position;
  let { vx, vy } = velocity;

  if (x < -bounds.maxX / 2 || x > bounds.maxX / 2) {
    vx = -vx;
    x = x < 0 ? -bounds.maxX / 2 : bounds.maxX / 2;
  }

  if (y < -bounds.maxY / 2 || y > bounds.maxY / 2) {
    vy = -vy;
    y = y < 0 ? -bounds.maxY / 2 : bounds.maxY / 2;
  }

  return {
    newPosition: { x, y },
    newVelocity: { vx, vy }
  };
};

export const useCowMovement = (
  setLocalCows: React.Dispatch<React.SetStateAction<CowData[]>>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastCounterUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    const updateCows = (timestamp: number) => {
      // Control de frame rate
      if (timestamp - lastFrameTimeRef.current < 1000 / FRAME_RATE) {
        animationRef.current = requestAnimationFrame(updateCows);
        return;
      }

      lastFrameTimeRef.current = timestamp;
      const now = Date.now();
      const shouldUpdateCounter = now - lastCounterUpdateRef.current >= COUNTER_UPDATE_INTERVAL;

      if (shouldUpdateCounter) {
        lastCounterUpdateRef.current = now;
      }

      setLocalCows((prevCows) =>
        prevCows.map((cow) => {
          const containerWidth = containerRef.current?.offsetWidth || 300;
          const containerHeight = containerRef.current?.offsetHeight || 400;
          
          // Calcular nueva posición inicial
          let newPos = { x: cow.x + cow.vx, y: cow.y + cow.vy };
          let newVel = { vx: cow.vx, vy: cow.vy };

          // Manejar colisiones con otras vacas
          prevCows.forEach((otherCow) => {
            if (otherCow.id !== cow.id) {
              const collision = handleCollision(
                { ...newPos, ...newVel },
                { x: otherCow.x, y: otherCow.y },
                COW_SIZE * MIN_DISTANCE_MULTIPLIER
              );
              newPos = collision.newPosition;
              newVel = collision.newVelocity;
            }
          });

          // Manejar colisiones con los límites
          const boundaryCollision = handleBoundaryCollision(
            newPos,
            newVel,
            {
              maxX: containerWidth - COW_SIZE,
              maxY: containerHeight - COW_SIZE
            }
          );
          newPos = boundaryCollision.newPosition;
          newVel = boundaryCollision.newVelocity;

          // Aplicar movimiento aleatorio
          if (Math.random() < RANDOM_MOVEMENT_CHANCE) {
            newVel.vx += (Math.random() - 0.5) * RANDOM_MOVEMENT_FORCE;
            newVel.vy += (Math.random() - 0.5) * RANDOM_MOVEMENT_FORCE;
            newVel = limitSpeed(newVel);
          }

          // Actualizar contador
          const newCounter = shouldUpdateCounter && cow.counter < 1000
            ? cow.counter + 1
            : cow.counter;

          return {
            ...cow,
            ...newPos,
            ...newVel,
            counter: newCounter,
          };
        })
      );

      animationRef.current = requestAnimationFrame(updateCows);
    };

    animationRef.current = requestAnimationFrame(updateCows);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [setLocalCows, containerRef]);
};