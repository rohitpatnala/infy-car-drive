// src/ChunkManager.tsx
import { useEffect, useState } from "react";
import { Mesh } from "three";
import Terrain from "./Terrain";
import Road from "./Road";
import Environment from "./Environment";
import RoadMarkings from "./RoadMarkings";

const TILE_SIZE = 50;
const RADIUS = 1; // 3×3 grid

type TileKey = `${number},${number}`;

export default function ChunkManager({
  carRef,
}: {
  carRef: React.RefObject<Mesh>;
}) {
  const [tiles, setTiles] = useState<TileKey[]>([]);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (carRef.current) {
        const xTile = Math.floor(carRef.current.position.x / TILE_SIZE);
        const zTile = Math.floor(carRef.current.position.z / TILE_SIZE);

        const newTiles: TileKey[] = [];
        for (let dx = -RADIUS; dx <= RADIUS; dx++) {
          for (let dz = -RADIUS; dz <= RADIUS; dz++) {
            newTiles.push(`${xTile + dx},${zTile + dz}` as TileKey);
          }
        }

        setTiles((prev) =>
          prev.length === newTiles.length &&
          prev.every((t) => newTiles.includes(t))
            ? prev
            : newTiles
        );
      }
      frameId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frameId);
  }, [carRef]);

  return (
    <>
      {tiles.map((key) => {
        const [tx, tz] = key.split(",").map(Number);
        const offsetX = tx * TILE_SIZE;
        const offsetZ = tz * TILE_SIZE;

        return (
          <group key={key} position={[offsetX, 0, offsetZ]}>
            <Terrain offsetX={offsetX} offsetZ={offsetZ} />
            <Road offsetX={offsetX} offsetZ={offsetZ} />
            <RoadMarkings offsetX={offsetX} offsetZ={offsetZ} carRef={carRef} />
            <Environment offsetX={offsetX} offsetZ={offsetZ} />
          </group>
        );
      })}
    </>
  );
}
