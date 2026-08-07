import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function GlowingHeart() {
  const heartRef = useRef();

  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    
    // Heart shape definition
    shape.moveTo( x + 5, y + 5 );
    shape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    shape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
    shape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    shape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    shape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    shape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    // Create a Plus (Cross) hole in the center
    const holePath = new THREE.Path();
    const cx = 5, cy = 11; // Center of the cross relative to the heart
    const hw = 1.2, hL = 3.5; // Half-width (thickness) and Half-length of the cross

    // Draw cross path (counter-clockwise relative to the heart)
    holePath.moveTo(cx - hw, cy + hL);
    holePath.lineTo(cx - hw, cy + hw);
    holePath.lineTo(cx - hL, cy + hw);
    holePath.lineTo(cx - hL, cy - hw);
    holePath.lineTo(cx - hw, cy - hw);
    holePath.lineTo(cx - hw, cy - hL);
    holePath.lineTo(cx + hw, cy - hL);
    holePath.lineTo(cx + hw, cy - hw);
    holePath.lineTo(cx + hL, cy - hw);
    holePath.lineTo(cx + hL, cy + hw);
    holePath.lineTo(cx + hw, cy + hw);
    holePath.lineTo(cx + hw, cy + hL);
    holePath.lineTo(cx - hw, cy + hL); // Close path

    shape.holes.push(holePath);

    const extrudeSettings = {
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry so rotation pivots around its true center
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    // Scale it down to fit nicely in the view
    geometry.scale(0.12, 0.12, 0.12);
    
    // Rotate to orient the heart upwards
    geometry.rotateX(Math.PI);

    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (heartRef.current) {
      // Gentle spin
      heartRef.current.rotation.y = time * 0.4;
      
      // Realistic heartbeat (lub-dub) effect
      const beatPeriod = 1.2; // seconds per full heartbeat cycle
      const t = time % beatPeriod;
      
      let targetScale = 1;
      
      // Lub (first beat)
      if (t < 0.15) {
        targetScale = 1.15;
      } 
      // Dub (second, slightly stronger beat)
      else if (t > 0.25 && t < 0.4) {
        targetScale = 1.25;
      }
      
      // Smoothly interpolate to the target scale for organic movement
      heartRef.current.scale.x = THREE.MathUtils.lerp(heartRef.current.scale.x, targetScale, 0.2);
      heartRef.current.scale.y = THREE.MathUtils.lerp(heartRef.current.scale.y, targetScale, 0.2);
      heartRef.current.scale.z = THREE.MathUtils.lerp(heartRef.current.scale.z, targetScale, 0.2);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={heartRef} geometry={heartGeometry}>
          <MeshDistortMaterial
            color="#3b82f6" // blue-500
            emissive="#2563eb" // blue-600
            emissiveIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.15} // Slight organic distortion
            speed={3}
          />
        </mesh>
      </Float>
      
      {/* Ambient sparkles matching the blue theme */}
      <Sparkles count={50} scale={4} size={3} speed={0.4} opacity={0.6} color="#60a5fa" />
      <Sparkles count={30} scale={6} size={6} speed={0.2} opacity={0.3} color="#93c5fd" />
    </group>
  );
}
