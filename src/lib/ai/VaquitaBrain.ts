import { VaquitaState } from "@/types/Vaquita";

export class VaquitaBrain {
  private lastStateChange: number;
  public state: VaquitaState;
  private position: [number, number];

  constructor(initial: VaquitaState = "walking", position: [number, number]) {
    this.state = initial;
    this.lastStateChange = performance.now();
    this.position = position;
  }

  shouldChangeState(): boolean {
    if (this.state === "withdrawing") return false; 

    const now = performance.now();
    const delay = this.getDelayForCurrentState();
    return now - this.lastStateChange > delay;
  }

  nextState(): VaquitaState {
    const probabilities: [VaquitaState, number][] = [
      ["working", 0.5],
      ["walking", 0.3],
      ["sleeping", 0.2],
    ];

    const next = this.weightedRandom(probabilities);
    this.state = next;
    this.lastStateChange = performance.now();
    return next;
  }

  getDelayForCurrentState(): number {
    switch (this.state) {
      case "walking":
        return 40000; // 40s
      case "working":
        return 50000; // 50s
      case "sleeping":
        return 20000; // 20s  
        // TODO: review this logic because it's not necessary to have a delay for withdrawing
      case "withdrawing":
        return 0;
    }
  }

  updatePosition(pos: [number, number]) {
    this.position = pos;
  }

  private weightedRandom(weights: [VaquitaState, number][]): VaquitaState {
    const total = weights.reduce((acc, [, prob]) => acc + prob, 0);
    const rand = Math.random() * total;

    let sum = 0;
    for (const [state, prob] of weights) {
      sum += prob;
      if (rand <= sum) return state;
    }

    return weights[0][0]; // fallback
  }
}
