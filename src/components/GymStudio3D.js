import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import ResponsiveCamera from './ResponsiveCamera';
import { PresentationControls, Environment, Float, Text, RoundedBox, useCursor, MeshReflectorMaterial, Html } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// --- Equipment Components ---

const Treadmill = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Base Belt */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 2.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Side Rails */}
      <mesh position={[-0.45, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.3, 2.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0.45, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.3, 2.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Console Arms */}
      <mesh position={[-0.4, 0.8, -1]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.8, -1]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      {/* Screen Console */}
      <group position={[0, 1.5, -1.2]} rotation={[0.3, 0, 0]}>
        <RoundedBox args={[1.2, 0.8, 0.1]} radius={0.05} castShadow>
          <meshStandardMaterial color="#0a0f1c" roughness={0.4} metalness={0.8} />
        </RoundedBox>
        {/* Glowing Screen */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshBasicMaterial color="#0ea5e9" />
        </mesh>
      </group>
    </group>
  );
};

const DumbbellRack = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand Legs */}
      <mesh position={[-1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Shelves and Dumbbells */}
      {[0.3, 0.6, 0.9].map((y, shelfIdx) => (
        <group key={`shelf-${shelfIdx}`} position={[0, y, 0]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3, 0.05, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Dumbbells on this shelf */}
          {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
            <group key={`db-${shelfIdx}-${i}`} position={[x, 0.05, 0]}>
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>
              {/* Hex Dumbbell Heads */}
              <mesh position={[-0.1, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
                <meshStandardMaterial color="#111827" roughness={0.8} />
              </mesh>
              <mesh position={[0.1, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
                <meshStandardMaterial color="#111827" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

const ReceptionDesk = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.2, 1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0.2]} castShadow>
        <boxGeometry args={[4.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* POS Terminal */}
      <group position={[1, 1.3, -0.1]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.35, 0.25]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
};


// --- Character Component ---

const GymMember = ({ position, rotation, action, color, data, onClick, isActive }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Interaction spring for scaling
  const { scale } = useSpring({
    scale: isActive || hovered ? 1.05 : 1,
    config: { tension: 300, friction: 20 }
  });

  // Animation parameters based on action
  const floatProps = {
    speed: action === 'running' ? 15 : action === 'lifting' ? 3 : 2,
    rotationIntensity: 0,
    floatIntensity: action === 'running' ? 0.15 : action === 'lifting' ? 0.4 : 0.05,
    floatingRange: action === 'lifting' ? [-0.15, 0.1] : [-0.05, 0.05]
  };

  return (
    <a.group 
      position={position} 
      rotation={rotation}
      scale={scale} 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} 
      onPointerOut={() => setHovered(false)}
    >
      <Float {...floatProps}>
        <group>
          {/* Invisible Hitbox for easier clicking */}
          <mesh position={[0, 1, 0]} visible={false}>
            <boxGeometry args={[1, 2, 1]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Body */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <capsuleGeometry args={[0.25, 0.7, 4, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>

          {/* If Lifting, give them a detailed barbell */}
          {action === 'lifting' && (
            <group position={[0, 1.0, 0.35]}>
              <mesh castShadow rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.02, 0.02, 1.8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Left Plates */}
              <mesh position={[-0.6, 0, 0]} castShadow rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05]} />
                <meshStandardMaterial color="#111827" roughness={0.9} />
              </mesh>
              <mesh position={[-0.68, 0, 0]} castShadow rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05]} />
                <meshStandardMaterial color="#111827" roughness={0.9} />
              </mesh>
              {/* Right Plates */}
              <mesh position={[0.6, 0, 0]} castShadow rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05]} />
                <meshStandardMaterial color="#111827" roughness={0.9} />
              </mesh>
              <mesh position={[0.68, 0, 0]} castShadow rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.05]} />
                <meshStandardMaterial color="#111827" roughness={0.9} />
              </mesh>
            </group>
          )}

          {/* Floating UI Pop-up */}
          <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
            <div className={`transition-all duration-300 transform ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
              <div className="bg-black/90 backdrop-blur-md border border-cyan-500 p-3 rounded-lg w-48 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-700 pb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-white font-bold text-sm tracking-widest uppercase">{data.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-cyan-400 font-bold">{data.plan}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Activity:</span>
                    <span className="text-white">{data.activity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Last Visited:</span>
                    <span className="text-emerald-400">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </Html>
        </group>
      </Float>
    </a.group>
  );
};


export default function GymStudio3D() {
  const [activeMember, setActiveMember] = useState(null);

  // Click outside to deselect
  const handlePointerMissed = () => {
    setActiveMember(null);
  };

  const members = [
    { id: 1, pos: [-3, 0, -1], rot: [0, 0, 0], action: 'running', color: '#ec4899', data: { name: 'Sarah M.', plan: 'VIP Elite', activity: 'Cardio Zone' } },
    { id: 2, pos: [-1, 0, -1], rot: [0, 0, 0], action: 'running', color: '#0ea5e9', data: { name: 'James L.', plan: 'Standard', activity: 'Cardio Zone' } },
    { id: 3, pos: [3, 0, 1], rot: [0, -Math.PI / 2, 0], action: 'lifting', color: '#10b981', data: { name: 'Alex K.', plan: 'PT Package', activity: 'Free Weights' } },
    { id: 4, pos: [-3, 0, 3], rot: [0, Math.PI / 4, 0], action: 'idle', color: '#8b5cf6', data: { name: 'Front Desk', plan: 'Admin', activity: 'System Active' } }, // Receptionist
  ];

  return (
    <div className="w-full h-full cursor-crosshair">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }} onPointerMissed={handlePointerMissed}>
      <ResponsiveCamera defaultFov={45} mobileFov={70} />
        <color attach="background" args={['#0f172a']} />
        
        {/* Improved Lighting for a brighter gym */}
        <ambientLight intensity={1.2} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={3} color="#ffffff" shadow-mapSize={[2048, 2048]} />
        <spotLight position={[0, 15, 0]} intensity={4} color="#f8fafc" angle={0.8} penumbra={0.5} castShadow />
        
        <pointLight position={[-4, 3, -1]} intensity={2.5} color="#0ea5e9" distance={12} />
        <pointLight position={[4, 3, 1]} intensity={2.5} color="#ec4899" distance={12} />
        
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
          <group position={[0, -1, 0]}>
            
            {/* The Environment */}
            <Treadmill position={[-3, 0, -2]} rotation={[0, 0, 0]} />
            <Treadmill position={[-1, 0, -2]} rotation={[0, 0, 0]} />
            <Treadmill position={[1, 0, -2]} rotation={[0, 0, 0]} />
            
            <DumbbellRack position={[3, 0, 2]} rotation={[0, -Math.PI / 2, 0]} />
            
            <ReceptionDesk position={[-3, 0, 4]} rotation={[0, Math.PI / 4, 0]} />

            {/* Luxury Gym Back Wall */}
            <group position={[0, 0, -2.5]}>
              {/* Main Wall */}
              <mesh position={[0, 3, 0]} receiveShadow>
                <boxGeometry args={[25, 6, 0.5]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
              </mesh>
              
              {/* LED Strip (Top of Wainscoting) */}
              <mesh position={[0, 1.5, 0.28]}>
                <boxGeometry args={[25, 0.05, 0.05]} />
                <meshBasicMaterial color="#0ea5e9" />
              </mesh>
              
              {/* Metal Wainscoting */}
              <mesh position={[0, 0.75, 0.26]} receiveShadow>
                <boxGeometry args={[25, 1.5, 0.05]} />
                <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
              </mesh>

              {/* Neon Sign */}
              <group position={[3, 3, 0.3]}>
                <Text position={[-3, 0, 0]} fontSize={0.4} color="#f8fafc" letterSpacing={0.2} fontWeight="bold">
                  FITNESS OS
                </Text>
                <pointLight color="#ec4899" intensity={2} distance={5} />
              </group>
            </group>

            {/* The Animated Characters */}
            {members.map((member) => (
              <GymMember 
                key={member.id}
                position={member.pos}
                rotation={member.rot}
                action={member.action}
                color={member.color}
                data={member.data}
                isActive={activeMember === member.id}
                onClick={() => setActiveMember(member.id)}
              />
            ))}

            {/* Floor (Also handles click-to-close) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={() => setActiveMember(null)}>
              <planeGeometry args={[30, 30]} />
              <MeshReflectorMaterial
                blur={[100, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={10}
                roughness={0.2}
                depthScale={1}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#0f172a"
                metalness={0.5}
              />
            </mesh>

          </group>
        </PresentationControls>
      </Canvas>
      
      {/* UI Hint */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center pointer-events-none z-10">
        <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-cyan-500/50 flex items-center gap-3 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
            Click members to view CRM profiles
          </span>
        </div>
      </div>
    </div>
  );
}
