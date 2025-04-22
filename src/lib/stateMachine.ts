// lib/stateMachine.ts

import { VaquitaState } from "@/types/Vaquita";

export function getNextState(current: VaquitaState): VaquitaState {
  const states: VaquitaState[] = ["walking", "working", "sleeping"];
  const index = states.indexOf(current);
  const next = (index + 1) % states.length;
  return states[next];
}
