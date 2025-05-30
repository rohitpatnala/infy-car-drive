// src/CarPhysics.tsx
import React, { forwardRef, useEffect, useState } from "react";
import { Mesh } from "three";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

type KeyMap = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
};

const CarPhysics = forwardRef<Mesh, {}>((_, ref) => {
  // Track arrow keys
  const [keys, setKeys] = useState<KeyMap>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      e.code in keys && setKeys((k) => ({ ...k, [e.code]: true }));
    const up = (e: KeyboardEvent) =>
      e.code in keys && setKeys((k) => ({ ...k, [e.code]: false }));

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keys]);

  // Create a dynamic box body
  const [boxRef, api] = useBox<Mesh>(
    () => ({
      mass: 500,
      args: [1, 0.5, 2], // width, height, length
      position: [0, 1, 0], // start 1 unit above ground
      angularDamping: 0.5, // helps stabilize rotation
      linearDamping: 0.5, // simulates friction
    }),
    ref
  );

  // Apply forces each frame based on key input
  useFrame(() => {
    if (keys.ArrowUp) {
      api.applyLocalForce([0, 0, -150], [0, 0, 0]); // forward
    }
    if (keys.ArrowDown) {
      api.applyLocalForce([0, 0, 150], [0, 0, 0]); // backward
    }
    if (keys.ArrowLeft) {
      api.applyLocalTorque([0, 5, 0]); // turn left
    }
    if (keys.ArrowRight) {
      api.applyLocalTorque([0, -5, 0]); // turn right
    }
  });

  return (
    <mesh castShadow ref={boxRef}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default CarPhysics;
