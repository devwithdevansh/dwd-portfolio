import React, { useState } from 'react';
import { Environment, OrbitControls, Html, Float, ContactShadows } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

// 3D Reception Desk Environment
function ReceptionDesk() {
  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>

      {/* Main Curved Desk (Marble & Wood) */}
      <mesh position={[0, 0.5, -1]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1, 1]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.05, -1]} castShadow>
        <boxGeometry args={[3.4, 0.1, 1.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.5, -0.45]} castShadow>
        <boxGeometry args={[2.8, 0.9, 0.1]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} /> {/* Wood panel accent */}
      </mesh>

      {/* Glass Partition */}
      <mesh position={[0, 1.5, -0.6]} castShadow>
        <boxGeometry args={[3.4, 0.8, 0.05]} />
        <meshPhysicalMaterial color="#bae6fd" opacity={0.4} transparent transmission={0.9} roughness={0.05} />
      </mesh>

      {/* Decorative Potted Plant */}
      <group position={[1.4, 1.1, -0.8]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <dodecahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      </group>

      {/* Computer Monitors */}
      <group position={[-0.8, 1.1, -1.2]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.3, 0.03]}>
          <boxGeometry args={[0.7, 0.4, 0.05]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      <group position={[0.8, 1.1, -1.2]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.3, 0.03]}>
          <boxGeometry args={[0.7, 0.4, 0.05]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Receptionist Character */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <capsuleGeometry args={[0.25, 0.9, 4, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
      </group>

      {/* Waiting Area Seating (Right Side) */}
      <group position={[4, 0, -1.5]}>
        {[0, 1, 2].map(i => (
          <group key={`seat-${i}`} position={[i * 1.5, 0, 0]}>
            {/* Seat Base */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
            {/* Seat Back */}
            <mesh position={[0, 0.6, -0.35]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.1]} />
              <meshStandardMaterial color="#c2410c" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Queue Line Markers (Left Side) */}
      {[-3, -4.5, -6].map((x, i) => (
        <mesh key={`marker-${i}`} position={[x, 0.01, 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={i === 0 ? "#22c55e" : "#cbd5e1"} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Mock Data for Patients
const patientData = [
  { name: 'Rahul Sharma', phone: '+91 98765 43210', address: 'Andheri West, Mumbai' },
  { name: 'Priya Patel', phone: '+91 91234 56789', address: 'Koramangala, Bengaluru' },
  { name: 'Amit Singh', phone: '+91 99887 76655', address: 'Connaught Place, Delhi' },
];

// Interactive ERP Popup UI (Sleek Green Pill Style)
function SyncPopup({ syncStep, visible, patientId }) {
  if (!visible) return null;
  const data = patientData[patientId] || patientData[0];

  return (
    <Html position={[0, 2.5, 0]} center transform sprite zIndexRange={[100, 0]} scale={0.7}>
      <div style={{
        background: '#22c55e',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '13px',
        fontFamily: 'sans-serif',
        boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        whiteSpace: 'nowrap',
        minWidth: '200px'
      }}>
        {syncStep === 0 && <div style={{ textAlign: 'center', opacity: 0.8 }}>Syncing Data...</div>}

        {syncStep >= 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Name: <span style={{ fontWeight: 'normal', opacity: 0.9 }}>{data.name}</span></span>
            <span>✓</span>
          </div>
        )}

        {syncStep >= 2 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Phone: <span style={{ fontWeight: 'normal', opacity: 0.9 }}>{data.phone}</span></span>
            <span>✓</span>
          </div>
        )}

        {syncStep >= 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Addr: <span style={{ fontWeight: 'normal', opacity: 0.9 }}>{data.address}</span></span>
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
            PATIENT CLEARED
          </div>
        )}
      </div>
    </Html>
  );
}

// 3D Patient Character
function Patient({ id, status, queueIndex, color, onClick, isActive, isPopupVisible, syncStep }) {
  // Determine target position based on status
  let targetPosition = [0, 0, 1]; // Default

  if (status === 'queue') {
    targetPosition = [-3 - (queueIndex * 1.5), 0, 1];
  } else if (status === 'processing') {
    targetPosition = [0, 0, 1]; // Standing at the desk
  } else if (status === 'cleared') {
    targetPosition = [4 + (id * 1.5), 0.4, -1.5]; // Sitting on the chair
  }

  // Smooth animation using react-spring
  const { position, scale } = useSpring({
    position: targetPosition,
    scale: isActive ? 1.1 : 1,
    config: { mass: 1, tension: 120, friction: 20 }
  });

  return (
    <a.group
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (status === 'processing' && onClick) onClick();
      }}
      onPointerOver={(e) => {
        if (status === 'processing') document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        if (status === 'processing') document.body.style.cursor = 'auto';
      }}
    >
      {/* Patient Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.9, 4, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Patient Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fbcfe8" />
      </mesh>

      {/* Interactive Indicator above active patient */}
      {isActive && status === 'processing' && !isPopupVisible && (
        <Float speed={5} rotationIntensity={0} floatIntensity={1.5}>
          <Html position={[0, 2.5, 0]} center transform sprite scale={0.7}>
            <div style={{
              background: '#22c55e',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'sans-serif',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.5)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              animation: 'pulse 2s infinite'
            }}>
              Tap Here ↓
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

      {/* Show the small popup attached directly to the patient */}
      {status === 'processing' && (
        <SyncPopup visible={isPopupVisible} syncStep={syncStep} patientId={id} />
      )}
    </a.group>
  );
}

export default function PatientIntakeScene() {
  // State: 0, 1, 2 representing the 3 patients
  // Each patient can be 'queue', 'processing', 'cleared'
  const [patients, setPatients] = useState([
    { id: 0, status: 'processing', color: '#ef4444' }, // First patient starts at the desk
    { id: 1, status: 'queue', color: '#f59e0b' },
    { id: 2, status: 'queue', color: '#10b981' }
  ]);

  const [syncStep, setSyncStep] = useState(0); // 0 = not started, 1, 2, 3 = syncing, 4 = done
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to calculate a patient's position in the queue
  const getQueueIndex = (id) => {
    const queuePatients = patients.filter(p => p.status === 'queue').sort((a, b) => a.id - b.id);
    return queuePatients.findIndex(p => p.id === id);
  };

  // Handle clicking the active patient
  const handlePatientClick = () => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);
    setIsPopupVisible(true);
    setSyncStep(0);

    // Simulate sequential data syncing
    setTimeout(() => setSyncStep(1), 600);
    setTimeout(() => setSyncStep(2), 1200);
    setTimeout(() => setSyncStep(3), 1800);
    setTimeout(() => {
      setSyncStep(4);
      // After a short delay, clear the patient and advance the queue
      setTimeout(() => advanceQueue(), 1000);
    }, 2400);
  };

  const advanceQueue = () => {
    setIsPopupVisible(false);
    setSyncStep(0);
    setIsProcessing(false);

    setPatients(prev => {
      const newPatients = [...prev];

      // Find current processing patient and clear them
      const processingIdx = newPatients.findIndex(p => p.status === 'processing');
      if (processingIdx !== -1) {
        newPatients[processingIdx] = { ...newPatients[processingIdx], status: 'cleared' };
      }

      // Find next patient in queue and move them to processing
      const nextQueuePatient = newPatients.find(p => p.status === 'queue');
      if (nextQueuePatient) {
        const queueIdx = newPatients.findIndex(p => p.id === nextQueuePatient.id);
        newPatients[queueIdx] = { ...newPatients[queueIdx], status: 'processing' };
      } else {
        // If all cleared, loop back to start after a delay
        setTimeout(() => resetQueue(), 2000);
      }

      return newPatients;
    });
  };

  const resetQueue = () => {
    setPatients([
      { id: 0, status: 'processing', color: '#ef4444' },
      { id: 1, status: 'queue', color: '#f59e0b' },
      { id: 2, status: 'queue', color: '#10b981' }
    ]);
  };

  return (
    <group position={[0, -1.5, 0]}>
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

      {/* The Environment */}
      <ReceptionDesk />

      {/* The Patients */}
      {patients.map(p => (
        <Patient
          key={p.id}
          id={p.id}
          status={p.status}
          queueIndex={getQueueIndex(p.id)}
          color={p.color}
          isActive={p.status === 'processing' && !isProcessing}
          onClick={handlePatientClick}
          isPopupVisible={isPopupVisible}
          syncStep={syncStep}
        />
      ))}

      {/* Shadows */}
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </group>
  );
}
