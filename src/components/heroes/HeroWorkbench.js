import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// ---------------------------------------------------------------------------
// SPATIAL WORLD CONFIGURATION
// ---------------------------------------------------------------------------
const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 3000;

const spatialAssets = {
  heroSheet: {
    id: 'hero',
    x: 2000, y: 1500,
    width: 'auto', height: 'auto',
    rotation: 1, zIndex: 30,
  },
  blueprint: {
    id: 'blueprint',
    x: 1200, y: 1000,
    width: '350px', height: 'auto', aspectRatio: '3/4',
    rotation: 12, zIndex: 20,
  },
  digitalDesktop: {
    id: 'digital',
    x: 2900, y: 1000,
    width: '450px', height: 'auto', aspectRatio: '16/9',
    rotation: 6, zIndex: 10,
  },
  digitalMobile: {
    id: 'mobile',
    x: 2750, y: 1150,
    width: '160px', height: 'auto', aspectRatio: '9/16',
    rotation: -15, zIndex: 20,
  },
  business: {
    id: 'business',
    x: 2900, y: 2200,
    width: '400px', height: 'auto',
    rotation: -12, zIndex: 20,
  },
  automation: {
    id: 'automation',
    x: 1100, y: 2100,
    width: '400px', height: '300px',
    rotation: -8, zIndex: 10,
  },
  industriesCluster: {
    id: 'industries',
    x: 3600, y: 1500,
    width: '400px', height: '350px',
    rotation: 18, zIndex: 10,
  },
  toolsPencil: {
    id: 'pencil',
    x: 1700, y: 1250,
    width: '250px', height: '10px',
    rotation: -55, zIndex: 40,
  },
  toolsRuler: {
    id: 'ruler',
    x: 2200, y: 2000,
    width: '300px', height: '30px',
    rotation: 15, zIndex: 30,
  }
};

const cameraStops = [
  { targetId: 'hero', zoom: 0.8 },          // 0: Start at center overview
  { targetId: 'blueprint', zoom: 1.4 },      // 1: Move up-left to blueprint
  { targetId: 'pencil', zoom: 1.7 },         // 2: Move right to pencil
  { targetId: 'automation', zoom: 1.3 },     // 3: Move down-left to automation
  { targetId: 'business', zoom: 1.2 },       // 4: Move right to physical infrastructure
  { targetId: 'digital', zoom: 1.4 },        // 5: Move up to digital product
  { targetId: 'industries', zoom: 1.1 }      // 6: End at industries
];

// Helper to get absolute positioning style
const getAssetStyle = (assetKey) => {
  const asset = spatialAssets[assetKey];
  return {
    position: 'absolute',
    left: `${asset.x}px`,
    top: `${asset.y}px`,
    width: asset.width,
    height: asset.height,
    zIndex: asset.zIndex,
    transform: `translate(-50%, -50%) rotate(${asset.rotation}deg)`
  };
};

// Sub-component to safely use hooks per-card
function IndustryCard({ ind, i, industrySpread }) {
  const spreadX = useTransform(industrySpread, [0, 40], [0, (i % 3 - 1) * 60]);
  const spreadY = useTransform(industrySpread, [0, 40], [0, (Math.floor(i / 3) - 1) * 80]);
  const spreadRotate = useTransform(industrySpread, [0, 40], [(i * 3) - 10, (i * 10) - 40]);

  return (
    <motion.div 
      style={{ x: spreadX, y: spreadY, rotate: spreadRotate }}
      className="absolute w-[100px] h-[130px] bg-[#FAF3E6] shadow-lg border border-[#15121C]/10 flex flex-col p-1 hover:z-50 transition-all duration-300"
    >
      <div className="w-full flex-1 bg-white border-b border-[#15121C]/10 flex items-center justify-center p-1">
        <div className="w-full h-full border border-dashed border-gray-300 text-[6px] text-center flex items-center justify-center text-gray-400">
          {ind} ASSET
        </div>
      </div>
      <div className="p-1 text-[6px] font-bold text-center mt-1">{ind}</div>
    </motion.div>
  );
}

