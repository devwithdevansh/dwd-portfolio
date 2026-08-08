import React from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei';
import PatientIntakeScene from './PatientIntakeScene';

// This is the actual model component that loads an external GLTF file if supplied
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function HospitalModelViewer({ modelUrl }) {
  if (!modelUrl) {
    return <PatientIntakeScene />;
  }

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      
      {/* Allows the user to rotate and zoom the model */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
      
      <Model url={modelUrl} />
    </>
  );
}

