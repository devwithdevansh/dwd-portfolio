import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Torus, Cylinder } from '@react-three/drei';
import { motion } from 'framer-motion';

export default function Car3DScene() {
  const wheelGroupRef = useRef();
  const rotorRef = useRef();
  const [glossLevel, setGlossLevel] = useState('ceramic'); // 'ceramic' | 'matte' | 'hyper'
  const [isTurboActive, setIsTurboActive] = useState(false);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (wheelGroupRef.current) {
      // Continuous rotation simulating a high-octane wheel/engine spin
      const spinSpeed = isTurboActive ? 2.5 : 0.4;
      wheelGroupRef.current.rotation.z += delta * spinSpeed;
      wheelGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.25 + 0.3; // Angle tilt for 3D depth
    }

    if (rotorRef.current) {
      rotorRef.current.rotation.z -= delta * (isTurboActive ? 3.0 : 0.5);
    }
  });

  const handleTurboToggle = () => {
    setIsTurboActive(prev => !prev);
  };

  const handleGlossToggle = () => {
    setGlossLevel(prev => {
      if (prev === 'ceramic') return 'hyper';
      if (prev === 'hyper') return 'matte';
      return 'ceramic';
    });
  };

  // Dynamic metallic material properties based on gloss level
  const materialProps = {
    ceramic: { roughness: 0.1, metalness: 0.85, clearcoat: 1, clearcoatRoughness: 0.05, color: "#e11d48" },
    hyper: { roughness: 0.02, metalness: 0.95, clearcoat: 1, clearcoatRoughness: 0.01, color: "#f59e0b" },
    matte: { roughness: 0.6, metalness: 0.3, clearcoat: 0, clearcoatRoughness: 0.8, color: "#1e293b" },
  }[glossLevel];

  return (
    <group>
      {/* High-Octane Studio Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 8, 6]} intensity={1.8} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#fbbf24" />
      <pointLight position={[0, 2, 3]} intensity={1.5} color="#f43f5e" />

      {/* Speed & Gloss Particles */}
      <Sparkles count={90} scale={7} size={2.2} speed={isTurboActive ? 1.8 : 0.6} opacity={0.4} color="#f43f5e" />
      <Sparkles count={50} scale={6} size={1.8} speed={isTurboActive ? 1.4 : 0.4} opacity={0.3} color="#fbbf24" />

      {/* TOP HEADLINE OVERLAY */}
      <Html position={[0, 2.1, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center max-w-xs sm:max-w-md mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isTurboActive ? 'bg-rose-600 animate-ping' : 'bg-rose-500'}`} />
            {isTurboActive ? 'TURBO DYNO ACTIVE • 8,500 RPM' : 'CERAMIC GLOSS INSPECTOR'}
          </div>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-1">
            APEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-amber-400">DRIVE OS</span>
          </h3>
          
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Interactive High-Ticket Automotive & Detailing Engine
          </p>
        </div>
      </Html>

      {/* 3D FLOATING AUTOMOTIVE ALLOY WHEEL & BRAKE ROTOR ASSEMBLY */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={wheelGroupRef} position={[0, -0.1, 0]} scale={0.9}>
          
          {/* Outer Performance Tire Rubber Ring */}
          <Torus args={[1.75, 0.38, 24, 60]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
          </Torus>

          {/* Alloy Rim Lip */}
          <Torus args={[1.42, 0.08, 20, 60]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhysicalMaterial {...materialProps} />
          </Torus>

          {/* Metallic Drilled Brake Rotor Disc */}
          <group ref={rotorRef} position={[0, 0, -0.05]}>
            <Cylinder args={[1.25, 1.25, 0.04, 36]}>
              <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
            </Cylinder>
            {/* Rotor Drill Holes */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <mesh key={i} position={[Math.cos(rad) * 0.8, Math.sin(rad) * 0.8, 0.03]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>
              );
            })}
          </group>

          {/* Brembo Red Brake Caliper */}
          <mesh position={[0.85, 0.7, 0.08]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.45, 0.85, 0.22]} />
            <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.6} />
          </mesh>

          {/* 5-Spoke Alloy Wheels */}
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <group key={i} rotation={[0, 0, rad]}>
                <mesh position={[0, 0.7, 0.06]}>
                  <boxGeometry args={[0.18, 1.2, 0.12]} />
                  <meshPhysicalMaterial {...materialProps} />
                </mesh>
              </group>
            );
          })}

          {/* Center Wheel Cap Badge */}
          <mesh position={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 24]} />
            <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
          </mesh>

        </group>
      </Float>

      {/* BOTTOM INTERACTIVE CONTROL BUTTONS */}
      <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGlossToggle}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white font-black text-xs rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 dark:border-slate-300"
          >
            <span>🪞</span> Gloss: {glossLevel.toUpperCase()}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTurboToggle}
            className={`px-4 py-2 text-white font-black text-xs rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300 ${
              isTurboActive ? 'bg-gradient-to-r from-rose-600 to-amber-500 animate-pulse' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <span>⚡</span> {isTurboActive ? 'DYNO TURBO ON' : 'SPIN TURBO'}
          </motion.button>
        </div>
      </Html>

      {/* Contact Shadow for 3D Alloy Wheel */}
      <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={5} blur={2.5} far={4} color="#000000" />
    </group>
  );
}
