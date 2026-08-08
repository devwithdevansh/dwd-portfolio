import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Sparkles, Box, Cylinder, Sphere, Cone, OrbitControls, Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE LOG (fixes applied to the original scene)
// 1. randomOrder() used `sort(() => Math.random() - 0.5)`, a well-known biased
//    "shuffle" — swapped for a proper Fisher–Yates shuffle.
// 2. Side chairs (left/right of the table) reused the front/back backrest's
//    geometry and offset axis, so their backrests weren't actually oriented
//    toward the table — fixed with per-chair rotation + correct offset axis.
// 3. `go()` didn't accept a `cooking` flag, so the COOK stage fired
//    onStageChange() twice (once inside go(), once right after) — go() now
//    takes the flag directly, so each stage transition is a single dispatch.
// 4. ManagerHUD referenced a CSS `ping` keyframe (a Tailwind utility name)
//    that was never defined, so the "live" pulse dot silently did nothing —
//    added a real @keyframes rule scoped to the HUD.
// 5. Emoji (✓ 🔴 🟢) were used inside <Text> (troika/3D text), whose custom
//    TTF font has no emoji glyphs and would render as missing boxes — removed
//    from 3D text; emoji are fine to keep in the HTML-based ManagerHUD.
// 6. Magic timing numbers (3000, 2500, 4000, ...) pulled into a named
//    TIMING object so the order lifecycle is self-documenting and easy to
//    retune.
// 7. Kitchen partition's cooking indicator was three <Sparkles> blocks
//    (floating dust, not fire) — removed entirely and replaced with
//    KitchenFlame: real flame geometry (inner/outer cone, additive
//    blending, per-frame flicker + a flickering point light) at each
//    burner.
// 8. Table sign only ever showed a binary AVAILABLE/OCCUPIED, hiding what
//    a table is actually doing — it now reads the table's real lifecycle
//    stage (Seated / Order Sent / Cooking / Served / Billing) via the
//    shared STAGE_META map, same one the Manager HUD uses.
// 9. Manager HUD floated in open air at z=0 with no wall, stand, or frame
//    behind it — it's now mounted in a physical bezel (matte black + gold
//    trim, matching the KDS screen) flush on the back wall, and its
//    content was redesigned for clearer hierarchy (status pills instead
//    of bare dots, consistent section dividers, a highlighted revenue
//    footer).
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Stage constants
// ─────────────────────────────────────────────────────────────────────────────
const S = { WAIT: 'WAIT', SEATED: 'SEATED', ORDER: 'ORDER', COOK: 'COOK', SERVED: 'SERVED', BILLED: 'BILLED' };

