import React, { useState, useEffect } from 'react';
import { Environment, PresentationControls, Text, Float, ContactShadows, RoundedBox } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
// A Stylized Student sitting at a desk
function Student({ id, position, color, mode, status, onClick }) {
  const [hovered, setHovered] = useState(false);

  // Interaction Animation (Bounce when clicked)
  const { scale, y } = useSpring({
    scale: hovered ? 1.1 : 1,
    y: status ? 0.3 : 0, // Hop up when action completed
    config: { mass: 1, tension: 300, friction: 15 }
  });

  return (
    <group position={position}>
      {/* The Desk (Lifted to rest properly on y=0) */}
      <mesh position={[0, 0.3, 0.4]}>
        <boxGeometry args={[1.2, 0.6, 0.6]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>
      {/* Desk top */}
      <mesh position={[0, 0.65, 0.4]}>
        <boxGeometry args={[1.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.7} />
      </mesh>

      {/* The Student (Clickable) */}
      <a.group
        position-y={y}
        scale={scale}
        onClick={(e) => { e.stopPropagation(); onClick(id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'grab'; }}
      >
        {/* Body (extended to touch floor) */}
        <mesh position={[0, 0.5, -0.2]}>
          <cylinderGeometry args={[0.3, 0.3, 1.0]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.2, -0.2]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.2} />
        </mesh>

        {/* Visual Indicator (Checkmark for Attendance, Coin for Fees) */}
        {status && mode === 'ATTENDANCE' && (
          <Text position={[0, 1.8, -0.2]} fontSize={0.3} color="#10b981" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
            ✓
          </Text>
        )}
        {status && mode === 'FEES' && (
          <group position={[0, 1.9, -0.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.05]} />
              <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.1} />
            </mesh>
            <Text position={[0, 0, 0.03]} fontSize={0.25} color="#854d0e" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
              ₹
            </Text>
          </group>
        )}
      </a.group>
    </group>
  );
}

// Tablet UI Component
const DigitalTablet = ({ mode, records, onStudentClick }) => {
  const studentsList = [
    { id: 's1', name: 'Aarav M.' },
    { id: 's2', name: 'Riya K.' },
    { id: 's3', name: 'Kabir S.' },
    { id: 's4', name: 'Nisha P.' },
  ];

  const completedCount = Object.values(records).filter(Boolean).length;
  const totalStudents = studentsList.length;
  const revenue = completedCount * 2500;

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      {/* Moved tablet UP higher so it perfectly clears the floor plane */}
      <group position={[-2.5, 2.2, 0]} rotation={[0, 0.15, 0]}>
        {/* Tablet Body (Rounded iPad style) */}
        <RoundedBox args={[2.7, 3.8, 0.1]} radius={0.15} smoothness={4} position={[0, 0, -0.05]} castShadow>
          <meshStandardMaterial color="black" metalness={0.2} roughness={0.5} />
        </RoundedBox>

        {/* Screen Background (Using plane to avoid Z-fighting) */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[2.5, 3.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Camera Notch */}
        <mesh position={[0, 1.72, 0.01]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 1.72, 0.011]}>
          <circleGeometry args={[0.015, 16]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>

        {/* Header Area */}
        <RoundedBox args={[2.3, 0.6, 0.01]} radius={0.1} smoothness={4} position={[0, 1.35, 0.01]}>
          <meshBasicMaterial color={mode === 'ATTENDANCE' ? "#e0f2fe" : "#d1fae5"} />
        </RoundedBox>

        <Text position={[0, 1.45, 0.02]} fontSize={0.12} color={mode === 'ATTENDANCE' ? "#0284c7" : "#059669"} anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
          {mode === 'ATTENDANCE' ? 'DAILY ATTENDANCE' : 'FEE COLLECTION'}
        </Text>
        <Text position={[0, 1.25, 0.02]} fontSize={0.18} color="#0f172a" fontWeight="bold" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
          BATCH 10-A
        </Text>

        {/* Student List */}
        {studentsList.map((student, index) => {
          const isDone = records[student.id];
          const y = 0.75 - (index * 0.45);
          return (
            <group 
              key={student.id} 
              position={[0, y, 0.02]}
              onClick={(e) => {
                e.stopPropagation();
                if (onStudentClick) onStudentClick(student.id);
              }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab'; }}
            >
              {/* Row Separator */}
              {index !== 0 && (
                <mesh position={[0, 0.225, 0]}>
                  <planeGeometry args={[2.3, 0.01]} />
                  <meshBasicMaterial color="#e2e8f0" />
                </mesh>
              )}

              {/* Avatar circle */}
              <mesh position={[-0.9, 0, 0]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color={isDone ? (mode === 'ATTENDANCE' ? "#10b981" : "#fbbf24") : "#cbd5e1"} />
              </mesh>
              {/* Avatar Initial */}
              <Text position={[-0.9, 0, 0.01]} fontSize={0.12} color={isDone ? "#ffffff" : "#475569"} fontWeight="bold" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
                {student.name.charAt(0)}
              </Text>

              {/* Name */}
              <Text position={[-0.6, 0, 0.01]} fontSize={0.16} color={isDone ? "#0f172a" : "#475569"} fontWeight={isDone ? "bold" : "normal"} anchorX="left" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
                {student.name}
              </Text>

              {/* Status Badge */}
              <RoundedBox args={[0.7, 0.25, 0.01]} radius={0.125} smoothness={4} position={[0.7, 0, 0]}>
                <meshBasicMaterial color={isDone ? (mode === 'ATTENDANCE' ? "#ecfdf5" : "#fefce8") : "#f8fafc"} />
              </RoundedBox>
              {/* Badge Outline */}
              <RoundedBox args={[0.72, 0.27, 0.005]} radius={0.135} smoothness={4} position={[0.7, 0, -0.002]}>
                <meshBasicMaterial color={isDone ? (mode === 'ATTENDANCE' ? "#34d399" : "#fde047") : "#cbd5e1"} />
              </RoundedBox>
              <Text position={[0.7, 0, 0.01]} fontSize={0.1} color={isDone ? (mode === 'ATTENDANCE' ? "#065f46" : "#a16207") : "#64748b"} fontWeight="bold" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
                {isDone ? (mode === 'ATTENDANCE' ? 'PRESENT' : 'PAID') : 'PENDING'}
              </Text>
            </group>
          );
        })}

        {/* Dynamic Action Button/Stats area */}
        <RoundedBox args={[2.3, 0.5, 0.01]} radius={0.15} smoothness={4} position={[0, -1.45, 0.01]}>
          <meshBasicMaterial color={mode === 'ATTENDANCE' ? "#bae6fd" : "#fef08a"} />
        </RoundedBox>
        <Text position={[0, -1.45, 0.02]} fontSize={0.13} color={mode === 'ATTENDANCE' ? "#0369a1" : "#713f12"} fontWeight="bold" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
          {mode === 'ATTENDANCE'
            ? `TOTAL PRESENT: ${completedCount} / ${totalStudents}`
            : `REVENUE COLLECTED: ₹${revenue.toLocaleString()}`}
        </Text>
      </group>
    </Float>
  );
}

export default function TuitionClass3D() {
  const [mode, setMode] = useState('ATTENDANCE'); // 'ATTENDANCE' or 'FEES'

  // Track state for each mode
  const [attendance, setAttendance] = useState({ s1: false, s2: false, s3: false, s4: false });
  const [fees, setFees] = useState({ s1: false, s2: false, s3: false, s4: false });

  // Game Loop Logic
  useEffect(() => {
    if (mode === 'ATTENDANCE') {
      const allPresent = Object.values(attendance).every(v => v === true);
      if (allPresent) {
        setTimeout(() => {
          setMode('FEES');
          // Reset fee states when entering fees mode
          setFees({ s1: false, s2: false, s3: false, s4: false });
        }, 1500);
      }
    } else if (mode === 'FEES') {
      const allPaid = Object.values(fees).every(v => v === true);
      if (allPaid) {
        setTimeout(() => {
          setMode('ATTENDANCE');
          // Reset attendance when starting new cycle
          setAttendance({ s1: false, s2: false, s3: false, s4: false });
        }, 2000);
      }
    }
  }, [attendance, fees, mode]);

  const handleStudentClick = (id) => {
    if (mode === 'ATTENDANCE') {
      setAttendance(prev => ({ ...prev, [id]: true }));
    } else {
      setFees(prev => ({ ...prev, [id]: true }));
    }
  };

  const records = mode === 'ATTENDANCE' ? attendance : fees;

  return (
    <group>
      <Environment preset="city" />

      <PresentationControls
        global={false}
        cursor={true}
        snap={true}
        speed={1.5}
        zoom={0.8}
        polar={[-Math.PI / 8, Math.PI / 8]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        {/* Centered and scaled scene */}
        <group scale={0.4} position={[0, -1.2, 0]}>

          <DigitalTablet mode={mode} records={records} onStudentClick={handleStudentClick} />

          {/* Studio Floor (Infinite centered plane) */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#f8fafc" roughness={1} />
          </mesh>

          {/* Whiteboard / Smartboard in back */}
          <mesh position={[1.3, 3.2, -2.5]}>
            <boxGeometry args={[4.5, 2.5, 0.1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[1.3, 3.2, -2.4]}>
            <planeGeometry args={[4.3, 2.3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Math equations on board */}
          <Text position={[1.3, 3.7, -2.39]} fontSize={0.25} color="#0f172a" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
            ∫ e^x dx = e^x + C
          </Text>
          <Text position={[1.3, 2.7, -2.39]} fontSize={0.25} color="#dc2626" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
            E = mc²
          </Text>

          {/* Students (Compacted together so they fit perfectly in the viewport) */}
          <Student id="s1" color="#3b82f6" position={[-0.2, 0, -1]} mode={mode} status={records.s1} onClick={handleStudentClick} />
          <Student id="s2" color="#ef4444" position={[1.8, 0, -1]} mode={mode} status={records.s2} onClick={handleStudentClick} />
          <Student id="s3" color="#10b981" position={[0.8, 0, 1.5]} mode={mode} status={records.s3} onClick={handleStudentClick} />
          <Student id="s4" color="#8b5cf6" position={[2.8, 0, 1.5]} mode={mode} status={records.s4} onClick={handleStudentClick} />

        </group>
      </PresentationControls>

      {/* Cinematic Contact Shadows */}
      <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={20} blur={2} far={4} />
    </group>
  );
}
