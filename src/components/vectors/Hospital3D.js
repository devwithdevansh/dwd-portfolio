import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Edges, Grid } from '@react-three/drei';
import * as THREE from 'three';

export default function Hospital3D({ hovered }) {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      // Smoothly rotate the entire blueprint campus
      group.current.rotation.y += delta * 0.1;
      
      const targetRotationX = hovered ? 0.15 : 0.1;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    }

    // Expand the side buildings (wings) on hover
    const targetOffset = hovered ? 1.6 : 0;
    
    if (leftWing.current) {
      leftWing.current.position.x = THREE.MathUtils.lerp(leftWing.current.position.x, -targetOffset, 0.08);
    }
    if (rightWing.current) {
      rightWing.current.position.x = THREE.MathUtils.lerp(rightWing.current.position.x, targetOffset, 0.08);
    }
  });

  // Realistic Blueprint Colors
  const blueprintGlass = "#020817"; // Very dark blue/black transparent body
  const cyanGlow = "#00ffff"; // Glowing blueprint lines
  const subtleGlow = "#0ea5e9"; // Secondary lines (windows)
  const crossColor = "#ff0055"; // Bright pinkish red for the cross
  
  // Blueprint Materials: transparent, depthWrite false for that X-Ray CAD look
  const primaryMat = <meshBasicMaterial color={blueprintGlass} transparent opacity={0.6} depthWrite={false} />;
  const secondaryMat = <meshBasicMaterial color={blueprintGlass} transparent opacity={0.8} depthWrite={false} />;
  const windowMat = <meshBasicMaterial color={subtleGlow} transparent opacity={0.2} depthWrite={false} />;
  const crossMat = <meshBasicMaterial color={crossColor} transparent opacity={0.8} depthWrite={false} />;

  // Razor sharp cyan outlines
  const edgeProps = { scale: 1.0, color: cyanGlow, threshold: 15 };
  const windowEdgeProps = { scale: 1.0, color: subtleGlow, threshold: 15 };

  // Helper to generate rows of windows
  const renderWindows = (rows, cols, w, h, spacing, offsetX, offsetY, offsetZ) => {
    let windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push(
          <mesh 
            key={`${r}-${c}`} 
            position={[
              offsetX + c * spacing, 
              offsetY + r * spacing, 
              offsetZ
            ]}
          >
            <planeGeometry args={[w, h]} />
            {windowMat}
            <Edges {...windowEdgeProps} />
          </mesh>
        );
      }
    }
    return windows;
  };

  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      {/* Start with an isometric-ish base rotation */}
      <group ref={group} rotation={[0.1, -0.5, 0]} scale={hovered ? 1.1 : 0.9} position={[0, -0.5, 0]}>
        
        {/* ======================= */}
        {/* BLUEPRINT GRID          */}
        {/* ======================= */}
        <Grid 
          position={[0, -1.8, 0]} 
          args={[10, 10]} 
          cellColor={cyanGlow} 
          sectionColor={cyanGlow} 
          sectionThickness={1} 
          cellThickness={0.3} 
          fadeDistance={10} 
        />

        {/* ======================= */}
        {/* CORE TOWER (Main Hosp)  */}
        {/* ======================= */}
        <group position={[0, 0, 0]}>
          {/* Main Block */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 3.5, 1.5]} />
            {primaryMat}
            <Edges {...edgeProps} />
          </mesh>
          
          {/* Top Block (Tiered Architecture) */}
          <mesh position={[0, 1.9, 0]}>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            {secondaryMat}
            <Edges {...edgeProps} />
          </mesh>

          {/* Entrance Canopy */}
          <group position={[0, -1.6, 0.8]}>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1, 0.1, 0.6]} />
              {secondaryMat}
              <Edges {...edgeProps} />
            </mesh>
            <mesh position={[-0.4, 0, 0.2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              {primaryMat}
              <Edges {...edgeProps} />
            </mesh>
            <mesh position={[0.4, 0, 0.2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              {primaryMat}
              <Edges {...edgeProps} />
            </mesh>
          </group>

          {/* Medical Cross (Hologram Red) */}
          <group position={[0, 1.2, 0.76]}>
            <mesh><boxGeometry args={[0.2, 0.6, 0.02]} />{crossMat}<Edges color={crossColor} /></mesh>
            <mesh><boxGeometry args={[0.6, 0.2, 0.02]} />{crossMat}<Edges color={crossColor} /></mesh>
          </group>

          {/* Helipad on Roof */}
          <group position={[0, 2.11, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.5, 32]} />
              {secondaryMat}
              <Edges {...edgeProps} />
            </mesh>
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
              <mesh position={[-0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/>{windowMat}</mesh>
              <mesh position={[0.15, 0, 0]}><planeGeometry args={[0.05, 0.3]}/>{windowMat}</mesh>
              <mesh position={[0, 0, 0]}><planeGeometry args={[0.3, 0.05]}/>{windowMat}</mesh>
            </group>
          </group>

          {/* Front Windows (Main Tower) */}
          <group position={[0, 0, 0.76]}>
             {renderWindows(6, 4, 0.15, 0.2, 0.3, -0.45, -0.6, 0)}
          </group>
        </group>

        {/* ======================= */}
        {/* LEFT WING               */}
        {/* ======================= */}
        <group ref={leftWing} position={[0, 0, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[1.2, 2.5, 1.2]} />
            {primaryMat}
            <Edges {...edgeProps} />
          </mesh>
          {/* Front Windows (Left Wing) */}
          <group position={[0, -0.2, 0.61]}>
             {renderWindows(5, 3, 0.15, 0.2, 0.3, -0.3, -0.6, 0)}
          </group>
        </group>

        {/* ======================= */}
        {/* RIGHT WING              */}
        {/* ======================= */}
        <group ref={rightWing} position={[0, 0, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[1.2, 2.5, 1.2]} />
            {primaryMat}
            <Edges {...edgeProps} />
          </mesh>
          {/* Front Windows (Right Wing) */}
          <group position={[0, -0.2, 0.61]}>
             {renderWindows(5, 3, 0.15, 0.2, 0.3, -0.3, -0.6, 0)}
          </group>
        </group>

      </group>
    </Float>
  );
}
