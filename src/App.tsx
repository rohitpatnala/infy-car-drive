import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import ChunkManager from "./ChunkManager";
import Car from "./Car";
import CameraRig from "./CameraRig";

export default function App() {
  const carRef = useRef<Mesh>(null);

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 5, 10], fov: 60 }}
      shadows
    >
      {/* lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* infinite terrain + road */}
      <ChunkManager carRef={carRef} />

      {/* car and follow camera */}
      <Car ref={carRef} />
      <CameraRig targetRef={carRef} />
    </Canvas>
  );
}
