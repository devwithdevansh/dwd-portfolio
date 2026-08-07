import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TorusKnot, Torus, MeshDistortMaterial, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Restaurant3DScene() {
  const knotRef = useRef();
  const ringRef = useRef();
  const groupRef = useRef();

  const orangeColor = new THREE.Color("#f97316");
  const amberColor = new THREE.Color("#f59e0b");

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (knotRef.current) {
      knotRef.current.rotation.x = elapsedTime * 0.3;
      knotRef.current.rotation.y = elapsedTime * 0.4;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1.5);
      
      // Dynamic color shift on scroll
      const targetColor = orangeColor.clone().lerp(amberColor, Math.min(scrollProgress, 1));
      knotRef.current.material.color.lerp(targetColor, 0.05);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = elapsedTime * 0.2;
      ringRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;
    }

    // Mouse Parallax
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.3;
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Warm Golden Orange Data Sparkles */}
      <Sparkles count={180} scale={10} size={2.5} speed={0.6} opacity={0.4} color="#f97316" />
      <Sparkles count={100} scale={8} size={1.8} speed={0.4} opacity={0.3} color="#fbbf24" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Core 3D Restaurant Knot Engine */}
        <TorusKnot ref={knotRef} args={[0.9, 0.3, 128, 32]} scale={1.3}>
          <MeshDistortMaterial
            color="#f97316"
            envMapIntensity={1.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.7}
            roughness={0.2}
            distort={0.35}
            speed={2.5}
          />
        </TorusKnot>

        {/* Orbiting Outer Halo Ring */}
        <Torus ref={ringRef} args={[1.8, 0.04, 32, 100]}>
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f97316"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
      </Float>
    </group>
  );
}
