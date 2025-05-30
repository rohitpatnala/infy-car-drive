import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, Mesh } from "three";
import { createNoise2D } from "simplex-noise";

const TILE_SIZE = 50;
const SEGMENTS = 50;
const NOISE_FREQ = 0.05;

// single noise generator
const noise2D = createNoise2D();

type TerrainProps = {
  offsetX: number;
  offsetZ: number;
};

export default function Terrain({ offsetX, offsetZ }: TerrainProps) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions: number[] = [];

    for (let i = 0; i <= SEGMENTS; i++) {
      for (let j = 0; j <= SEGMENTS; j++) {
        // local x,z within tile
        const x = (i / SEGMENTS - 0.5) * TILE_SIZE;
        const z = (j / SEGMENTS - 0.5) * TILE_SIZE;

        // world coordinates for noise continuity
        const worldX = x + offsetX;
        const worldZ = z + offsetZ;

        // height from noise
        const y = noise2D(worldX * NOISE_FREQ, worldZ * NOISE_FREQ) * 2;

        positions.push(x, y, z);
      }
    }

    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [offsetX, offsetZ]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#88cc88" />
    </mesh>
  );
}
