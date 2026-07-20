import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

export default function Hospital3D({ hovered }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly rotate the cross
      group.current.rotation.y += delta * 0.5;
      
      // If hovered, slightly tilt it towards the user
      const targetRotationX = hovered ? 0.2 : 0;
      group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.1;
    }
  });

  return (
    <Float
      speed={4} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
      floatingRange={[-0.2, 0.2]} // Range of y-axis values the object will float within
    >
      <group ref={group} scale={hovered ? 1.5 : 1} position={[0, 0, 0]}>
        {/* Vertical Box of the Cross */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1, 3, 1]} />
          <MeshDistortMaterial 
            color={hovered ? "#06B6D4" : "#ffffff"} 
            envMapIntensity={1} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
            roughness={0.2}
            metalness={0.8}
            distort={hovered ? 0.3 : 0} // Glitch/liquid effect on hover
            speed={hovered ? 5 : 0}
          />
        </mesh>
        
        {/* Horizontal Box of the Cross */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 1, 1]} />
          <MeshDistortMaterial 
            color={hovered ? "#06B6D4" : "#ffffff"} 
            envMapIntensity={1} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
            roughness={0.2}
            metalness={0.8}
            distort={hovered ? 0.3 : 0} // Glitch/liquid effect on hover
            speed={hovered ? 5 : 0}
          />
        </mesh>
      </group>
    </Float>
  );
}
