import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Gold dust particles surrounding the diamond
function GoldDust({ count = 200 }) {
  const points = useRef();

  // Generate random positions and velocities for the dust
  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread them in a spherical volume
      const r = 3 + Math.random() * 5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = Math.random() * 0.02 + 0.01;
    }
    return [positions, speeds];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slowly rotate the entire particle system
    points.current.rotation.y = time * 0.05;
    points.current.rotation.z = time * 0.03;

    // Gently bob the particles
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.002;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Diamond3D() {
  const diamondRef = useRef();

  useFrame((state) => {
    if (diamondRef.current) {
      // Spin majestic horizontally like a jewelry display
      diamondRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group>
      {/* High Dynamic Range Environment map is necessary for Transmission to refract something */}
      <Environment preset="city" />
      
      <GoldDust count={150} />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <group ref={diamondRef}>
          {/* The Massive Diamond (Scaled up to look like a true statement piece) */}
          <mesh scale={0.95} position={[0, 1.42, 0]}>
            {/* Icosahedron with detail=0 looks like a brilliant cut gem/diamond */}
            <icosahedronGeometry args={[1, 0]} />
            
            <MeshTransmissionMaterial
              backside
              backsideThickness={5}
              thickness={2}
              roughness={0}
              transmission={1}
              ior={2.4} /* 2.4 is the index of refraction for Diamond */
              chromaticAberration={0.06}
              anisotropy={0.1}
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              clearcoat={1}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
              color="#ffffff"
            />
          </mesh>

          {/* The Golden Ring Band (Standing vertically) */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[1.2, 0.15, 32, 100]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              metalness={1} 
              roughness={0.1} 
              envMapIntensity={2} 
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
