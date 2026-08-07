import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Cylinder, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Ultra-Detailed Realistic Sports Coupe Car Body
function SculptedSupercar({ progress }) {
  const bodyRef = useRef();

  // Lerp material properties smoothly from Dull/Dusty (progress = 0) to 9H Liquid Mirror Ceramic (progress = 1)
  const currentRoughness = THREE.MathUtils.lerp(0.9, 0.02, progress);
  const currentMetalness = THREE.MathUtils.lerp(0.05, 0.98, progress);
  const currentClearcoat = THREE.MathUtils.lerp(0, 1.0, progress);

  // Color transitions from dull dusty slate grey (#334155) to deep liquid ruby crimson (#dc2626)
  const dullColor = new THREE.Color("#334155");
  const glossColor = new THREE.Color("#dc2626");
  const currentColor = dullColor.clone().lerp(glossColor, progress);

  return (
    <group ref={bodyRef} position={[0, -0.05, 0]}>
      
      {/* Carbon Fiber / Dark Metallic Chassis Base */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.45, 1.7]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.01}
          reflectivity={0.95}
        />
      </mesh>

      {/* Aerodynamic Sculpted Hood */}
      <mesh position={[1.15, 0.28, 0]} rotation={[0, 0, -0.12]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.32, 1.62]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.01}
        />
      </mesh>

      {/* Sloped Windshield & Cabin Roof */}
      <mesh position={[-0.15, 0.65, 0]} rotation={[0, 0, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.48, 1.3]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.01}
        />
      </mesh>

      {/* Dark Tinted Glass Windows */}
      <mesh position={[0.42, 0.7, 0]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.75, 0.04, 1.22]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} />
      </mesh>
      <mesh position={[-0.75, 0.72, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.65, 0.04, 1.2]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Rear High-Downforce GT Wing Spoiler */}
      <group position={[-1.55, 0.6, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.35, 0.06, 1.7]} />
          <meshPhysicalMaterial
            color={currentColor}
            roughness={currentRoughness}
            metalness={currentMetalness}
            clearcoat={currentClearcoat}
          />
        </mesh>
        <mesh position={[0, -0.08, 0.65]}>
          <boxGeometry args={[0.12, 0.32, 0.08]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.08, -0.65]}>
          <boxGeometry args={[0.12, 0.32, 0.08]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
      </group>

      {/* Front Xenon LED Headlights */}
      <mesh position={[1.72, 0.28, 0.58]}>
        <boxGeometry args={[0.06, 0.14, 0.36]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 2.5 : 0.5} />
      </mesh>
      <mesh position={[1.72, 0.28, -0.58]}>
        <boxGeometry args={[0.06, 0.14, 0.36]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 2.5 : 0.5} />
      </mesh>

      {/* Rear LED Taillight Strip */}
      <mesh position={[-1.72, 0.32, 0]}>
        <boxGeometry args={[0.06, 0.1, 1.5]} />
        <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={progress > 0.4 ? 3.0 : 0.6} />
      </mesh>

      {/* 4 Performance Alloy Rims & Low-Profile Rubber Tires */}
      {[
        [1.0, -0.08, 0.88],
        [1.0, -0.08, -0.88],
        [-1.0, -0.08, 0.88],
        [-1.0, -0.08, -0.88],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Low Profile Rubber Tire */}
          <Torus args={[0.36, 0.13, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </Torus>
          {/* Multi-Spoke Alloy Rim */}
          <Cylinder args={[0.26, 0.26, 0.16, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.92} />
          </Cylinder>
          {/* Red Brake Caliper */}
          <mesh position={[0.08, 0.1, 0]}>
            <boxGeometry args={[0.14, 0.2, 0.12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Handheld High-Tech Orbital Buffer / Ceramic Applicator Tool (Glides horizontally on car surface)
function HandheldBufferTool({ progress }) {
  const bufferRef = useRef();

  // Calculate buffer X position along car body (-1.7 to +1.7)
  const bufferX = THREE.MathUtils.lerp(-1.7, 1.7, progress);
  
  // Height follows car hood & roof curvature
  let bufferY = 0.52;
  if (progress > 0.25 && progress < 0.75) {
    bufferY = 0.92; // Roof height
  }

  useFrame((state) => {
    if (bufferRef.current) {
      bufferRef.current.position.x = bufferX;
      bufferRef.current.position.y = bufferY;
      // Orbital buffer high-frequency rotation
      bufferRef.current.rotation.y = state.clock.getElapsedTime() * 12;
    }
  });

  return (
    <group ref={bufferRef} position={[bufferX, bufferY, 0]}>
      {/* Microfiber Foam Buffing Pad (Rests on car body) */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.08, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.7} emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* Orbital Polisher Metallic Motor Housing */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.24, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Ergonomic Top Grip Handle */}
      <mesh position={[-0.15, 0.24, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="#e11d48" roughness={0.4} />
      </mesh>

      {/* Glowing Nano-Ceramic Curing Laser Ring */}
      <mesh position={[0, -0.06, 0]}>
        <torusGeometry args={[0.38, 0.02, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

export default function Car3DScene() {
  const [coatingProgress, setCoatingProgress] = useState(0.0); // 0.0 (Dull) to 1.0 (Hyper-Gloss)
  const [isBuffingActive, setIsBuffingActive] = useState(false);
  const carGroupRef = useRef();

  useFrame((state, delta) => {
    // Smooth 3D tilt & rotation showcase
    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.22 + 0.38;
      carGroupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.04 + 0.12;
    }

    // Auto-buffing animation step
    if (isBuffingActive) {
      setCoatingProgress((prev) => {
        const next = prev + delta * 0.55;
        if (next >= 1.0) {
          setIsBuffingActive(false);
          return 1.0;
        }
        return next;
      });
    }
  });

  const handleSliderChange = (e) => {
    setIsBuffingActive(false);
    setCoatingProgress(parseFloat(e.target.value));
  };

  const handleAutoBuff = () => {
    if (coatingProgress >= 1.0) {
      setCoatingProgress(0.0);
    }
    setIsBuffingActive(true);
  };

  const handleResetWash = () => {
    setIsBuffingActive(false);
    setCoatingProgress(0.0);
  };

  const isFullGloss = coatingProgress >= 0.98;
  const glossPercentage = Math.round(coatingProgress * 100);

  return (
    <group>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
      <directionalLight position={[-6, 5, -4]} intensity={0.6} color="#fbbf24" />
      <pointLight position={[0, 2.5, 2]} intensity={1.5} color="#e11d48" />

      {/* REALISTIC BILLOWING CERAMIC STEAM / SMOKE FOG PARTICLES */}
      {/* Layer 1: Dense Ceramic Curing Smoke Mist */}
      <Sparkles
        count={Math.round(40 + coatingProgress * 120)}
        scale={[6, 3, 6]}
        size={3.5}
        speed={1.2}
        opacity={0.3 + coatingProgress * 0.5}
        color={isFullGloss ? "#f59e0b" : "#e2e8f0"}
      />
      {/* Layer 2: High-Speed Vapor Sparkles */}
      <Sparkles
        count={Math.round(30 + coatingProgress * 80)}
        scale={[5, 2.5, 5]}
        size={2.0}
        speed={1.8}
        opacity={0.4}
        color="#38bdf8"
      />

      {/* TOP HEADLINE OVERLAY */}
      <Html position={[0, 2.0, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center max-w-xs sm:max-w-md mx-auto px-2">
          {isFullGloss ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                9H Ceramic Liquid Shield Cured
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-1">
                YUMMY GLOSS! <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-amber-400">100% SHIELD</span>
              </h3>
              
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Swirl-free mirror finish dispatched to workshop terminal.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>🪄</span> Drag slider to buff ceramic coating
              </div>

              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Ceramic Gloss: <span className="text-rose-600 font-mono">{glossPercentage}%</span>
              </h3>
              
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">
                {coatingProgress < 0.1 ? 'Initial State: Dull & Dusty Slate' : 'Buffing & Curing 9H Liquid Ceramic...'}
              </div>
            </div>
          )}
        </div>
      </Html>

      {/* 3D SHOWCASE GROUP (SUPERCAR + HANDHELD ORBITAL BUFFER TOOL) */}
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.3}>
        <group ref={carGroupRef} position={[0, -0.15, 0]} scale={0.88}>
          
          {/* Sculpted Supercar Body */}
          <SculptedSupercar progress={coatingProgress} />

          {/* Handheld Orbital Buffer Tool (Resting on car body surface) */}
          <HandheldBufferTool progress={coatingProgress} />

        </group>
      </Float>

      {/* BOTTOM SLIDER & CONTROL BUTTONS OVERLAY */}
      <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center gap-3">
          
          {/* Interactive Range Slider (Buffing Wand Simulator) */}
          <div className="flex items-center gap-3 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-700 dark:border-slate-800 shadow-2xl">
            <span className="text-xs font-bold text-slate-400">🧼 DULL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={coatingProgress}
              onChange={handleSliderChange}
              className="w-44 sm:w-56 accent-rose-500 cursor-pointer"
            />
            <span className="text-xs font-black text-rose-400">🪞 9H GLOSS</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAutoBuff}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-full shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
            >
              <span>🪄</span> {isFullGloss ? 'Re-Buff Ceramic Shield' : 'Auto-Buff 9H Shield'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetWash}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 dark:border-slate-300"
            >
              <span>🧼</span> Wash / Reset to Dull
            </motion.button>
          </div>

        </div>
      </Html>

      {/* Realistic Shadow beneath Supercar */}
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={6} blur={2.5} far={4} color="#000000" />
    </group>
  );
}
