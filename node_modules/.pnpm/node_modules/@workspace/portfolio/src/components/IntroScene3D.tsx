import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sparkles, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function IcosahedronCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.2;
      outerRef.current.rotation.y += delta * 0.35;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#0080FF"
          emissiveIntensity={2.5}
          wireframe
        />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#00FFFF"
          emissiveIntensity={4}
        />
      </mesh>
    </Float>
  );
}

function NeuralParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 24;
  }

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00FFFF" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

interface IntroScene3DProps {
  phase: number;
}

export default function IntroScene3D({ phase }: IntroScene3DProps) {
  return (
    <Canvas
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

      {phase >= 1 && (
        <Stars radius={100} depth={60} count={4000} factor={4} saturation={0} fade speed={0.8} />
      )}
      {phase >= 1 && <NeuralParticles />}
      {phase >= 2 && <IcosahedronCore />}
      {phase >= 2 && (
        <Sparkles count={150} scale={12} size={2.5} speed={0.3} opacity={0.9} color="#00FFFF" />
      )}

      <Environment preset="night" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} intensity={2} />
      </EffectComposer>
    </Canvas>
  );
}
