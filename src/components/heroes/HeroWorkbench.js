import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ---------------------------------------------------------------------------
// ASSET SLOTS CONFIGURATION
// ---------------------------------------------------------------------------
const workbenchAssets = {
  heroSheet: {
    stage: '02_HERO',
    position: 'absolute z-30 flex flex-col items-center justify-center p-16 md:p-32',
    transform: 'rotate-[1deg]',
    width: 'auto',
    height: 'auto',
    weight: 'Dominant'
  },
  blueprint: {
    stage: '03_BLUEPRINT',
    position: 'absolute top-[25%] left-[20%] z-20',
    transform: 'rotate-[12deg]',
    width: '350px',
    aspectRatio: '3/4',
    weight: 'Secondary (Engineering Thinking)'
  },
  business: {
    stage: '04_BUSINESS',
    position: 'absolute bottom-[25%] right-[22%] z-20',
    transform: 'rotate-[-12deg]',
    width: '400px',
    aspectRatio: 'auto',
    weight: 'Secondary (Real World)'
  },
  digitalDesktop: {
    stage: '05_DIGITAL',
    position: 'absolute top-[20%] right-[15%] z-10',
    transform: 'rotate-[6deg]',
    width: '450px',
    aspectRatio: '16/9',
    weight: 'Secondary (Product)'
  },
  digitalMobile: {
    stage: '05_DIGITAL',
    position: 'absolute -bottom-16 -left-16 z-20',
    transform: 'rotate-[-15deg]',
    width: '160px',
    aspectRatio: '9/16',
    weight: 'Secondary (Product Detail)'
  },
  automation: {
    stage: '06_AUTOMATION',
    position: 'absolute bottom-[20%] left-[15%] z-10',
    transform: 'rotate-[-8deg]',
    width: '400px',
    height: '300px',
    weight: 'Secondary (Systems)'
  },
  industriesCluster: {
    stage: '07_INDUSTRIES',
    position: 'absolute top-[45%] right-[5%] z-10',
    transform: 'rotate-[18deg]',
    width: '400px',
    height: '350px',
    weight: 'Transition'
  },
  toolsPencil: {
    stage: 'ALL',
    position: 'absolute top-[42%] left-[18%] z-40',
    transform: 'rotate-[-55deg]',
    width: '250px',
    height: '10px'
  },
  toolsRuler: {
    stage: 'ALL',
    position: 'absolute bottom-[35%] right-[40%] z-30',
    transform: 'rotate-[15deg]',
    width: '300px',
    height: '30px'
  }
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
    offset: ["start start", "end start"]
  });

  // ---------------------------------------------------------------------------
  // CAMERA CHOREOGRAPHY (FROZEN)
  // ---------------------------------------------------------------------------
  const cameraScale = useTransform(scrollYProgress, 
    [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1], 
    [0.7, 0.7, 1.8, 2.2, 2.2, 2.2, 2.2, 2.2]
  );

  const cameraX = useTransform(scrollYProgress,
    [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    ["0%", "0%", "0%", "20%", "-25%", "25%", "-15%", "0%"]
  );

  const cameraY = useTransform(scrollYProgress,
    [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    ["0%", "0%", "15%", "-15%", "25%", "35%", "-25%", "0%"]
  );

  const cameraRotateX = useTransform(scrollYProgress, [0, 1], [35, 10]);
  const cameraRotateZ = useTransform(scrollYProgress, [0, 1], [-15, -5]);

  // Industry Spread Animation (activates during stage 7: 0.85 - 1.0)
  const industrySpread = useTransform(scrollYProgress, [0.85, 1], [0, 40]);

  return (
    <section ref={containerRef} className="h-[800vh] relative bg-[#EBE7E0] cursor-crosshair font-mono">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden [perspective:2000px]">
        
        <motion.div 
          style={{ scale: cameraScale, x: cameraX, y: cameraY, rotateX: cameraRotateX, rotateZ: cameraRotateZ }}
          className="relative w-[250vw] h-[250vh] flex items-center justify-center origin-center transform-style-3d shadow-[inset_0_0_300px_rgba(0,0,0,0.05)] bg-[#F5F3EE]"
        >
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'linear-gradient(#15121C 1px, transparent 1px), linear-gradient(90deg, #15121C 1px, transparent 1px)', 
            backgroundSize: '50px 50px'
          }} />

          {/* 1. HERO SHEET */}
          <div className={`${workbenchAssets.heroSheet.position} ${workbenchAssets.heroSheet.transform} bg-[#FAF3E6] shadow-2xl`}>
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
          <div className={`${workbenchAssets.blueprint.position} ${workbenchAssets.blueprint.transform} w-[${workbenchAssets.blueprint.width}] aspect-[${workbenchAssets.blueprint.aspectRatio}] bg-[#F5F3EE] border border-[#15121C]/30 shadow-xl p-6 flex flex-col justify-between`}>
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

          {/* 3. BUSINESS ARTIFACT */}
          <div className={`${workbenchAssets.business.position} ${workbenchAssets.business.transform} w-[${workbenchAssets.business.width}] shadow-2xl bg-white p-6 border border-gray-100`}>
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
          <div className={`${workbenchAssets.digitalDesktop.position} ${workbenchAssets.digitalDesktop.transform}`}>
            {/* Desktop Dashboard Placeholder */}
            <div className={`w-[${workbenchAssets.digitalDesktop.width}] aspect-[${workbenchAssets.digitalDesktop.aspectRatio}] bg-[#FAF3E6] shadow-xl border border-[#15121C]/10 p-2`}>
              <div className="w-full h-full border border-dashed border-[#15121C]/30 flex flex-col items-center justify-center text-[#15121C]/50 text-[10px] text-center p-4">
                <span className="font-bold mb-2 text-xs">ASSET NEEDED: DESKTOP UI</span>
                <span>Sunrise Connect Dashboard Printout<br/>(Metrics, charts, fee tracking)</span>
              </div>
            </div>
            {/* Mobile UI Placeholder */}
            <div className={`${workbenchAssets.digitalMobile.position} ${workbenchAssets.digitalMobile.transform} w-[${workbenchAssets.digitalMobile.width}] aspect-[${workbenchAssets.digitalMobile.aspectRatio}] bg-white shadow-2xl border border-gray-200 rounded-[24px] p-2`}>
              <div className="w-full h-full border border-dashed border-gray-300 rounded-[16px] flex flex-col items-center justify-center text-gray-400 text-[9px] text-center p-2">
                 <span className="font-bold mb-1">ASSET NEEDED:<br/>MOBILE UI</span>
                 <span>Sunrise Connect App</span>
              </div>
            </div>
          </div>

          {/* 5. AUTOMATION DIAGRAM */}
          <div className={`${workbenchAssets.automation.position} ${workbenchAssets.automation.transform} w-[${workbenchAssets.automation.width}] h-[${workbenchAssets.automation.height}] bg-[#F5F3EE] shadow-lg border border-[#15121C]/10 p-6 flex flex-col`}>
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
          <div className={`${workbenchAssets.toolsPencil.position} ${workbenchAssets.toolsPencil.transform} w-[${workbenchAssets.toolsPencil.width}] h-[${workbenchAssets.toolsPencil.height}] bg-[#E8A33D] shadow-md border border-[#15121C]/20 flex items-center justify-center`}>
             <span className="text-[6px] text-black/50 tracking-widest font-bold">ASSET NEEDED: YELLOW PENCIL</span>
          </div>
          <div className={`${workbenchAssets.toolsRuler.position} ${workbenchAssets.toolsRuler.transform} w-[${workbenchAssets.toolsRuler.width}] h-[${workbenchAssets.toolsRuler.height}] bg-gray-200/90 backdrop-blur-sm shadow-sm border border-white flex items-center pl-4`}>
             <span className="text-[6px] text-gray-500 tracking-widest font-bold">ASSET NEEDED: METAL RULER</span>
             <div className="absolute bottom-0 left-0 w-full h-[2px] flex justify-between px-2">
               {[...Array(20)].map((_, i) => <div key={i} className="h-full w-[1px] bg-black/20" />)}
             </div>
          </div>

          {/* 7. INDUSTRY CONTACT SHEETS */}
          <div className={`${workbenchAssets.industriesCluster.position} ${workbenchAssets.industriesCluster.transform} w-[${workbenchAssets.industriesCluster.width}] h-[${workbenchAssets.industriesCluster.height}] flex items-center justify-center relative`}>
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
