import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Single Pizza Slice Component (Classic Gourmet Slice)
function PizzaSlice({ index, totalSlices = 6, isEaten, onClick, isHovered, onHover, onUnhover }) {
  const meshGroupRef = useRef();

  const angleStep = (Math.PI * 2) / totalSlices;
  const sliceAngle = index * angleStep + angleStep / 2;

  // Calculate slice direction vector
  const dirX = Math.cos(sliceAngle);
  const dirZ = Math.sin(sliceAngle);

  // Animation values
  const currentOffset = useRef(0);
  const currentScale = useRef(1);

  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;

    let targetOffset = 0;
    let targetScale = 1;

    if (isEaten) {
      targetOffset = 2.5;
      targetScale = 0;
    } else if (isHovered) {
      targetOffset = 0.35;
      targetScale = 1.08;
    }

    currentOffset.current = THREE.MathUtils.lerp(currentOffset.current, targetOffset, delta * 8);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 8);

    meshGroupRef.current.position.x = dirX * currentOffset.current;
    meshGroupRef.current.position.z = dirZ * currentOffset.current;
    meshGroupRef.current.scale.setScalar(currentScale.current);
  });

  if (isEaten && currentScale.current < 0.05) return null;

  return (
    <group
      ref={meshGroupRef}
      onClick={(e) => { e.stopPropagation(); onClick(index); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(index); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      <group rotation={[0, -sliceAngle + Math.PI / 2, 0]}>
        {/* Cheese Base Wedge */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.5, 0.05, 0.12, 16, 1, false, -angleStep / 2, angleStep]} />
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.3}
            metalness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Outer Crust Edge */}
        <mesh position={[0, 0.04, 1.48]}>
          <boxGeometry args={[0.75, 0.18, 0.16]} />
          <meshStandardMaterial color="#d97706" roughness={0.6} />
        </mesh>

        {/* Pepperoni Toppings */}
        <mesh position={[0.2, 0.08, 0.8]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[-0.22, 0.08, 1.1]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0.08, 0.4]}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>

        {/* Black Olive Rings */}
        <mesh position={[-0.12, 0.09, 0.75]}>
          <torusGeometry args={[0.07, 0.03, 8, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>

        {/* Basil Leaves */}
        <mesh position={[-0.1, 0.09, 0.65]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.01, 0.2]} />
          <meshStandardMaterial color="#16a34a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export default function Pizza3DScene() {
  const [eatenSlices, setEatenSlices] = useState([false, false, false, false, false, false]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pizzaGroupRef = useRef();

  const eatenCount = eatenSlices.filter(Boolean).length;
  const isAllEaten = eatenCount === 6;

  useFrame((state) => {
    if (pizzaGroupRef.current) {
      pizzaGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
      pizzaGroupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.12 + 0.35;
    }
  });

  const handleEatNextSlice = () => {
    const nextIdx = eatenSlices.findIndex(eaten => !eaten);
    if (nextIdx !== -1) {
      handleEatSlice(nextIdx);
    }
  };

  const handleEatSlice = (index) => {
    setEatenSlices((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleResetPizza = () => {
    setEatenSlices([false, false, false, false, false, false]);
  };

  return (
    <group>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <pointLight position={[0, 2.5, 0]} intensity={1.2} color="#f97316" />

      {/* Floating Sparkles in Deep Background */}
      <Sparkles count={60} scale={7} size={2} speed={0.5} opacity={0.3} color="#f97316" />

      {/* TOP HEADLINE OVERLAY (WHILE SLICES REMAIN) */}
      {!isAllEaten && (
        <Html position={[0, 1.8, 0]} center className="pointer-events-auto z-50">
          <div className="text-center select-none whitespace-nowrap flex flex-col items-center max-w-xs sm:max-w-md mx-auto px-2">
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Click a slice to eat <span className="text-orange-600">🍕</span>
            </h3>
            
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest">
              {6 - eatenCount} of 6 Slices Remaining
            </div>
          </div>
        </Html>
      )}

      {/* 3D Floating Pizza & Wooden Pan Board Group */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={pizzaGroupRef} position={[0, -0.1, 0]} scale={0.85}>
          
          {/* Classic Wooden Pan Board */}
          <mesh position={[0, -0.15, 0]} receiveShadow>
            <cylinderGeometry args={[2.0, 2.1, 0.08, 32]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.1} />
          </mesh>

          {/* 6 Gourmet Pizza Slices */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <PizzaSlice
              key={i}
              index={i}
              totalSlices={6}
              isEaten={eatenSlices[i]}
              onClick={handleEatSlice}
              isHovered={hoveredIndex === i}
              onHover={(idx) => setHoveredIndex(idx)}
              onUnhover={() => setHoveredIndex(null)}
            />
          ))}
        </group>
      </Float>

      {/* DIRECTLY ON-PLATE COMPLETION DISPLAY WHEN ALL SLICES ARE EATEN */}
      {isAllEaten && (
        <Html position={[0, 0.1, 0]} center className="pointer-events-auto z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="text-center select-none whitespace-nowrap flex flex-col items-center px-6 py-5 rounded-3xl bg-slate-900/95 dark:bg-slate-950/95 border-2 border-orange-500/50 shadow-2xl"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              120ms KOT Dispatch Active
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase mb-1">
              YUMMY! <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-400">100% EATEN</span>
            </h3>
            
            <p className="text-xs font-medium text-slate-300 mb-4">
              All 6 gourmet slices dispatched directly to kitchen.
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetPizza}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-xl shadow-orange-600/40 transition-colors duration-300 cursor-pointer flex items-center gap-2 border border-amber-300"
            >
              <span>🍕</span> Bake Fresh Woodfired Pizza
            </motion.button>
          </motion.div>
        </Html>
      )}

      {/* BOTTOM ACTION BUTTON (WHILE SLICES REMAIN) */}
      {!isAllEaten && (
        <Html position={[0, -1.6, 0]} center className="pointer-events-auto z-50">
          <div className="text-center select-none whitespace-nowrap flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEatNextSlice}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white font-black text-xs rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700 dark:border-slate-300"
            >
              <span>🍕</span> Take a Slice
            </motion.button>
          </div>
        </Html>
      )}

      {/* Contact Shadow for 3D Pan Board */}
      <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={5} blur={2.5} far={4} color="#78350f" />
    </group>
  );
}
