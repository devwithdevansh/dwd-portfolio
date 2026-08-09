import React, { useRef, useState, useMemo } from 'react';
import ResponsiveCamera from './ResponsiveCamera';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PresentationControls, 
  Environment, 
  Float, 
  Html, 
  ContactShadows,
  MeshTransmissionMaterial
} from '@react-three/drei';
import * as THREE from 'three';

// Reusable Popup Component
function ZonePopup({ title, subtitle, color }) {
  return (
    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl w-48 pointer-events-none transition-opacity duration-300">
      <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>{title}</div>
      <div className="text-slate-300 text-xs leading-relaxed">{subtitle}</div>
    </div>
  );
}

// Left Side: The Messy Manual Process
function ChaosZone() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={[-3.5, 0, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        {/* The Rough Register (Khata) */}
        <mesh position={[0, 0.2, 0]} rotation={[0.2, 0.5, -0.1]} castShadow>
          <boxGeometry args={[0.8, 0.15, 1.1]} />
          <meshStandardMaterial color="#ef4444" roughness={0.9} />
        </mesh>
        
        {/* Messy Paper Bills */}
        <mesh position={[-0.6, 0.5, 0.2]} rotation={[1.2, 0.3, 0.5]} castShadow>
          <planeGeometry args={[0.5, 0.7]} />
          <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.5, 0.8, -0.3]} rotation={[-0.5, 0.8, 0.2]} castShadow>
          <planeGeometry args={[0.5, 0.7]} />
          <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.2, -0.4, 0.6]} rotation={[-1.2, -0.2, 0.1]} castShadow>
          <planeGeometry args={[0.5, 0.7]} />
          <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
        </mesh>
      </Float>
      
      {/* Invisible Hitbox for easier hovering */}
      <mesh visible={false}>
         <sphereGeometry args={[1.5]} />
         <meshBasicMaterial />
      </mesh>
      
      <Html position={[0, 1.8, 0]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
        <ZonePopup title="The Old Way" subtitle="Scattered rough registers, messy paper bills, and manual tracking." color="#ef4444" />
      </Html>
    </group>
  );
}

// Right Side: The Organized Digital Dashboard
function OrderZone() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={[3.5, 0, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Sleek Digital Tablet/Dashboard */}
        <mesh position={[0, -0.2, 0]} rotation={[0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[1.8, 0.1, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Organized Bar Charts */}
        <mesh position={[-0.5, 0.15, 0.1]} rotation={[0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.3, -0.1]} rotation={[0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        <mesh position={[0.5, 0.05, -0.3]} rotation={[0.2, -0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      </Float>
      
      <mesh visible={false}>
         <sphereGeometry args={[1.5]} />
         <meshBasicMaterial />
      </mesh>
      
      <Html position={[0, 1.8, 0]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
        <ZonePopup title="The DWD Engine" subtitle="Unified digital dashboard, auto-tallied Galla, and clear metrics." color="#10b981" />
      </Html>
    </group>
  );
}

// Center: The Software Engine
function EngineCore() {
  const [hovered, setHovered] = useState(false);
  const coreRef = useRef();
  
  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.getElapsedTime() * 1.5;
      coreRef.current.rotation.z = clock.getElapsedTime() * 0.8;
      // Pulse emission
      coreRef.current.material.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        {/* Outer Tech Glass Cube */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <MeshTransmissionMaterial 
            backside
            thickness={0.2}
            roughness={0.1}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.1}
            color="#e0f2fe"
          />
        </mesh>
        
        {/* Glowing Inner Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" toneMapped={false} />
        </mesh>
      </Float>
      
      <Html position={[0, 1.8, 0]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
        <ZonePopup title="The Custom OS" subtitle="The bespoke architecture absorbing all your manual chaos." color="#06b6d4" />
      </Html>
    </group>
  );
}

// Particle Flow: Visualizing chaos turning into organized data
function DataStream() {
  const groupRef = useRef();
  
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      pos: new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 1.5 - 0.75, Math.random() * 1.5 - 0.75),
      speed: Math.random() * 0.03 + 0.015,
      yOffset: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, i) => {
        const p = particles[i];
        p.pos.x += p.speed;
        
        // Loop particles from left to right
        if (p.pos.x > 4) {
          p.pos.x = -4; 
        }
        
        // Add sine wave float
        mesh.position.set(p.pos.x, p.pos.y + Math.sin(t * 3 + p.yOffset) * 0.2, p.pos.z);
        
        // Color transition: Red (-4) -> Cyan (0) -> Green (4)
        // Clamp progress to safely interpolate
        let progress = Math.max(0, Math.min(1, (mesh.position.x + 4) / 8));
        
        if (progress < 0.5) {
            // Left side: Red to Cyan
            let localProg = progress * 2; // 0 to 1
            mesh.material.color.setHex(0xef4444).lerp(new THREE.Color(0x06b6d4), localProg);
            mesh.material.emissive.setHex(0xef4444).lerp(new THREE.Color(0x06b6d4), localProg);
        } else {
            // Right side: Cyan to Green
            let localProg = (progress - 0.5) * 2; // 0 to 1
            mesh.material.color.setHex(0x06b6d4).lerp(new THREE.Color(0x10b981), localProg);
            mesh.material.emissive.setHex(0x06b6d4).lerp(new THREE.Color(0x10b981), localProg);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function BusinessBlock3D() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing rounded-[2rem] overflow-hidden">
      <Canvas camera={{ position: [0, 1.5, 9], fov: 45 }}>
      <ResponsiveCamera defaultFov={45} mobileFov={70} />
        {/* Match slate-50 background perfectly */}
        <color attach="background" args={['#f8fafc']} /> 
        
        {/* Cinematic Software Lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Red light hitting the chaos zone */}
        <spotLight position={[-5, 8, 5]} intensity={3} penumbra={1} color="#ef4444" castShadow />
        
        {/* Green/Cyan light hitting the order zone */}
        <spotLight position={[5, 8, 5]} intensity={3} penumbra={1} color="#10b981" castShadow />
        
        <directionalLight position={[0, -5, 0]} intensity={0.5} color="#ffffff" />
        <Environment preset="city" />

        <PresentationControls 
          global 
          rotation={[0, 0, 0]} 
          polar={[-0.1, 0.1]} 
          azimuth={[-0.3, 0.3]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <group position={[0, -0.5, 0]}>
            <ChaosZone />
            <EngineCore />
            <OrderZone />
            <DataStream />
            
            {/* Soft Ground Reflection */}
            <ContactShadows 
              position={[0, -2, 0]} 
              opacity={0.3} 
              scale={25} 
              blur={2.5} 
              far={4.5} 
              color="#0f172a"
            />
          </group>
        </PresentationControls>
      </Canvas>
      
      {/* Visual Metaphor Helper UI */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] sm:text-xs font-bold tracking-widest text-slate-500 pointer-events-none bg-white/70 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-slate-200">
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> THE OLD WAY</span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"/> THE OS</span>
        <span className="text-slate-300">→</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> DIGITAL ORDER</span>
      </div>
    </div>
  );
}
