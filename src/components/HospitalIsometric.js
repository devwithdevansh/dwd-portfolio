import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function HospitalIsometric() {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating and subtle slow rotation for an alive feel
      groupRef.current.rotation.y = (Math.sin(time * 0.2) * 0.05) - (Math.PI / 4);
    }
  });

  return (
    // Isometric rotation setup
    <group ref={groupRef} scale={0.55} position={[0, -0.5, 0]} rotation={[Math.PI / 8, -Math.PI / 4, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.5}>
        
        {/* Base Platform */}
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[8, 0.5, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        
        {/* Grass Patches */}
        <mesh position={[-1.5, 0.01, 1.5]} receiveShadow>
          <boxGeometry args={[4, 0.1, 4]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>
        <mesh position={[2, 0.01, -2]} receiveShadow>
          <boxGeometry args={[3, 0.1, 3]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>

        {/* Main Building Body */}
        <mesh position={[-1, 2, -1]} castShadow receiveShadow>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        
        {/* Main Building Roof */}
        <mesh position={[-1, 4.1, -1]} castShadow>
          <boxGeometry args={[2.8, 0.2, 2.8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>

        {/* Windows (Blue Glass) */}
        {/* Front Windows */}
        <mesh position={[-0.9, 2.8, 0.51]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[-2.1, 2.8, 0.51]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[-0.9, 1.5, 0.51]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[-2.1, 1.5, 0.51]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Side Windows */}
        <mesh position={[0.51, 2.8, -0.9]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0.51, 2.8, -2.1]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0.51, 1.5, -0.9]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0.51, 1.5, -2.1]}>
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Side Building / Entrance */}
        <mesh position={[1.5, 1.5, 1]} castShadow receiveShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>

        {/* Red Cross on Side Building */}
        <group position={[1.5, 3.2, 2.01]}>
          <mesh>
            <boxGeometry args={[0.8, 0.25, 0.1]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.25, 0.1]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Entrance Door */}
        <mesh position={[1.5, 0.6, 2.01]}>
          <boxGeometry args={[1, 1.2, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Trees */}
        {/* Tree 1 */}
        <group position={[-2.5, 0.5, 2.5]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
             <sphereGeometry args={[0.6, 16, 16]} />
             <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
             <sphereGeometry args={[0.5, 16, 16]} />
             <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0, 1.7, 0]} castShadow>
             <sphereGeometry args={[0.4, 16, 16]} />
             <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Tree 2 */}
        <group position={[2.5, 0.5, -2]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
             <sphereGeometry args={[0.5, 16, 16]} />
             <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
             <sphereGeometry args={[0.4, 16, 16]} />
             <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Stylized Hospital Bed (Outside) */}
        <group position={[2, 0.4, 2.5]} rotation={[0, -Math.PI / 4, 0]}>
           {/* Bed Frame */}
           <mesh position={[0, 0, 0]} castShadow>
             <boxGeometry args={[1.6, 0.2, 2.2]} />
             <meshStandardMaterial color="#e2e8f0" />
           </mesh>
           <mesh position={[0, 0.4, -1.05]} castShadow>
             <boxGeometry args={[1.6, 0.8, 0.1]} />
             <meshStandardMaterial color="#cbd5e1" />
           </mesh>
           <mesh position={[0, 0.2, 1.05]} castShadow>
             <boxGeometry args={[1.6, 0.4, 0.1]} />
             <meshStandardMaterial color="#cbd5e1" />
           </mesh>
           
           {/* Mattress */}
           <mesh position={[0, 0.2, 0]} castShadow>
             <boxGeometry args={[1.5, 0.2, 2.0]} />
             <meshStandardMaterial color="#ffffff" />
           </mesh>
           
           {/* Blanket (Blue) */}
           <mesh position={[0, 0.22, 0.3]} castShadow>
             <boxGeometry args={[1.55, 0.25, 1.4]} />
             <meshStandardMaterial color="#3b82f6" />
           </mesh>
           
           {/* Pillows */}
           <mesh position={[-0.4, 0.35, -0.6]} castShadow>
             <boxGeometry args={[0.6, 0.15, 0.5]} />
             <meshStandardMaterial color="#f8fafc" />
           </mesh>
           <mesh position={[0.4, 0.35, -0.6]} castShadow>
             <boxGeometry args={[0.6, 0.15, 0.5]} />
             <meshStandardMaterial color="#f8fafc" />
           </mesh>
        </group>

      </Float>
    </group>
  );
}
