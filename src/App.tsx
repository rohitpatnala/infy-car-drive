// src/App.tsx
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { useRef } from "react";
import { Mesh } from "three";
import Ground from "./Ground";
import ChunkManager from "./ChunkManager";
import CarPhysics from "./CarPhysics";
import CameraRig from "./CameraRig";

export default function App() {
  const carRef = useRef<Mesh>(null);

  return (
    <Canvas
      shadows
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 5, 10], fov: 60 }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Physics world */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* Drivable ground plane */}
        <Ground />

        {/* Infinite terrain + road */}
        <ChunkManager carRef={carRef} />

        {/* Physics-driven car */}
        <CarPhysics ref={carRef} />
      </Physics>

      {/* Follow camera */}
      <CameraRig targetRef={carRef} />
    </Canvas>
  );
}
