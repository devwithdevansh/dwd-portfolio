import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { useScroll } from 'framer-motion';

// --- GLSL Shaders ---
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScrollVelocity;
  
  // Theme Colors
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    vec2 distortedUv = st;
    distortedUv.y += uScrollVelocity * 0.001 * snoise(st * 10.0 + uTime);
    distortedUv.x += uScrollVelocity * 0.0005 * snoise(st * 5.0 - uTime);

    float noiseValue = snoise(vec2(distortedUv.x * 2.0, distortedUv.y * 2.0 - uTime * 0.15));
    float noiseValue2 = snoise(vec2(distortedUv.x * 4.0 + uTime * 0.1, distortedUv.y * 4.0));
    
    float combinedNoise = (noiseValue + noiseValue2) * 0.5;
    
    vec3 finalColor = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, combinedNoise));
    finalColor = mix(finalColor, uColor3, smoothstep(0.2, 0.8, snoise(distortedUv * 1.5 + uTime * 0.05)));
    
    float grain = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    finalColor -= grain * 0.05;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const BrutalistMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uScrollVelocity: 0,
    uColor1: new THREE.Color('#050505'),
    uColor2: new THREE.Color('#1a1a3a'),
    uColor3: new THREE.Color('#260d40'),
  },
  vertexShader,
  fragmentShader
);

extend({ BrutalistMaterial });

function ShaderPlane({ theme }) {
  const materialRef = useRef();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const velocity = useRef(0);

  // Set colors based on theme
  useEffect(() => {
    if (!materialRef.current) return;
    
    let c1, c2, c3;
    switch (theme) {
      case 'luxury': // Jewelers (Gold / Amber)
        c1 = '#1a1200';
        c2 = '#4a3500';
        c3 = '#8a6500';
        break;
      case 'clinical': // Hospitals (Deep Ocean / Teal)
        c1 = '#001a1f';
        c2 = '#004a5c';
        c3 = '#007a99';
        break;
      case 'structured': // Schools (Navy / Emerald)
        c1 = '#001122';
        c2 = '#003366';
        c3 = '#006644';
        break;
      default: // Default Agency (Dark Charcoal / Purple)
        c1 = '#050505';
        c2 = '#1a1a3a';
        c3 = '#260d40';
        break;
    }
    
    // Animate color transition using GSAP or just hard set for now
    materialRef.current.uColor1.set(c1);
    materialRef.current.uColor2.set(c2);
    materialRef.current.uColor3.set(c3);
  }, [theme]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uResolution.set(state.size.width, state.size.height);

      const currentScroll = scrollY.get();
      const deltaScroll = currentScroll - lastScrollY.current;
      velocity.current = THREE.MathUtils.lerp(velocity.current, deltaScroll * 10, 0.1);
      materialRef.current.uScrollVelocity = velocity.current;
      lastScrollY.current = currentScroll;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <brutalistMaterial ref={materialRef} />
    </mesh>
  );
}

export default function ShaderBackground({ theme = 'default' }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ShaderPlane theme={theme} />
      </Canvas>
    </div>
  );
}
