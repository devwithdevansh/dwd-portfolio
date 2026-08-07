import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function GlowingPulse() {
  const lineRef = useRef();
  const dotRef = useRef();

  const { curve, geometry } = useMemo(() => {
    let pts = [
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-8, 0, 0),
      // P wave (small bump)
      new THREE.Vector3(-7.5, 0.5, 0),
      new THREE.Vector3(-7, 0, 0),
      // Q (small dip)
      new THREE.Vector3(-6.5, -0.8, 0),
      // R (huge spike up)
      new THREE.Vector3(-6, 4.5, 0),
      // S (huge spike down)
      new THREE.Vector3(-5.5, -1.5, 0),
      new THREE.Vector3(-5, 0, 0),
      // T (medium bump)
      new THREE.Vector3(-3.5, 1.2, 0),
      new THREE.Vector3(-2.5, 0, 0),
      
      // Flat segment
      new THREE.Vector3(1, 0, 0),
      
      // P wave
      new THREE.Vector3(1.5, 0.5, 0),
      new THREE.Vector3(2, 0, 0),
      // Q
      new THREE.Vector3(2.5, -0.8, 0),
      // R (second spike)
      new THREE.Vector3(3, 3.5, 0), 
      // S
      new THREE.Vector3(3.5, -1.2, 0),
      new THREE.Vector3(4, 0, 0),
      // T
      new THREE.Vector3(5.5, 1.0, 0),
      new THREE.Vector3(6.5, 0, 0),
      
      // Flat end
      new THREE.Vector3(10, 0, 0),
    ];

    // Center and scale the points
    const box = new THREE.Box3().setFromPoints(pts);
    const center = new THREE.Vector3();
    box.getCenter(center);
    pts = pts.map(p => p.sub(center).multiplyScalar(0.45));

    // Create a smooth curve through the points
    const c = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1);
    
    // Create the 3D tube geometry
    const geo = new THREE.TubeGeometry(c, 300, 0.08, 8, false);

    return { curve: c, geometry: geo };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lineRef.current) {
      // Subtle pan and tilt
      lineRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      lineRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
    
    if (dotRef.current) {
      // Animate a glowing dot traveling along the EKG path
      // It completes one loop every 2.5 seconds
      const t = (time % 2.5) / 2.5; 
      const position = curve.getPointAt(t);
      dotRef.current.position.copy(position);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* The main EKG Line */}
        <mesh ref={lineRef} geometry={geometry}>
          <meshStandardMaterial 
            color="#3b82f6"      // Blue theme to match the website mode
            emissive="#2563eb"   // Glowing emissive blue
            emissiveIntensity={2} 
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {/* Traveling glowing pulse dot */}
        <mesh ref={dotRef}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#60a5fa" intensity={4} distance={3} />
        </mesh>
      </Float>
      
      {/* Subtle ambient particles */}
      <Sparkles count={40} scale={10} size={2} speed={0.4} opacity={0.4} color="#93c5fd" />
    </group>
  );
}
