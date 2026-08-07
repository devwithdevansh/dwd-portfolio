import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function DNAHelix() {
  const groupRef = useRef();
  
  const strandCount = 18;
  const radius = 1.4;
  const heightSpacing = 0.45;
  const rotationPerStep = 0.35;
  
  // Create color targets for smooth lerping
  const emeraldColor = new THREE.Color("#10b981");
  const redColor = new THREE.Color("#ef4444"); 

  const materials = useMemo(() => {
     return [...Array(strandCount)].map(() => ({
         mat1: new THREE.MeshStandardMaterial({ color: emeraldColor, emissive: "#059669", emissiveIntensity: 0.7, metalness: 0.8, roughness: 0.2 }),
         mat2: new THREE.MeshStandardMaterial({ color: "#3b82f6", emissive: "#1d4ed8", emissiveIntensity: 0.7, metalness: 0.8, roughness: 0.2 }),
         matLink: new THREE.MeshStandardMaterial({ color: "#94a3b8", transparent: true, opacity: 0.4, metalness: 1, roughness: 0.2 })
     }));
  }, [emeraldColor]);

  useFrame((state) => {
    // Rotation & float animation
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      groupRef.current.position.y = (Math.sin(state.clock.getElapsedTime()) * 0.3) - ((strandCount * heightSpacing) / 2);
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1.5);
      const targetColor = emeraldColor.clone().lerp(redColor, Math.min(scrollProgress, 1));
      
      materials.forEach(m => m.mat1.color.lerp(targetColor, 0.05));
    }

    // Cinematic Mouse Parallax
    if (groupRef.current) {
      const targetX = (state.pointer.x * 0.1);
      const targetY = (state.pointer.y * 0.1);
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={0.8} position={[0, -((strandCount * heightSpacing)/2), 0]}>
       {/* Deep Space Atmosphere */}
       <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
       
       {/* Ambient Tech Particles */}
       <Sparkles count={200} scale={15} size={2.5} speed={0.5} opacity={0.4} color="#6ee7b7" />
       
       {materials.map((m, i) => {
          const y = i * heightSpacing;
          const angle = i * rotationPerStep;
          
          // Parametric coordinates for a helix
          const x1 = Math.cos(angle) * radius;
          const z1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle + Math.PI) * radius;
          const z2 = Math.sin(angle + Math.PI) * radius;
          
          return (
             <group key={i} position={[0, y, 0]}>
                {/* Primary Data Node (Left) */}
                <Sphere args={[0.25, 32, 32]} position={[x1, 0, z1]} material={m.mat1} />
                
                {/* Secondary Data Node (Right) */}
                <Sphere args={[0.25, 32, 32]} position={[x2, 0, z2]} material={m.mat2} />
                
                {/* Connecting Synth Bridge */}
                <Cylinder args={[0.04, 0.04, radius * 2, 8]} rotation={[0, -angle, Math.PI / 2]} material={m.matLink} />
             </group>
          )
       })}
       
       {/* Core Central Light */}
       <pointLight position={[0, (strandCount * heightSpacing)/2, 0]} intensity={15} distance={15} color="#34d399" />
    </group>
  );
}
