'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function GlobeWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Gold wireframe material
  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#c9a84c'),
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    []
  );

  // Glow material
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#c9a84c'),
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
      }),
    []
  );

  // Inner glow material
  const innerGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#d4a843'),
        transparent: true,
        opacity: 0.08,
      }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.02;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <group>
      {/* Main wireframe globe */}
      <Sphere ref={meshRef} args={[2, 32, 32]} material={wireframeMaterial} />

      {/* Outer glow */}
      <Sphere ref={glowRef} args={[2.15, 32, 32]} material={glowMaterial} />

      {/* Inner subtle glow */}
      <Sphere args={[1.85, 32, 32]} material={innerGlowMaterial} />

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.02, 0.005, 8, 100]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.4} />
      </mesh>

      {/* Tilt ring */}
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[2.05, 0.003, 8, 100]} />
        <meshBasicMaterial color="#e2c66d" transparent opacity={0.25} />
      </mesh>

      {/* Latitude lines */}
      {[-1, -0.5, 0.5, 1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(4 - y * y), 0.003, 8, 80]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const theta = (i / 30) * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2.3 + Math.random() * 0.3;
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.sin(phi) * Math.sin(theta),
              r * Math.cos(phi),
            ]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#e2c66d" transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Globe3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#c9a84c" />
        <pointLight position={[-10, -10, -5]} intensity={0.15} color="#d4a843" />
        <GlobeWireframe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
