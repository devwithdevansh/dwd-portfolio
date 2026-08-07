import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Torus, Cylinder, Environment, Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Chamkila Sparkle Dust Particles surrounding the Car
function ChamkilaSparkles({ count = 180, isChamkila }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 4.5;
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
        color={isChamkila ? "#f59e0b" : "#f43f5e"}
        size={isChamkila ? 0.08 : 0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={isChamkila ? 0.8 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Sleek 3D Sports Car Body (Dynamic Dull to Chamkila Shiny Material Transformation)
function ChamkilaSportsCar({ progress }) {
  const carRef = useRef();

  // Lerp material properties smoothly from Dull/Gandi (progress = 0) to 100% Chamkila Gloss (progress = 1)
  const currentRoughness = THREE.MathUtils.lerp(0.95, 0.005, progress);
  const currentMetalness = THREE.MathUtils.lerp(0.05, 0.98, progress);
  const currentClearcoat = THREE.MathUtils.lerp(0, 1.0, progress);
  const currentEnvIntensity = THREE.MathUtils.lerp(0.1, 4.5, progress);

  // Lerp color from Dull Dusty Slate (#3b4252) to High-Gloss Chamkila Crimson (#ef4444)
  const dullColor = new THREE.Color("#3b4252");
  const chamkilaColor = new THREE.Color("#ef4444");
  const currentColor = dullColor.clone().lerp(chamkilaColor, progress);

  useFrame((state) => {
    if (carRef.current) {
      // Majestic continuous spin showcase
      carRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
      carRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05 + 0.12;
    }
  });

  return (
    <group ref={carRef} position={[0, -0.1, 0]} scale={0.92}>
      
      {/* Supercar Main Lower Chassis */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.48, 1.65]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.001}
          envMapIntensity={currentEnvIntensity}
          reflectivity={0.98}
        />
      </mesh>

      {/* Aerodynamic Sculpted Hood */}
      <mesh position={[1.15, 0.3, 0]} rotation={[0, 0, -0.14]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.34, 1.58]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.001}
          envMapIntensity={currentEnvIntensity}
        />
      </mesh>

      {/* Cockpit Cabin Roof */}
      <mesh position={[-0.15, 0.66, 0]} rotation={[0, 0, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.46, 1.25]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.001}
          envMapIntensity={currentEnvIntensity}
        />
      </mesh>

      {/* Tinted Front & Rear Glass Windows */}
      <mesh position={[0.42, 0.7, 0]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.72, 0.04, 1.18]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} envMapIntensity={3} />
      </mesh>
      <mesh position={[-0.72, 0.72, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.62, 0.04, 1.16]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} envMapIntensity={3} />
      </mesh>

      {/* Rear High-Downforce GT Wing Spoiler */}
      <group position={[-1.52, 0.6, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.35, 0.06, 1.68]} />
          <meshPhysicalMaterial
            color={currentColor}
            roughness={currentRoughness}
            metalness={currentMetalness}
            clearcoat={currentClearcoat}
            clearcoatRoughness={0.001}
            envMapIntensity={currentEnvIntensity}
          />
        </mesh>
        <mesh position={[0, -0.08, 0.62]}>
          <boxGeometry args={[0.1, 0.32, 0.08]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.08, -0.62]}>
          <boxGeometry args={[0.1, 0.32, 0.08]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
      </group>

      {/* Front Xenon LED Headlights */}
      <mesh position={[1.68, 0.28, 0.55]}>
        <boxGeometry args={[0.06, 0.14, 0.34]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 3.0 : 0.5} />
      </mesh>
      <mesh position={[1.68, 0.28, -0.55]}>
        <boxGeometry args={[0.06, 0.14, 0.34]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 3.0 : 0.5} />
      </mesh>

      {/* Rear Crimson LED Taillight Strip */}
      <mesh position={[-1.68, 0.32, 0]}>
        <boxGeometry args={[0.06, 0.1, 1.48]} />
        <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={progress > 0.4 ? 3.5 : 0.6} />
      </mesh>

      {/* 4 Multi-Spoke Chrome Alloy Wheels & Tires */}
      {[
        [0.98, -0.06, 0.86],
        [0.98, -0.06, -0.86],
        [-0.98, -0.06, 0.86],
        [-0.98, -0.06, -0.86],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Rubber Tire */}
          <Torus args={[0.35, 0.13, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </Torus>
          {/* Chrome Alloy Rim */}
          <Cylinder args={[0.25, 0.25, 0.15, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#cbd5e1" roughness={0.1} metalness={0.95} envMapIntensity={3} />
          </Cylinder>
        </group>
      ))}

    </group>
  );
}

export default function Car3DScene() {
  const [coatingProgress, setCoatingProgress] = useState(0.0); // 0.0 (Dull) to 1.0 (100% Chamkila Gloss)
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

  const isChamkila = coatingProgress >= 0.98;
  const glossPercentage = Math.round(coatingProgress * 100);

  return (
    <group>
      {/* High Dynamic Range City Environment Map for Ultra-Chamkila Mirror Reflections */}
      <Environment preset="city" />

      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
      <pointLight position={[0, 2, 3]} intensity={1.6} color="#ef4444" />

      {/* Speed & Chamkila Sparkle Dust Particles */}
      <ChamkilaSparkles count={180} isChamkila={isChamkila} />
      <Sparkles
        count={Math.round(30 + coatingProgress * 90)}
        scale={7}
        size={2.5}
        speed={0.8}
        opacity={0.3 + coatingProgress * 0.5}
        color={isChamkila ? "#f59e0b" : "#38bdf8"}
      />

      {/* TOP HEADLINE OVERLAY */}
      <Html position={[0, 2.1, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center max-w-xs sm:max-w-md mx-auto px-2">
          {isChamkila ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                100% CHAMKILA CERAMIC SHIELD ACTIVE
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase mb-1">
                FULL <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-500 to-amber-400">CHAMKILA GLOSS</span> ✨
              </h3>
              
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Mirror sheen finish dispatched to workshop terminal.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>🪄</span> Drag slider to turn Dull Car into Chamkila!
              </div>

              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Chamkila Shine: <span className="text-rose-600 font-mono">{glossPercentage}%</span>
              </h3>
              
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">
                {coatingProgress < 0.1 ? 'Current State: Dull & Dusty Car 🧼' : 'Making Car Ultra Chamkila... ✨'}
              </div>
            </div>
          )}
        </div>
      </Html>

      {/* 3D FLOATING SPORTS CAR (DYNAMIC DULL TO CHAMKILA SHINE) */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
        <ChamkilaSportsCar progress={coatingProgress} />
      </Float>

      {/* BOTTOM SLIDER & CONTROL BUTTONS OVERLAY */}
      <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center gap-3">
          
          {/* Interactive Range Slider (Dull to Chamkila Simulator) */}
          <div className="flex items-center gap-3 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-700 dark:border-slate-800 shadow-2xl">
            <span className="text-xs font-bold text-slate-400">🧼 DULL CAR</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={coatingProgress}
              onChange={handleSliderChange}
              className="w-44 sm:w-56 accent-rose-500 cursor-pointer"
            />
            <span className="text-xs font-black text-rose-400">✨ CHAMKILA</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAutoBuff}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-full shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
            >
              <span>🪄</span> {isChamkila ? 'Make Chamkila Again' : 'Make Car Chamkila ✨'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetWash}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 dark:border-slate-300"
            >
              <span>🧼</span> Reset to Dull Car
            </motion.button>
          </div>

        </div>
      </Html>

      {/* Contact Shadow under Supercar */}
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={6} blur={2.5} far={4} color="#000000" />
    </group>
  );
}
