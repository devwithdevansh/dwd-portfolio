import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Turbine3D() {
  const turbineRef = useRef();
  const coreRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Smoothly interpolate rotation speed and glow based on hover state
  const speed = useRef(0.02);
  const glow = useRef(0);

  useFrame((state, delta) => {
    // Target speed: faster if hovered or active
    const targetSpeed = active ? 0.2 : (hovered ? 0.1 : 0.01);
    speed.current = THREE.MathUtils.lerp(speed.current, targetSpeed, 0.05);
    
    // Target glow: brighter if active or hovered
    const targetGlow = active ? 2 : (hovered ? 1 : 0);
    glow.current = THREE.MathUtils.lerp(glow.current, targetGlow, 0.05);

    if (turbineRef.current) {
      turbineRef.current.rotation.z -= speed.current; // Spin the blades
    }
    
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = glow.current;
    }
  });

  const bladeCount = 24;
  const blades = Array.from({ length: bladeCount }).map((_, i) => {
    const angle = (i / bladeCount) * Math.PI * 2;
    return (
      <mesh key={i} rotation={[0.2, 0, angle]} position={[Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0]}>
        {/* Blade geometry */}
        <boxGeometry args={[0.8, 0.05, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
    );
  });

  return (
    <group>
      <Environment preset="city" />
      
      {/* PresentationControls makes the entire model grab-able and rotatable by the user */}
      <PresentationControls 
        global={false} // Only drag when clicking the object
        cursor={true}
        snap={true} // Snap back to original position when released
        speed={1.5}
        zoom={1.2}
        polar={[-Math.PI / 4, Math.PI / 4]} // Limit vertical rotation
        azimuth={[-Math.PI / 4, Math.PI / 4]} // Limit horizontal rotation
      >
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group 
            scale={1.2}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={() => setActive(true)}
            onPointerUp={() => setActive(false)}
          >
            
            {/* Outer Heavy Casing */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.2, 2.2, 1, 64]} openEnded={true} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
            </mesh>

            {/* Inner Casing Lip */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
              <torusGeometry args={[2.2, 0.1, 16, 64]} />
              <meshStandardMaterial color="#EAB308" metalness={0.6} roughness={0.2} />
            </mesh>

            {/* The Rotating Turbine Assembly */}
            <group ref={turbineRef}>
              {/* Hub / Core */}
              <mesh ref={coreRef} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 0.6, 32]} />
                <meshStandardMaterial 
                  color="#1E293B" 
                  metalness={0.8} 
                  roughness={0.2}
                  emissive="#EAB308"
                  emissiveIntensity={0}
                />
              </mesh>
              
              {/* Nose Cone */}
              <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.5, 0.4, 32]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
              </mesh>

              {/* Blades */}
              {blades}
            </group>

            {/* Back exhaust glow */}
            <mesh position={[0, 0, -0.4]}>
              <circleGeometry args={[2.1, 32]} />
              <meshBasicMaterial color="#EAB308" transparent opacity={hovered ? 0.4 : 0.1} />
            </mesh>

          </group>
        </Float>
      </PresentationControls>
    </group>
  );
}
