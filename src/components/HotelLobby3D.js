import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PresentationControls, 
  Environment, 
  Float, 
  Html, 
  ContactShadows,
  MeshTransmissionMaterial,
  RoundedBox
} from '@react-three/drei';

// Reusable Popup Component
function ZonePopup({ title, subtitle, color }) {
  return (
    <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-56 pointer-events-none transition-all duration-300">
      <div className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color }}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {title}
      </div>
      <div className="text-slate-300 text-sm leading-relaxed font-medium">{subtitle}</div>
    </div>
  );
}

// 1. Ground Floor: Automated Kiosk
function GroundFloor() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={[0, -1.5, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <RoundedBox args={[3.2, 1, 3.2]} radius={0.05}>
         <meshStandardMaterial 
            color={hovered ? "#fbbf24" : "#1e293b"} 
            metalness={0.8} 
            roughness={0.2} 
            emissive={hovered ? "#fbbf24" : "#000000"} 
            emissiveIntensity={0.2} 
            transition="all 0.3s"
         />
      </RoundedBox>
      <Html position={[0, 0, 1.8]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        <ZonePopup title="Automated Kiosk" subtitle="Self check-in, keyless entry, and zero front desk bottlenecks." color="#fbbf24" />
      </Html>
    </group>
  );
}

// 2. Middle Floors: Housekeeping Status
function MiddleFloors() {
  const [hovered, setHovered] = useState(false);
  
  // Create a grid of windows
  const windows = useMemo(() => {
    const arr = [];
    for(let y=0; y<3; y++) {
      for(let x=0; x<4; x++) {
        arr.push({ pos: [x*0.6 - 0.9, y*0.8 - 0.8, 1.45], status: Math.random() > 0.4 ? 'clean' : 'dirty' });
        arr.push({ pos: [x*0.6 - 0.9, y*0.8 - 0.8, -1.45], status: Math.random() > 0.4 ? 'clean' : 'dirty' });
        arr.push({ pos: [1.45, y*0.8 - 0.8, x*0.6 - 0.9], status: Math.random() > 0.4 ? 'clean' : 'dirty' });
        arr.push({ pos: [-1.45, y*0.8 - 0.8, x*0.6 - 0.9], status: Math.random() > 0.4 ? 'clean' : 'dirty' });
      }
    }
    return arr;
  }, []);

  return (
    <group position={[0, 0.5, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Glass Core */}
      <RoundedBox args={[2.8, 2.8, 2.8]} radius={0.05}>
         <MeshTransmissionMaterial 
            backside 
            thickness={0.5} 
            roughness={0.1} 
            transmission={0.9} 
            ior={1.5} 
            color="#cbd5e1" 
         />
      </RoundedBox>
      
      {/* Windows indicating live room status */}
      {windows.map((w, i) => {
         let winColor = "#334155"; // default dark
         if (hovered) {
             winColor = w.status === 'clean' ? "#10b981" : "#ef4444"; // green or red
         }
         return (
           <mesh key={i} position={w.pos}>
             <boxGeometry args={[0.3, 0.4, 0.3]} />
             <meshStandardMaterial 
                color={winColor} 
                emissive={winColor} 
                emissiveIntensity={hovered ? 1 : 0} 
                toneMapped={false}
             />
           </mesh>
         )
      })}
      
      <Html position={[0, 0, 1.8]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        <ZonePopup title="Live Housekeeping" subtitle="Rooms instantly flash red on checkout, auto-assigning cleaning staff." color="#10b981" />
      </Html>
    </group>
  );
}

// 3. Roof Antenna: OTA Sync
function RoofAntenna() {
  const [hovered, setHovered] = useState(false);
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  
  useFrame(({ clock }) => {
    if (hovered) {
       const t = clock.getElapsedTime();
       if(ringRef1.current) {
          ringRef1.current.position.y = (t * 2) % 3;
          ringRef1.current.scale.setScalar(1 + ((t * 2) % 3) * 0.5);
          ringRef1.current.material.opacity = Math.max(0, 1 - ((t * 2) % 3) / 3);
       }
       if(ringRef2.current) {
          ringRef2.current.position.y = ((t * 2 + 1.5) % 3);
          ringRef2.current.scale.setScalar(1 + ((t * 2 + 1.5) % 3) * 0.5);
          ringRef2.current.material.opacity = Math.max(0, 1 - ((t * 2 + 1.5) % 3) / 3);
       }
    } else {
       if(ringRef1.current) ringRef1.current.material.opacity = 0;
       if(ringRef2.current) ringRef2.current.material.opacity = 0;
    }
  });

  return (
    <group position={[0, 2.5, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Roof Base */}
      <RoundedBox args={[3.2, 0.2, 3.2]} radius={0.05}>
         <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </RoundedBox>
      
      {/* Antenna Spire */}
      <mesh position={[0, 1, 0]}>
         <cylinderGeometry args={[0.05, 0.1, 2]} />
         <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={hovered ? 1.5 : 0.2} toneMapped={false} />
      </mesh>
      
      {/* Emitting Data Rings */}
      <mesh ref={ringRef1} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.5, 0.02, 16, 64]} />
         <meshBasicMaterial color="#fbbf24" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef2} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.5, 0.02, 16, 64]} />
         <meshBasicMaterial color="#fbbf24" transparent opacity={0} toneMapped={false} />
      </mesh>
      
      {/* Massive Hitbox for flawless hovering */}
      <mesh visible={false} position={[0, 1, 0]}>
         <boxGeometry args={[3, 3, 3]} />
         <meshBasicMaterial />
      </mesh>

      <Html position={[0, 1.5, 1.8]} center style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        <ZonePopup title="OTA Sync Engine" subtitle="Push dynamic rates to Booking.com & Agoda without 15% channel manager fees." color="#fbbf24" />
      </Html>
    </group>
  );
}

export default function HotelLobby3D() {
  return (
    <div className="w-full h-full bg-[#0a0f1c] cursor-grab active:cursor-grabbing rounded-[2rem] overflow-hidden">
      <Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }}>
        <color attach="background" args={['#0a0f1c']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={2.5} color="#fbbf24" penumbra={1} castShadow />
        <spotLight position={[-5, 5, -5]} intensity={2} color="#3b82f6" penumbra={1} />
        <directionalLight position={[0, -5, 0]} intensity={0.5} color="#ffffff" />
        
        <Environment preset="city" />

        <PresentationControls 
          global 
          rotation={[0, -Math.PI / 4, 0]} 
          polar={[-0.1, 0.2]} 
          azimuth={[-Math.PI / 2, Math.PI / 2]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
            <group position={[0, -0.5, 0]}>
              <GroundFloor />
              <MiddleFloors />
              <RoofAntenna />
            </group>
          </Float>
          
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.5} 
            scale={15} 
            blur={2.5} 
            far={4} 
            color="#fbbf24"
          />
        </PresentationControls>
      </Canvas>
      
      {/* Helper UI */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] sm:text-xs font-bold tracking-widest text-slate-500 pointer-events-none bg-white/5 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.1)] border border-slate-800">
        <span className="flex items-center gap-3 text-white">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_#fbbf24]" /> 
          HOVER BUILDING SECTIONS TO EXPLORE OS
        </span>
      </div>
    </div>
  );
}
