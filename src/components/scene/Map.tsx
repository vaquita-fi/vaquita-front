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
  myDeposits,
  onWithdraw,
  othercows,
}: {
  totalSaved: number;
  goalTarget: number;
  goalType: GoalType;
  myDeposits: Deposit[];
  onWithdraw: (id: string) => void;
  othercows?: Deposit[];
}) => {
  const { trees, rocks } = useTerrain();
  const { stage, percentage } = useGoalProgress({ totalSaved, goalTarget });
  const [selectedCow, setSelectedCow] = useState<VaquitaData[] | null>(null);

  const myDepositsVaquitas = mapDepositsToVaquitas(myDeposits);
  const otherDepositsVaquitas = mapDepositsToVaquitas(othercows || []);
  console.log({ otherDepositsVaquitas });

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

        {myDepositsVaquitas.length > 0 && (
          <VaquitaController
            cow={myDepositsVaquitas}
            onSelect={() => setSelectedCow(myDepositsVaquitas)}
          />
        )}
        {
          <VaquitaController
            cow={myDepositsVaquitas}
            onSelect={() => setSelectedCow(myDepositsVaquitas)}
          />
        }
        <SceneControls />
      </Canvas>

      {selectedCow && (
        <VaquitaModal
          vaquitas={myDepositsVaquitas}
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
