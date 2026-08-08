import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Environment, Float, Text, RoundedBox, useCursor, MeshReflectorMaterial, Sparkles, Html } from '@react-three/drei';
import { a, useSpring, config } from '@react-spring/three';

// Procedural Customer Data
const GUEST_TYPES = [
  { type: 'VIP', color: '#fbbf24', payout: 15000, speed: 0.03 },
  { type: 'Business', color: '#38bdf8', payout: 8000, speed: 0.04 },
  { type: 'Tourist', color: '#10b981', payout: 4000, speed: 0.025 },
  { type: 'Family', color: '#f43f5e', payout: 6000, speed: 0.02 },
];

const FIRST_NAMES = ['Aarav', 'Sophia', 'Liam', 'Priya', 'Noah', 'Emma', 'Oliver', 'Mia', 'Elijah', 'Ava'];
const LAST_NAMES = ['Smith', 'Patel', 'Johnson', 'Sharma', 'Williams', 'Kumar', 'Brown', 'Singh', 'Jones', 'Das'];

function generateGuest(id) {
  const type = GUEST_TYPES[Math.floor(Math.random() * GUEST_TYPES.length)];
  const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)][0]}.`;
  const room = [101, 102, 103][Math.floor(Math.random() * 3)];
  return { id, name, room, ...type };
}

// Neon Sign Component
const NeonSign = () => (
  <group position={[3, 3, -1.8]}>
    <Text position={[-3.5, 0.5, 0]} fontSize={0.3} color="#f8fafc" letterSpacing={0.4}>
      HOTEL & SUITES
    </Text>
    {/* Glow Effect */}
    <pointLight color="#fbbf24" intensity={2} distance={4} />
  </group>
);

// 3D Door Component
const HotelDoor = ({ position, roomNumber, onCheckIn, isActive }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Door interaction spring
  const { scale, doorColor, emissiveIntensity } = useSpring({
    scale: hovered || isActive ? 1.05 : 1,
    doorColor: isActive ? '#fbbf24' : '#e2e8f0',
    emissiveIntensity: isActive ? 0.6 : 0,
    config: { mass: 1, tension: 280, friction: 20 }
  });

  return (
    <a.group position={position} scale={scale} onClick={() => onCheckIn(roomNumber)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Archway Frame */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Door Panel */}
      <a.mesh position={[0, 1.05, 0.08]}>
        <boxGeometry args={[0.95, 2, 0.05]} />
        <a.meshStandardMaterial color={doorColor} metalness={0.4} roughness={0.3} emissive="#fbbf24" emissiveIntensity={emissiveIntensity} />
      </a.mesh>

      {/* Room Number Plate */}
      <mesh position={[0, 1.7, 0.11]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <Text position={[0, 1.7, 0.12]} fontSize={0.12} color="#0f172a" fontWeight="bold" anchorX="center" anchorY="middle">
        {roomNumber}
      </Text>
      {/* Active Indicator Light */}
      <a.pointLight position={[0, 2.2, 0.2]} distance={2} intensity={emissiveIntensity} color="#fbbf24" />
      <a.mesh position={[0, 2, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <a.meshBasicMaterial color={isActive ? '#fbbf24' : '#334155'} />
      </a.mesh>
      {/* Handle */}
      <mesh position={[0.35, 1, 0.11]}>
        <cylinderGeometry args={[0.03, 0.03, 0.1]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
      </mesh>
    </a.group>
  );
};

// Customer Component
const Customer = ({ guest, guestState, targetRoom }) => {
  const groupRef = useRef();

  const doors = {
    101: [-3.5, 0, -1],
    102: [-1, 0, -1],
    103: [1.5, 0, -1],
  };

  const { springPos, springScale } = useSpring({
    to: async (next) => {
      if (guestState === 'waiting') {
        await next({ springPos: [3.2, 0, 3.5], springScale: 1, config: { mass: 2, tension: 40, friction: 15 } });
      } else if (guestState === 'walking') {
        // Step 1: Walk left to clear the desk
        await next({ springPos: [0, 0, 3.5], springScale: 1, config: { mass: 1, tension: 60, friction: 20 } });
        // Step 2: Walk to the assigned room
        await next({ springPos: doors[targetRoom] || [0, 0, 3.5], springScale: 1, config: { mass: 2, tension: 40, friction: 15 } });
      } else if (guestState === 'checked-in') {
        await next({ springScale: 0, config: { mass: 1, tension: 120, friction: 14 } });
      }
    }
  });

  if (!guest) return null;

  return (
    <a.group ref={groupRef} position={springPos} scale={springScale}>
      <Float speed={guestState === 'walking' ? 8 : 2} rotationIntensity={guestState === 'walking' ? 0.5 : 0.1} floatIntensity={guestState === 'walking' ? 0.3 : 0.1}>
        <group>
          {/* Body */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
            <meshStandardMaterial color={guest.color} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>
          {/* Label */}
          <Text position={[0, 1.9, 0]} fontSize={0.18} color="#ffffff" anchorX="center" anchorY="bottom" outlineWidth={0.03} outlineColor="#000000">
            {guest.name}
          </Text>

          {/* Suitcase */}
          <group position={[-0.45, 0.35, 0]} rotation={[0, 0, 0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.45, 0.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.15, 0.08, 0.04]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Wheels */}
            <mesh position={[-0.1, -0.25, 0.05]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.04]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.1, -0.25, 0.05]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.04]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        </group>
      </Float>
    </a.group>
  );
};

// Floating Reward Component
const RewardPopup = ({ text, position, color }) => {
  const { springY, scale } = useSpring({
    from: { springY: position[1], scale: 0 },
    to: async (next) => {
      await next({ springY: position[1] + 0.8, scale: 1, config: { mass: 1, tension: 120, friction: 14 } });
      await next({ springY: position[1] + 1.2, scale: 0, config: { mass: 1, tension: 60, friction: 20 }, delay: 1000 });
    }
  });

  return (
    <a.group position-x={position[0]} position-y={springY} position-z={position[2]} scale={scale}>
      <RoundedBox args={[1.5, 0.3, 0.05]} radius={0.05}>
        <meshBasicMaterial color={color} />
      </RoundedBox>
      <Text position={[0, 0, 0.03]} fontSize={0.12} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </a.group>
  );
};

// Reception PC UI (Sitting on the desk)
const ReceptionPC = ({ guest, guestState, onCheckIn }) => {
  return (
    <group position={[2.8, 1.36, 1.7]} rotation={[0, -0.4, 0]} scale={0.7}>
      {/* PC Stand Base */}
      <RoundedBox args={[0.6, 0.05, 0.4]} radius={0.02} position={[0, 0.025, -0.1]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* PC Stand Neck */}
      <mesh position={[0, 0.2, -0.2]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitor Assembly */}
      <group position={[0, 0.65, -0.15]}>
        {/* Monitor Back/Bezel */}
        <RoundedBox args={[2.2, 1.4, 0.05]} radius={0.05} position={[0, 0, -0.02]}>
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </RoundedBox>

        {/* Screen Base (Light Theme) */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.1, 1.3]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>

        {/* UI Elements (Scaled Down for PC) */}
        <group scale={0.7} position={[0, 0.1, 0.02]}>
          {/* Header */}
          <RoundedBox args={[2.1, 0.3, 0.02]} radius={0.05} position={[0, 0.7, 0]}>
            <meshBasicMaterial color="#fbbf24" />
          </RoundedBox>
          <Text position={[0, 0.7, 0.02]} fontSize={0.12} color="#0f172a" fontWeight="bold" anchorX="center" anchorY="middle">
            HOTEL OS v2.0
          </Text>

          {/* Guest Info */}
          <group position={[-0.5, 0.2, 0]}>
            <Text position={[0, 0.2, 0]} fontSize={0.08} color="#64748b" anchorX="center" anchorY="middle" letterSpacing={0.1}>
              {guestState === 'waiting' ? 'AWAITING CHECK-IN' : 'PROCESSING...'}
            </Text>
            <Text position={[0, -0.05, 0]} fontSize={0.15} color="#0f172a" fontWeight="bold" anchorX="center" anchorY="middle">
              {guest?.name || 'NO GUEST'}
            </Text>
            {guest && (
              <RoundedBox args={[0.7, 0.15, 0.01]} radius={0.05} position={[0, -0.25, 0]}>
                <meshBasicMaterial color={guestState === 'waiting' ? '#34d399' : '#fbbf24'} />
                <Text position={[0, 0, 0.01]} fontSize={0.06} color="#064e3b" fontWeight="bold" anchorX="center" anchorY="middle">
                  {guest.type ? `${guest.type.toUpperCase()} GUEST` : 'STANDBY'}
                </Text>
              </RoundedBox>
            )}
          </group>

          {/* Room Assignment UI */}
          <group position={[0.5, 0.2, 0]}>
            <Text position={[0, 0.2, 0]} fontSize={0.08} color="#64748b" anchorX="center" anchorY="middle" letterSpacing={0.1}>
              ASSIGNED ROOM
            </Text>
            <Text position={[0, -0.1, 0]} fontSize={0.25} color="#0f172a" fontWeight="black" anchorX="center" anchorY="middle">
              {guest?.room || '---'}
            </Text>
          </group>

          {/* Action Buttons for Rooms (Horizontal across bottom) */}
          <group position={[0, -0.5, 0]}>
            {[101, 102, 103].map((roomNum, idx) => {
              const isCorrect = guest && guest.room === roomNum;
              const isWaiting = guestState === 'waiting';
              const xPos = (idx - 1) * 0.8;

              return (
                <TabletButton
                  key={roomNum}
                  position={[xPos, 0, 0]}
                  label={`CHECK ${roomNum}`}
                  color={isCorrect && isWaiting ? '#10b981' : '#cbd5e1'}
                  textColor={isCorrect && isWaiting ? '#ffffff' : '#475569'}
                  onClick={() => isWaiting && onCheckIn(roomNum)}
                />
              );
            })}
          </group>
        </group>
      </group>
    </group>
  );
};

const TabletButton = ({ position, label, color, textColor = '#ffffff', onClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const { scale, emissiveIntensity } = useSpring({
    scale: hovered ? 1.15 : 1,
    emissiveIntensity: hovered ? 0.8 : 0,
    config: { tension: 300, friction: 15 }
  });

  return (
    <a.group position={position} scale={scale} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <RoundedBox args={[0.7, 0.25, 0.04]} radius={0.05}>
        <a.meshStandardMaterial color={color} metalness={0.1} roughness={0.5} emissive={color} emissiveIntensity={emissiveIntensity} />
      </RoundedBox>
      <Text position={[0, 0, 0.03]} fontSize={0.08} color={textColor} fontWeight="bold" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </a.group>
  );
};

export default function HotelLobby3D() {
  const [guestQueue, setGuestQueue] = useState([generateGuest(1)]);
  const [guestIdCounter, setGuestIdCounter] = useState(2);
  const [guestState, setGuestState] = useState('waiting'); // waiting, walking, checked-in
  const [popups, setPopups] = useState([]);

  const currentGuest = guestQueue[0];

  const handleCheckIn = (roomNumber) => {
    if (guestState !== 'waiting' || !currentGuest) return;

    if (roomNumber === currentGuest.room) {
      setGuestState('walking');

      setTimeout(() => {
        setGuestState('checked-in');

        const doors = {
          101: [-3.5, 2, -0.5],
          102: [-1, 2, -0.5],
          103: [1.5, 2, -0.5],
        };
        const newPopup = {
          id: Date.now(),
          text: `+₹${currentGuest.payout.toLocaleString()} DIRECT BOOKING!`,
          position: doors[currentGuest.room],
          color: '#10b981'
        };
        setPopups(prev => [...prev, newPopup]);
        setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== newPopup.id));
        }, 2500);

        setTimeout(() => {
          setGuestQueue(prev => prev.slice(1));
          setGuestState('waiting');
          setGuestQueue(prev => [...prev, generateGuest(guestIdCounter)]);
          setGuestIdCounter(prev => prev + 1);
        }, 1500);

      }, 4500);
    } else {
      const newPopup = {
        id: Date.now(),
        text: "WRONG ROOM!",
        position: [-3.5, 4.5, 1.5],
        color: '#ef4444'
      };
      setPopups(prev => [...prev, newPopup]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== newPopup.id));
      }, 2000);
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0f1c] cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [1.2, 3, 10], fov: 45 }}>
        <color attach="background" args={['#0a0f1c']} />
        <fog attach="fog" args={['#0a0f1c', 10, 25]} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={2.5} color="#ffffff" shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-5, 5, 2]} intensity={3} color="#fbbf24" distance={20} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#3b82f6" distance={20} />

        <Environment preset="city" />

        <PresentationControls
          global={false}
          cursor={false}
          snap={true}
          speed={1.5}
          zoom={1}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 8, Math.PI / 8]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <group position={[0, -1.5, 0]}>
            {/* Mirror Polished Marble Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={80}
                roughness={0.1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#0f172a"
                metalness={0.5}
              />
            </mesh>

            {/* Luxury Back Wall (Wallpaper + Wainscoting) */}
            <group position={[0, 0, -2.2]}>
              {/* Main Wall Base */}
              <mesh position={[0, 3, 0]} receiveShadow>
                <boxGeometry args={[20, 6, 0.5]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>

              {/* Wooden Wainscoting (Lower half) */}
              <mesh position={[0, 1, 0.26]} receiveShadow>
                <boxGeometry args={[20, 2, 0.05]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
              </mesh>

              {/* Gold Trim Molding */}
              <mesh position={[0, 2, 0.28]} receiveShadow>
                <boxGeometry args={[20, 0.05, 0.05]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
              </mesh>

              {/* Gold Baseboard */}
              <mesh position={[0, 0.1, 0.28]} receiveShadow>
                <boxGeometry args={[20, 0.2, 0.05]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.8} />
              </mesh>

              {/* Wallpaper Stripes (Upper half) */}
              {Array.from({ length: 40 }).map((_, i) => (
                <mesh key={i} position={[-10 + i * 0.5, 4, 0.26]} receiveShadow>
                  <boxGeometry args={[0.2, 4, 0.02]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
              ))}
            </group>

            {/* Luxury Reception Desk */}
            <group position={[3.2, 0, 1.5]}>
              <RoundedBox args={[2.8, 1.3, 1]} radius={0.1} position={[0, 0.65, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.8} />
              </RoundedBox>
              <RoundedBox args={[3.0, 0.1, 1.2]} radius={0.05} position={[0, 1.3, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.9} />
              </RoundedBox>
              {/* Desk Glow Base */}
              <RoundedBox args={[2.6, 0.2, 0.8]} position={[0, 0.1, 0]}>
                <meshBasicMaterial color="#fbbf24" />
              </RoundedBox>
            </group>

            {/* Neon Sign */}
            <NeonSign />

            {/* Doors */}
            <HotelDoor roomNumber={101} position={[-3.5, 0, -1.9]} onCheckIn={handleCheckIn} isActive={currentGuest?.room === 101 && guestState === 'waiting'} />
            <HotelDoor roomNumber={102} position={[-1, 0, -1.9]} onCheckIn={handleCheckIn} isActive={currentGuest?.room === 102 && guestState === 'waiting'} />
            <HotelDoor roomNumber={103} position={[1.5, 0, -1.9]} onCheckIn={handleCheckIn} isActive={currentGuest?.room === 103 && guestState === 'waiting'} />

            {/* Desktop PC */}
            <ReceptionPC guest={currentGuest} guestState={guestState} onCheckIn={handleCheckIn} />

            {/* Customer */}
            <Customer guest={currentGuest} guestState={guestState} targetRoom={currentGuest?.room} />

            {/* Popups & Confetti */}
            {popups.map(popup => (
              <RewardPopup key={popup.id} text={popup.text} position={popup.position} color={popup.color} />
            ))}

          </group>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
