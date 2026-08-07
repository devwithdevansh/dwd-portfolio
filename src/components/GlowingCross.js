import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function GlowingCross() {
  const groupRef = useRef();
  const mat1Ref = useRef();
  const mat2Ref = useRef();
  
  // Create color targets for smooth lerping
  const emeraldColor = new THREE.Color("#10b981");
  const redColor = new THREE.Color("#ef4444"); // Red for the "Trap" section

  useFrame((state) => {
    // Rotation & float animation
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.2;
      
      // Get scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled past the hero section
      const scrollProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1.5);
      
      // Target color
      const targetColor = emeraldColor.clone().lerp(redColor, Math.min(scrollProgress, 1));
      
      if (mat1Ref.current) mat1Ref.current.color.lerp(targetColor, 0.05);
      if (mat2Ref.current) mat2Ref.current.color.lerp(targetColor, 0.05);
    }

    // Cinematic Mouse Parallax
    if (groupRef.current) {
      const targetX = (state.pointer.x * 0.2);
      const targetY = (state.pointer.y * 0.2);
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Deep Space Atmosphere */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Dynamic Data Particles (Emerald tint) */}
      <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.3} color="#6ee7b7" />

      {/* Vertical Bar */}
      <RoundedBox args={[0.8, 3.2, 0.8]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          ref={mat1Ref}
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>
      
      {/* Horizontal Bar */}
      <RoundedBox args={[3.2, 0.8, 0.8]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          ref={mat2Ref}
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Core Light */}
      <pointLight position={[0, 0, 0]} intensity={10} distance={10} color="#34d399" />
    </group>
  );
}
