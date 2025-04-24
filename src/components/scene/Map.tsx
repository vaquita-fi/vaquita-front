"use client";

import { Canvas } from "@react-three/fiber";
import { VaquitaController } from "../voxel-entity/Vaquita/VaquitaController";
import { GoalEntity } from "../voxel-entity/goal/GoalEntity";
import { Ground } from "./Ground";
import { useTerrain } from "@/hooks/useTerrain";
import Tree from "./Tree";
import Rock from "./Rock";
import { SceneLighting } from "./SceneLighting";
import { SceneCamera } from "./SceneCamera";
import { SceneControls } from "./SceneControls";
import { useGoalProgress } from "@/hooks/useGoalProgress";
import { GoalType } from "@/types/Goal";
import { VaquitaData } from "@/types/Vaquita";
import { VaquitaModal } from "../ui/VaquitaModal";
import { useState } from "react";

export const Map = ({
  totalSaved,
  goalTarget,
  goalType,
  cows,
  onWithdraw,
}: {
  totalSaved: number;
  goalTarget: number;
  goalType: GoalType;
  cows: VaquitaData[];
  onWithdraw: (id: string) => void;
}) => {
  const { trees, rocks } = useTerrain();
  const { stage, percentage } = useGoalProgress({ totalSaved, goalTarget });
  const [selectedCow, setSelectedCow] = useState<VaquitaData | null>(null);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEF5E4] to-[#F9E4BD] z-0" />
      <Canvas camera={{ fov: 50 }} shadows>
        <SceneLighting />
        <SceneCamera />
        <Ground />
        {trees.map((tree) => (
          <Tree
            key={tree.id}
            position={tree.position}
            beingWorked={tree.beingWorked}
            variant={tree.variant}
          />
        ))}

        {rocks.map((rock) => (
          <Rock
            key={rock.id}
            position={rock.position}
            beingWorked={rock.beingWorked}
            variant={rock.variant}
          />
        ))}

        <GoalEntity
          type={goalType}
          stage={stage}
          progressPercentage={percentage}
        />
        {cows.map((cow) => (
          <VaquitaController
            key={cow.id}
            id={cow.id}
            cow={cow}
            onSelect={() => setSelectedCow(cow)}
          />
        ))}
        <SceneControls />
      </Canvas>
      {selectedCow && selectedCow.status === "active" && (
        <VaquitaModal
          cow={selectedCow}
          isOpen={!!selectedCow}
          onClose={() => setSelectedCow(null)}
          onWithdraw={(cow) => {
            // Aquí llamas la   lógica de retirar
            onWithdraw(cow.id);
            setSelectedCow(null);
          }}
        />
      )}
    </div>
  );
};
