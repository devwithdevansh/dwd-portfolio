import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows, Environment, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Ceramic Steam Smoke & Cleaning Fog
function CleaningSmokeFog({ count = 180, isBuffing }) {
  const points = useRef();

  const [positions, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.0 + Math.random() * 4.0;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.2;
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = Math.random() * 0.04 + 0.02;
    }
    return [positions, speeds];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    const array = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.005;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isBuffing ? "#f59e0b" : "#e2e8f0"}
        size={isBuffing ? 0.1 : 0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={isBuffing ? 0.8 : 0.0}
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
      wheelRef.current.rotation.z -= 0.15; // Drive rotation
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

// Automated Workshop Glowing Archway
function WorkshopArchway() {
  return (
    <group position={[1.5, 0, 0]}>
      {/* Left Pillar */}
      <mesh position={[-0.5, 1.2, 2]}>
        <boxGeometry args={[0.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[-0.5, 1.2, -2]}>
        <boxGeometry args={[0.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Top Arch Bridge */}
      <mesh position={[-0.5, 2.4, 0]}>
        <boxGeometry args={[0.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Glowing Neon Strip */}
      <mesh position={[-0.49, 2.4, 0]}>
        <boxGeometry args={[0.22, 0.1, 4.0]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Sleek Horizontal Sports Coupe Car Body
function SleekSportsCoupe({ progress, targetColor, position, isSpinningWheels }) {
  // Lerp material properties smoothly from Dull (progress = 0) to 100% Chamkila Sheen (progress = 1)
  const currentRoughness = THREE.MathUtils.lerp(0.92, 0.005, progress);
  const currentMetalness = THREE.MathUtils.lerp(0.08, 0.95, progress);
  const currentClearcoat = THREE.MathUtils.lerp(0, 1.0, progress);
  const currentEnvIntensity = THREE.MathUtils.lerp(0.2, 4.5, progress);

  // Color lerps from Dull Slate (#3b4252) to target glossy color
  const dullColor = new THREE.Color("#3b4252");
  const finalColor = new THREE.Color(targetColor);
  const currentColor = dullColor.clone().lerp(finalColor, progress);

  return (
    <group position={position} scale={0.95}>
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
      <ProportionedCarWheel position={[0.85, 0.05, 0.72]} isSpinning={isSpinningWheels} />
      <ProportionedCarWheel position={[0.85, 0.05, -0.72]} isSpinning={isSpinningWheels} />
      <ProportionedCarWheel position={[-0.85, 0.05, 0.72]} isSpinning={isSpinningWheels} />
      <ProportionedCarWheel position={[-0.85, 0.05, -0.72]} isSpinning={isSpinningWheels} />

    </group>
  );
}

// Customer Queue for Simulation - Localized for Indian Market
const CUSTOMER_QUEUE = [
  { id: '1001', color: '#dc2626', name: 'Mahindra Thar (Red)', service: '9H Ceramic Coating', price: '₹25,000' },
  { id: '1002', color: '#1e3a8a', name: 'Honda City (Blue)', service: 'Rubbing & Polishing', price: '₹4,500' },
  { id: '1003', color: '#10b981', name: 'Toyota Fortuner', service: 'Deep Spa Wash & Teflon', price: '₹1,500' },
  { id: '1004', color: '#0f172a', name: 'Kia Seltos X-Line', service: 'Garware TPU PPF Wrap', price: '₹75,000' }
];

export default function Car3DScene() {
  const [queueIndex, setQueueIndex] = useState(0);
  const [stage, setStage] = useState('WAITING'); // WAITING | DRIVING_IN | DETAILING | DRIVING_OUT
  const [carPositionX, setCarPositionX] = useState(-15);
  const [coatingProgress, setCoatingProgress] = useState(0.0);

  const currentCar = CUSTOMER_QUEUE[queueIndex];
  
  // Audio ref for cha-ching
  const [showRevenue, setShowRevenue] = useState(false);

  // Workshop Automation Logic
  useFrame((_, delta) => {
    if (stage === 'DRIVING_IN') {
      setCarPositionX((prev) => {
        const next = THREE.MathUtils.lerp(prev, 1.5, 0.05); // Move towards center archway
        if (Math.abs(1.5 - next) < 0.05) {
          setStage('DETAILING');
          return 1.5;
        }
        return next;
      });
    }

    if (stage === 'DETAILING') {
      setCoatingProgress((prev) => {
        const next = prev + delta * 0.4;
        if (next >= 1.0) {
          setStage('DRIVING_OUT');
          setShowRevenue(true);
          setTimeout(() => setShowRevenue(false), 2500);
          return 1.0;
        }
        return next;
      });
    }

    if (stage === 'DRIVING_OUT') {
      setCarPositionX((prev) => {
        const next = THREE.MathUtils.lerp(prev, 15, 0.05); // Move off screen right
        if (Math.abs(15 - next) < 0.1) {
          // Reset cycle for next car
          setStage('WAITING');
          setCoatingProgress(0.0);
          setCarPositionX(-15);
          setQueueIndex((prevIdx) => (prevIdx + 1) % CUSTOMER_QUEUE.length);
          return 15;
        }
        return next;
      });
    }
  });

  const handleAcceptBooking = () => {
    if (stage === 'WAITING') {
      setStage('DRIVING_IN');
    }
  };

  const isWheelsSpinning = stage === 'DRIVING_IN' || stage === 'DRIVING_OUT';
  const isBuffing = stage === 'DETAILING';

  return (
    <group>
      {/* High Dynamic Range City Environment Map for Ultra-Chamkila Mirror Reflections */}
      <Environment preset="city" />

      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow />
      <pointLight position={[0, 2, 3]} intensity={1.6} color="#ffffff" />

      {/* Workshop Elements - Scaled to fit viewport */}
      <group scale={0.7} position={[0.6, -0.4, -1]}>
        <WorkshopArchway />
        <CleaningSmokeFog count={250} isBuffing={isBuffing} />

        {/* Chamkila Sparkle Stars during detailing */}
        <Sparkles
          count={Math.round(coatingProgress * 150)}
          scale={6}
          size={3}
          speed={0.8}
          position={[1.5, 0, 0]}
          opacity={coatingProgress}
          color="#38bdf8"
        />

        {/* Simulated Driving Car */}
        <Float speed={0} rotationIntensity={0} floatIntensity={0}>
          <SleekSportsCoupe 
            progress={coatingProgress} 
            targetColor={currentCar.color}
            position={[carPositionX, -0.15, 0]} 
            isSpinningWheels={isWheelsSpinning}
          />
        </Float>
        
        {/* Realistic Ground Shadow under Archway */}
        <ContactShadows position={[0, -1.35, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
      </group>

      {/* 3D ERP Tablet Interface (Left Side) - Scaled and Repositioned */}
      <Html transform position={[-0.9, 0.1, 1.0]} rotation={[0, Math.PI / 10, 0]} scale={0.14} className="pointer-events-auto">
        {/* Physical Tablet Bezel (Black Hardware) */}
        <div className="w-[380px] h-[550px] bg-white rounded-[2.5rem] border-[14px] border-[#0a0a0c] shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-slate-800 flex flex-col overflow-hidden select-none relative">
          
          {/* Front Facing Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#0a0a0c] rounded-b-xl z-50 flex items-center justify-center gap-2 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-800 shadow-inner" />
             <div className="w-1 h-1 rounded-full bg-emerald-500/50 blur-[0.5px]" />
          </div>

          {/* Screen Glass Glare Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none z-40 mix-blend-overlay" />
          
          {/* iOS Style Status Bar (Light Mode) */}
          <div className="bg-slate-50 pt-1 pb-0 px-5 flex justify-between items-center text-[9px] text-slate-800 font-bold z-30 relative">
             <span>Jio 5G</span>
             <span className="text-slate-800">14:05</span>
             <div className="flex items-center gap-1">
                <span>98%</span>
                <div className="w-4 h-2 rounded-[3px] border border-slate-800 flex justify-end p-[1px]">
                   <div className="w-full h-full bg-slate-800 rounded-[1px]" />
                </div>
             </div>
          </div>

          {/* Tablet Header (Light Mode) */}
          <div className="bg-white p-4 pt-3 border-b border-slate-200 flex justify-between items-center relative z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-rose-700 rounded-md flex items-center justify-center shadow-md shadow-rose-600/20 border border-rose-400/30">
                <span className="text-white text-xs font-black">AD</span>
              </div>
              <span className="text-slate-900 font-black text-sm tracking-widest uppercase">ApexDrive OS</span>
            </div>
          </div>

          {/* Tablet Content (Light Mode) */}
          <div className="flex-1 p-5 flex flex-col relative bg-slate-50 z-20">
            {/* Subtle Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-50 pointer-events-none" />
            
            <h2 className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-4 relative z-10 flex items-center gap-2">
              <div className="w-1 h-3 bg-rose-500 rounded-full" />
              Live Workshop Queue
            </h2>

            {/* Current Request Card (Light Mode) */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentCar.id + stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-lg relative overflow-hidden"
              >
                {/* Colored Top Banner */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: currentCar.color }} />

                <div className="flex justify-between items-start mb-3 mt-1">
                  <div>
                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">ID: #{currentCar.id}</div>
                    <div className="text-slate-900 font-bold text-lg leading-tight">{currentCar.name}</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                    {currentCar.price}
                  </div>
                </div>

                <div className="text-slate-600 text-sm font-medium mb-5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  🔧 {currentCar.service}
                </div>

                {/* Status / Action Button */}
                {stage === 'WAITING' && (
                  <button 
                    onClick={handleAcceptBooking}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest py-3 rounded-lg shadow-md shadow-rose-600/20 active:scale-95 transition-all text-sm border border-rose-500"
                  >
                    Accept Booking
                  </button>
                )}
                
                {stage === 'DRIVING_IN' && (
                  <div className="w-full bg-amber-100 text-amber-700 font-black uppercase tracking-widest py-3 rounded-lg text-center text-sm border border-amber-200 flex items-center justify-center gap-2">
                    <span className="animate-spin text-lg">⏳</span> Valet Parking...
                  </div>
                )}

                {stage === 'DETAILING' && (
                  <div className="w-full bg-sky-100 text-sky-700 font-black uppercase tracking-widest py-3 rounded-lg text-center text-sm border border-sky-200 flex flex-col items-center justify-center">
                    <span className="text-xs mb-1">Executing Service...</span>
                    <div className="w-3/4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 transition-all" style={{ width: `${coatingProgress * 100}%` }} />
                    </div>
                  </div>
                )}

                {stage === 'DRIVING_OUT' && (
                  <div className="w-full bg-emerald-100 text-emerald-700 font-black uppercase tracking-widest py-3 rounded-lg text-center text-sm border border-emerald-200 flex items-center justify-center gap-2">
                    <span className="text-lg">✅</span> Job Completed
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Upcoming Queue (Light Mode) */}
            <div className="mt-6">
              <h3 className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Up Next in Bay</h3>
              {[1, 2].map((offset) => {
                const nextCar = CUSTOMER_QUEUE[(queueIndex + offset) % CUSTOMER_QUEUE.length];
                return (
                  <div key={offset} className="flex justify-between items-center py-2 border-b border-slate-200 opacity-60 grayscale">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nextCar.color }} />
                      <span className="text-slate-600 text-xs font-medium">{nextCar.name}</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono">{nextCar.price}</span>
                  </div>
                );
              })}
            </div>

            {/* Floating Revenue Alert */}
            <AnimatePresence>
              {showRevenue && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 bg-white/60 backdrop-blur-sm"
                >
                  <div className="bg-emerald-500 text-white font-black text-3xl px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.4)] border-4 border-emerald-400 rotate-[-5deg]">
                    + {currentCar.price}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Html>
    </group>
  );
}
