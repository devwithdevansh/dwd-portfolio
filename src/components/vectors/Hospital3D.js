import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function Hospital3D({ hovered }) {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly rotate the entire campus
      group.current.rotation.y += delta * 0.15;
      
      // If hovered, tilt it towards the user
      const targetRotationX = hovered ? 0.2 : 0;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    }

    // Expand the side buildings (wings) on hover
    const targetOffset = hovered ? 1.8 : 0;
    
    if (leftWing.current) {
      leftWing.current.position.x = THREE.MathUtils.lerp(leftWing.current.position.x, -targetOffset, 0.08);
      leftWing.current.position.y = THREE.MathUtils.lerp(leftWing.current.position.y, hovered ? -0.3 : 0, 0.08);
    }
    if (rightWing.current) {
      rightWing.current.position.x = THREE.MathUtils.lerp(rightWing.current.position.x, targetOffset, 0.08);
      rightWing.current.position.y = THREE.MathUtils.lerp(rightWing.current.position.y, hovered ? -0.3 : 0, 0.08);
    }
  });

  // Soft Clay Materials
  const clayMaterial = (
    <meshStandardMaterial 
      color="#ffffff" 
      roughness={0.9} 
      metalness={0.05} 
    />
  );
  
  const accentMaterial = (
    <meshStandardMaterial 
      color="#06B6D4" // Medical Cyan
      roughness={0.8}
      metalness={0.1}
      emissive="#06B6D4"
      emissiveIntensity={hovered ? 0.4 : 0.1}
    />
  );

  const windowMaterial = (
    <meshStandardMaterial 
      color="#e0f2fe" // Very light blue
      roughness={0.2}
      metalness={0.8}
    />
  );

  return (
    <>
      <Environment preset="city" />
      <Float
        speed={2} 
        rotationIntensity={0.1} 
        floatIntensity={1} 
        floatingRange={[-0.1, 0.1]} 
      >
        <group ref={group} scale={hovered ? 1.1 : 0.9} position={[0, -0.5, 0]}>
          
          {/* ======================= */}
          {/* CORE TOWER (Main Hosp)  */}
          {/* ======================= */}
          <group position={[0, 0, 0]}>
            <RoundedBox args={[1.5, 3.5, 1.5]} radius={0.05} smoothness={4} castShadow receiveShadow>
              {clayMaterial}
            </RoundedBox>

            {/* Medical Cross Signage */}
            <group position={[0, 1.2, 0.76]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.6, 0.05]} />
                {accentMaterial}
              </mesh>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.6, 0.2, 0.05]} />
                {accentMaterial}
              </mesh>
            </group>

            {/* Helipad on Roof */}
            <group position={[0, 1.76, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <circleGeometry args={[0.6, 32]} />
                <meshStandardMaterial color="#f5f5f5" roughness={1} />
              </mesh>
              <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
                <mesh position={[-0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/>{accentMaterial}</mesh>
                <mesh position={[0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/>{accentMaterial}</mesh>
                <mesh position={[0, 0, 0]}><planeGeometry args={[0.3, 0.05]}/>{accentMaterial}</mesh>
              </group>
            </group>

            {/* Front Windows */}
            <mesh position={[0, -0.5, 0.76]} castShadow>
              <boxGeometry args={[0.8, 1.5, 0.05]} />
              {windowMaterial}
            </mesh>
          </group>

          {/* ======================= */}
          {/* LEFT WING               */}
          {/* ======================= */}
          <group ref={leftWing} position={[0, 0, 0]}>
            <RoundedBox args={[1.2, 2.5, 1.2]} radius={0.05} smoothness={4} castShadow receiveShadow>
              {clayMaterial}
            </RoundedBox>
            {/* Windows */}
            <mesh position={[0, 0, 0.61]} castShadow>
              <boxGeometry args={[0.6, 1.8, 0.05]} />
              {windowMaterial}
            </mesh>
          </group>

          {/* ======================= */}
          {/* RIGHT WING              */}
          {/* ======================= */}
          <group ref={rightWing} position={[0, 0, 0]}>
            <RoundedBox args={[1.2, 2.5, 1.2]} radius={0.05} smoothness={4} castShadow receiveShadow>
              {clayMaterial}
            </RoundedBox>
            {/* Windows */}
            <mesh position={[0, 0, 0.61]} castShadow>
              <boxGeometry args={[0.6, 1.8, 0.05]} />
              {windowMaterial}
            </mesh>
          </group>

        </group>
      </Float>
    </>
  );
}
