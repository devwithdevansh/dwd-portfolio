import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Helper to create a procedural canvas texture for text labels like "AMBULANCE", "EMERGENCY", "H"
function createTextTexture(text, bgColor, textColor, width = 512, height = 128, fontSize = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ----------------------------------------------------
// 1. HOSPITAL BUILDING & DIORAMA ENVIRONMENT WITH ANIMATED GATE
// ----------------------------------------------------
function HospitalEnvironment({ ambulanceZ }) {
  const emergencySignTex = useMemo(() => createTextTexture('EMERGENCY', '#ea580c', '#ffffff', 512, 128, 70), []);
  const hLogoTex = useMemo(() => createTextTexture('H', '#0284c7', '#ffffff', 256, 256, 160), []);
  const receptionTex = useMemo(() => createTextTexture('RECEPTION', '#0284c7', '#ffffff', 512, 128, 60), []);
  const ambParkingTex = useMemo(() => createTextTexture('AMBULANCE ONLY', '#dc2626', '#ffffff', 512, 128, 50), []);

  // Ref for the Barrier Gate Arm Pivot
  const gateArmRef = useRef();
  const gateLightRef = useRef();

  // Refs for the ER sliding doors & interior light
  const erLeftDoorRef = useRef();
  const erRightDoorRef = useRef();
  const erLightRef = useRef();

  // Animate Boom Gate Arm Opening/Closing based on Ambulance position Z
  useFrame((state, delta) => {
    // Gate opens up when ambulance approaches (Z between -1 and 10)
    const shouldOpen = ambulanceZ < 11 && ambulanceZ > -2;
    const targetAngle = shouldOpen ? -Math.PI / 2 : 0; // -90 deg when open, 0 deg horizontal when closed

    if (gateArmRef.current) {
      gateArmRef.current.rotation.z = THREE.MathUtils.damp(
        gateArmRef.current.rotation.z,
        targetAngle,
        6,
        delta
      );
    }

    // Gate Light Flashes yellow when opening/closing
    if (gateLightRef.current) {
      const flash = Math.sin(state.clock.getElapsedTime() * 10) > 0;
      gateLightRef.current.intensity = shouldOpen && Math.abs(gateArmRef.current.rotation.z - targetAngle) > 0.05 ? (flash ? 4 : 0.5) : 1;
    }

    // Animate ER sliding doors when ambulance is parked (Z < 3)
    const isParked = ambulanceZ < 3;
    const doorTarget = isParked ? 0.9 : 0; // slide open by 0.9 units
    if (erLeftDoorRef.current && erRightDoorRef.current) {
      erLeftDoorRef.current.position.x = THREE.MathUtils.damp(erLeftDoorRef.current.position.x, -0.6 - doorTarget, 4, delta);
      erRightDoorRef.current.position.x = THREE.MathUtils.damp(erRightDoorRef.current.position.x, 0.6 + doorTarget, 4, delta);
    }

    // ER interior light pulses rapidly when doors are open
    if (erLightRef.current) {
      erLightRef.current.intensity = isParked ? 3 + Math.sin(state.clock.getElapsedTime() * 15) * 2 : 1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Base & Landscaping */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[26, 0.4, 26]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Main Asphalt Road & Parking Driveway */}
      <mesh position={[2.8, 0.01, 2]} receiveShadow>
        <planeGeometry args={[14, 22]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      
      {/* Road Markings / Ambulance Parking Bay Lines */}
      <mesh position={[2.8, 0.02, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 5.2]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </mesh>
      <mesh position={[2.8, 0.025, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 0.6]} />
        <meshBasicMaterial map={ambParkingTex} transparent />
      </mesh>

      {/* Green Lawn Left */}
      <mesh position={[-8.5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[7, 0.05, 24]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>

      {/* Spacious Sidewalk & Curbs in front of Hospital (Creates realistic walking gap) */}
      <mesh position={[-0.2, 0.08, 2]} receiveShadow>
        <boxGeometry args={[4.2, 0.15, 20]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* --- AUTOMATED SECURITY BOOM BARRIER GATE --- */}
      <group position={[4.6, 0.15, 7.5]}>
        {/* Main Gate Post */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        
        {/* Flashing Yellow Gate Light */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
        </mesh>
        <pointLight ref={gateLightRef} position={[0, 1.4, 0]} color="#f59e0b" intensity={2} distance={4} />

        {/* Animated Barrier Gate Arm Pivot (Red & White Striped) */}
        <group position={[-0.2, 1.0, 0]} ref={gateArmRef}>
          <mesh position={[-1.7, 0, 0]} castShadow>
            <boxGeometry args={[3.4, 0.12, 0.08]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* White Stripes on Gate Arm */}
          {[-0.5, -1.2, -1.9, -2.6].map((xOffset, idx) => (
            <mesh key={`stripe-${idx}`} position={[xOffset, 0, 0.005]}>
              <boxGeometry args={[0.3, 0.13, 0.09]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>

      {/* --- MAIN HOSPITAL STRUCTURE (MODERN ARCHITECTURE) --- */}
      <group position={[-2.5, 0, -2]}>
        
        {/* 1. Main Curved Glass Facade Building */}
        {/* Central Core Structure */}
        <mesh position={[-1, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 9, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>

        {/* Outer Glass Curtain Wall - Front */}
        <mesh position={[-1, 4.5, 4.1]} castShadow>
          <boxGeometry args={[10.2, 9.2, 0.2]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.9} thickness={0.5} envMapIntensity={2} />
        </mesh>
        
        {/* Outer Glass Curtain Wall - Right Side */}
        <mesh position={[4.1, 4.5, 0]} castShadow>
          <boxGeometry args={[0.2, 9.2, 8]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.9} thickness={0.5} envMapIntensity={2} />
        </mesh>
        
        {/* Outer Glass Curtain Wall - Left Side */}
        <mesh position={[-6.1, 4.5, 0]} castShadow>
          <boxGeometry args={[0.2, 9.2, 8]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.9} thickness={0.5} envMapIntensity={2} />
        </mesh>

        {/* Structural Window Mullions (Steel Grid) */}
        <group position={[-1, 4.5, 4.2]}>
          {/* Vertical Mullions */}
          {[-4, -2, 0, 2, 4].map(x => (
            <mesh key={`v-mullion-${x}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.1, 9.2, 0.05]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Horizontal Mullions */}
          {[-3.5, -1.5, 0.5, 2.5, 4.5].map(y => (
            <mesh key={`h-mullion-${y}`} position={[0, y, 0]}>
              <boxGeometry args={[10.2, 0.1, 0.05]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* --- GRAND ENTRANCE PORTICO & CANOPY --- */}
        <group position={[-1, 0, 6]}>
          {/* Massive Overhanging Steel Canopy */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <boxGeometry args={[8, 0.3, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
          </mesh>
          
          {/* Recessed Lighting under Canopy */}
          {[-2, 2].map(x => (
            <group key={`canopy-light-${x}`} position={[x, 2.35, 1]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 16]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
              </mesh>
              <pointLight color="#ffffff" intensity={2} distance={8} />
            </group>
          ))}
          
          {/* Sleek Cylindrical Steel Pillars */}
          {[-3, 3].map(x => (
            <group key={`pillar-${x}`} position={[x, 1.25, 2.5]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, 2.5, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, -1.2, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            </group>
          ))}
          
          {/* 3D "H" Hospital Emblem on Canopy */}
          <group position={[0, 2.8, 3.0]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 1.6, 0.15]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <Text position={[0, 0, 0.09]} fontSize={1.2} color="#ffffff" anchorX="center" anchorY="middle">
              H
            </Text>
          </group>
        </group>

        {/* --- DETAILED INTERIOR LOBBY (VISIBLE THROUGH GLASS) --- */}
        <group position={[-1, 0, 2.5]}>
          {/* Lobby Floor */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[9.8, 0.1, 3]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
          {/* Reception Desk */}
          <mesh position={[0, 0.5, -0.5]}>
            <boxGeometry args={[3, 1, 0.6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.05, -0.5]}>
            <boxGeometry args={[3.2, 0.1, 0.7]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Inner Lobby Lighting */}
          <pointLight position={[0, 2.5, 0]} color="#ffedd5" intensity={4} distance={10} />
          <pointLight position={[-3, 2.5, 0]} color="#ffedd5" intensity={3} distance={10} />
          <pointLight position={[3, 2.5, 0]} color="#ffedd5" intensity={3} distance={10} />
          {/* Waiting Area Sofas */}
          {[-3, 3].map(x => (
            <mesh key={`sofa-${x}`} position={[x, 0.3, 0.5]}>
              <boxGeometry args={[1.5, 0.5, 0.8]} />
              <meshStandardMaterial color="#ea580c" roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* --- PROPER RECESSED EMERGENCY AMBULANCE ENTRANCE --- */}
        <group position={[5, 0, -1]}>
          {/* Main Overhanging Canopy Structure (Dark Steel/Concrete) */}
          <mesh position={[0.5, 5, 2.5]} castShadow receiveShadow>
            <boxGeometry args={[8, 1, 6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0.5, 3, -1]} castShadow receiveShadow>
            <boxGeometry args={[8, 5, 2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>

          {/* Left and Right Support Walls */}
          <mesh position={[-3, 2.5, 2.5]} castShadow receiveShadow>
            <boxGeometry args={[1, 4, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[4, 2.5, 2.5]} castShadow receiveShadow>
            <boxGeometry args={[1, 4, 6]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>

          {/* Massive Cylindrical Steel Pillars supporting the canopy front */}
          {[-2.5, 3.5].map(x => (
            <mesh key={`er-pillar-${x}`} position={[x, 2.5, 4.8]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 5, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}

          {/* "AMBULANCE ONLY" Overhead Signage */}
          <group position={[0.5, 4.5, 5.55]}>
            <mesh castShadow>
              <boxGeometry args={[5, 0.6, 0.15]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <Text position={[0, 0, 0.09]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
              AMBULANCE ONLY
            </Text>
          </group>

          {/* Recessed ER Corridor Depth (The Interior Space) */}
          <group position={[0.5, 0, 0]}>
            {/* Interior Floor */}
            <mesh position={[0, 0.05, 1.5]}>
              <boxGeometry args={[5.8, 0.1, 5]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
            
            {/* Deep Interior Back Wall (Creates Depth) */}
            <mesh position={[0, 2.5, -0.8]}>
              <boxGeometry args={[6, 5, 0.2]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
            </mesh>
            
            {/* Medical Supply Cabinets */}
            <group position={[2.2, 1, -0.6]}>
              <mesh castShadow>
                <boxGeometry args={[1, 2, 0.4]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              {/* Glass cabinet doors */}
              <mesh position={[0, 0.4, 0.21]}>
                <boxGeometry args={[0.8, 1, 0.05]} />
                <meshPhysicalMaterial color="#bae6fd" transmission={0.9} opacity={0.6} transparent roughness={0.1} />
              </mesh>
            </group>

            {/* ER Reception / Triage Desk inside the corridor */}
            <mesh position={[-1.5, 0.6, 0.5]}>
              <boxGeometry args={[2, 1.2, 0.8]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <mesh position={[-1.5, 1.25, 0.5]}>
              <boxGeometry args={[2.2, 0.1, 1]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Surgical Overhead Light */}
            <group position={[0, 4.5, 1]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
              <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              <pointLight position={[0, -0.6, 0]} color="#ffffff" intensity={3} distance={5} />
            </group>

            {/* Glowing Medical Screens / Monitors on the back wall */}
            <mesh position={[0.5, 2, -0.6]}>
              <boxGeometry args={[1.5, 0.8, 0.1]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
            <mesh position={[-0.5, 2, -0.6]}>
              <boxGeometry args={[1.0, 0.6, 0.1]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0, 1.5, -0.6]}>
              <boxGeometry args={[0.8, 0.4, 0.1]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>

            {/* Dynamic ER Interior Lighting */}
            <pointLight ref={erLightRef} position={[0, 3, 1]} color="#ffffff" intensity={2} distance={10} />
            <pointLight position={[-1.5, 3, -0.2]} color="#ffedd5" intensity={2} distance={8} />

            {/* --- ANIMATED GLASS SLIDING DOORS (Front of the Recess) --- */}
            <group position={[0, 1.4, 2.8]}>
              {/* Outer Door Frame */}
              <mesh castShadow>
                <boxGeometry args={[3.2, 2.8, 0.2]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>
              {/* Animated Left Glass Door */}
              <mesh ref={erLeftDoorRef} position={[-0.6, 0, 0.05]} castShadow>
                <boxGeometry args={[1.4, 2.6, 0.1]} />
                <meshPhysicalMaterial color="#bae6fd" opacity={0.7} transparent transmission={0.9} roughness={0.1} />
              </mesh>
              {/* Animated Right Glass Door */}
              <mesh ref={erRightDoorRef} position={[0.6, 0, 0.05]} castShadow>
                <boxGeometry args={[1.4, 2.6, 0.1]} />
                <meshPhysicalMaterial color="#bae6fd" opacity={0.7} transparent transmission={0.9} roughness={0.1} />
              </mesh>
            </group>
          </group>

          {/* Emergency Flashing Beacons */}
          <pointLight position={[2.8, 3.8, 4.2]} color="#ef4444" intensity={4} distance={6} />
          <pointLight position={[-1.8, 3.8, 4.2]} color="#ef4444" intensity={4} distance={6} />
        </group>

        {/* --- ROOFTOP & HELIPAD --- */}
        <group position={[-1, 9, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[10.4, 0.2, 8.4]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* HVAC Industrial Units */}
          <mesh position={[-2, 0.8, -1]}>
            <boxGeometry args={[2, 1.2, 1.5]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[-2, 1.45, -1]}>
            <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Solar Panels Grid */}
          {[-3, -1, 1].map((x, idx) => (
            <mesh key={`solar-grid-${idx}`} position={[x, 0.5, 2.5]} rotation={[Math.PI / 8, 0, 0]}>
              <boxGeometry args={[1.5, 0.05, 1.5]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
          
          {/* Raised Helipad Platform */}
          <group position={[3, 0.4, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[2.5, 2.8, 0.6, 32]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.4, 32]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Helipad Markings */}
            <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.1, 2.3, 32]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
            <Text position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={2.5} color="#ffffff" anchorX="center" anchorY="middle">
              H
            </Text>
          </group>
        </group>
      </group>

      {/* --- TREES & VEGETATION --- */}
      {[
        [-11, 0, 6], [-11, 0, 1], [-11, 0, -4], [-11, 0, -8],
        [-5, 0, -9], [2, 0, -9]
      ].map(([x, y, z], i) => (
        <group key={`tree-${i}`} position={[x, y, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 1.6, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh position={[0, 2.2, 0]} castShadow>
              <dodecahedronGeometry args={[1.1, 1]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#22c55e" : "#16a34a"} roughness={0.8} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* --- PEOPLE / HOSPITAL EMERGENCY STAFF (Positioned along spacious walkway gap) --- */}
      <group position={[0.6, 0.15, 1.8]}>
        {/* Doctor in Blue Scrubs walking toward ambulance */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>

        {/* Emergency Paramedic carrying medical gear */}
        <mesh position={[0.7, 0.6, -0.6]}>
          <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.7, 1.15, -0.6]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// 2. ANIMATED 3D AMBULANCE MODEL & DRIVING PHYSICS
// ----------------------------------------------------
export function AnimatedAmbulance({ onPositionUpdate }) {
  const vehicleRef = useRef();
  const bodyGroupRef = useRef();
  const wheelFL = useRef();
  const wheelFR = useRef();
  const wheelRL = useRef();
  const wheelRR = useRef();
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const redBeaconRef = useRef();
  const blueBeaconRef = useRef();
  const brakeLightsRef = useRef();

  const ambulanceTextTex = useMemo(() => createTextTexture('AMBULANCE', '#dc2626', '#ffffff', 512, 128, 64), []);
  const starOfLifeTex = useMemo(() => createTextTexture('*', '#ffffff', '#0284c7', 256, 256, 180), []);

  // Animation Timeline States (Arrival -> Approach -> Braking -> Doors Open -> Reset)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycleDuration = 10; // 10 second loop
    const t = (time % cycleDuration) / cycleDuration; // 0.0 -> 1.0

    if (!vehicleRef.current) return;

    let targetZ = 14;
    let pitchAngle = 0;
    let speed = 0;
    let doorsOpenProgress = 0;
    let isBraking = false;

    // Shot 1: Arrival & Acceleration (t: 0 -> 0.35)
    if (t < 0.35) {
      const progress = t / 0.35;
      targetZ = THREE.MathUtils.lerp(14, 5, progress);
      speed = 18;
    } 
    // Shot 2: Approach & Deceleration (t: 0.35 -> 0.55)
    else if (t < 0.55) {
      const progress = (t - 0.35) / 0.2;
      targetZ = THREE.MathUtils.lerp(5, 2.2, 1 - Math.pow(1 - progress, 2)); // Ease out into parking slot
      speed = THREE.MathUtils.lerp(18, 0, progress);
      isBraking = true;
      pitchAngle = Math.sin(progress * Math.PI) * -0.06; // Inertial forward pitch dip on braking
    } 
    // Shot 3 & 4: Stopped in Parking Slot with Gap & Rear Doors Swing Open (t: 0.55 -> 0.85)
    else if (t < 0.85) {
      targetZ = 2.2;
      speed = 0;
      isBraking = false;
      const doorProgress = Math.min(1, (t - 0.55) / 0.15);
      doorsOpenProgress = THREE.MathUtils.lerp(0, Math.PI * 0.65, doorProgress);
    } 
    // Reset / Drive away through gate (t: 0.85 -> 1.0)
    else {
      const progress = (t - 0.85) / 0.15;
      targetZ = THREE.MathUtils.lerp(2.2, -8, progress);
      speed = 15;
      doorsOpenProgress = THREE.MathUtils.lerp(Math.PI * 0.65, 0, progress);
    }

    // Report ambulance Z position back to environment so gate opens/closes
    if (onPositionUpdate) {
      onPositionUpdate(targetZ);
    }

    // Set Vehicle Position & Pitch (Suspension Reaction)
    vehicleRef.current.position.set(2.8, 0.45, targetZ);
    if (bodyGroupRef.current) {
      bodyGroupRef.current.rotation.x = THREE.MathUtils.lerp(bodyGroupRef.current.rotation.x, pitchAngle, 0.2);
    }

    // Rotate Wheels based on velocity
    const wheelRotDelta = speed * 0.05;
    [wheelFL, wheelFR, wheelRL, wheelRR].forEach((ref) => {
      if (ref.current) ref.current.rotation.x += wheelRotDelta;
    });

    // Flashing Emergency Light Bar Effect (Alternating Red/Blue Strobe)
    const flashFreq = Math.floor(time * 12) % 2 === 0;
    if (redBeaconRef.current) redBeaconRef.current.intensity = flashFreq ? 8 : 0.2;
    if (blueBeaconRef.current) blueBeaconRef.current.intensity = !flashFreq ? 8 : 0.2;

    // Brake Lights Glow
    if (brakeLightsRef.current) {
      brakeLightsRef.current.material.emissiveIntensity = isBraking ? 4 : 0.4;
    }

    // Animate Rear Doors Pivot
    if (leftDoorRef.current) leftDoorRef.current.rotation.y = -doorsOpenProgress;
    if (rightDoorRef.current) rightDoorRef.current.rotation.y = doorsOpenProgress;
  });

  return (
    <group ref={vehicleRef} position={[2.8, 0.45, 14]}>
      {/* Main Vehicle Chassis / Body (with Suspension inertia) */}
      {/* Main Vehicle Chassis / Body (with Suspension inertia) */}
      <group ref={bodyGroupRef}>
        {/* Hollow White Van Body */}
        {/* Roof */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[1.7, 0.1, 3.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Floor */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.7, 0.1, 3.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Left Side */}
        <mesh position={[-0.8, 0.8, 0]} castShadow>
          <boxGeometry args={[0.1, 1.2, 3.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Right Side */}
        <mesh position={[0.8, 0.8, 0]} castShadow>
          <boxGeometry args={[0.1, 1.2, 3.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Front Wall */}
        <mesh position={[0, 0.8, 1.65]} castShadow>
          <boxGeometry args={[1.7, 1.2, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* --- AMBULANCE INTERIOR CABIN --- */}
        <group position={[0, 0.5, -0.2]}>
          {/* Patient Stretcher */}
          <group position={[0, 0, -0.4]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.1, 1.8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.5, 0.15, 1.7]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.2, 0.6]}>
              <boxGeometry args={[0.4, 0.1, 0.3]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </group>
          {/* Medical Life Support Panel */}
          <mesh position={[-0.6, 0.4, -0.8]}>
            <boxGeometry args={[0.2, 0.6, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Glowing Monitors */}
          <mesh position={[-0.49, 0.5, -0.6]}>
            <boxGeometry args={[0.05, 0.2, 0.3]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[-0.49, 0.5, -0.9]}>
            <boxGeometry args={[0.05, 0.2, 0.2]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <pointLight position={[0, 0.8, -0.5]} color="#ffffff" intensity={0.5} distance={3} />
        </group>

        {/* Front Cabin Windshield Slop */}
        <mesh position={[0, 0.9, 1.3]} rotation={[0.35, 0, 0]} castShadow>
          <boxGeometry args={[1.65, 1.1, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Red Emergency Stripe Band (Left, Right, Front) */}
        <mesh position={[-0.81, 0.6, 0]}>
          <boxGeometry args={[0.1, 0.35, 3.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0.81, 0.6, 0]}>
          <boxGeometry args={[0.1, 0.35, 3.4]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.6, 1.66]}>
          <boxGeometry args={[1.7, 0.35, 0.1]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>

        {/* Windshield & Windows (Glass) */}
        <mesh position={[0, 1.05, 1.32]} rotation={[0.35, 0, 0]}>
          <planeGeometry args={[1.5, 0.7]} />
          <meshPhysicalMaterial color="#0f172a" roughness={0.1} transmission={0.7} thickness={0.2} />
        </mesh>
        
        {/* Side Windows */}
        {[-0.86, 0.86].map((x, i) => (
          <mesh key={`sidewin-${i}`} position={[x, 1.0, 0.6]} rotation={[0, i === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 0.5]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.1} transmission={0.7} thickness={0.2} />
          </mesh>
        ))}

        {/* Front Grille & Bumper */}
        <mesh position={[0, 0.35, 1.72]}>
          <boxGeometry args={[1.6, 0.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* Headlights (Bright White LED) */}
        {[-0.6, 0.6].map((x, i) => (
          <group key={`headlight-${i}`} position={[x, 0.5, 1.73]}>
            <mesh>
              <boxGeometry args={[0.3, 0.2, 0.05]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
            </mesh>
            <spotLight position={[0, 0, 0.1]} target-position={[x, -0.5, 8]} color="#ffffff" intensity={5} distance={12} angle={0.4} />
          </group>
        ))}

        {/* Rear Brake Lights */}
        {[-0.65, 0.65].map((x, i) => (
          <mesh key={`brakelight-${i}`} ref={i === 0 ? brakeLightsRef : null} position={[x, 0.6, -1.72]}>
            <boxGeometry args={[0.25, 0.4, 0.05]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* "AMBULANCE" Hood Decal */}
        <mesh position={[0, 0.85, 1.68]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial map={ambulanceTextTex} transparent />
        </mesh>

        {/* Star of Life Symbol on Sides */}
        {[-0.865, 0.865].map((x, i) => (
          <mesh key={`star-${i}`} position={[x, 0.9, -0.4]} rotation={[0, i === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <planeGeometry args={[0.6, 0.6]} />
            <meshBasicMaterial map={starOfLifeTex} transparent />
          </mesh>
        ))}

        {/* --- ROOFTOP EMERGENCY LIGHTBAR --- */}
        <group position={[0, 1.55, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.15, 0.3]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>

          {/* Red Flashing Beacon Light */}
          <mesh position={[-0.4, 0.12, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.25]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
          </mesh>
          <pointLight ref={redBeaconRef} position={[-0.4, 0.3, 0]} color="#ef4444" intensity={4} distance={8} />

          {/* Blue Flashing Beacon Light */}
          <mesh position={[0.4, 0.12, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.25]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
          </mesh>
          <pointLight ref={blueBeaconRef} position={[0.4, 0.3, 0]} color="#3b82f6" intensity={4} distance={8} />
        </group>

        {/* --- REAR SWING DOORS (ANIMATED PIVOTS) --- */}
        <group position={[-0.4, 0.8, -1.71]} ref={leftDoorRef}>
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.4, 1.3, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
        <group position={[0.4, 0.8, -1.71]} ref={rightDoorRef}>
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.4, 1.3, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* --- SEPARATED WHEELS (SPINNING) --- */}
      {/* Front Left */}
      <group position={[-0.85, -0.15, 1.0]} ref={wheelFL}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.25, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.02, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.85, -0.15, 1.0]} ref={wheelFR}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.25, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Rear Left */}
      <group position={[-0.85, -0.15, -1.0]} ref={wheelRL}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.25, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.02, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Rear Right */}
      <group position={[0.85, -0.15, -1.0]} ref={wheelRR}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.25, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// 3. MAIN COMPOSITE 3D SCENE EXPORT
// ----------------------------------------------------
export default function AnimatedAmbulanceScene() {
  const [ambZ, setAmbZ] = React.useState(14);

  return (
    <>
      {/* Lighting Setup matching daylight isometric diorama */}
      <Environment preset="city" />
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[15, 25, 15]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} color="#93c5fd" />

      {/* Orbit Controls for interactive rotation/zoom */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={5}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* 3D Hospital Diorama with Animated Boom Gate */}
      <HospitalEnvironment ambulanceZ={ambZ} />

      {/* Animated 3D Ambulance Driving & Braking */}
      <AnimatedAmbulance onPositionUpdate={setAmbZ} />
    </>
  );
}

