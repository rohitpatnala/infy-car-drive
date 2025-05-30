// src/RoadMarkings.tsx
import { useRef, useMemo } from "react";
import {
  CatmullRomCurve3,
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineDashedMaterial,
  Vector3,
  Mesh,
} from "three";
import { useFrame } from "@react-three/fiber";
import { createNoise2D } from "simplex-noise";

const TILE_SIZE = 50;
const SEGMENTS = 20;
const NOISE_SCALE = 0.1;
const MAX_CURVE = 2;

// one noise generator for chunk continuity
const noise2D = createNoise2D();

type RoadMarkingsProps = {
  offsetX: number;
  offsetZ: number;
  carRef: React.RefObject<Mesh>;
};

export default function RoadMarkings({
  offsetX,
  offsetZ,
  carRef,
}: RoadMarkingsProps) {
  const lineRef = useRef<Line>(null);

  // build the dashed center‐line geometry
  const geometry = useMemo(() => {
    // sample points along the road center
    const pts: Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const localZ = -t * TILE_SIZE;

      // world coords for noise continuity
      const worldX = offsetX;
      const worldZ = offsetZ + localZ;

      // lateral noise offset
      const x = noise2D(worldX * NOISE_SCALE, worldZ * NOISE_SCALE) * MAX_CURVE;
      pts.push(new Vector3(x, 0.051, localZ)); // slightly above road surface
    }

    // pack into a BufferGeometry
    const positions = new Float32BufferAttribute(
      new Float32Array(pts.flatMap((v) => [v.x, v.y, v.z])),
      3
    );
    const geo = new BufferGeometry();
    geo.setAttribute("position", positions);
    geo.computeBoundingSphere();
    return geo;
  }, [offsetX, offsetZ]);

  // each frame, move & rotate with the car
  useFrame(() => {
    const line = lineRef.current;
    const car = carRef.current;
    if (line && car) {
      line.position.copy(car.position);
      line.rotation.y = car.rotation.y;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineDashedMaterial
        color="white"
        dashSize={1}
        gapSize={1}
        linewidth={1}
      />
    </line>
  );
}
