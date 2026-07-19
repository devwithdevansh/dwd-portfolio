import React, { useRef, useMemo } from 'react';
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
  varying vec2 vUv;

  // Classic Simplex 2D noise by Stefan Gustavson
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

    // Distort UVs based on scroll velocity for the WOW factor
    vec2 distortedUv = st;
    distortedUv.y += uScrollVelocity * 0.001 * snoise(st * 10.0 + uTime);
    distortedUv.x += uScrollVelocity * 0.0005 * snoise(st * 5.0 - uTime);

    // Create a fluid/blob effect using noise
    float noiseValue = snoise(vec2(distortedUv.x * 2.0, distortedUv.y * 2.0 - uTime * 0.15));
    float noiseValue2 = snoise(vec2(distortedUv.x * 4.0 + uTime * 0.1, distortedUv.y * 4.0));
    
    float combinedNoise = (noiseValue + noiseValue2) * 0.5;
    
    // Brutalist colors (Dark Charcoal, Deep Blue/Purple hints)
    vec3 color1 = vec3(0.02, 0.02, 0.02); // Almost black
    vec3 color2 = vec3(0.1, 0.1, 0.2); // Dark slate blue
    vec3 color3 = vec3(0.15, 0.05, 0.25); // Deep purple
    vec3 color4 = vec3(0.3, 0.3, 0.3); // Gray accent for grit

    vec3 finalColor = mix(color1, color2, smoothstep(-1.0, 1.0, combinedNoise));
    finalColor = mix(finalColor, color3, smoothstep(0.2, 0.8, snoise(distortedUv * 1.5 + uTime * 0.05)));
    
    // Add fake film grain for brutality
    float grain = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    finalColor -= grain * 0.05;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create the custom material
const BrutalistMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uScrollVelocity: 0,
  },
  vertexShader,
  fragmentShader
);

// Register it with R3F
extend({ BrutalistMaterial });

function ShaderPlane() {
  const materialRef = useRef();
  
  // Track scroll velocity for distortion
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const velocity = useRef(0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uResolution.set(state.size.width, state.size.height);

      // Calculate simple velocity
      const currentScroll = scrollY.get();
      const deltaScroll = currentScroll - lastScrollY.current;
      
      // Smoothly interpolate velocity
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

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
