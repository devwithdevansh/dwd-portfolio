import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function HospitalShield() {
  const outerRingRef = useRef();
  const innerCrossRef = useRef();
  const innerCrossRef2 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (outerRingRef.current) {
      // Rotate the tech shield
      outerRingRef.current.rotation.x = time * 0.2;
      outerRingRef.current.rotation.y = time * 0.3;
    }
    if (innerCrossRef.current && innerCrossRef2.current) {
      // Slowly rotate the medical cross in the opposite direction
      innerCrossRef.current.rotation.y = -time * 0.4;
      innerCrossRef2.current.rotation.y = -time * 0.4;
      
      // Gentle pulse on the cross
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      innerCrossRef.current.scale.set(pulse, pulse, pulse);
      innerCrossRef2.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group scale={1.3}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        
        {/* The Outer Software Engine Shield (Emerald Wireframe) */}
        <mesh ref={outerRingRef}>
          <icosahedronGeometry args={[1.8, 2]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#059669"
            emissiveIntensity={1}
            roughness={0.1}
            metalness={0.8}
            wireframe={true}
            transparent={true}
            opacity={0.6}
          />
        </mesh>
        
        {/* The Inner Patient Front Door (Blue Cross) */}
        <group ref={innerCrossRef}>
          <mesh>
            <boxGeometry args={[1.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={2} roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
        <group ref={innerCrossRef2}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[1.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={2} roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
        
      </Float>
      
      {/* Particles combining both Emerald (Software) and Blue (Website) colors */}
      <Sparkles count={40} scale={4.5} size={3} speed={0.4} opacity={0.6} color="#60a5fa" />
      <Sparkles count={40} scale={4.5} size={3} speed={0.3} opacity={0.6} color="#34d399" />
    </group>
  );
}
