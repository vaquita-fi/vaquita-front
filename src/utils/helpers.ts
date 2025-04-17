import { Position, Velocity } from '@/types/Cow';

export const getRandomPosition = (): Position => {
    const container = document.querySelector(".relative.w-full.h-full");
    const width = container?.clientWidth || 300;
    const height = container?.clientHeight || 400;
    const x = (Math.random() - 0.5) * (width - 80);
    const y = (Math.random() - 0.5) * (height - 80);
    return { x, y };
  };

export const getRandomVelocity = (): Velocity => {
    const velocity = {
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      };
    return velocity;
    }; 