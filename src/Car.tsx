import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

type KeyMap = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
};

const Car = forwardRef<Mesh>((_, ref) => {
  const carRef = useRef<Mesh>(null);
  const speed = 0.2;
  const turnSpeed = 0.03;

  // Expose the mesh instance to parent
  useImperativeHandle(ref, () => carRef.current!, []);

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

  // Move the car each frame
  useFrame(() => {
    const car = carRef.current;
    if (!car) return;

    if (keys.ArrowDown) {
      car.position.x -= Math.sin(car.rotation.y) * speed;
      car.position.z -= Math.cos(car.rotation.y) * speed;
    }
    if (keys.ArrowUp) {
      car.position.x += Math.sin(car.rotation.y) * speed;
      car.position.z += Math.cos(car.rotation.y) * speed;
    }
    if (keys.ArrowLeft) {
      car.rotation.y += turnSpeed;
    }
    if (keys.ArrowRight) {
      car.rotation.y -= turnSpeed;
    }
  });

  return (
    <mesh ref={carRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default Car;
