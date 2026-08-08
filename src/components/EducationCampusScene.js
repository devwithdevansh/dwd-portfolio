import React, { useState } from 'react';
import { Environment, OrbitControls, Html, Float, ContactShadows, Text } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

// 3D Campus Environment
function CampusEnvironment() {
  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>

      {/* --- High-Society Infrastructure Backdrop --- */}
      <group position={[0, 0, -4]}>
        {/* Main Architectural Wall */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 4, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        
        {/* Premium Wood Accent Panel in Center */}
        <mesh position={[0, 2, 0.26]} castShadow receiveShadow>
          <boxGeometry args={[6, 4, 0.05]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} /> {/* Rich Mahogany */}
        </mesh>
        
        {/* Massive Glass Windows */}
        {[-7, -4, 4, 7].map((x, i) => (
          <group key={`window-${i}`} position={[x, 2, 0.1]}>
            <mesh>
              <boxGeometry args={[2.2, 3, 0.4]} />
              <meshPhysicalMaterial color="#bae6fd" transmission={0.9} opacity={1} transparent roughness={0.1} />
            </mesh>
            {/* Window Frames */}
            <mesh position={[0, 0, 0.2]}>
              <boxGeometry args={[2.3, 3.1, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}

        {/* Elegant Marble Pillars */}
        {[-8.5, -5.5, -2.5, 2.5, 5.5, 8.5].map((x, i) => (
          <mesh key={`pillar-${i}`} position={[x, 2, 0.4]} castShadow>
            <boxGeometry args={[0.6, 4, 0.6]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.1} />
          </mesh>
        ))}
        
        {/* Top Trim / Roof Overhang */}
        <mesh position={[0, 4.1, 0.5]} castShadow>
          <boxGeometry args={[20.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Internal Partition Walls */}
        <mesh position={[2.5, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 4, 8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
        </mesh>
        <mesh position={[-10, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 4, 8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
        </mesh>
        <mesh position={[10, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 4, 8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
        </mesh>
      </group>
      
      {/* Landscaping / Premium Campus Vibe */}
      <group position={[-8, 0, 2]}>
        {/* Planter Box */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Campus Tree */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 3, 0]} castShadow>
          <dodecahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
        <mesh position={[0.5, 2.5, 0.5]} castShadow>
          <dodecahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* --- ZONE 1: Admin / Fee Desk (Left/Center) --- */}
      <group position={[-2, 0, 0]}>
        {/* Floating Sign */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <Text position={[0, 2.5, -1]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
            ADMISSIONS OFFICE
          </Text>
        </Float>

        {/* Desk */}
        <mesh position={[0, 0.5, -1]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1, 1]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.1} /> {/* Lighter marble-like */}
        </mesh>
        {/* Desk Top */}
        <mesh position={[0, 1.05, -1]} castShadow>
          <boxGeometry args={[3.4, 0.1, 1.2]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} /> {/* Navy Blue */}
        </mesh>
        
        {/* Glass Partition */}
        <mesh position={[0, 1.4, -0.45]} castShadow>
          <boxGeometry args={[3.4, 0.6, 0.05]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} thickness={0.5} />
        </mesh>

        {/* Potted Plant */}
        <group position={[1.2, 1.1, -1]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <dodecahedronGeometry args={[0.25]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
        
        {/* Computer */}
        <group position={[0, 1.1, -1]} rotation={[0, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[1.2, 0.7, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.3, 0.06]}>
            <boxGeometry args={[1.1, 0.6, 0.01]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.05, -0.1]} castShadow>
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* Admin Staff */}
        <group position={[0, 0, -1.8]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#fbcfe8" />
          </mesh>
        </group>
      </group>

      {/* --- ZONE 2: Classroom (Right) --- */}
      <group position={[5, 0, -1]}>
        {/* Floating Sign */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
          <Text position={[1.5, 3.8, -3]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
            CLASSROOM
          </Text>
        </Float>

        {/* Whiteboard - on back wall beside teacher, pulled forward to be visible */}
        <group position={[2, 0, -2.5]}>
          {/* Board Frame */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[3.8, 2.2, 0.12]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} />
          </mesh>
          {/* White Board surface */}
          <mesh position={[0, 2.2, 0.08]}>
            <boxGeometry args={[3.6, 2.0, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.05} emissive="#f0f9ff" emissiveIntensity={0.15} />
          </mesh>
          {/* Board marker tray */}
          <mesh position={[0, 1.22, 0.12]}>
            <boxGeometry args={[3.6, 0.14, 0.22]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Lesson text on board */}
          <Text position={[0, 2.65, 0.14]} fontSize={0.2} color="#1e40af" anchorX="center" anchorY="middle" fontWeight="bold">
            Today's Lesson
          </Text>
          <Text position={[0, 2.3, 0.14]} fontSize={0.13} color="#334155" anchorX="center" anchorY="middle">
            Digital Campus Management
          </Text>
          <Text position={[0, 1.98, 0.14]} fontSize={0.11} color="#64748b" anchorX="center" anchorY="middle">
            Attendance · Fees · Grades
          </Text>
        </group>

        {/* Nameplate above whiteboard */}
        <group position={[2, 3.5, -2.5]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.38, 0.18]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <Text position={[0, 0, 0.1]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
            ROOM 101
          </Text>
        </group>

        {/* Teacher */}
        <group position={[-1, 0, -2.2]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.3, 1.5, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 1.65, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#fbcfe8" />
          </mesh>
        </group>

        {/* Desks */}
        {[
          { x: 0, z: -1 },
          { x: 3, z: -1 },
          { x: 1.5, z: 1 }
        ].map((pos, i) => (
          <group key={`desk-${i}`} position={[pos.x, 0, pos.z]}>
             {/* Desk */}
             <mesh position={[0, 0.6, 0]} castShadow>
               <boxGeometry args={[1.2, 0.05, 0.8]} />
               <meshStandardMaterial color="#d97706" /> {/* Wood */}
             </mesh>
             {/* Desk Legs */}
             <mesh position={[-0.5, 0.3, -0.3]} castShadow><boxGeometry args={[0.05, 0.6, 0.05]} /><meshStandardMaterial color="#334155" /></mesh>
             <mesh position={[0.5, 0.3, -0.3]} castShadow><boxGeometry args={[0.05, 0.6, 0.05]} /><meshStandardMaterial color="#334155" /></mesh>
             <mesh position={[-0.5, 0.3, 0.3]} castShadow><boxGeometry args={[0.05, 0.6, 0.05]} /><meshStandardMaterial color="#334155" /></mesh>
             <mesh position={[0.5, 0.3, 0.3]} castShadow><boxGeometry args={[0.05, 0.6, 0.05]} /><meshStandardMaterial color="#334155" /></mesh>
             
             {/* Chair */}
             <mesh position={[0, 0.35, 0.6]} castShadow>
               <boxGeometry args={[0.6, 0.05, 0.6]} />
               <meshStandardMaterial color="#2563eb" />
             </mesh>
             <mesh position={[0, 0.7, 0.875]} castShadow>
               <boxGeometry args={[0.6, 0.6, 0.05]} />
               <meshStandardMaterial color="#2563eb" />
             </mesh>
             <mesh position={[0, 0.175, 0.6]} castShadow><boxGeometry args={[0.4, 0.35, 0.4]} /><meshStandardMaterial color="#334155" /></mesh>
          </group>
        ))}
      </group>
      
      {/* Queue Line Markers (Left Side) */}
      {[-5, -6.5, -8].map((x, i) => (
        <mesh key={`marker-${i}`} position={[x, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Active Marker at Desk */}
      <mesh position={[-2, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Mock Data for Students
const studentData = [
  { name: 'Arjun Mehta', course: 'B.Tech CS', id: 'CS-2026-01' },
  { name: 'Neha Sharma', course: 'MBA Finance', id: 'MB-2026-14' },
  { name: 'Rohan Patel', course: 'B.Arch', id: 'AR-2026-08' },
];

// Interactive ERP Popup UI (Sleek Blue Pill Style)
function SyncPopup({ syncStep, visible, studentId }) {
  if (!visible) return null;
  const data = studentData[studentId] || studentData[0];

  return (
    <Html position={[0, 2.6, 0]} center transform sprite zIndexRange={[100, 0]} scale={0.7}>
      <div style={{
        background: '#2563eb',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '13px',
        fontFamily: 'sans-serif',
        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        whiteSpace: 'nowrap',
        minWidth: '200px'
      }}>
        {syncStep === 0 && <div style={{ textAlign: 'center', opacity: 0.8 }}>Processing Admission...</div>}
        
        {syncStep >= 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Docs: <span style={{fontWeight: 'normal', opacity: 0.9}}>{data.name} Verified</span></span>
            <span>✓</span>
          </div>
        )}
        
        {syncStep >= 2 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Fees: <span style={{fontWeight: 'normal', opacity: 0.9}}>Cleared</span></span>
            <span>✓</span>
          </div>
        )}
        
        {syncStep >= 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>ID: <span style={{fontWeight: 'normal', opacity: 0.9}}>{data.id} Issued</span></span>
            <span>✓</span>
          </div>
        )}

        {syncStep === 4 && (
          <div style={{ 
            marginTop: '4px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(255,255,255,0.4)', 
            textAlign: 'center', 
            fontSize: '14px' 
          }}>
            STUDENT ENROLLED
          </div>
        )}
      </div>
    </Html>
  );
}

// 3D Student Character
function Student({ id, status, queueIndex, color, onClick, isActive, isPopupVisible, syncStep }) {
  // Determine target position based on status
  let targetPosition = [0, 0, 1]; // Default
  
  if (status === 'queue') {
    targetPosition = [-5 - (queueIndex * 1.5), 0, 1];
  } else if (status === 'processing') {
    targetPosition = [-2, 0, 1]; // Standing at the Admin desk
  } else if (status === 'cleared') {
    // Map to specific desks in the classroom
    const deskPositions = [
      [5, 0.45, -0.4],
      [8, 0.45, -0.4],
      [6.5, 0.45, 1.6]
    ];
    targetPosition = deskPositions[id] || [6, 0.45, 0];
  }

  // Smooth animation
  const { position, scale } = useSpring({
    position: targetPosition,
    scale: status === 'cleared' ? [1, 0.8, 1] : [1, 1, 1], // Squish slightly when sitting
    config: { mass: 1, tension: 120, friction: 20 }
  });

  return (
    <a.group
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (isActive) onClick();
      }}
    >
      {/* === Detailed Human Character === */}
      {/* Head */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.77, 0]} castShadow>
        <sphereGeometry args={[0.205, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.41, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.18, 8]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      {/* Torso / Shirt */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.38, 0.55, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 1.31, 0.1]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.25, 1.05, 0]} castShadow rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Left Hand */}
      <mesh position={[-0.3, 0.76, 0]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.25, 1.05, 0]} castShadow rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Right Hand */}
      <mesh position={[0.3, 0.76, 0]} castShadow>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#f5d0a9" roughness={0.8} />
      </mesh>
      {/* Waist / Belt */}
      <mesh position={[0, 0.77, 0]} castShadow>
        <boxGeometry args={[0.39, 0.08, 0.23]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      {/* Left Leg / Trouser */}
      <mesh position={[-0.1, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.42, 4, 8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Left Foot / Shoe */}
      <mesh position={[-0.1, 0.11, 0.06]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.22]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} />
      </mesh>
      {/* Right Leg / Trouser */}
      <mesh position={[0.1, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.42, 4, 8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
      </mesh>
      {/* Right Foot / Shoe */}
      <mesh position={[0.1, 0.11, 0.06]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.22]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} />
      </mesh>
      {/* Schoolbag (only when in queue or processing) */}
      {status !== 'cleared' && (
        <group position={[0, 1.05, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.38, 0.14]} />
            <meshStandardMaterial color="#7c3aed" roughness={0.5} />
          </mesh>
          {/* Bag strap detail */}
          <mesh position={[0, 0.12, 0.08]} castShadow>
            <boxGeometry args={[0.28, 0.05, 0.02]} />
            <meshStandardMaterial color="#6d28d9" />
          </mesh>
        </group>
      )}

      {/* Interactive Indicator above active student */}
      {isActive && status === 'processing' && !isPopupVisible && (
        <Float speed={5} rotationIntensity={0} floatIntensity={1.5}>
          <Html position={[0, 2.5, 0]} center transform sprite scale={0.7}>
            <div style={{
              background: '#3b82f6',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              animation: 'pulse 2s infinite'
            }}>
              Tap to Enroll ↓
            </div>
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
            `}</style>
          </Html>
        </Float>
      )}

      {/* Show the small popup attached directly to the student */}
      {status === 'processing' && (
        <SyncPopup visible={isPopupVisible} syncStep={syncStep} studentId={id} />
      )}
    </a.group>
  );
}

export default function EducationCampusScene() {
  // State: 0, 1, 2 representing the 3 students
  // Each student can be 'queue', 'processing', 'cleared'
  const [students, setStudents] = useState([
    { id: 0, status: 'processing', color: '#ef4444' }, // First in line is at desk
    { id: 1, status: 'queue', color: '#f59e0b' },
    { id: 2, status: 'queue', color: '#10b981' }
  ]);
  
  const [syncStep, setSyncStep] = useState(0); // 0 = not started, 1, 2, 3 = syncing, 4 = done
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to figure out position in queue
  const getQueueIndex = (studentId) => {
    const queueStudents = students.filter(s => s.status === 'queue');
    return queueStudents.findIndex(s => s.id === studentId);
  };

  const resetQueue = () => {
    setIsProcessing(false);
    setIsPopupVisible(false);
    setSyncStep(0);
    setStudents([
      { id: 0, status: 'processing', color: '#ef4444' },
      { id: 1, status: 'queue', color: '#f59e0b' },
      { id: 2, status: 'queue', color: '#10b981' }
    ]);
  };

  const handleStudentClick = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsPopupVisible(true);
    setSyncStep(0);

    // Simulate sequential data syncing
    setTimeout(() => setSyncStep(1), 600);
    setTimeout(() => setSyncStep(2), 1200);
    setTimeout(() => setSyncStep(3), 1800);
    setTimeout(() => setSyncStep(4), 2400);

    // Complete processing after full sync
    setTimeout(() => {
      setIsPopupVisible(false);
      setIsProcessing(false);
      advanceQueue();
    }, 3600);
  };

  const advanceQueue = () => {
    setStudents(prev => {
      const newStudents = [...prev];

      // Find current processing student and clear them
      const processingIdx = newStudents.findIndex(s => s.status === 'processing');
      if (processingIdx !== -1) {
        newStudents[processingIdx] = { ...newStudents[processingIdx], status: 'cleared' };
      }

      // Find first in queue and move to processing
      const queueIdx = newStudents.findIndex(s => s.status === 'queue');
      if (queueIdx !== -1) {
        newStudents[queueIdx] = { ...newStudents[queueIdx], status: 'processing' };
      } else {
        // If all cleared, loop back to start after a delay
        setTimeout(() => resetQueue(), 3000);
      }

      return newStudents;
    });
  };

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

      {/* The Environment */}
      <CampusEnvironment />

      {/* The Students */}
      {students.map(s => (
        <Student
          key={s.id}
          id={s.id}
          status={s.status}
          queueIndex={getQueueIndex(s.id)}
          color={s.color}
          isActive={s.status === 'processing' && !isProcessing}
          onClick={handleStudentClick}
          isPopupVisible={isPopupVisible}
          syncStep={syncStep}
        />
      ))}

      {/* Shadows */}
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />

      {/* Allow limited camera movement */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
    </>
  );
}
