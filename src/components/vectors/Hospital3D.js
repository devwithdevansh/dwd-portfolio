import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Edges, MeshTransmissionMaterial } from '@react-three/drei';
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
      leftWing.current.position.z = THREE.MathUtils.lerp(leftWing.current.position.z, hovered ? 0.5 : 0, 0.08);
    }
    if (rightWing.current) {
      rightWing.current.position.x = THREE.MathUtils.lerp(rightWing.current.position.x, targetOffset, 0.08);
      rightWing.current.position.y = THREE.MathUtils.lerp(rightWing.current.position.y, hovered ? -0.3 : 0, 0.08);
      rightWing.current.position.z = THREE.MathUtils.lerp(rightWing.current.position.z, hovered ? -0.5 : 0, 0.08);
    }
  });

  const glassColor = hovered ? "#06B6D4" : "#ffffff";
  const coreColor = hovered ? "#022B3A" : "#111111";

  return (
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
          {/* Glass Exterior */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 3.5, 1.5]} />
            <MeshTransmissionMaterial 
              backside
              samples={4}
              thickness={0.5}
              roughness={0.1}
              transmission={0.9}
              ior={1.5}
              color={glassColor}
            />
            <Edges scale={1} threshold={15} color={hovered ? "#00FFFF" : "#555555"} />
          </mesh>
          
          {/* Inner Structural Core (Gives depth through the glass) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 3.4, 1.2]} />
            <meshStandardMaterial color={coreColor} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Glowing Neon Medical Cross (Front Face) */}
          <group position={[0, 1.2, 0.76]}>
            <mesh>
              <boxGeometry args={[0.2, 0.6, 0.05]} />
              <meshBasicMaterial color={hovered ? "#00FFFF" : "#555555"} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.6, 0.2, 0.05]} />
              <meshBasicMaterial color={hovered ? "#00FFFF" : "#555555"} />
            </mesh>
          </group>

          {/* Helipad on Roof */}
          <group position={[0, 1.76, 0]}>
            {/* Pad Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.6, 32]} />
              <meshStandardMaterial color={coreColor} />
              <Edges color={hovered ? "#06B6D4" : "#444"} />
            </mesh>
            {/* Helipad "H" */}
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
              <mesh position={[-0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/><meshBasicMaterial color={hovered ? "#00FFFF" : "#666"} /></mesh>
              <mesh position={[0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/><meshBasicMaterial color={hovered ? "#00FFFF" : "#666"} /></mesh>
              <mesh position={[0, 0, 0]}><planeGeometry args={[0.3, 0.05]}/><meshBasicMaterial color={hovered ? "#00FFFF" : "#666"} /></mesh>
            </group>
          </group>
        </group>

        {/* ======================= */}
        {/* LEFT WING               */}
        {/* ======================= */}
        <group ref={leftWing} position={[0, 0, 0]}>
          {/* Glass Exterior */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 2.5, 1.2]} />
            <MeshTransmissionMaterial backside samples={4} thickness={0.5} roughness={0.1} transmission={0.9} ior={1.5} color={glassColor} />
            <Edges scale={1} threshold={15} color={hovered ? "#06B6D4" : "#444444"} />
          </mesh>
          {/* Inner Core */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.0, 2.4, 1.0]} />
            <meshStandardMaterial color={coreColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* ======================= */}
        {/* RIGHT WING              */}
        {/* ======================= */}
        <group ref={rightWing} position={[0, 0, 0]}>
          {/* Glass Exterior */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 2.5, 1.2]} />
            <MeshTransmissionMaterial backside samples={4} thickness={0.5} roughness={0.1} transmission={0.9} ior={1.5} color={glassColor} />
            <Edges scale={1} threshold={15} color={hovered ? "#06B6D4" : "#444444"} />
          </mesh>
          {/* Inner Core */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.0, 2.4, 1.0]} />
            <meshStandardMaterial color={coreColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

      </group>
    </Float>
  );
}
