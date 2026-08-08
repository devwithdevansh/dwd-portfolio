import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Html, Float, ContactShadows, Text } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';

// ===== STUDIO INTERIOR ENVIRONMENT (Gender Neutral / Premium) =====
function SalonInterior() {
  return (
    <group>
      {/* === FLOOR: Slate & White Marble Tiles === */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.05} metalness={0.1} />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x, i) =>
        [-2, 0, 2].map((z, j) => (
          <mesh key={`tile-${i}-${j}`} position={[x, 0.0, z]} receiveShadow>
            <boxGeometry args={[1.98, 0.01, 1.98]} />
            <meshStandardMaterial color={((i + j) % 2 === 0) ? "#ffffff" : "#f1f5f9"} roughness={0.05} />
          </mesh>
        ))
      )}

      {/* === BACK WALL === */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[18, 5, 0.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
      </mesh>

      {/* === LARGE HOLLYWOOD MIRRORS (2x) === */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={`mirror-${i}`} position={[x, 2.3, -4.8]}>
          <mesh castShadow>
            <boxGeometry args={[2.4, 3.2, 0.08]} />
            <meshStandardMaterial color="#1c1917" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[2.2, 3.0, 0.04]} />
            <meshPhysicalMaterial color="#e2e8f0" transmission={0.3} roughness={0} metalness={0.9} reflectivity={1} />
          </mesh>
          {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bi) => (
            <mesh key={`bulb-top-${bi}`} position={[bx, 1.65, 0.12]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={2} />
            </mesh>
          ))}
          {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bi) => (
            <mesh key={`bulb-bot-${bi}`} position={[bx, -1.65, 0.12]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={2} />
            </mesh>
          ))}
          <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#fef08a" distance={3} />
        </group>
      ))}

      {/* === VANITY COUNTER under mirrors === */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={`vanity-${i}`} position={[x, 0, -4.5]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[2.4, 0.08, 0.7]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[2.4, 0.8, 0.7]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
          </mesh>
          {[-0.6, 0, 0.6].map((bx, bi) => (
            <group key={`bottle-${bi}`} position={[bx, 0.88, -0.1]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
                <meshStandardMaterial color={['#1c1917', '#9ca3af', '#475569'][bi]} roughness={0.2} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.03, 0.05, 0.08, 8]} />
                <meshStandardMaterial color="#1c1917" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* === STYLING CHAIRS (2x) Premium dark leather === */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={`chair-${i}`} position={[x, 0, -2.8]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[0.65, 0.12, 0.65]} />
            <meshStandardMaterial color="#1c1917" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.77, 0]} castShadow>
            <boxGeometry args={[0.6, 0.08, 0.6]} />
            <meshStandardMaterial color="#292524" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.2, -0.3]} castShadow>
            <boxGeometry args={[0.65, 1.1, 0.1]} />
            <meshStandardMaterial color="#1c1917" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.2, -0.25]} castShadow>
            <boxGeometry args={[0.55, 1.0, 0.08]} />
            <meshStandardMaterial color="#292524" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
            <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* === NEON STUDIO SIGN on wall === */}
      <group position={[0, 4.3, -4.75]}>
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
          <Text fontSize={0.5} color="#e0e7ff" anchorX="center" anchorY="middle" fontWeight="bold">
            ✦ STUDIO ✦
          </Text>
          <pointLight position={[0, 0, 0.5]} intensity={0.8} color="#818cf8" distance={4} />
        </Float>
      </group>

      {/* === CEILING PENDANT LIGHTS === */}
      {[-4, 0, 4].map((x, i) => (
        <group key={`pendant-${i}`} position={[x, 4.5, -2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.2, 0.4, 12]} />
            <meshStandardMaterial color="#1c1917" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 4]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} />
          </mesh>
          <pointLight position={[0, 0, 0]} intensity={0.6} color="#fef3c7" distance={5} castShadow />
        </group>
      ))}

      {/* === WAITING AREA (right side) === */}
      <group position={[6.5, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.08, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[2, 0.4, 0.6]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>
        <mesh position={[1.3, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[1.3, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.6} />
        </mesh>
      </group>

      {/* === ENTRANCE DOOR (left) === */}
      <group position={[-7, 1.8, -1]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 3.6, 1.4]} />
          <meshStandardMaterial color="#1c1917" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 3.4, 1.2]} />
          <meshPhysicalMaterial color="#bfdbfe" transmission={0.8} roughness={0.05} transparent opacity={0.7} />
        </mesh>
      </group>
      <mesh position={[-8.5, 2.5, 0]} castShadow>
        <boxGeometry args={[0.2, 5, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ===== WALL CLOCK =====
function WallClock({ timeRotation }) {
  const { hourRotation, minuteRotation, secondRotation } = useSpring({
    hourRotation: [0, 0, -timeRotation],
    minuteRotation: [0, 0, -(timeRotation * 12)],
    secondRotation: [0, 0, -(timeRotation * 720)],
    config: { mass: 1, tension: 150, friction: 40 },
  });

  // Ticks
  const ticks = Array.from({ length: 12 }).map((_, i) => (
    <group key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
      <mesh position={[0, 0.38, 0.07]}>
        <boxGeometry args={[0.015, 0.06, 0.01]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
    </group>
  ));

  return (
    <group position={[0, 2.3, -4.75]}>
      {/* Clock Base (Black Rim) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#1c1917" metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Clock Face (White) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.051]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.01, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Clock Center Pin */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      
      {ticks}

      {/* Hour Hand */}
      <a.group rotation={hourRotation} position={[0, 0, 0.08]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.04, 0.3, 0.02]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
      </a.group>
      {/* Minute Hand */}
      <a.group rotation={minuteRotation} position={[0, 0, 0.09]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.02]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
      </a.group>
      {/* Second Hand (Red) */}
      <a.group rotation={secondRotation} position={[0, 0, 0.1]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.01, 0.45, 0.01]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </a.group>
    </group>
  );
}

// ===== HIGH-FIDELITY IPHONE UI =====
function SmartPhone({ sceneState, activeCustomer, onBook }) {
  // Float phone nicely in foreground, using a fixed scale so it stays in frame
  const { position, opacity } = useSpring({
    position: (sceneState === 'IDLE' || sceneState === 'BOOKING') ? [-3.0, 0.8, 1.0] : [-3.0, -5, 1.0],
    opacity: (sceneState === 'IDLE' || sceneState === 'BOOKING') ? 1 : 0,
    config: { tension: 100, friction: 20 }
  });

  return (
    <a.group position={position} rotation={[-0.05, 0.2, -0.02]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Html transform position={[0, 0, 0]} scale={0.15} zIndexRange={[100, 0]} className="pointer-events-auto">
          <div 
            style={{ opacity: (sceneState === 'IDLE' || sceneState === 'BOOKING') ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
            className="w-[280px] h-[580px] bg-slate-50 rounded-[3rem] border-[12px] border-[#0a0a0c] shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-slate-800 flex flex-col overflow-hidden select-none relative"
          >
            {/* Front Facing Camera Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#0a0a0c] rounded-full z-50 flex items-center justify-between px-3 shadow-sm">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-800 shadow-inner flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-indigo-500/50 blur-[0.5px]" />
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 blur-[0.5px] opacity-80" />
            </div>

            {/* Screen Glass Glare Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none z-40 mix-blend-overlay" />
            
            {/* iOS Style Status Bar */}
            <div className="bg-white pt-2 pb-1 px-6 flex justify-between items-center text-[10px] text-slate-800 font-bold z-30 relative">
               <span>10:29</span>
               <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-5 h-2.5 rounded-[4px] border border-slate-800 flex justify-end p-[1px]">
                     <div className="w-full h-full bg-slate-800 rounded-[2px]" />
                  </div>
               </div>
            </div>

            {/* App Content */}
            <div className="flex-1 flex flex-col relative z-30 bg-slate-50">
              {/* App Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 pt-8 pb-10 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                <h3 className="m-0 text-xl font-black tracking-tight relative z-10">Studio Elegance</h3>
                <p className="m-0 mt-1 text-xs text-indigo-200 font-medium tracking-wide relative z-10 uppercase">Incoming Booking</p>
              </div>

              {/* Customer Details Card */}
              <div className="flex-1 px-5 relative -top-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-900/5 p-5 border border-slate-100">
                  <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-2xl mb-4 shadow-inner border border-indigo-100">
                    👤
                  </div>
                  <h2 className="m-0 text-2xl font-bold text-slate-900 tracking-tight">{activeCustomer.name}</h2>
                  <p className="m-0 mt-1 text-sm font-semibold text-indigo-600">{activeCustomer.service}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Time</span>
                      <span className="text-sm font-black text-slate-800">{activeCustomer.timeStr}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Stylist</span>
                      <span className="text-sm font-black text-slate-800">{activeCustomer.stylist}</span>
                    </div>
                    <div className="flex justify-between items-end pb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Deposit</span>
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Paid ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pb-8">
                <button 
                  onClick={onBook}
                  disabled={sceneState !== 'IDLE'}
                  className={`w-full py-4 rounded-2xl text-sm font-black tracking-widest uppercase transition-all duration-300 shadow-xl ${
                    sceneState === 'IDLE' 
                      ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 cursor-pointer' 
                      : 'bg-emerald-500 text-white shadow-emerald-500/30'
                  }`}
                >
                  {sceneState === 'IDLE' ? 'Confirm Booking' : '✓ Confirmed'}
                </button>
              </div>
              
              {/* iOS Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </Html>
      </Float>
    </a.group>
  );
}

// ===== CHARACTER MESH COMPONENTS =====

function CharacterBody({ isMale, hairColor, shirtColor, pantColor, isSeated, isWorking }) {
  const rightArmRef = useRef();
  const leftArmRef = useRef();

  useFrame(({ clock }) => {
    if (isWorking && rightArmRef.current && leftArmRef.current) {
      const t = clock.getElapsedTime() * 15;
      rightArmRef.current.rotation.x = Math.sin(t) * 0.2 - 2.2;
      leftArmRef.current.rotation.x = Math.cos(t) * 0.2 - 2.2;
    } else if (rightArmRef.current && leftArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
    }
  });

  const { sitOffset, legRotation, zOffset } = useSpring({
    sitOffset: isSeated ? -0.2 : 0,
    legRotation: isSeated ? -Math.PI / 2.2 : 0,
    zOffset: isSeated ? 0.1 : 0,
    config: { tension: 120, friction: 18 }
  });

  return (
    <a.group position-y={sitOffset} position-z={zOffset}>
      {/* Head */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      
      {/* Hair */}
      {isMale ? (
        <mesh position={[0, 1.74, 0]} castShadow>
          <sphereGeometry args={[0.185, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
      ) : (
        <group>
          <mesh position={[0, 1.78, 0]} castShadow>
            <sphereGeometry args={[0.185, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.92, -0.08]} castShadow>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color={hairColor} roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* Neck */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.18, 8]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <boxGeometry args={[0.34, 0.52, 0.2]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>
      
      {/* Left Arm Hinge */}
      <group ref={leftArmRef} position={[-0.2, 1.25, 0]}>
        <mesh position={[-0.02, -0.2, 0]} castShadow rotation={[0, 0, 0.18]}>
          <capsuleGeometry args={[0.06, 0.32, 4, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
        <mesh position={[-0.06, -0.47, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Right Arm Hinge */}
      <group ref={rightArmRef} position={[0.2, 1.25, 0]}>
        <mesh position={[0.02, -0.2, 0]} castShadow rotation={[0, 0, -0.18]}>
          <capsuleGeometry args={[0.06, 0.32, 4, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.06, -0.47, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
        </mesh>
      </group>

      {/* Lower Body (Hinged at Hips Y=0.8) */}
      <a.group position={[0, 0.8, 0]} rotation-x={legRotation}>
        {isMale ? (
          <group>
            {/* Legs */}
            <mesh position={[-0.1, -0.3, 0]} castShadow>
              <capsuleGeometry args={[0.085, 0.6, 4, 8]} />
              <meshStandardMaterial color={pantColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.1, -0.3, 0]} castShadow>
              <capsuleGeometry args={[0.085, 0.6, 4, 8]} />
              <meshStandardMaterial color={pantColor} roughness={0.7} />
            </mesh>
          </group>
        ) : (
          <group>
            {/* Skirt / Legs */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.32, 0.5, 12]} />
              <meshStandardMaterial color={pantColor} roughness={0.5} />
            </mesh>
            <mesh position={[-0.1, -0.53, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
              <meshStandardMaterial color="#f5d0a9" roughness={0.7} />
            </mesh>
            <mesh position={[0.1, -0.53, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
              <meshStandardMaterial color="#f5d0a9" roughness={0.7} />
            </mesh>
          </group>
        )}
        
        {/* Shoes */}
        <mesh position={[-0.1, -0.74, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.2]} />
          <meshStandardMaterial color="#1c1917" roughness={0.4} />
        </mesh>
        <mesh position={[0.1, -0.74, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.2]} />
          <meshStandardMaterial color="#1c1917" roughness={0.4} />
        </mesh>
      </a.group>
    </a.group>
  );
}

// Stylist Character (Stands by mirror, approaches chair)
function Stylist({ sceneState }) {
  const isServicing = sceneState === 'SERVICING';
  
  const { position, rotation } = useSpring({
    position: isServicing ? [-2.5, 0, -2.1] : [-1, 0, -4],
    rotation: isServicing ? [0, Math.PI, 0] : [0, -Math.PI / 4, 0],
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.group position={position} rotation={rotation}>
      <group scale={1.3}>
        <CharacterBody isMale={true} hairColor="#000" shirtColor="#1e293b" pantColor="#0f172a" isWorking={isServicing} />
      </group>
      {/* Service Indicator (Floating Scissors icon) */}
      <Html position={[0, 2.7, 0]} center zIndexRange={[50, 0]}>
        <div style={{
          opacity: isServicing ? 1 : 0,
          transform: `scale(${isServicing ? 1 : 0})`,
          transition: 'all 0.5s ease',
          fontSize: '32px',
          animation: isServicing ? 'snip 0.5s ease infinite alternate' : 'none',
        }}>
          ✂️
        </div>
        <style>{`@keyframes snip { 0% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }`}</style>
      </Html>
    </a.group>
  );
}

// Customer Character (Walks in, sits, walks out)
function Customer({ data, sceneState }) {
  const isMale = data.id % 2 === 0;
  
  // Calculate Target Position based on story state
  let targetPos = [-8, 0, -2]; // Off-screen / Door
  let targetRot = [0, Math.PI / 2, 0]; // Face right (walking in)

  if (sceneState === 'ARRIVING') {
    targetPos = [-2.5, 0.8, -2.75]; // At chair
    targetRot = [0, Math.PI / 2, 0]; 
  } else if (sceneState === 'SERVICING') {
    targetPos = [-2.5, 0.8, -2.75]; // Sitting in chair
    targetRot = [0, Math.PI, 0]; // Face mirror
  } else if (sceneState === 'LEAVING') {
    targetPos = [-10, 0, -2]; // Walk way out
    targetRot = [0, -Math.PI / 2, 0]; // Face left (walking out)
  }

  const { position, rotation } = useSpring({
    position: targetPos,
    rotation: targetRot,
    config: { mass: 1, tension: 80, friction: 20 },
  });

  // Only render if they are active in the scene
  if (sceneState === 'IDLE' || sceneState === 'BOOKING' || sceneState === 'TIME_LAPSE') {
    return null; 
  }

  return (
    <a.group position={position} rotation={rotation}>
      <CharacterBody 
        isMale={isMale} 
        hairColor={data.hairColor} 
        shirtColor={data.shirtColor} 
        pantColor={data.pantColor} 
        isSeated={sceneState === 'SERVICING'}
      />
    </a.group>
  );
}

// ===== MAIN SCENE COMPONENT & STATE MACHINE =====

const CUSTOMER_DATA = [
  { id: 0, name: 'Arjun Patel', service: 'Haircut & Styling', stylist: 'Rahul', timeStr: '10:30 AM', targetHours: 2.5, hairColor: '#1c1917', shirtColor: '#f8fafc', pantColor: '#1e293b' },
  { id: 1, name: 'Priya Sharma', service: 'Keratin Treatment', stylist: 'Rahul', timeStr: '1:00 PM', targetHours: 5.0, hairColor: '#451a03', shirtColor: '#f1f5f9', pantColor: '#0f172a' },
  { id: 2, name: 'Rohan Mehta', service: 'Beard Trim & Spa', stylist: 'Rahul', timeStr: '4:15 PM', targetHours: 8.25, hairColor: '#1c1917', shirtColor: '#cbd5e1', pantColor: '#0f172a' },
];

export default function SalonScene() {
  const [sceneState, setSceneState] = useState('IDLE'); // IDLE, BOOKING, TIME_LAPSE, ARRIVING, SERVICING, LEAVING
  const [customerIdx, setCustomerIdx] = useState(0);
  const [clockTime, setClockTime] = useState(0); // in hours
  
  const activeCustomer = CUSTOMER_DATA[customerIdx % CUSTOMER_DATA.length];

  const handleBook = () => {
    if (sceneState !== 'IDLE') return;
    
    // 1. Confirm Booking
    setSceneState('BOOKING');
    
    // 2. Start Time Lapse after confirmation
    setTimeout(() => {
      setSceneState('TIME_LAPSE');
      setClockTime(activeCustomer.targetHours);
    }, 1500);

    // 3. Customer Arrives
    setTimeout(() => {
      setSceneState('ARRIVING');
    }, 4500);

    // 4. Stylist Services Customer
    setTimeout(() => {
      setSceneState('SERVICING');
    }, 6500);

    // 5. Customer Leaves
    setTimeout(() => {
      setSceneState('LEAVING');
    }, 11500);

    // 6. Reset for next customer
    setTimeout(() => {
      setCustomerIdx(prev => prev + 1);
      setSceneState('IDLE');
    }, 14500);
  };

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#fef3c7" />

      <group position={[0, -1.5, 1]}>
        <SalonInterior />
        <WallClock timeRotation={(clockTime / 12) * Math.PI * 2} />
        <Stylist sceneState={sceneState} />
        <Customer data={activeCustomer} sceneState={sceneState} />
        <SmartPhone sceneState={sceneState} activeCustomer={activeCustomer} onBook={handleBook} />
        
        <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={20} blur={2} far={4} />
      </group>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </>
  );
}
