import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, Vector3 } from "three";

type CameraRigProps = {
  targetRef: React.RefObject<Mesh>;
};

export default function CameraRig({ targetRef }: CameraRigProps) {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    const car = targetRef.current;
    if (!car) return;

    // Offset 3 units up, 6 units behind in car's local space
    const offset = new Vector3(0, 3, -6).applyQuaternion(car.quaternion);
    const desiredPos = car.position.clone().add(offset);

    camera.position.lerp(desiredPos, 0.1);
    camera.lookAt(car.position);
  });

  return <group ref={groupRef} />;
}
