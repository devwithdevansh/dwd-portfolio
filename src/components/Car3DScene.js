import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Torus, Cylinder, Environment, Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// High-Octane Speed & Metallic Dust Particles surrounding the 3D Wheel Assembly
function HighOctaneDust({ count = 160, isFullGloss }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 4;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = Math.random() * 0.02 + 0.01;
    }
    return [positions, speeds];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    
    points.current.rotation.y = time * 0.08;
    points.current.rotation.z = time * 0.04;

    const array = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.003;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isFullGloss ? "#f59e0b" : "#f43f5e"}
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Ultra-Realistic Sports Wheel & Brake Rotor Showcase
function PhotorealisticWheelShowcase({ progress }) {
  const wheelGroupRef = useRef();
  const rotorRef = useRef();

  // Dynamic PBR material properties based on coating progress (0.0 Dull -> 1.0 9H Hyper-Gloss)
  const currentRoughness = THREE.MathUtils.lerp(0.85, 0.01, progress);
  const currentMetalness = THREE.MathUtils.lerp(0.1, 0.98, progress);
  const currentClearcoat = THREE.MathUtils.lerp(0, 1.0, progress);
  const currentEnvIntensity = THREE.MathUtils.lerp(0.2, 3.5, progress);

  // Lerp rim color from Dull Slate (#334155) to 9H Liquid Crimson Ruby (#e11d48)
  const dullColor = new THREE.Color("#334155");
  const glossColor = new THREE.Color("#e11d48");
  const currentRimColor = dullColor.clone().lerp(glossColor, progress);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (wheelGroupRef.current) {
      // Continuous majestic spin like a luxury jewelry display
      wheelGroupRef.current.rotation.y = elapsedTime * 0.35;
      wheelGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.3) * 0.12 + 0.2;
    }

    if (rotorRef.current) {
      rotorRef.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group ref={wheelGroupRef} position={[0, -0.05, 0]} scale={0.92}>
      
      {/* Performance Rubber Tire */}
      <Torus args={[1.65, 0.35, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.15} />
      </Torus>

      {/* Ceramic Coating Liquid Sheen Outer Lip Ring */}
      <Torus args={[1.32, 0.09, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color={currentRimColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.005}
          envMapIntensity={currentEnvIntensity}
          reflectivity={0.98}
        />
      </Torus>

      {/* Drilled Metallic Sports Brake Disc Rotor */}
      <group ref={rotorRef} position={[0, 0, -0.06]}>
        <Cylinder args={[1.15, 1.15, 0.04, 48]}>
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.95} envMapIntensity={2} />
        </Cylinder>

        {/* Radial Rotor Ventilation Holes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh key={i} position={[Math.cos(rad) * 0.75, Math.sin(rad) * 0.75, 0.03]}>
              <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* Brembo Performance Crimson Brake Caliper */}
      <mesh position={[0.78, 0.65, 0.08]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.42, 0.82, 0.22]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.7} envMapIntensity={2.5} />
      </mesh>

      {/* 5 Sculpted Spoke Alloy Blades */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={i} rotation={[0, 0, rad]}>
            <mesh position={[0, 0.62, 0.06]}>
              <boxGeometry args={[0.16, 1.15, 0.12]} />
              <meshPhysicalMaterial
                color={currentRimColor}
                roughness={currentRoughness}
                metalness={currentMetalness}
                clearcoat={currentClearcoat}
                clearcoatRoughness={0.005}
                envMapIntensity={currentEnvIntensity}
              />
            </mesh>
          </group>
        );
      })}

      {/* Center Wheel Hub Badge */}
      <mesh position={[0, 0, 0.14]}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.95} envMapIntensity={3} />
      </mesh>

    </group>
  );
}

export default function Car3DScene() {
  const [coatingProgress, setCoatingProgress] = useState(0.0); // 0.0 (Dull) to 1.0 (9H Hyper-Gloss)
  const [isBuffingActive, setIsBuffingActive] = useState(false);

  useFrame((_, delta) => {
    if (isBuffingActive) {
      setCoatingProgress((prev) => {
        const next = prev + delta * 0.5;
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
      {/* High Dynamic Range City Environment Map for Photorealistic Reflections */}
      <Environment preset="city" />

      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
      <pointLight position={[0, 2, 3]} intensity={1.5} color="#e11d48" />

      {/* Speed & Metallic Dust Particles */}
      <HighOctaneDust count={150} isFullGloss={isFullGloss} />
      <Sparkles
        count={Math.round(30 + coatingProgress * 70)}
        scale={6}
        size={2.0}
        speed={0.6}
        opacity={0.3 + coatingProgress * 0.4}
        color={isFullGloss ? "#f59e0b" : "#38bdf8"}
      />

      {/* TOP HEADLINE OVERLAY */}
      <Html position={[0, 2.1, 0]} center className="pointer-events-auto z-50">
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
                9H Ceramic Liquid Shield Active
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-1">
                YUMMY GLOSS! <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-amber-400">100% SHIELD</span>
              </h3>
              
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Mirror sheen finish dispatched to workshop terminal.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>🪄</span> Drag slider to apply 9H Ceramic Shield
              </div>

              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Ceramic Gloss: <span className="text-rose-600 font-mono">{glossPercentage}%</span>
              </h3>
              
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">
                {coatingProgress < 0.1 ? 'Initial State: Dull & Dusty Slate' : 'Applying 9H Liquid Ceramic Shield...'}
              </div>
            </div>
          )}
        </div>
      </Html>

      {/* 3D FLOATING PHOTOREALISTIC WHEEL SHOWCASE */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
        <PhotorealisticWheelShowcase progress={coatingProgress} />
      </Float>

      {/* BOTTOM SLIDER & CONTROL BUTTONS OVERLAY */}
      <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center gap-3">
          
          {/* Interactive Range Slider (Ceramic Shield Simulator) */}
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
              <span>🪄</span> {isFullGloss ? 'Re-Apply Ceramic Shield' : 'Auto-Apply 9H Shield'}
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

      {/* Realistic Shadow beneath Wheel Assembly */}
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={5} blur={2.5} far={4} color="#000000" />
    </group>
  );
}
