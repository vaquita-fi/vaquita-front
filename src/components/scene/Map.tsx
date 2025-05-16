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
import { GoalType, Deposit } from "@/types/Goal";
import { VaquitaData } from "@/types/Vaquita";
import { VaquitaModal } from "../ui/VaquitaModal";
import { useState } from "react";
import { mapDepositsToVaquitas } from "@/utils/mapDepositsToVaquitas";

export const Map = ({
  totalSaved,
  goalTarget,
  goalType,
  mycows,
  onWithdraw,
  othercows,
}: {
  totalSaved: number;
  goalTarget: number;
  goalType: GoalType;
  mycows: Deposit[];
  onWithdraw: (id: string) => void;
  othercows?: Deposit[];
}) => {
  const { trees, rocks } = useTerrain();
  const { stage, percentage } = useGoalProgress({ totalSaved, goalTarget });
  const [selectedCow, setSelectedCow] = useState<VaquitaData | null>(null);

  const myVaquitas = mapDepositsToVaquitas(mycows);
  const otherVaquitas = mapDepositsToVaquitas(othercows || []);

  return (
    <div className="relative w-full h-full">
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

        {myVaquitas.map((cow) => (
          <VaquitaController
            key={cow.id}
            id={cow.id}
            cow={cow}
            onSelect={() => setSelectedCow(cow)}
          />
        ))}

        {otherVaquitas.map((cow) => (
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
            onWithdraw(cow.id);
            setSelectedCow(null);
          }}
        />
      )}
    </div>
  );
};
