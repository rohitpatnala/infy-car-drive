import { useMemo } from "react";
import { Shape, ExtrudeGeometry, CatmullRomCurve3, Vector3, Mesh } from "three";
import { createNoise2D } from "simplex-noise";

const TILE_SIZE = 50;
const SEGMENTS = 20;
const WIDTH = 4;
const HEIGHT = 0.05;
const NOISE_SCALE = 0.1;
const MAX_CURVE = 2;

// single noise generator
const noise2D = createNoise2D();

type RoadProps = {
  offsetX: number;
  offsetZ: number;
};

export default function Road({ offsetX, offsetZ }: RoadProps) {
  const geometry = useMemo(() => {
    // build curved centerline for this tile
    const pts: Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const localZ = -t * TILE_SIZE;

      // world coords for noise continuity
      const worldX = offsetX + 0; // centerline starts at local x=0
      const worldZ = offsetZ + localZ;

      // lateral offset from noise
      const x = noise2D(worldX * NOISE_SCALE, worldZ * NOISE_SCALE) * MAX_CURVE;
      pts.push(new Vector3(x, 0.01, localZ));
    }

    const curve = new CatmullRomCurve3(pts);

    // extrude a thin rectangle along that curve
    const shape = new Shape()
      .moveTo(-WIDTH / 2, 0)
      .lineTo(WIDTH / 2, 0)
      .lineTo(WIDTH / 2, -HEIGHT)
      .lineTo(-WIDTH / 2, -HEIGHT)
      .closePath();

    return new ExtrudeGeometry(shape, {
      steps: SEGMENTS,
      bevelEnabled: false,
      extrudePath: curve,
    });
  }, [offsetX, offsetZ]);

  return (
    <mesh
      geometry={geometry}
      // Mesh is built in local coords; chunk manager will position it
      receiveShadow
    >
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}
