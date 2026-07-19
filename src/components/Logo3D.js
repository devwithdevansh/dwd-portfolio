import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import logoImage from '../assets/logo.png';

export default function Logo3D() {
  const meshRef = useRef();
  
  // Load the logo texture
  const texture = useTexture(logoImage);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.5;
      // Mouse follow interaction
      const targetX = (state.mouse.x * Math.PI) / 4;
      const targetY = (state.mouse.y * Math.PI) / 4;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetX * 0.2, 0.1);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          {/* A metallic cylinder acting as a coin */}
          <cylinderGeometry args={[2, 2, 0.2, 64]} />
          
          <meshStandardMaterial 
            color="#111" 
            metalness={0.9} 
            roughness={0.1}
          />
          
          {/* Front face with the logo */}
          <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial 
              map={texture}
              transparent={true}
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={2}
            />
          </mesh>
          
          {/* Back face with the logo reversed or solid */}
          <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
             <circleGeometry args={[2, 64]} />
             <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} />
          </mesh>
        </mesh>
      </Float>

      {/* Environment for shiny reflections */}
      <Environment preset="city" />
      
      {/* Ground shadow */}
      <ContactShadows 
        position={[0, -3, 0]} 
        opacity={0.7} 
        scale={10} 
        blur={2} 
        far={4} 
      />
    </group>
  );
}
