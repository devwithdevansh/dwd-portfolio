import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Environment, Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Ceramic Steam Smoke & Cleaning Fog
function CleaningSmokeFog({ count = 180, isBuffing }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 3.5;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.2;
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = Math.random() * 0.03 + 0.015;
    }
    return [positions, speeds];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    // Smoke drifts slightly but doesn't spin wildly

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
        color={isBuffing ? "#f59e0b" : "#e2e8f0"}
        size={isBuffing ? 0.08 : 0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={isBuffing ? 0.75 : 0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Proportioned Wheel Component (Lies flat facing outwards on Z axis)
function ProportionedCarWheel({ position, isSpinning }) {
  const wheelRef = useRef();

  useFrame((state) => {
    if (wheelRef.current && isSpinning) {
      wheelRef.current.rotation.z = -state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group position={position}>
      <group ref={wheelRef}>
        {/* Rubber Tire (Cylinder oriented along Z axis) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.16, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Whitewall Rubber Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, position[2] > 0 ? 0.08 : -0.08]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Chrome Dish Hubcap */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, position[2] > 0 ? 0.09 : -0.09]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.05} metalness={0.98} envMapIntensity={3.5} />
        </mesh>

        {/* Center Chrome Spinner Badge */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, position[2] > 0 ? 0.1 : -0.1]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.02} metalness={0.98} envMapIntensity={4} />
        </mesh>
      </group>
    </group>
  );
}

// L-Shaped Detailing Stick / Polisher Tool
function DetailingPolisher({ position, isActive }) {
  const toolRef = useRef();

  useFrame((state) => {
    if (toolRef.current) {
      // Bob up and down slightly
      toolRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 4) * 0.02;
      
      // Scrubbing motion instead of spinning if active
      if (isActive) {
        toolRef.current.children[0].rotation.z = Math.sin(state.clock.elapsedTime * 25) * 0.2; // Rapid scrubbing
      }
    }
  });

  return (
    <group position={[position.x, position.y, position.z]} ref={toolRef}>
      {/* Spinning Buffing Pad */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.8} /> {/* Yellow sponge pad */}
      </mesh>
      
      {/* Polisher Base Body */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* L-Shaped Handle (Stick) */}
      <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Handle Grip */}
      <mesh position={[0.4, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.9} /> {/* Red rubber grip */}
      </mesh>
      
      {/* Interactive Tooltip on the stick */}
      {!isActive && (
        <Html position={[0.5, 0.3, 0]} center>
          <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-amber-500/50 whitespace-nowrap animate-bounce shadow-lg shadow-amber-500/20">
            Grab & Drag to Polish! 🪄
          </div>
        </Html>
      )}
    </group>
  );
}


// Sleek Horizontal Sports Coupe Car Body
function SleekSportsCoupe({ progress }) {
  const carRef = useRef();

  // Lerp material properties smoothly from Dull (progress = 0) to 100% Chamkila Sheen (progress = 1)
  const currentRoughness = THREE.MathUtils.lerp(0.92, 0.005, progress);
  const currentMetalness = THREE.MathUtils.lerp(0.08, 0.95, progress);
  const currentClearcoat = THREE.MathUtils.lerp(0, 1.0, progress);
  const currentEnvIntensity = THREE.MathUtils.lerp(0.2, 4.5, progress);

  // Color lerps from Dull Slate (#3b4252) to Liquid Crimson Red (#dc2626)
  const dullColor = new THREE.Color("#3b4252");
  const chamkilaColor = new THREE.Color("#dc2626");
  const currentColor = dullColor.clone().lerp(chamkilaColor, progress);

  useFrame((state) => {
    if (carRef.current) {
      // Subtle stationary floating instead of endless spinning
      carRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.05;
      carRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02 + 0.05;
    }
  });

  return (
    <group ref={carRef} position={[0, -0.15, 0]} scale={0.95}>
      
      {/* Lower Main Car Chassis */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.38, 1.38]} />
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

      {/* Sloped Hood */}
      <mesh position={[0.95, 0.28, 0]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.28, 1.35]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.001}
          envMapIntensity={currentEnvIntensity}
        />
      </mesh>

      {/* Cockpit Roof & Cabin */}
      <mesh position={[-0.2, 0.54, 0]} rotation={[0, 0, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.4, 1.1]} />
        <meshPhysicalMaterial
          color={currentColor}
          roughness={currentRoughness}
          metalness={currentMetalness}
          clearcoat={currentClearcoat}
          clearcoatRoughness={0.001}
          envMapIntensity={currentEnvIntensity}
        />
      </mesh>

      {/* Front Grill (New Detail) */}
      <mesh position={[1.51, 0.16, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.9]} />
        <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.5} />
      </mesh>
      {/* Grill Chrome Accent */}
      <mesh position={[1.52, 0.16, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.9]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.05} metalness={0.98} />
      </mesh>

      {/* Side Mirrors (New Detail) */}
      <mesh position={[0.3, 0.42, 0.65]}>
        <boxGeometry args={[0.1, 0.08, 0.12]} />
        <meshPhysicalMaterial color={currentColor} roughness={currentRoughness} metalness={currentMetalness} clearcoat={currentClearcoat} />
      </mesh>
      <mesh position={[0.3, 0.42, -0.65]}>
        <boxGeometry args={[0.1, 0.08, 0.12]} />
        <meshPhysicalMaterial color={currentColor} roughness={currentRoughness} metalness={currentMetalness} clearcoat={currentClearcoat} />
      </mesh>

      {/* Chrome Side Body Trim Lines */}
      <mesh position={[0, 0.18, 0.7]}>
        <boxGeometry args={[2.9, 0.03, 0.03]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.05} metalness={0.98} envMapIntensity={4} />
      </mesh>
      <mesh position={[0, 0.18, -0.7]}>
        <boxGeometry args={[2.9, 0.03, 0.03]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.05} metalness={0.98} envMapIntensity={4} />
      </mesh>

      {/* Front Chrome Bumper */}
      <mesh position={[1.52, 0.04, 0]}>
        <boxGeometry args={[0.08, 0.08, 1.32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.05} metalness={0.98} envMapIntensity={4} />
      </mesh>

      {/* Rear Chrome Bumper */}
      <mesh position={[-1.52, 0.14, 0]}>
        <boxGeometry args={[0.08, 0.12, 1.32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.05} metalness={0.98} envMapIntensity={4} />
      </mesh>

      {/* Sloped Glass Windshield & Rear Window */}
      <mesh position={[0.35, 0.58, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.6, 0.03, 1.05]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} envMapIntensity={3} />
      </mesh>
      <mesh position={[-0.75, 0.58, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.5, 0.03, 1.05]} />
        <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.95} envMapIntensity={3} />
      </mesh>

      {/* Dual Headlights */}
      <mesh position={[1.51, 0.28, 0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 3.0 : 0.6} />
      </mesh>
      <mesh position={[1.51, 0.28, -0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={progress > 0.4 ? 3.0 : 0.6} />
      </mesh>

      {/* Dual Taillights */}
      <mesh position={[-1.51, 0.28, 0.42]}>
        <boxGeometry args={[0.04, 0.1, 0.26]} />
        <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={progress > 0.4 ? 3.5 : 0.6} />
      </mesh>
      <mesh position={[-1.51, 0.28, -0.42]}>
        <boxGeometry args={[0.04, 0.1, 0.26]} />
        <meshStandardMaterial color="#f87171" emissive="#dc2626" emissiveIntensity={progress > 0.4 ? 3.5 : 0.6} />
      </mesh>

      {/* 4 Whitewall Chrome Dish Wheels Positioned Correctly */}
      <ProportionedCarWheel position={[0.85, 0.05, 0.72]} isSpinning={progress > 0 && progress < 1.0} />
      <ProportionedCarWheel position={[0.85, 0.05, -0.72]} isSpinning={progress > 0 && progress < 1.0} />
      <ProportionedCarWheel position={[-0.85, 0.05, 0.72]} isSpinning={progress > 0 && progress < 1.0} />
      <ProportionedCarWheel position={[-0.85, 0.05, -0.72]} isSpinning={progress > 0 && progress < 1.0} />

    </group>
  );
}

// 3D Detailing Billboard (Sign)
function DetailingBillboard({ progress }) {
  const glossPercentage = Math.round(progress * 100);
  
  return (
    <group position={[-2.5, 0, -2.5]} rotation={[0, Math.PI / 6, 0]}>
      {/* Stand Pillars */}
      <mesh position={[-0.8, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Board Panel */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[2.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Sign Frame */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[2.3, 1.3, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 3D Text on Billboard using HTML Transform */}
      <Html transform position={[0, 1.4, 0.06]} scale={0.3} className="pointer-events-none select-none">
        <div className="w-[800px] h-[380px] flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-black text-sky-400 mb-4 tracking-wider">PREMIUM DETAILING</h1>
          <h2 className="text-3xl font-medium text-slate-100 mb-8">Ceramic Shield &bull; PPF &bull; Paint Correction</h2>
          <div className="text-4xl font-black text-amber-400 mb-4 tracking-widest">
            {progress >= 0.98 ? "100% CHAMKILA PROTECTED" : `GLOSS PROGRESS: ${glossPercentage}%`}
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-3/4 h-6 bg-slate-700/80 rounded-full overflow-hidden border border-slate-600">
            <div 
              className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-100 ease-out" 
              style={{ width: `${glossPercentage}%` }} 
            />
          </div>
        </div>
      </Html>
    </group>
  );
}


export default function Car3DScene() {
  const [coatingProgress, setCoatingProgress] = useState(0.0); // 0.0 (Dull) to 1.0 (100% Chamkila Sheen)
  const [toolPosition, setToolPosition] = useState(new THREE.Vector3(0, 1, 1.5));
  const [isDragging, setIsDragging] = useState(false);

  // Interactive Drag handler for the invisible hit box
  const handlePointerMove = (e) => {
    // Only update tool position if we are moving within the scene 
    setToolPosition(e.point);
    if (isDragging && coatingProgress < 1.0) {
      setCoatingProgress((prev) => Math.min(prev + 0.005, 1.0));
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.stopPropagation();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const isChamkila = coatingProgress >= 0.98;

  return (
    <group>
      {/* High Dynamic Range City Environment Map for Ultra-Chamkila Mirror Reflections */}
      <Environment preset="city" />

      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
      <pointLight position={[0, 2, 3]} intensity={1.6} color="#dc2626" />

      {/* Invisible Interactive Hit Box for Dragging Polisher */}
      <mesh 
        position={[0, 0, 0]} 
        visible={false} 
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        {/* Large bounding box to capture pointer movements around the car */}
        <boxGeometry args={[6, 4, 6]} />
      </mesh>

      {/* Interactive Polisher Tool (Follows Cursor) */}
      {!isChamkila && (
        <DetailingPolisher position={toolPosition} isActive={isDragging} />
      )}

      {/* 3D Detailing Billboard */}
      <DetailingBillboard progress={coatingProgress} />

      {/* Cleaning Steam Smoke Fog Particles */}
      <CleaningSmokeFog count={180} isBuffing={isDragging && !isChamkila} />

      {/* Chamkila Sparkle Stars */}
      <Sparkles
        count={Math.round(30 + coatingProgress * 90)}
        scale={6}
        size={2.5}
        speed={0.8}
        opacity={0.3 + coatingProgress * 0.5}
        color={isChamkila ? "#f59e0b" : "#38bdf8"}
      />

      {/* TOP HEADLINE OVERLAY */}
      <Html position={[0, 2.5, 0]} center className="pointer-events-none z-50">
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
          ) : null}
        </div>
      </Html>

      {/* 3D FLOATING SCULPTED CLASSIC COUPE */}
      <Float speed={1.5} rotationIntensity={isDragging ? 0.05 : 0.15} floatIntensity={isDragging ? 0.05 : 0.35}>
        <SleekSportsCoupe progress={coatingProgress} />
      </Float>

      {/* BOTTOM CONTROL BUTTONS OVERLAY (Slider Removed) */}
      <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
        <div className="text-center select-none whitespace-nowrap flex flex-col items-center gap-3">
          
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            {isChamkila && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCoatingProgress(0.0)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white font-black text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 dark:border-slate-300"
              >
                <span>🧼</span> Reset & Drag Again
              </motion.button>
            )}
          </div>

        </div>
      </Html>

      {/* Realistic Ground Shadow under Coupe */}
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={5.5} blur={2.2} far={4} color="#000000" />
    </group>
  );
}