// Single source of truth for stage display — used by both the in-scene table
// sign and the Manager HUD, so a table's real lifecycle stage (not just a
// available/occupied binary) reads identically everywhere.
const STAGE_META = {
  WAIT: { label: 'AVAILABLE', short: 'Waiting', color: '#4ade80', panel: '#14532d' },
  SEATED: { label: 'SEATED', short: 'Seated', color: '#38bdf8', panel: '#0c4a6e' },
  ORDER: { label: 'ORDER SENT', short: 'KOT Sent', color: '#a78bfa', panel: '#4c1d95' },
  COOK: { label: 'COOKING', short: 'Cooking', color: '#fb923c', panel: '#7c2d12' },
  SERVED: { label: 'SERVED', short: 'Served', color: '#4ade80', panel: '#14532d' },
  BILLED: { label: 'BILLING', short: 'Billing', color: '#22d3ee', panel: '#164e63' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sample Menu
// ─────────────────────────────────────────────────────────────────────────────
const MENU = [
  ['Paneer Tikka', 320], ['Dal Makhani', 280], ['Butter Naan ×2', 80],
  ['Biryani Bowl', 420], ['Lassi', 90], ['Gulab Jamun', 120],
  ['Tandoori Chicken', 380], ['Jeera Rice', 140], ['Masala Chai', 60],
  ['Veg Thali', 260], ['Cold Coffee', 150], ['Samosa Platter', 160],
];

// Proper Fisher–Yates shuffle (Math.random() - 0.5 comparator is biased and
// does not produce a uniform permutation).
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomOrder() {
  return shuffle(MENU)
    .slice(0, 2 + Math.floor(Math.random() * 2))
    .map(([name, price]) => ({ name, price }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Infinite-style floor — one massive dark plane with subtle tiling
// ─────────────────────────────────────────────────────────────────────────────
function Floor() {
  return (
    <group>
      {/* Massive base floor — extends to fog boundary so no white ever shows */}
      <Box args={[200, 0.04, 200]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1208" roughness={0.9} />
      </Box>
      {/* Warm restaurant dining area overlay on top */}
      <Box args={[11, 0.045, 10]} position={[0, 0.003, 0]} receiveShadow>
        <meshStandardMaterial color="#7c5c38" roughness={0.8} />
      </Box>
      {/* Plank lines for detail */}
      {[-4, -2, 0, 2, 4].map(x => (
        <Box key={x} args={[0.02, 0.046, 10]} position={[x, 0.003, 0]}>
          <meshStandardMaterial color="#5a3e24" roughness={1} />
        </Box>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Walls — premium restaurant interior
// Back wall: terracotta upper + dark wood wainscoting + gold dado rail + sconces
// Side wall: alternating dark wood vertical panels
// ─────────────────────────────────────────────────────────────────────────────
function Walls() {
  return (
    <group>
      {/* ── BACK WALL ──────────────────────────────────────────────── */}
      {/* Upper wall — rich warm terracotta */}
      <Box args={[12, 3.15, 0.25]} position={[0, 2.93, -4.5]} receiveShadow castShadow>
        <meshStandardMaterial color="#7a2e1a" roughness={0.88} />
      </Box>
      {/* Lower wainscoting — dark walnut wood */}
      <Box args={[12, 1.35, 0.25]} position={[0, 0.675, -4.5]} receiveShadow castShadow>
        <meshStandardMaterial color="#2d1408" roughness={0.72} />
      </Box>
      {/* Dado rail — brushed gold divider */}
      <Box args={[12.1, 0.1, 0.32]} position={[0, 1.36, -4.42]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.65} />
      </Box>
      {/* Crown molding at top */}
      <Box args={[12.1, 0.1, 0.3]} position={[0, 4.46, -4.42]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.65} />
      </Box>
      {/* Skirting baseboard — gold */}
      <Box args={[12.1, 0.12, 0.3]} position={[0, 0.06, -4.42]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.5} />
      </Box>

      {/* Vertical panel divisions carved into wainscoting */}
      {[-5, -3.3, -1.6, 0.1, 1.8, 3.5, 5.2].map((x, i) => (
        <Box key={i} args={[0.05, 1.1, 0.32]} position={[x, 0.75, -4.42]}>
          <meshStandardMaterial color="#1a0c04" roughness={0.6} />
        </Box>
      ))}

      {/* Framed rectangular panels (wainscoting detail) */}
      {[-4, -1.5, 1, 3.5].map((x, i) => (
        <group key={i} position={[x, 0.76, -4.42]}>
          {/* Horizontal rail top */}
          <Box args={[1.4, 0.05, 0.32]} position={[0, 0.42, 0]}>
            <meshStandardMaterial color="#1a0c04" roughness={0.6} />
          </Box>
          {/* Horizontal rail bottom */}
          <Box args={[1.4, 0.05, 0.32]} position={[0, -0.42, 0]}>
            <meshStandardMaterial color="#1a0c04" roughness={0.6} />
          </Box>
        </group>
      ))}

      {/* Wall sconce lights on upper wall */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={i} position={[x, 2.8, -4.32]}>
          {/* Bracket arm */}
          <Box args={[0.06, 0.35, 0.12]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#c9a84c" roughness={0.2} metalness={0.8} />
          </Box>
          {/* Shade */}
          <Cylinder args={[0.09, 0.14, 0.2, 16]} position={[0, 0.27, 0]}>
            <meshStandardMaterial color="#c9a84c" roughness={0.2} metalness={0.7} />
          </Cylinder>
          {/* Bulb glow */}
          <Sphere args={[0.06, 10, 10]} position={[0, 0.18, 0]}>
            <meshStandardMaterial color="#fff8e1" emissive="#fff8e1" emissiveIntensity={4} />
          </Sphere>
          <pointLight position={[0, 0.18, 0.3]} intensity={0.7} color="#fff0c0" distance={3.5} />
        </group>
      ))}

      {/* ── SIDE WALL (right) ────────────────────────────────────────── */}
      {/* Alternating dark wood vertical planks */}
      {Array.from({ length: 10 }, (_, i) => i).map(i => (
        <Box key={i} args={[0.25, 4.5, 0.99]} position={[5.875, 2.25, -4 + i]} receiveShadow castShadow>
          <meshStandardMaterial color={i % 2 === 0 ? '#1e1208' : '#2a1a0a'} roughness={0.78} />
        </Box>
      ))}
      {/* Gold vertical strip joining planks */}
      <Box args={[0.3, 0.08, 10]} position={[5.84, 1.36, 0]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.65} />
      </Box>
      <Box args={[0.3, 0.08, 10]} position={[5.84, 4.46, 0]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.65} />
      </Box>
      <Box args={[0.3, 0.12, 10]} position={[5.84, 0.06, 0]}>
        <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.5} />
      </Box>
    </group>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Kitchen flame — a real flame silhouette (inner + outer cone, additive
// blending, per-frame flicker) sitting on a burner, instead of a generic
// floating dust-particle system standing in for "fire".
// ─────────────────────────────────────────────────────────────────────────────
function KitchenFlame({ position }) {
  const groupRef = useRef();
  const outerRef = useRef();
  const coreRef = useRef();
  const lightRef = useRef();
  // Random phase offset so the two burners don't flicker in lockstep
  const seed = useRef(Math.random() * 100);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 6 + seed.current;
    const flicker = 0.85 + Math.sin(t) * 0.08 + Math.sin(t * 2.7) * 0.05;

    if (groupRef.current) {
      groupRef.current.scale.set(1, flicker, 1);
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      groupRef.current.position.x = position[0] + Math.sin(t * 1.3) * 0.015;
      groupRef.current.position.z = position[2] + Math.cos(t * 1.1) * 0.015;
    }
    if (outerRef.current) {
      outerRef.current.material.emissiveIntensity = 2 + Math.sin(t * 3.3 + 1) * 0.5;
    }
    if (coreRef.current) {
      coreRef.current.material.emissiveIntensity = 3 + Math.sin(t * 4) * 0.6;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 5) * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer flame — orange/red, wider and taller */}
      <Cone ref={outerRef} args={[0.16, 0.42, 12]} position={[0, 0.21, 0]}>
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={2}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Cone>
      {/* Inner core — bright yellow-white, sits inside the outer cone */}
      <Cone ref={coreRef} args={[0.08, 0.26, 12]} position={[0, 0.16, 0]}>
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fde047"
          emissiveIntensity={3}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Cone>
      {/* Flickering warm glow cast onto the pass */}
      <pointLight ref={lightRef} color="#fb923c" intensity={0.8} distance={2.2} position={[0, 0.35, 0]} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Kitchen Pass
// ─────────────────────────────────────────────────────────────────────────────
function KitchenPass({ cooking }) {
  return (
    <group position={[0, 0, -3.8]}>
      <Box args={[7, 1, 0.6]} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.3} />
      </Box>
      <Box args={[7.1, 0.08, 0.7]} position={[0, 1.04, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.05} metalness={0.1} />
      </Box>
      <Cylinder args={[0.35, 0.35, 0.05, 32]} position={[-1.8, 1.09, 0]} castShadow>
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.35, 0.35, 0.05, 32]} position={[1.8, 1.09, 0]} castShadow>
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </Cylinder>
      {cooking && (
        <>
          <KitchenFlame position={[-1.8, 1.12, 0]} />
          <KitchenFlame position={[1.8, 1.12, 0]} />
          {/* Preparing Order label above partition — static, no motion */}
          <Text
            position={[0, 2.1, 0.3]}
            fontSize={0.28}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          >
            Preparing Order
          </Text>
        </>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KDS Screen (3D) — dark monitor with colored status strip + white text
// Note: emoji are intentionally NOT used here — the loaded TTF has no emoji
// glyphs, so they'd render as missing-character boxes. Color already carries
// the status via the strip above the label.
// ─────────────────────────────────────────────────────────────────────────────
function KDSScreen({ activeKOTs }) {
  const active = activeKOTs.length > 0;
  const label = active
    ? activeKOTs.map(k => `T${k + 1}`).join('  |  ') + '  ·  COOKING'
    : 'KITCHEN IDLE';

  return (
    <group position={[0, 3.2, -4.3]}>
      {/* Monitor outer bezel — matte black */}
      <Box args={[4.8, 1.05, 0.1]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.3} />
      </Box>
      {/* Screen face — dark charcoal, like a real LCD off */}
      <Box args={[4.58, 0.85, 0.11]}>
        <meshStandardMaterial color="#111418" roughness={0.1} metalness={0.05} />
      </Box>
      {/* Colored status bar at the top of screen (thin accent strip) */}
      <Box args={[4.58, 0.1, 0.115]} position={[0, 0.375, 0]}>
        <meshStandardMaterial
          color={active ? '#dc2626' : '#16a34a'}
          emissive={active ? '#dc2626' : '#16a34a'}
          emissiveIntensity={1.8}
        />
      </Box>
      {/* White readable text on dark screen */}
      <Text
        position={[0, -0.05, 0.1]}
        fontSize={0.18}
        color={active ? '#ffffff' : '#d1fae5'}
        anchorX="center"
        anchorY="middle"
        maxWidth={4.2}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {label}
      </Text>
      {/* Small status label */}
      <Text
        position={[0, 0.36, 0.1]}
        fontSize={0.1}
        color={active ? '#fecaca' : '#bbf7d0'}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {active ? 'ORDERS IN QUEUE' : 'ALL CLEAR'}
      </Text>
    </group>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Dining Table with 4 chairs
// Chairs at (±x, 0) face along X toward the table; chairs at (0, ±z) face
// along Z. Each backrest is rotated to match its chair's facing axis, and
// offset along that same axis — previously side chairs kept the front/back
// backrest's orientation and were offset on the wrong axis, so they read as
// a flat plate floating beside the seat rather than a proper chair back.
// ─────────────────────────────────────────────────────────────────────────────
function DiningTable({ position, isOccupied, isServed, showRevenue, colors }) {
  const chairs = [[0, 0, 1.05], [0, 0, -1.05], [1.05, 0, 0], [-1.05, 0, 0]];
  return (
    <group position={position}>
      <Cylinder args={[0.75, 0.75, 0.07, 32]} position={[0, 0.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3b2a1e" roughness={0.25} metalness={0.05} />
      </Cylinder>
      <Cylinder args={[0.07, 0.12, 0.7, 16]} position={[0, 0.35, 0]} castShadow>
        <meshStandardMaterial color="#1c1917" roughness={0.7} />
      </Cylinder>
      {chairs.map(([cx, , cz], i) => {
        const facesX = cx !== 0; // side chair, sits/faces along the X axis
        const backOffset = facesX ? (cx > 0 ? -0.16 : 0.16) : (cz > 0 ? -0.16 : 0.16);
        const backPosition = facesX ? [backOffset, 0.65, 0] : [0, 0.65, backOffset];
        const backRotationY = facesX ? Math.PI / 2 : 0;
        return (
          <group key={i} position={[cx, 0, cz]}>
            <Box args={[0.42, 0.04, 0.38]} position={[0, 0.4, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </Box>
            <Box args={[0.42, 0.45, 0.05]} position={backPosition} rotation={[0, backRotationY, 0]} castShadow>
              <meshStandardMaterial color="#263349" roughness={0.5} />
            </Box>
          </group>
        );
      })}
      {isOccupied && (
        <>
          <Float speed={2} floatIntensity={0.12} rotationIntensity={0}>
            <Sphere args={[0.2, 24, 24]} position={[0, 1.05, 0.9]}>
              <meshStandardMaterial color={colors[0]} roughness={0.1} />
            </Sphere>
          </Float>
          <Float speed={2.6} floatIntensity={0.12} rotationIntensity={0}>
            <Sphere args={[0.2, 24, 24]} position={[0, 1.05, -0.9]}>
              <meshStandardMaterial color={colors[1]} roughness={0.1} />
            </Sphere>
          </Float>
        </>
      )}
      {isServed && (
        <group position={[0, 0.75, 0]}>
          <Cylinder args={[0.18, 0.18, 0.025, 24]} position={[0.25, 0, 0]}>
            <meshStandardMaterial color="#fbbf24" />
          </Cylinder>
          <Cylinder args={[0.18, 0.18, 0.025, 24]} position={[-0.25, 0, 0]}>
            <meshStandardMaterial color="#fbbf24" />
          </Cylinder>
        </group>
      )}
      {showRevenue && <Sparkles count={80} scale={3} size={12} speed={2} position={[0, 2, 0]} color="#10b981" opacity={1} />}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WaiterRobot — smooth walking, NO teleportation
// The key fix: the group has NO position prop; position is 100% controlled by useFrame
// ─────────────────────────────────────────────────────────────────────────────
function WaiterRobot({ targetPosition, bodyColor }) {
  const meshRef = useRef();
  // Internal mutable position — starts at the target so there's no initial snap
  const currentPos = useRef(new THREE.Vector3(...targetPosition));
  const targetVec = useRef(new THREE.Vector3(...targetPosition));

  // Sync target ref whenever prop changes (no state, no re-render needed)
  useEffect(() => {
    targetVec.current.set(...targetPosition);
  }, [targetPosition]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Smooth lerp toward target — speed 2.2 gives a realistic walking pace
    currentPos.current.lerp(targetVec.current, Math.min(1, delta * 2.2));
    meshRef.current.position.copy(currentPos.current);

    // Smooth rotation to face direction of travel
    const dir = targetVec.current.clone().sub(currentPos.current);
    if (dir.lengthSq() > 0.003) {
      const angle = Math.atan2(dir.x, dir.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y, angle, delta * 6
      );
    }
  });

  return (
    // NO position prop on this group — entirely managed above via useFrame
    <group ref={meshRef}>
      <Float speed={5} floatIntensity={0.25} rotationIntensity={0.08}>
        {/* Body */}
        <Cylinder args={[0.14, 0.14, 0.65, 16]} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color={bodyColor} roughness={0.1} metalness={0.9} />
        </Cylinder>
        {/* Head */}
        <RoundedBox args={[0.3, 0.26, 0.26]} radius={0.05} position={[0, 0.88, 0]} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </RoundedBox>
        {/* Eye visor */}
        <Box args={[0.2, 0.055, 0.04]} position={[0, 0.88, 0.135]}>
          <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={3} />
        </Box>
        {/* Held mobile POS — simple dark device, no blue glow */}
        <group position={[0.2, 0.55, 0.08]} rotation={[-0.3, 0.15, 0]}>
          <Box args={[0.11, 0.18, 0.013]}>
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
          </Box>
          {/* Screen - dark, off-look */}
          <Box args={[0.09, 0.155, 0.014]} position={[0, 0, 0.007]}>
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </Box>
        </group>
      </Float>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative Planter
// ─────────────────────────────────────────────────────────────────────────────
function Planter({ position }) {
  return (
    <group position={position}>
      <Box args={[0.8, 0.55, 0.8]} position={[0, 0.275, 0]} castShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </Box>
      <Box args={[0.7, 0.1, 0.7]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#15803d" roughness={1} />
      </Box>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pendant light over a table
// ─────────────────────────────────────────────────────────────────────────────
function PendantLight({ position }) {
  return (
    <group position={position}>
      <Box args={[0.02, 0.8, 0.02]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Box>
      <Sphere args={[0.08, 12, 12]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#fffbeb" emissive="#fffbeb" emissiveIntensity={5} />
      </Sphere>
      <pointLight position={[0, -0.1, 0]} intensity={1} color="#fff8e1" distance={4} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Manager HUD — wall-mounted screen, not a floating browser card
//
// Two problems in the original: (1) the panel floated in open air at z=0,
// disconnected from any wall or stand, which reads as an unfinished overlay
// rather than a fixture in the room; (2) its header dot used
// `animation: 'ping 1s infinite'` — `ping` is a Tailwind keyframe name, and
// with no Tailwind stylesheet loaded here no such @keyframes exists, so the
// "live" pulse silently did nothing.
//
// Fix: the HUD now sits in its own bezel (matte black + gold trim, matching
// the KDS screen and the dining room's dado-rail palette) mounted flush on
// the back wall, and a real @keyframes rule ships with the HTML content so
// the live-pulse dot actually animates.
// ─────────────────────────────────────────────────────────────────────────────
function ManagerHUD({ tableStatuses, completedBills }) {
  const totalRevenue = completedBills.reduce((s, b) => s + b.total, 0);

  return (
    <group position={[-4.55, 2.75, -4.3]}>
      {/* Elegant Curved Bezel — outer frame */}
      <RoundedBox args={[2.08, 2.8, 0.1]} radius={0.08} smoothness={4} position={[0, 0, -0.04]} castShadow receiveShadow>
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.2} />
      </RoundedBox>
      {/* Inner Screen Glass / Inset */}
      <RoundedBox args={[1.92, 2.64, 0.05]} radius={0.06} smoothness={4} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.15} metalness={0.8} />
      </RoundedBox>

      <Html
        transform
        center
        position={[-0.44, 0, 0.02]}
        scale={0.30}
        style={{ pointerEvents: 'none' }}
        occlude={false}
      >
        <style>{`
          @keyframes hudPing {
            0% { transform: scale(1); opacity: 0.7; }
            75%, 100% { transform: scale(2.4); opacity: 0; }
          }
        `}</style>
        <div style={{ fontFamily: 'system-ui, sans-serif', width: '245px', height: '341px', background: '#0b0f1a', borderRadius: '16px', overflow: 'hidden', userSelect: 'none', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Header */}
          <div style={{ padding: '12px 14px', background: 'linear-gradient(90deg,#7c2d12,#9a3412)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', width: '7px', height: '7px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', animation: 'hudPing 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80' }} />
              </div>
              <span style={{ color: '#fdf4e8', fontWeight: 800, fontSize: '11px', letterSpacing: '0.06em' }}>Manager Dashboard</span>
            </div>
            <span style={{ color: 'rgba(253,244,232,0.6)', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live</span>
          </div>

          {/* Table status */}
          <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Tables</div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              {tableStatuses.map((t, i) => {
                const meta = STAGE_META[t.stage];
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < tableStatuses.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <span style={{ color: '#e2e8f0', fontSize: '11px', fontWeight: 700 }}>Table {i + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: meta.color, background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.03em' }}>{meta.short}</span>
                      <span style={{ color: '#64748b', fontSize: '9px', minWidth: '34px', textAlign: 'right' }}>{t.total > 0 ? `₹${t.total}` : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bill log */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', minHeight: '80px' }}>
            <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Recent Bills</div>
            {completedBills.length === 0 ? (
              <div style={{ color: '#334155', fontSize: '10px', fontStyle: 'italic' }}>No bills yet…</div>
            ) : (
              [...completedBills].reverse().slice(0, 3).map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>T{b.tableNum} · {b.items} items</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>₹{b.total}</span>
                </div>
              ))
            )}
          </div>

          {/* Revenue total */}
          <div style={{ padding: '14px', background: 'rgba(74,222,128,0.08)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Session Revenue</span>
            <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '16px' }}>₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Autonomous table (self-running cycle)
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = [['#a855f7', '#ec4899'], ['#f97316', '#fbbf24'], ['#06b6d4', '#22c55e']];
const WAITER_COLORS = ['#38bdf8', '#f472b6', '#4ade80'];

// Named timings for the order lifecycle (ms) — previously inline magic
// numbers scattered through the setTimeout chain.
const TIMING = {
  ORDER_TAKEN: 3000,      // seated -> waiter takes the order
  KITCHEN_START: 2500,    // order sent -> waiter reaches the kitchen, cooking starts
  FOOD_READY: 4000,       // cooking -> food ready, waiter heads back to the table
  WAITER_RETURN: 2000,    // served -> waiter walks back to their idle spot
  DINING_DURATION: 4800,  // served -> guests finish eating -> bill requested
  REVENUE_POPUP: 2200,    // billed -> revenue sparkle clears, table resets
  CYCLE_MIN_GAP: 1500,    // minimum gap before the table seats a new party
  CYCLE_RANDOM_GAP: 2500, // extra random gap added on top of the minimum
};

function AutonomousTable({ position, idx, onStageChange, onBillComplete, delay }) {
  const [stage, setStage] = useState(S.WAIT);
  const [waiterPos, setWaiterPos] = useState([position[0] - 1.5, 0, position[2]]);
  const [isServed, setIsServed] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const orderRef = useRef([]);

  const KITCHEN_Z = -3.0;
  const IDLE_POS = [position[0] - 1.5, 0, position[2]];
  const TABLE_FRONT = [position[0], 0, position[2] + 1.0];
  const KITCHEN_POS = [position[0] * 0.5, 0, KITCHEN_Z];

  // `cooking` now travels with the stage change itself instead of being
  // dispatched as a separate follow-up call — previously COOK fired
  // onStageChange() twice (once for the stage, once for the cooking flag).
  const go = useCallback((stg, wPos, cooking = false) => {
    setStage(stg);
    if (wPos) setWaiterPos(wPos);
    const total = orderRef.current.reduce((s, i) => s + i.price, 0);
    onStageChange(idx, stg, total, cooking);
  }, [idx, onStageChange]);

  useEffect(() => {
    let t;
    const cycle = () => {
      orderRef.current = randomOrder();
      const total = orderRef.current.reduce((s, i) => s + i.price, 0);
      go(S.SEATED, IDLE_POS);

      // waiter walks to the table to take the order
      t = setTimeout(() => {
        go(S.ORDER, TABLE_FRONT);

        // waiter walks to the kitchen to place the KOT
        t = setTimeout(() => {
          go(S.COOK, KITCHEN_POS, true);

          // food is ready — waiter carries it back to the table
          t = setTimeout(() => {
            setIsServed(true);
            go(S.SERVED, TABLE_FRONT);

            // waiter returns to their idle spot
            t = setTimeout(() => setWaiterPos(IDLE_POS), TIMING.WAITER_RETURN);

            // guests finish eating, then ask for the bill
            t = setTimeout(() => {
              setShowRevenue(true);
              go(S.BILLED, IDLE_POS);
              onBillComplete({ tableNum: idx + 1, items: orderRef.current.length, total });

              t = setTimeout(() => {
                setShowRevenue(false);
                setIsServed(false);
                go(S.WAIT, IDLE_POS);
                t = setTimeout(cycle, TIMING.CYCLE_MIN_GAP + Math.random() * TIMING.CYCLE_RANDOM_GAP);
              }, TIMING.REVENUE_POPUP);
            }, TIMING.DINING_DURATION);
          }, TIMING.FOOD_READY);
        }, TIMING.KITCHEN_START);
      }, TIMING.ORDER_TAKEN);
    };

    t = setTimeout(cycle, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group>
      <DiningTable
        position={position}
        isOccupied={stage !== S.WAIT && stage !== S.BILLED}
        isServed={isServed}
        showRevenue={showRevenue}
        colors={COLORS[idx]}
      />
      <WaiterRobot targetPosition={waiterPos} bodyColor={WAITER_COLORS[idx]} />

      {/* Floating status sign above the table — reflects the table's actual
          lifecycle stage (Seated / Order Sent / Cooking / Served / Billing),
          not just a binary available/occupied flag. Same STAGE_META the
          Manager HUD reads, so the two never disagree. */}
      <group position={[position[0], 1.85, position[2]]}>
        {/* Sign backing board */}
        <Box args={[1.7, 0.34, 0.04]}>
          <meshStandardMaterial color={STAGE_META[stage].panel} roughness={0.5} />
        </Box>
        {/* Status text */}
        <Text
          position={[0, 0, 0.025]}
          fontSize={0.145}
          maxWidth={1.5}
          color={STAGE_META[stage].color}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {`● ${STAGE_META[stage].label}`}
        </Text>
      </group>

    </group>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// Main exported scene
// ─────────────────────────────────────────────────────────────────────────────
const TABLE_POSITIONS = [
  [3.0, 0, 2.5],   // Right front
  [-2.5, 0, 2.0],  // Left middle
  [0.5, 0, -1.5],  // Centre back
];

export default function Restaurant3DScene() {
  const [tableStatuses, setTableStatuses] = useState(
    TABLE_POSITIONS.map(() => ({ stage: S.WAIT, total: 0, cooking: false }))
  );
  const [completedBills, setCompletedBills] = useState([]);

  const handleStageChange = useCallback((idx, stage, total, cooking = false) => {
    setTableStatuses(prev => {
      const next = [...prev];
      next[idx] = { stage, total: total || prev[idx].total, cooking };
      return next;
    });
  }, []);

  const handleBillComplete = useCallback((bill) => {
    setCompletedBills(prev => [...prev, bill]);
  }, []);

  const activeKOTs = tableStatuses
    .map((t, i) => t.stage === S.COOK ? i : -1)
    .filter(i => i !== -1);

  return (
    <group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        minPolarAngle={Math.PI / 7}
        maxPolarAngle={Math.PI / 2.3}
        autoRotate
        autoRotateSpeed={0.35}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 10, 8]} intensity={1.8} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 3, -3]} intensity={1.8} color="#ea580c" distance={8} />
      <pointLight position={[4, 3, 3]} intensity={0.6} color="#bfdbfe" distance={6} />

      {/* Scene group */}
      <group position={[0, -1.6, -0.5]}>
        <Floor />
        <Walls />
        <KitchenPass cooking={activeKOTs.length > 0} />
        <KDSScreen activeKOTs={activeKOTs} />
        <ContactShadows position={[0, -0.03, 0]} opacity={0.6} scale={14} blur={2.5} far={3} />

        {/* Corner planters */}
        <Planter position={[4.5, 0, 3.8]} />
        <Planter position={[-4.5, 0, 3.8]} />

        {/* Pendant lights over each table */}
        {TABLE_POSITIONS.map(([x, , z], i) => (
          <PendantLight key={i} position={[x, 3.5, z]} />
        ))}

        {/* Manager HUD Panel */}
        <ManagerHUD tableStatuses={tableStatuses} completedBills={completedBills} />

        {/* Autonomous tables */}
        {TABLE_POSITIONS.map((pos, i) => (
          <AutonomousTable
            key={i}
            position={pos}
            idx={i}
            onStageChange={handleStageChange}
            onBillComplete={handleBillComplete}
            delay={i * 2200}
          />
        ))}
      </group>
    </group>
  );
}