"use client";

import { Canvas } from "@react-three/fiber";
import { VaquitaController } from "../voxel-entity/Vaquita/VaquitaController";
import { Ground } from "./Ground";
import { useTerrain } from "@/hooks/useTerrain";
import Tree from "./Tree";
import Rock from "./Rock";
import { SceneLighting } from "./SceneLighting";
import { SceneCamera } from "./SceneCamera";
import { SceneControls } from "./SceneControls";

export const Map = () => {
  const { trees, rocks } = useTerrain();

  return (
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
      <VaquitaController id="v-1" startPosition={[10, 0.5, 6]} />
      <VaquitaController id="v-2" startPosition={[1, 0.5, 6]} />

      <SceneControls />
    </Canvas>
  );
};
