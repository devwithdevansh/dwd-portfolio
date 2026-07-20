import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Edges } from '@react-three/drei';
import * as THREE from 'three';

export default function Hospital3D({ hovered }) {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly rotate the entire campus
      group.current.rotation.y += delta * 0.2;
      
      // If hovered, slightly tilt it towards the user for drama
      const targetRotationX = hovered ? 0.15 : 0;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    }

    // Expand the side buildings (wings) on hover
    const targetOffset = hovered ? 1.6 : 0;
    
    if (leftWing.current) {
      // Left wing slides out and drops slightly
      leftWing.current.position.x = THREE.MathUtils.lerp(leftWing.current.position.x, -targetOffset, 0.08);
      leftWing.current.position.y = THREE.MathUtils.lerp(leftWing.current.position.y, hovered ? -0.5 : 0, 0.08);
    }
    if (rightWing.current) {
      // Right wing slides out and drops slightly
      rightWing.current.position.x = THREE.MathUtils.lerp(rightWing.current.position.x, targetOffset, 0.08);
      rightWing.current.position.y = THREE.MathUtils.lerp(rightWing.current.position.y, hovered ? -0.5 : 0, 0.08);
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={1} 
      floatingRange={[-0.1, 0.1]} 
    >
      <group ref={group} scale={hovered ? 1.2 : 1} position={[0, -0.5, 0]}>
        
        {/* Core Skyscraper (Main Hospital Building) */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 3.5, 1.5]} />
          <MeshDistortMaterial 
            color={hovered ? "#0a0a0a" : "#111111"} 
            envMapIntensity={1} 
            clearcoat={1} 
            roughness={0.2}
            metalness={0.9}
            distort={0}
          />
          {/* Glowing architectural edges */}
          <Edges 
            scale={1} 
            threshold={15} 
            color={hovered ? "#06B6D4" : "#333333"} 
          />
        </mesh>
        
        {/* Left Wing (Expands outwards) */}
        <mesh ref={leftWing} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 2.5, 1.2]} />
          <MeshDistortMaterial 
            color={hovered ? "#080808" : "#111111"} 
            envMapIntensity={1} 
            clearcoat={1} 
            roughness={0.2}
            metalness={0.9}
            distort={hovered ? 0.2 : 0}
            speed={hovered ? 4 : 0}
          />
          <Edges scale={1} threshold={15} color={hovered ? "#06B6D4" : "#222222"} />
        </mesh>

        {/* Right Wing (Expands outwards) */}
        <mesh ref={rightWing} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 2.5, 1.2]} />
          <MeshDistortMaterial 
            color={hovered ? "#080808" : "#111111"} 
            envMapIntensity={1} 
            clearcoat={1} 
            roughness={0.2}
            metalness={0.9}
            distort={hovered ? 0.2 : 0}
            speed={hovered ? 4 : 0}
          />
          <Edges scale={1} threshold={15} color={hovered ? "#06B6D4" : "#222222"} />
        </mesh>
        
        {/* Helipad / Roof Structure */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
          <meshStandardMaterial color={hovered ? "#06B6D4" : "#222222"} />
        </mesh>

      </group>
    </Float>
  );
}
