import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Warning Sparks floating around the gear
function WarningSparks({ count = 100 }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = Math.random() * 0.05 + 0.02; // Faster than dust
    }
    return [positions, speeds];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    
    // Rotating sparks
    points.current.rotation.y = time * 0.1;
    points.current.rotation.z = time * 0.05;

    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Sparks move erratically
      positions[i3 + 1] += Math.sin(time * speeds[i] * 5 + i) * 0.005;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#EAB308" // Industrial Yellow
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Reusable Gear Component
function SingleGear({ radius, tube, teethCount, color, rotationSpeed, inverted = false }) {
  const gearRef = useRef();

  useFrame((state) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += (inverted ? -1 : 1) * rotationSpeed;
    }
  });

  const teeth = useMemo(() => {
    const arr = [];
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      arr.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rotation: [0, 0, angle]
      });
    }
    return arr;
  }, [teethCount, radius]);

  const gearMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 2
  }), [color]);

  return (
    <group ref={gearRef}>
      {/* The main ring of the gear */}
      <mesh material={gearMaterial}>
        <torusGeometry args={[radius, tube, 16, 64]} />
      </mesh>
      
      {/* Inner spoke hub */}
      <mesh material={gearMaterial}>
        <cylinderGeometry args={[radius * 0.3, radius * 0.3, tube * 1.5, 32]} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Spokes connecting hub to ring */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh key={i} material={gearMaterial} rotation={[0, 0, angle]} position={[Math.cos(angle) * radius * 0.5, Math.sin(angle) * radius * 0.5, 0]}>
          <boxGeometry args={[radius, tube * 0.8, tube * 0.8]} />
        </mesh>
      ))}

      {/* The teeth */}
      {teeth.map((tooth, i) => (
        <mesh key={i} material={gearMaterial} position={tooth.position} rotation={tooth.rotation}>
          <boxGeometry args={[tube * 2, tube * 2.5, tube * 2.5]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Gear3D() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle majestic overall rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <Environment preset="city" />
      <WarningSparks count={150} />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <group ref={groupRef} scale={1.2}>
          
          {/* Main Dark Industrial Gear */}
          <group position={[0, 0, 0.2]}>
            <SingleGear 
              radius={1.5} 
              tube={0.15} 
              teethCount={24} 
              color="#1E293B" // Slate 800
              rotationSpeed={0.005} 
            />
          </group>

          {/* Smaller Accent Gear Interlocking (Yellow) */}
          <group position={[-1.9, 0.8, 0.5]} scale={0.6}>
            <SingleGear 
              radius={1.5} 
              tube={0.25} 
              teethCount={24} 
              color="#EAB308" // Industrial Yellow
              rotationSpeed={0.005} 
              inverted={true}
            />
          </group>

          {/* Third Gear (Metallic Silver/Gray) */}
          <group position={[1.2, -1.8, -0.3]} scale={0.7} rotation={[0.2, -0.1, 0]}>
            <SingleGear 
              radius={1.5} 
              tube={0.2} 
              teethCount={24} 
              color="#94A3B8" // Slate 400
              rotationSpeed={0.007} 
              inverted={true}
            />
          </group>
          
        </group>
      </Float>
    </group>
  );
}
