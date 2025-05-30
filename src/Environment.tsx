// src/Environment.tsx
import React, { useRef, useMemo, useEffect } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";
import { createNoise2D } from "simplex-noise";

type EnvironmentProps = {
  offsetX: number;
  offsetZ: number;
};

const TREE_COUNT = 100;
const TILE_SIZE = 50;
const NOISE_FREQ = 0.05;

// use the same noise parameters as your terrain
const noise2D = createNoise2D();

export default function Environment({ offsetX, offsetZ }: EnvironmentProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // Precompute tree positions in local tile coords, sampling terrain height
  const positions = useMemo(() => {
    const pos: Vector3[] = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      // random point within the tile
      const xLocal = Math.random() * TILE_SIZE - TILE_SIZE / 2;
      const zLocal = Math.random() * TILE_SIZE - TILE_SIZE / 2;
      // world coordinates for noise continuity
      const worldX = xLocal + offsetX;
      const worldZ = zLocal + offsetZ;
      // sample terrain height function (must match Terrain’s noise logic)
      const y = noise2D(worldX * NOISE_FREQ, worldZ * NOISE_FREQ) * 2;
      pos.push(new Vector3(xLocal, y, zLocal));
    }
    return pos;
  }, [offsetX, offsetZ]);

  // Push those into the InstancedMesh on mount/update
  useEffect(() => {
    const mesh = meshRef.current!;
    positions.forEach((vec, i) => {
      dummy.position.copy(vec);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TREE_COUNT]}>
      {/* A simple cone for a “tree” */}
      <coneGeometry args={[0.5, 1, 8]} />
      <meshStandardMaterial color="darkgreen" />
    </instancedMesh>
  );
}
