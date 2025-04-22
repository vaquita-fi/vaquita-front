"use client";

import { Walking } from "./states/Walking";
import { Working } from "./states/Working";
import { Sleeping } from "./states/Sleeping";
import { VaquitaState } from "@/types/Vaquita";

interface VaquitaProps {
  state: VaquitaState;
}

export const Vaquita = ({ state }: VaquitaProps) => {
  if (state === "walking") return <Walking />;
  if (state === "working") return <Working />;
  if (state === "sleeping") return <Sleeping />;
  return null;
};
