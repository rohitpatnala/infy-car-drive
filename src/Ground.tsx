// src/Ground.tsx
import { usePlane } from "@react-three/cannon";

export default function Ground() {
  // Physics plane at y=0, horizontal
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
}
