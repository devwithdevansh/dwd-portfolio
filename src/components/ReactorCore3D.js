import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function EnergyParticles({ count = 200, active }) {
  const points = useRef();
  const phase = useRef(0);

  const [positions, speeds, radii] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 3;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = 0.01 + Math.random() * 0.03;
      radii[i] = r;
    }
    return [positions, speeds, radii];
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    
    // Accumulate phase smoothly to avoid jumping when active state changes
    phase.current += delta * (active ? 3 : 1);
    
    points.current.rotation.y += delta * (active ? 0.5 : 0.1);
    points.current.rotation.x += delta * (active ? 0.3 : 0.05);

    const pos = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Use the smooth phase for pulsing
      const pulse = Math.sin(phase.current + i) * (active ? 0.1 : 0.02) * delta * 60;
      
      const length = Math.sqrt(pos[i3]**2 + pos[i3+1]**2 + pos[i3+2]**2);
      pos[i3] += (pos[i3] / length) * pulse;
      pos[i3+1] += (pos[i3+1] / length) * pulse;
      pos[i3+2] += (pos[i3+2] / length) * pulse;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false} raycast={() => null}>
      <PointMaterial
        transparent
        color="#EAB308"
        size={active ? 0.08 : 0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={active ? 0.9 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ReactorCore3D() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  
  const outerWireframeRef = useRef();
  const innerWireframeRef = useRef();
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  const speedMultiplier = useRef(1);
  const phase = useRef(0); // Smooth phase accumulator

  useFrame((state, delta) => {
    // 1. Smoothly interpolate speed multiplier using delta for framerate independence
    const targetSpeed = active ? 6 : (hovered ? 3 : 1);
    speedMultiplier.current = THREE.MathUtils.lerp(speedMultiplier.current, targetSpeed, delta * 5);
    
    // 2. Accumulate phase (this prevents the math.sin jumping bug!)
    const currentSpeed = speedMultiplier.current;
    phase.current += delta * currentSpeed;
    const p = phase.current;

    // Apply smooth incremental rotation
    if (outerWireframeRef.current) {
      outerWireframeRef.current.rotation.x = p * 0.2;
      outerWireframeRef.current.rotation.y = p * 0.3;
    }
    if (innerWireframeRef.current) {
      innerWireframeRef.current.rotation.x = -p * 0.4;
      innerWireframeRef.current.rotation.y = -p * 0.2;
    }
    
    if (ring1Ref.current) ring1Ref.current.rotation.z = p * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.y = p * 0.7;
    if (ring3Ref.current) ring3Ref.current.rotation.x = p * 0.9;

    if (coreRef.current) {
      // Smooth pulsing using the accumulated phase
      const pulse = Math.sin(p * 5) * 0.1 + 1;
      coreRef.current.scale.set(pulse, pulse, pulse);
      
      // Interpolate glow intensity
      const targetGlow = active ? 3 : (hovered ? 2 : 1);
      const currentGlow = coreRef.current.material.emissiveIntensity;
      coreRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(currentGlow, targetGlow * pulse, delta * 10);
    }
  });

  return (
    <group>
      <Environment preset="city" />
      
      {/* Particles don't interact with mouse */}
      <EnergyParticles count={300} active={hovered || active} />

      <PresentationControls 
        global={false} 
        cursor={true}
        snap={true} 
        speed={2}
        zoom={1.5}
        polar={[-Math.PI / 2, Math.PI / 2]} 
        azimuth={[-Math.PI, Math.PI]} 
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <group 
            scale={1.2}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
            onPointerDown={(e) => { e.stopPropagation(); setActive(true); }}
            onPointerUp={(e) => { e.stopPropagation(); setActive(false); }}
          >
            {/* INVISIBLE HITBOX to make hover state perfectly stable (prevents flickering when hovering over gaps in wireframe) */}
            <mesh visible={false}>
              <sphereGeometry args={[2.7, 32, 32]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* The Solid Glowing Core */}
            <mesh ref={coreRef}>
              <icosahedronGeometry args={[0.8, 2]} />
              <meshStandardMaterial 
                color="#EAB308" 
                emissive="#EAB308" 
                emissiveIntensity={1} 
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Inner Wireframe Sphere */}
            <mesh ref={innerWireframeRef}>
              <icosahedronGeometry args={[1.4, 1]} />
              <meshStandardMaterial 
                color="#FCD34D" 
                wireframe={true} 
                transparent 
                opacity={0.3} 
                emissive="#EAB308"
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Outer Wireframe Sphere */}
            <mesh ref={outerWireframeRef}>
              <icosahedronGeometry args={[1.8, 2]} />
              <meshStandardMaterial 
                color="#1E293B" 
                wireframe={true} 
                transparent 
                opacity={0.6}
              />
            </mesh>

            {/* Orbiting Metallic Rings */}
            <group rotation={[Math.PI / 4, 0, 0]}>
              <mesh ref={ring1Ref}>
                <torusGeometry args={[2.2, 0.05, 16, 100]} />
                <meshStandardMaterial color="#94A3B8" metalness={1} roughness={0.1} />
              </mesh>
            </group>

            <group rotation={[0, Math.PI / 3, 0]}>
              <mesh ref={ring2Ref}>
                <torusGeometry args={[2.4, 0.05, 16, 100]} />
                <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>

            <group rotation={[0, 0, Math.PI / 6]}>
              <mesh ref={ring3Ref}>
                <torusGeometry args={[2.6, 0.08, 16, 100]} />
                <meshStandardMaterial color="#EAB308" metalness={0.8} roughness={0.2} emissive="#EAB308" emissiveIntensity={0.2} />
              </mesh>
            </group>

          </group>
        </Float>
      </PresentationControls>
    </group>
  );
}
