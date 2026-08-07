import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function GlowingOrb() {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // Create color targets for smooth lerping
  const blueColor = new THREE.Color("#3b82f6");
  const redColor = new THREE.Color("#ef4444"); // Red for the "Trap" section

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Get scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled past the hero section
      const scrollProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1.5);
      
      // Target distortion
      const targetDistort = 0.4 + (scrollProgress * 0.8);
      meshRef.current.material.distort += (targetDistort - meshRef.current.material.distort) * 0.05;
      
      // Target color
      const targetColor = blueColor.clone().lerp(redColor, Math.min(scrollProgress, 1));
      meshRef.current.material.color.lerp(targetColor, 0.05);
    }

    // Cinematic Mouse Parallax
    if (groupRef.current) {
      // state.pointer is normalized mouse position from -1 to +1
      const targetX = (state.pointer.x * 0.2);
      const targetY = (state.pointer.y * 0.2);
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep Space Atmosphere */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Dynamic Data Particles (Blue tint) */}
      <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.2} color="#93c5fd" />

      {/* The Core Engine */}
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </group>
  );
}