export default function HeroWorkbench() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ---------------------------------------------------------------------------
  // CAMERA CHOREOGRAPHY
  // ---------------------------------------------------------------------------
  const progressInput = [];
  const xOutput = [];
  const yOutput = [];
  const scaleOutput = [];

  cameraStops.forEach((stop, i) => {
    const asset = Object.values(spatialAssets).find(a => a.id === stop.targetId) || spatialAssets.heroSheet;
    
    // Calculate progress (e.g. 7 stops = 0, 0.16, 0.33, 0.5, 0.66, 0.83, 1)
    const progress = i / (cameraStops.length - 1);

    if (i > 0) {
      // Inject midpoint for cinematic travel
      const prevStop = cameraStops[i - 1];
      const prevAsset = Object.values(spatialAssets).find(a => a.id === prevStop.targetId) || spatialAssets.heroSheet;
      
      const midProgress = progress - (1 / (cameraStops.length - 1)) * 0.5;
      const midX = (prevAsset.x + asset.x) / 2;
      const midY = (prevAsset.y + asset.y) / 2;
      
      // Zoom out by 20% relative to the smaller of the two zooms
      const midZoom = Math.min(prevStop.zoom, stop.zoom) * 0.8;

      progressInput.push(midProgress);
      scaleOutput.push(midZoom);
      xOutput.push((WORLD_WIDTH / 2 - midX) * midZoom);
      yOutput.push((WORLD_HEIGHT / 2 - midY) * midZoom);
    }

    progressInput.push(progress);
    scaleOutput.push(stop.zoom);
    xOutput.push((WORLD_WIDTH / 2 - asset.x) * stop.zoom);
    yOutput.push((WORLD_HEIGHT / 2 - asset.y) * stop.zoom);
  });

  const rawCameraX = useTransform(scrollYProgress, progressInput, xOutput);
  const rawCameraY = useTransform(scrollYProgress, progressInput, yOutput);
  const rawCameraScale = useTransform(scrollYProgress, progressInput, scaleOutput);

  // Apply a subtle spring to smooth out scroll wheel jitter
  const springConfig = { damping: 40, stiffness: 100, mass: 0.8 };
  const cameraX = useSpring(rawCameraX, springConfig);
  const cameraY = useSpring(rawCameraY, springConfig);
  const cameraScale = useSpring(rawCameraScale, springConfig);

  // Subtle 2.5D tilt - starts steep, levels out slightly
  const cameraRotateX = useTransform(scrollYProgress, [0, 1], [35, 10]);
  const cameraRotateZ = useTransform(scrollYProgress, [0, 1], [-5, -2]);

  // Industry Spread Animation (activates during the last 15% of scroll)
  const industrySpread = useTransform(scrollYProgress, [0.85, 1], [0, 40]);

  // Handle responsive base scale
  const [baseScale, setBaseScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setBaseScale(0.4);
      else if (window.innerWidth < 1024) setBaseScale(0.7);
      else setBaseScale(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const combinedScale = useTransform(cameraScale, s => s * baseScale);

  return (
    <section ref={containerRef} className="h-[1000vh] relative bg-[#EBE7E0] cursor-crosshair font-mono">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden [perspective:2000px]">
        
        {/* THE WORLD CANVAS */}
        <motion.div 
          style={{ 
            width: WORLD_WIDTH, 
            height: WORLD_HEIGHT,
            scale: combinedScale, 
            x: cameraX, 
            y: cameraY, 
            rotateX: cameraRotateX, 
            rotateZ: cameraRotateZ,
            transformOrigin: '50% 50%'
          }}
          className="absolute flex items-center justify-center transform-style-3d shadow-[inset_0_0_300px_rgba(0,0,0,0.05)] bg-[#F5F3EE]"
        >
          {/* Subtle Grid Texture (acts as the desk surface) */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'linear-gradient(#15121C 2px, transparent 2px), linear-gradient(90deg, #15121C 2px, transparent 2px)', 
            backgroundSize: '100px 100px'
          }} />

          {/* 1. HERO SHEET */}
          <div style={getAssetStyle('heroSheet')} className="bg-[#FAF3E6] shadow-2xl flex flex-col items-center justify-center p-16 md:p-32">
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#15121C] opacity-30" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#15121C] opacity-30" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#15121C] opacity-30" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#15121C] opacity-30" />
            
            <div className="absolute top-6 left-6 text-[10px] tracking-widest text-[#15121C] opacity-50 font-bold border border-[#15121C]/20 px-2 py-1">
              DWD / SYSTEM 01
            </div>

            <h1 className="text-[7vw] font-black uppercase tracking-tighter leading-none text-[#15121C] font-sans">BUSINESS</h1>
            <h1 className="text-[7vw] font-black uppercase tracking-tighter leading-none text-transparent font-sans" style={{ WebkitTextStroke: '2px #15121C' }}>EXPERIENCE</h1>
            <h1 className="text-[7vw] font-black uppercase tracking-tighter leading-none text-[#E8A33D] font-sans">ENGINEERS</h1>
          </div>

          {/* 2. BLUEPRINT ARTIFACT */}
          <div style={{ ...getAssetStyle('blueprint'), aspectRatio: spatialAssets.blueprint.aspectRatio }} className="bg-[#F5F3EE] border border-[#15121C]/30 shadow-xl p-6 flex flex-col justify-between">
            <div className="font-bold text-[10px] border-b border-[#15121C] pb-2 text-[#15121C]">ENGINEERING BLUEPRINT / 01</div>
            <div className="flex-1 border border-dashed border-[#15121C]/30 my-4 flex flex-col items-center justify-evenly text-[10px] text-[#15121C] font-mono tracking-widest relative">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#2B3A67 1px, transparent 1px), linear-gradient(90deg, #2B3A67 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">CUSTOMER</div>
              <div className="w-[1px] h-4 bg-[#15121C]" />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">OPERATIONS</div>
              <div className="w-[1px] h-4 bg-[#15121C]" />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">DATA</div>
              <div className="w-[1px] h-4 bg-[#15121C]" />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">SYSTEM</div>
              <div className="w-[1px] h-4 bg-[#15121C]" />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">AUTOMATION</div>
              <div className="w-[1px] h-4 bg-[#15121C]" />
              <div className="bg-white/80 px-2 py-1 z-10 border border-[#15121C]">AI</div>
            </div>
            <div className="text-[8px] text-[#15121C]/50 flex justify-between">
              <span>COORD: 32.44, 91.02</span>
              <span>SCALE: 1:100</span>
            </div>
          </div>

          {/* 3. BUSINESS ARTIFACT (HOSPITAL) */}
          <div style={getAssetStyle('business')} className="shadow-2xl bg-white p-6 border border-gray-100">
            <div className="w-full h-[250px] relative">
              <img src="/assets/projects/city-hospital-building/hospital_transparent.png" alt="" className="w-full h-full object-contain drop-shadow-xl" 
                   onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div className="hidden absolute inset-0 bg-[#F5F3EE] border border-dashed border-[#15121C]/30 items-center justify-center text-xs text-[#15121C]/50 text-center">
                ASSET NEEDED:<br/>HOSPITAL MODEL
              </div>
            </div>
            <div className="text-[10px] mt-4 uppercase font-bold text-[#15121C] border-t border-[#15121C]/20 pt-2 flex justify-between">
              <span>SECTOR / 01</span>
              <span>PHYSICAL INFRASTRUCTURE</span>
            </div>
          </div>

          {/* 4. DIGITAL / SOFTWARE ARTIFACT */}
          <div style={{ ...getAssetStyle('digitalDesktop'), aspectRatio: spatialAssets.digitalDesktop.aspectRatio }} className="bg-[#FAF3E6] shadow-xl border border-[#15121C]/10 p-2 relative">
            <div className="w-full h-full border border-dashed border-[#15121C]/30 flex flex-col items-center justify-center text-[#15121C]/50 text-[10px] text-center p-4">
              <span className="font-bold mb-2 text-xs">ASSET NEEDED: DESKTOP UI</span>
              <span>Sunrise Connect Dashboard Printout<br/>(Metrics, charts, fee tracking)</span>
            </div>
            <img src="/assets/workbench/desktop_ui.jpg" alt="Desktop UI" className="absolute top-2 left-2 right-2 bottom-2 object-cover z-10 mix-blend-multiply opacity-90" />
          </div>
          
          <div style={{ ...getAssetStyle('digitalMobile'), aspectRatio: spatialAssets.digitalMobile.aspectRatio }} className="bg-white shadow-2xl border border-gray-200 rounded-[24px] p-2 relative">
            <div className="w-full h-full border border-dashed border-gray-300 rounded-[16px] flex flex-col items-center justify-center text-gray-400 text-[9px] text-center p-2">
               <span className="font-bold mb-1">ASSET NEEDED:<br/>MOBILE UI</span>
               <span>Sunrise Connect App</span>
            </div>
            <img src="/assets/workbench/mobile_ui.jpg" alt="Mobile UI" className="absolute top-2 left-2 right-2 bottom-2 rounded-[16px] object-cover z-10 mix-blend-multiply opacity-90" />
          </div>

          {/* 5. AUTOMATION DIAGRAM */}
          <div style={getAssetStyle('automation')} className="bg-[#F5F3EE] shadow-lg border border-[#15121C]/10 p-6 flex flex-col">
             <div className="text-[10px] font-bold text-[#15121C] mb-4">SYSTEM / 02: AUTOMATION FLOW</div>
             <div className="flex-1 relative border border-dashed border-[#15121C]/20 p-4">
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <path d="M 20 20 L 100 20 L 100 80 L 180 80 L 180 140 L 260 140" fill="none" stroke="#E8A33D" strokeWidth="2" strokeDasharray="4 4" />
               </svg>
               <div className="absolute top-2 left-2 text-[8px] bg-white border border-[#15121C] px-1 py-0.5 z-10 shadow-sm">LEAD</div>
               <div className="absolute top-2 left-[90px] text-[8px] bg-white border border-[#15121C] px-1 py-0.5 z-10 shadow-sm">VALIDATE</div>
               <div className="absolute top-[75px] left-[90px] text-[8px] bg-white border border-[#15121C] px-1 py-0.5 z-10 shadow-sm">CRM</div>
               <div className="absolute top-[75px] left-[170px] text-[8px] bg-white border border-[#15121C] px-1 py-0.5 z-10 shadow-sm">WHATSAPP</div>
               <div className="absolute top-[135px] left-[170px] text-[8px] bg-white border border-[#15121C] px-1 py-0.5 z-10 shadow-sm">FOLLOW-UP</div>
             </div>
          </div>

          {/* 6. WORKBENCH TOOLS (Scattered) */}
          <div style={getAssetStyle('toolsPencil')} className="bg-[#E8A33D] shadow-md border border-[#15121C]/20 flex items-center justify-center relative">
             <span className="text-[6px] text-black/50 tracking-widest font-bold">ASSET NEEDED: YELLOW PENCIL</span>
             <img src="/assets/workbench/pencil.jpg" alt="Yellow Pencil" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] max-w-none h-auto z-10 drop-shadow-md pointer-events-none mix-blend-multiply opacity-90" />
          </div>
          
          <div style={getAssetStyle('toolsRuler')} className="bg-gray-200/90 backdrop-blur-sm shadow-sm border border-white flex items-center pl-4 relative">
             <span className="text-[6px] text-gray-500 tracking-widest font-bold">ASSET NEEDED: METAL RULER</span>
             <div className="absolute bottom-0 left-0 w-full h-[2px] flex justify-between px-2">
               {[...Array(20)].map((_, i) => <div key={i} className="h-full w-[1px] bg-black/20" />)}
             </div>
             <img src="/assets/workbench/ruler.jpg" alt="Metal Ruler" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] max-w-none h-auto z-10 drop-shadow-md pointer-events-none mix-blend-multiply opacity-90" />
          </div>

          {/* 7. INDUSTRY CONTACT SHEETS */}
          <div style={getAssetStyle('industriesCluster')} className="flex items-center justify-center relative">
            <div className="absolute -top-10 left-10 text-[10px] font-bold border-b border-[#15121C]/30 pb-1">INDUSTRY MATRICES</div>
             {['HOSPITAL', 'FACTORY', 'JEWELLER', 'HOTEL', 'SCHOOL', 'CAFE', 'CAR DETAILING', 'ENTERPRISE'].map((ind, i) => (
               <IndustryCard key={i} ind={ind} i={i} industrySpread={industrySpread} />
             ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
