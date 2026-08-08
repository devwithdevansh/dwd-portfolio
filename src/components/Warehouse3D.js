import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, Text, Float, Points, PointMaterial, ContactShadows } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';

// Floating Dust Particles to give it a cinematic atmosphere
function IndustrialDust({ count = 150 }) {
  const points = useRef();

  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [positions];
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false} raycast={() => null}>
      <PointMaterial
        transparent
        color="#fbbf24"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// A detailed Wooden Pallet
function WoodenPallet({ position }) {
  const woodMaterial = <meshStandardMaterial color="#8B5A2B" roughness={1} />;
  return (
    <group position={position}>
      {/* Base beams */}
      <mesh position={[-1, 0, 0]}><boxGeometry args={[0.2, 0.2, 2]} />{woodMaterial}</mesh>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.2, 2]} />{woodMaterial}</mesh>
      <mesh position={[1, 0, 0]}><boxGeometry args={[0.2, 0.2, 2]} />{woodMaterial}</mesh>
      
      {/* Top Planks */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((z, i) => (
        <mesh key={i} position={[0, 0.15, z]}>
          <boxGeometry args={[2.2, 0.1, 0.3]} />
          {woodMaterial}
        </mesh>
      ))}
    </group>
  );
}

// An Interactive Cardboard Box with shipping details
function InteractiveBox({ id, initialPosition, dispatchedPosition, isOnShelf, onClick }) {
  const [hovered, setHovered] = useState(false);

  const { position, rotation, scale } = useSpring({
    position: isOnShelf ? initialPosition : dispatchedPosition,
    rotation: isOnShelf ? [0, 0, 0] : [0, Math.random() * Math.PI, 0],
    scale: hovered && isOnShelf ? 1.05 : 1,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  return (
    <a.mesh 
      position={position} 
      rotation={rotation}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'grab'; }}
    >
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color={hovered && isOnShelf ? "#FCD34D" : "#c29b6f"} 
        roughness={0.9} 
      />
      
      {/* Tape on Top */}
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshBasicMaterial color="#e5e5e5" />
      </mesh>
      
      {/* Shipping Label on Front */}
      <mesh position={[0, 0.1, 0.41]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Caution Sticker on Front */}
      <mesh position={[0.2, -0.2, 0.41]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </a.mesh>
  );
}

// The Industrial Metal Rack
function Rack() {
  const rackMaterial = <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />;
  
  return (
    <group position={[0, -1, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[4, 0.1, 1.2]} />{rackMaterial}</mesh>
      <mesh position={[0, 1.2, 0]}><boxGeometry args={[4, 0.1, 1.2]} />{rackMaterial}</mesh>
      <mesh position={[0, 2.4, 0]}><boxGeometry args={[4, 0.1, 1.2]} />{rackMaterial}</mesh>

      <mesh position={[-1.9, 1.2, 0.5]}><boxGeometry args={[0.1, 2.5, 0.1]} />{rackMaterial}</mesh>
      <mesh position={[-1.9, 1.2, -0.5]}><boxGeometry args={[0.1, 2.5, 0.1]} />{rackMaterial}</mesh>
      <mesh position={[1.9, 1.2, 0.5]}><boxGeometry args={[0.1, 2.5, 0.1]} />{rackMaterial}</mesh>
      <mesh position={[1.9, 1.2, -0.5]}><boxGeometry args={[0.1, 2.5, 0.1]} />{rackMaterial}</mesh>
    </group>
  );
}

// Custom ListItem using 3D Text
function LedgerItem({ y, item, isPresent }) {
  return (
    <group position={[0, y, 0.02]}>
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.01]} />
        <meshBasicMaterial color={isPresent ? "#0f172a" : "#dc2626"} wireframe={!isPresent} />
      </mesh>
      
      <Text 
        position={[-0.7, 0, 0]} 
        fontSize={0.14} 
        color={isPresent ? "#0f172a" : "#dc2626"} 
        anchorX="left" 
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {item.name}
      </Text>

      {!isPresent && (
        <mesh position={[-0.2, 0, 0.01]}>
          <planeGeometry args={[1.5, 0.02]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      )}
    </group>
  );
}

// The Digital Clipboard UI overlaid in 3D Space
function Clipboard({ inventory }) {
  const items = [
    { id: 'box1', name: 'Raw Steel Coils' },
    { id: 'box2', name: 'Micro-Processors' },
    { id: 'box3', name: 'Engine Blocks' },
    { id: 'box4', name: 'Aluminum Sheets' },
  ];

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[-3.5, 0.5, 0]} rotation={[0, Math.PI / 6, 0]}>
        <mesh position={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshStandardMaterial color="#8b5a2b" roughness={1} />
        </mesh>
        
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.3, 3.3]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        
        <mesh position={[0, 1.6, 0.05]}>
          <boxGeometry args={[1, 0.2, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </mesh>

        <Text position={[0, 1.2, 0.02]} fontSize={0.2} color="#0f172a" fontWeight="bold" anchorX="center" anchorY="middle">
          INVENTORY LEDGER
        </Text>
        
        <mesh position={[0, 1.0, 0.02]}>
          <planeGeometry args={[1.8, 0.02]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {items.map((item, index) => (
          <LedgerItem key={item.id} y={0.6 - (index * 0.3)} item={item} isPresent={inventory[item.id]} />
        ))}

        <mesh position={[0, -1.2, 0.02]}>
          <planeGeometry args={[1.8, 0.01]} />
          <meshBasicMaterial color="#cbd5e1" />
        </mesh>
        
        <Text position={[0, -1.4, 0.02]} fontSize={0.12} color="#64748b" anchorX="center" anchorY="middle">
          STATUS: LIVE SYNC
        </Text>
        
        <mesh position={[0.7, -1.4, 0.02]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>
    </Float>
  );
}

export default function Warehouse3D() {
  const [inventory, setInventory] = useState({
    box1: true,
    box2: true,
    box3: true,
    box4: true
  });

  const toggleBox = (id) => {
    setInventory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <group>
      <Environment preset="warehouse" />
      <IndustrialDust />
      
      <PresentationControls 
        global={false} 
        cursor={true}
        snap={true} 
        speed={1.5}
        zoom={1.2}
        polar={[-Math.PI / 8, Math.PI / 8]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        {/* Perfectly centered group (balancing the -4 left bounds and +3 right bounds) */}
        <group scale={0.7} position={[0.5, -0.5, 0]}>
          
          <Rack />
          <Clipboard inventory={inventory} />

          {/* Fully modeled Wooden Pallet for dispatched items */}
          <WoodenPallet position={[2, -1.05, 1.5]} />

          <InteractiveBox 
            id="box1" 
            isOnShelf={inventory.box1} 
            initialPosition={[-1.2, -0.55, 0]} 
            dispatchedPosition={[1.5, -0.45, 1.5]}
            onClick={toggleBox} 
          />
          <InteractiveBox 
            id="box2" 
            isOnShelf={inventory.box2} 
            initialPosition={[0.5, -0.55, 0]} 
            dispatchedPosition={[2.5, -0.45, 1.5]}
            onClick={toggleBox} 
          />
          <InteractiveBox 
            id="box3" 
            isOnShelf={inventory.box3} 
            initialPosition={[-0.5, 0.65, 0]} 
            dispatchedPosition={[1.5, 0.35, 1.5]} 
            onClick={toggleBox} 
          />
          <InteractiveBox 
            id="box4" 
            isOnShelf={inventory.box4} 
            initialPosition={[1.2, 1.85, 0]} 
            dispatchedPosition={[2.5, 0.35, 1.5]} 
            onClick={toggleBox} 
          />
        </group>
      </PresentationControls>

      {/* Cinematic shadows baked onto the floor */}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
    </group>
  );
}
