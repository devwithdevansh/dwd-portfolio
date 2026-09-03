import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Music, Volume2, Sun, Moon } from 'lucide-react';

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const TRACKS = [
  { name: "Lofi Study", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" },
  { name: "Chill Vibes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "Empty Mind", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
];

const FLOWER_COLORS = ['#ff6b8a', '#ffa07a', '#ffe066', '#c9b1ff', '#87ceeb', '#ffb6c1', '#da77f2'];
const STARS = Array.from({ length: 35 }, (_, i) => ({
  top: `${(i * 17.3 + 5) % 50}%`, left: `${(i * 23.7 + 3) % 100}%`,
  size: ((i * 7) % 3) + 1, dur: 3 + ((i * 11) % 3), delay: (i * 0.4) % 4
}));
const MAX_FLOWERS = 25;

/* ═══════════════════════════════════════════
   FLOWER — grows where you click the grass
   ═══════════════════════════════════════════ */
const Flower = ({ x, type, isDark }) => {
  const color = FLOWER_COLORS[type % FLOWER_COLORS.length];
  const stemH = 14 + (type % 3) * 5;

  return (
    <motion.div
      initial={{ scale: 0, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.8 }}
      className="absolute bottom-0"
      style={{ left: `${x}%`, transformOrigin: 'bottom center' }}
    >
      {/* Planting ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-400/40"
      />
      <motion.div
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 2.5 + (type % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 44" className="w-4 md:w-5 h-auto">
          <line x1="12" y1={44 - stemH} x2="12" y2="44" stroke={isDark ? '#34d399' : '#4ade80'} strokeWidth="1.5" />
          <ellipse cx="16" cy={44 - stemH / 2} rx="4" ry="2" fill={isDark ? '#34d399' : '#4ade80'}
            transform={`rotate(-30, 16, ${44 - stemH / 2})`} />
          {type % 3 === 0 ? (
            /* Tulip */
            <>
              <ellipse cx="12" cy={44 - stemH - 5} rx="5" ry="8" fill={color} />
              <ellipse cx="12" cy={44 - stemH - 7} rx="3" ry="4" fill="white" opacity="0.2" />
            </>
          ) : type % 3 === 1 ? (
            /* Daisy */
            <>
              {[0, 60, 120, 180, 240, 300].map(a => (
                <ellipse key={a} cx="12" cy={44 - stemH - 7} rx="2.5" ry="5" fill={color}
                  transform={`rotate(${a}, 12, ${44 - stemH - 3})`} />
              ))}
              <circle cx="12" cy={44 - stemH - 3} r="2.5" fill="#fde68a" />
            </>
          ) : (
            /* Round bloom */
            <>
              <circle cx="12" cy={44 - stemH - 4} r="5" fill={color} />
              <circle cx="12" cy={44 - stemH - 4} r="2.5" fill="white" opacity="0.25" />
            </>
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   BIRD — spawns when you click the sky
   ═══════════════════════════════════════════ */
const Bird = ({ startX, flyRight, y, duration, isDark, onDone }) => (
  <motion.div
    initial={{ left: `${startX}%`, opacity: 0 }}
    animate={{ left: flyRight ? '110%' : '-10%', opacity: [0, 1, 1, 1, 0] }}
    transition={{ duration, ease: "linear" }}
    onAnimationComplete={onDone}
    className="absolute pointer-events-none"
    style={{ top: `${y}%` }}
  >
    <motion.svg viewBox="0 0 20 10" className="w-4 md:w-5"
      style={{ transform: flyRight ? 'scaleX(1)' : 'scaleX(-1)' }}
      animate={{ scaleY: [1, 0.5, 1] }}
      transition={{ duration: 0.35, repeat: Infinity }}
    >
      <path d="M 0 5 Q 5 0 10 5 Q 15 0 20 5"
        stroke={isDark ? '#94a3b8' : '#475569'} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </motion.svg>
  </motion.div>
);

/* ═══════════════════════════════════════════
   CAT — sleeps, wakes when you hover billboard
   ═══════════════════════════════════════════ */
const Cat = ({ isDark, isAwake, isPlaying }) => {
  const body = isDark ? "#1a1d23" : "#2c2f33";
  const inner = isDark ? "#252830" : "#3c3f43";

  return (
    <div className="absolute bottom-[calc(100%-3px)] left-[12%] z-20 pointer-events-none">
      <motion.div animate={{ y: [0, 1.5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <svg viewBox="0 0 140 62" className="w-[88px] md:w-[105px] h-auto overflow-visible"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
          {/* Body */}
          <ellipse cx="55" cy="50" rx="35" ry="13" fill={body} />
          {/* Head group — lifts when awake */}
          <motion.g animate={{ y: isAwake ? -4 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
            <circle cx="28" cy="38" r="15" fill={body} />
            {/* Ears */}
            <polygon points="16,28 11,10 28,24" fill={body} />
            <polygon points="18,26 14,14 26,24" fill={inner} />
            <polygon points="32,24 38,8 44,26" fill={body} />
            <polygon points="34,24 38,12 42,26" fill={inner} />
            {/* Eyes */}
            <AnimatePresence mode="wait">
              {isAwake ? (
                <motion.g key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <circle cx="21" cy="37" r="3.5" fill={isDark ? '#1e293b' : '#e2e2e2'} />
                  <circle cx="35" cy="37" r="3.5" fill={isDark ? '#1e293b' : '#e2e2e2'} />
                  <motion.circle cx="21" cy="37" r="1.8" fill={isDark ? '#818cf8' : '#333'}
                    animate={{ cx: [20, 22.5, 20] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.circle cx="35" cy="37" r="1.8" fill={isDark ? '#818cf8' : '#333'}
                    animate={{ cx: [34, 36.5, 34] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                  {/* Highlights */}
                  <circle cx="20" cy="36" r="0.7" fill="white" opacity="0.7" />
                  <circle cx="34" cy="36" r="0.7" fill="white" opacity="0.7" />
                </motion.g>
              ) : (
                <motion.g key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <path d="M 18 37 Q 21 35 24 37" stroke={isDark ? '#555' : '#888'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M 32 37 Q 35 35 38 37" stroke={isDark ? '#555' : '#888'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </motion.g>
              )}
            </AnimatePresence>
            {/* Nose & Whiskers */}
            <ellipse cx="28" cy="42" rx="2" ry="1.2" fill={isDark ? '#444' : '#666'} />
            <line x1="8" y1="40" x2="21" y2="41" stroke={isDark ? '#444' : '#777'} strokeWidth="0.5" />
            <line x1="8" y1="43" x2="21" y2="43" stroke={isDark ? '#444' : '#777'} strokeWidth="0.5" />
            <line x1="35" y1="41" x2="48" y2="40" stroke={isDark ? '#444' : '#777'} strokeWidth="0.5" />
            <line x1="35" y1="43" x2="48" y2="43" stroke={isDark ? '#444' : '#777'} strokeWidth="0.5" />
          </motion.g>
          {/* Paws */}
          <ellipse cx="30" cy="60" rx="6" ry="3" fill={body} />
          <ellipse cx="44" cy="60" rx="6" ry="3" fill={body} />
          {/* Tail */}
          <motion.path
            stroke={body} strokeWidth="7" fill="none" strokeLinecap="round"
            animate={{
              d: isAwake
                ? ["M 88 47 Q 118 38 116 18", "M 88 47 Q 122 32 108 10", "M 88 47 Q 118 38 116 18"]
                : ["M 88 47 Q 115 42 118 22", "M 88 47 Q 118 44 114 20", "M 88 47 Q 115 42 118 22"]
            }}
            transition={{ duration: isAwake ? 1.2 : 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Zzz when sleeping */}
      <AnimatePresence>
        {!isAwake && (
          <motion.div key="zzz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.span animate={{ opacity: [0, 0.6, 0], y: [-2, -20], x: [0, 8] }}
              transition={{ duration: 3, repeat: Infinity }}
              className={`absolute top-1 left-5 font-bold text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>z</motion.span>
            <motion.span animate={{ opacity: [0, 0.6, 0], y: [-2, -26], x: [0, 14] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className={`absolute -top-1 left-9 font-bold text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Z</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart when awake + music playing */}
      <AnimatePresence>
        {isAwake && isPlaying && (
          <motion.span key="heart"
            animate={{ opacity: [0, 1, 0], y: [-5, -22], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 left-3 text-[10px] text-pink-400">♥</motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Cloud ─── */
const Cloud = ({ top, duration, delay, scaleVal, opacity, isDark }) => (
  <motion.div initial={{ x: '-22vw' }} animate={{ x: '122vw' }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    className="absolute pointer-events-none" style={{ top }}>
    <div style={{ transform: `scale(${scaleVal})`, opacity }}>
      <div className={`w-44 h-10 rounded-full ${isDark ? 'bg-white/[0.06]' : 'bg-white/80'}`} style={{ filter: 'blur(2px)' }} />
      <div className={`w-28 h-10 rounded-full absolute -top-5 left-7 ${isDark ? 'bg-white/[0.05]' : 'bg-white/70'}`} style={{ filter: 'blur(3px)' }} />
      <div className={`w-16 h-7 rounded-full absolute -top-1 left-24 ${isDark ? 'bg-white/[0.04]' : 'bg-white/60'}`} style={{ filter: 'blur(3px)' }} />
    </div>
  </motion.div>
);

/* ─── Equalizer Bars ─── */
const EqBars = ({ isPlaying, isDark }) => (
  <div className="flex items-end gap-[2px] h-3">
    {[0, 0.15, 0.3, 0.1].map((d, i) => (
      <motion.div key={i} className="w-[3px] rounded-full"
        style={{ backgroundColor: isDark ? '#818cf8' : '#f2a54a' }}
        animate={isPlaying ? { height: ['3px', `${8 + i * 2}px`, '4px', `${10 - i}px`, '3px'] } : { height: '3px' }}
        transition={{ duration: 0.8, repeat: Infinity, delay: d, ease: "easeInOut" }} />
    ))}
  </div>
);

/* ─── Flying Notes ─── */
const FlyingNotes = ({ isPlaying, isDark }) => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    if (!isPlaying) { setNotes([]); return; }
    const iv = setInterval(() => {
      setNotes(p => [...p, { id: Date.now(), x: Math.random() * 36 - 18, n: ['♪', '♫', '♬'][Math.floor(Math.random() * 3)] }].slice(-5));
    }, 1100);
    return () => clearInterval(iv);
  }, [isPlaying]);
  return (
    <div className="absolute -top-2 right-0 pointer-events-none w-16 h-14">
      <AnimatePresence>
        {notes.map(n => (
          <motion.span key={n.id} initial={{ opacity: 0, y: 10, scale: 0.3 }}
            animate={{ opacity: [0, 0.85, 0], y: -30, x: n.x, scale: 1, rotate: n.x > 0 ? 18 : -18 }}
            exit={{ opacity: 0 }} transition={{ duration: 2, ease: "easeOut" }}
            className={`absolute text-[11px] font-bold ${isDark ? 'text-indigo-300' : 'text-[#f2a54a]'}`}>{n.n}</motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ─── Rainbow Easter Egg ─── */
const Rainbow = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}
    className="absolute top-[3%] left-[8%] w-[84%] h-[50%] pointer-events-none z-[15]">
    <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6b6b" /><stop offset="16%" stopColor="#ffa07a" />
          <stop offset="33%" stopColor="#ffe066" /><stop offset="50%" stopColor="#69db7c" />
          <stop offset="66%" stopColor="#74c0fc" /><stop offset="83%" stopColor="#9775fa" />
          <stop offset="100%" stopColor="#da77f2" />
        </linearGradient>
      </defs>
      <path d="M 5 200 A 198 198 0 0 1 395 200" stroke="url(#rb)" strokeWidth="6" fill="none" opacity="0.3" />
      <path d="M 18 200 A 185 185 0 0 1 382 200" stroke="url(#rb)" strokeWidth="4" fill="none" opacity="0.2" />
      <path d="M 30 200 A 172 172 0 0 1 370 200" stroke="url(#rb)" strokeWidth="3" fill="none" opacity="0.12" />
    </svg>
  </motion.div>
);

/* ═══════════════════════════════════════════════
   ███ MAIN COMPONENT — THE TINY LIVING WORLD
   ═══════════════════════════════════════════════ */
const UnderConstruction = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [flowers, setFlowers] = useState([]);
  const [birds, setBirds] = useState([]);
  const [interactions, setInteractions] = useState(0);
  const [progress, setProgress] = useState(72);
  const [catAwake, setCatAwake] = useState(false);

  const audioRef = useRef(null);
  const billboardRef = useRef(null);
  const catTimerRef = useRef(null);

  /* ─── System theme + clock ─── */
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const h = (e) => setIsDark(e.matches);
    mq.addEventListener?.('change', h) || mq.addListener?.(h);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => { clearInterval(t); mq.removeEventListener?.('change', h) || mq.removeListener?.(h); };
  }, []);

  /* ─── Audio engine ─── */
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(p => !p);
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = TRACKS[currentTrack].url;
    audioRef.current.volume = volume;
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]); // eslint-disable-line

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  /* ─── Interaction system ─── */
  const addInteraction = useCallback(() => {
    setInteractions(p => p + 1);
    setProgress(p => Math.min(p + 0.3, 99));
  }, []);

  const plantFlower = useCallback((xPercent) => {
    const type = Math.floor(Math.random() * 7);
    setFlowers(prev => {
      const next = [...prev, { id: Date.now(), x: xPercent, type }];
      return next.length > MAX_FLOWERS ? next.slice(1) : next;
    });
    addInteraction();
  }, [addInteraction]);

  const spawnBird = useCallback((xPercent) => {
    const flyRight = xPercent < 50;
    const y = 8 + Math.random() * 35;
    const duration = 4 + Math.random() * 2;
    setBirds(prev => [...prev, { id: Date.now(), startX: xPercent, flyRight, y, duration }].slice(-5));
    addInteraction();
  }, [addInteraction]);

  const removeBird = useCallback((id) => {
    setBirds(prev => prev.filter(b => b.id !== id));
  }, []);

  /* ─── World click handler ─── */
  const handleWorldClick = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    if (billboardRef.current?.contains(e.target)) return;

    const vh = window.innerHeight;
    const xPct = (e.clientX / window.innerWidth) * 100;

    if (e.clientY > vh * 0.68) {
      plantFlower(xPct);
    } else {
      spawnBird(xPct);
    }
  }, [plantFlower, spawnBird]);

  /* ─── Cat wake/sleep ─── */
  const wakeCat = useCallback(() => {
    clearTimeout(catTimerRef.current);
    setCatAwake(true);
  }, []);
  const sleepCat = useCallback(() => {
    catTimerRef.current = setTimeout(() => setCatAwake(false), 1500);
  }, []);

  /* ─── Derived values ─── */
  const roundedProgress = Math.round(progress * 10) / 10;
  const showRainbow = flowers.length >= 15;
  const sky = isDark
    ? 'linear-gradient(175deg, #0c0f1a 0%, #151b2e 35%, #1e2744 65%, #283350 100%)'
    : 'linear-gradient(175deg, #87ceeb 0%, #a8d8ea 35%, #c9eaf5 65%, #e8f6fd 100%)';

  return (
    <div onClick={handleWorldClick}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-end select-none transition-[background] duration-1000"
      style={{ background: sky, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <audio ref={audioRef} loop preload="auto" />

      {/* ── Day/Night Toggle ── */}
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setIsDark(d => !d)}
        className={`fixed top-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-colors duration-500
          ${isDark ? 'bg-white/10 border-white/20 text-yellow-300' : 'bg-black/5 border-black/10 text-indigo-600'}`}>
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>

      {/* ── Sun / Moon ── */}
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] right-[16%] pointer-events-none">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full transition-colors duration-1000"
          style={{
            backgroundColor: isDark ? '#e2e8f0' : '#ffecd2',
            boxShadow: isDark ? '0 0 60px 20px rgba(226,232,240,0.12)' : '0 0 60px 20px rgba(255,236,210,0.35)'
          }}>
          {isDark && <>
            <div className="absolute top-5 left-5 w-4 h-4 rounded-full bg-gray-300/15" />
            <div className="absolute top-12 left-14 w-3 h-3 rounded-full bg-gray-300/10" />
          </>}
        </div>
      </motion.div>

      {/* ── Stars ── */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        {STARS.map((s, i) => (
          <motion.div key={i} animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            className="absolute bg-white rounded-full"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
        ))}
      </div>

      {/* ── Clouds ── */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Cloud top="10%" duration={55} delay={0} scaleVal={1} opacity={0.5} isDark={isDark} />
          <Cloud top="22%" duration={72} delay={-25} scaleVal={0.7} opacity={0.35} isDark={isDark} />
          <Cloud top="34%" duration={60} delay={-12} scaleVal={1.2} opacity={0.4} isDark={isDark} />
          <Cloud top="5%" duration={85} delay={-42} scaleVal={0.5} opacity={0.22} isDark={isDark} />
        </div>
      )}

      {/* ── Birds ── */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {birds.map(b => (
            <Bird key={b.id} {...b} isDark={isDark} onDone={() => removeBird(b.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Rainbow Easter Egg ── */}
      <AnimatePresence>{showRainbow && <Rainbow key="rainbow" />}</AnimatePresence>

      {/* ═══ BILLBOARD ═══ */}
      <div className="relative z-20 w-full max-w-[900px] mb-[18vh] md:mb-[20vh] px-4 md:px-8 flex justify-center">
        {/* Pillars */}
        <div className="absolute -bottom-[22vh] md:-bottom-[26vh] left-[22%] md:left-[27%] w-5 md:w-6 h-[26vh] md:h-[30vh] rounded-t-sm shadow-xl transition-colors duration-1000"
          style={{ background: isDark ? 'linear-gradient(180deg,#1f2937,#111827)' : 'linear-gradient(180deg,#3a3f47,#2c2f33)' }} />
        <div className="absolute -bottom-[22vh] md:-bottom-[26vh] right-[22%] md:right-[27%] w-5 md:w-6 h-[26vh] md:h-[30vh] rounded-t-sm shadow-xl transition-colors duration-1000"
          style={{ background: isDark ? 'linear-gradient(180deg,#1f2937,#111827)' : 'linear-gradient(180deg,#3a3f47,#2c2f33)' }} />
        {/* Catwalk */}
        <div className="absolute -bottom-3 left-[8%] w-[84%] h-3 rounded-sm z-10 shadow-lg transition-colors duration-1000"
          style={{ background: isDark ? 'linear-gradient(90deg,#111827,#1f2937,#111827)' : 'linear-gradient(90deg,#2c2f33,#3a3f47,#2c2f33)' }} />

        {/* Frame */}
        <motion.div
          ref={billboardRef}
          onMouseEnter={wakeCat} onMouseLeave={sleepCat} onTouchStart={wakeCat}
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.35 }}
          className="relative w-full p-3 md:p-5 rounded-xl md:rounded-2xl shadow-2xl transition-colors duration-1000"
          style={{
            backgroundColor: isDark ? '#111827' : '#2c2f33',
            boxShadow: isDark ? '0 20px 50px -10px rgba(0,0,0,0.5)' : '0 20px 50px -10px rgba(0,0,0,0.25)'
          }}>
          <Cat isDark={isDark} isAwake={catAwake} isPlaying={isPlaying} />

          {/* Screen */}
          <div className="relative w-full h-auto sm:aspect-[21/9] rounded-lg overflow-hidden flex flex-col sm:flex-row transition-colors duration-1000"
            style={{
              backgroundColor: isDark ? '#1e2433' : '#fdfbf7',
              boxShadow: `inset 0 0 25px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)'}`
            }}>

            {/* Left Panel */}
            <div className="w-full sm:w-[36%] border-b sm:border-b-0 sm:border-r p-5 md:p-6 flex flex-col justify-between shrink-0 transition-colors duration-1000"
              style={{ backgroundColor: isDark ? '#252d3d' : '#f4eee1', borderColor: isDark ? '#334155' : '#e8dcc4' }}>
              <div>
                <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`}>
                  <Activity className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase">Status</span>
                </div>
                <h2 className={`text-xl md:text-2xl lg:text-[28px] font-black leading-[1.1] ${isDark ? 'text-white' : 'text-[#4a4539]'}`}>
                  SITE UNDER<br />CONSTRUCTION.
                </h2>
              </div>

              {/* Clock + Interactions */}
              <div className="flex flex-col gap-2 mt-5 sm:mt-0">
                <div className={`rounded-lg p-3 transition-colors duration-1000 ${isDark ? 'bg-[#1a2030]' : 'bg-[#e8dcc4]'}`}
                  style={{ boxShadow: `inset 0 1px 3px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}` }}>
                  <div className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8b7e6a]'}`}>Local Time</div>
                  <div className={`font-mono text-base md:text-xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#4a4539]'}`}>
                    {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "00:00:00"}
                    <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                {interactions > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className={`rounded-lg px-3 py-2 flex items-center justify-between transition-colors duration-1000 ${isDark ? 'bg-[#1a2030]' : 'bg-[#e8dcc4]'}`}>
                    <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-[#8b7e6a]'}`}>World Alive</span>
                    <span className={`font-mono text-sm font-black ${isDark ? 'text-indigo-300' : 'text-[#f2a54a]'}`}>{interactions}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full sm:w-[64%] p-6 md:p-8 flex flex-col justify-center relative min-h-[220px]">
              {/* Music Widget */}
              <div className="absolute top-4 right-4 z-30"
                onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={toggleMusic}
                  className={`rounded-full px-3 py-1.5 flex items-center gap-2 cursor-pointer border shadow-sm backdrop-blur-sm transition-colors duration-500
                    ${isDark ? 'bg-white/[0.08] border-white/10 hover:bg-white/[0.14]' : 'bg-white/80 border-[#e8dcc4] hover:bg-white'}`}>
                  {isPlaying ? <EqBars isPlaying={isPlaying} isDark={isDark} /> : <Music className={`w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`} />}
                  <span className={`text-[10px] md:text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-[#6b6255]'}`}>{TRACKS[currentTrack].name}</span>
                </motion.div>

                <AnimatePresence>
                  {showControls && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 p-4 rounded-xl shadow-xl border backdrop-blur-md flex gap-4 z-40
                        ${isDark ? 'bg-[#1a2030]/95 border-white/10' : 'bg-white/95 border-[#e8dcc4]'}`}>
                      <div className="flex flex-col gap-1 min-w-[105px]">
                        <div className={`text-[8px] uppercase font-bold tracking-[0.15em] mb-1 ${isDark ? 'text-gray-600' : 'text-[#b3a78f]'}`}>Tracks</div>
                        {TRACKS.map((t, i) => (
                          <div key={i} onClick={() => { setCurrentTrack(i); if (!isPlaying) setIsPlaying(true); }}
                            className={`text-[11px] font-semibold cursor-pointer py-1 px-2 rounded-md flex items-center gap-2 transition-all
                              ${currentTrack === i ? (isDark ? 'text-indigo-300 bg-indigo-500/10' : 'text-[#f2a54a] bg-[#f2a54a]/10')
                                : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-[#8b7e6a] hover:text-[#4a4539] hover:bg-black/5')}`}>
                            {currentTrack === i && isPlaying ? (
                              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-indigo-400' : 'bg-[#f2a54a]'}`} />
                            ) : <div className="w-1.5 h-1.5 rounded-full shrink-0" />}
                            {t.name}
                          </div>
                        ))}
                      </div>
                      <div className={`w-px self-stretch rounded-full ${isDark ? 'bg-white/10' : 'bg-[#e8dcc4]'}`} />
                      <div className="flex flex-col items-center justify-between py-1 w-7 gap-2">
                        <div className="relative h-16 w-full flex justify-center">
                          <div className={`absolute h-full w-[5px] rounded-full overflow-hidden flex flex-col justify-end ${isDark ? 'bg-white/10' : 'bg-[#e8dcc4]'}`}>
                            <motion.div className={`w-full rounded-full ${isDark ? 'bg-indigo-400' : 'bg-[#f2a54a]'}`}
                              animate={{ height: `${volume * 100}%` }} transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                          </div>
                          <input type="range" min="0" max="1" step="0.01" value={volume}
                            onChange={e => setVolume(parseFloat(e.target.value))}
                            className="absolute w-16 h-5 opacity-0 cursor-pointer origin-center -rotate-90 z-10" />
                        </div>
                        <Volume2 className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-[#b3a78f]'}`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <FlyingNotes isPlaying={isPlaying} isDark={isDark} />
              </div>

              {/* Content */}
              <div className={`flex items-center gap-2 mt-4 sm:mt-0 mb-3 ${isDark ? 'text-amber-400' : 'text-[#f2a54a]'}`}>
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                <span className="font-bold text-[10px] uppercase tracking-[0.15em]">Notice</span>
              </div>

              <h1 className={`text-xl md:text-2xl lg:text-3xl font-extrabold mb-3 leading-[1.15] transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#4a4539]'}`}>
                We are currently rebuilding<br className="hidden sm:block" /> our website.
              </h1>
              <p className={`text-[12px] md:text-[13px] max-w-[92%] leading-relaxed mb-6 font-medium transition-colors duration-1000 ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`}>
                Our team is crafting a better experience. Grab some coffee and explore the world while you wait.
              </p>

              {/* Progress */}
              <div className="w-full max-w-[88%] mt-auto">
                <div className={`flex justify-between text-[9px] md:text-[10px] font-bold mb-2 uppercase tracking-[0.12em] ${isDark ? 'text-gray-500' : 'text-[#8b7e6a]'}`}>
                  <span>Progress</span>
                  <span>{roundedProgress}%</span>
                </div>
                <div className={`w-full h-2 md:h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-[#e8dcc4]'}`}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: isDark ? 'linear-gradient(90deg,#818cf8,#6366f1)' : 'linear-gradient(90deg,#ffb7b2,#f2a54a)' }}
                    animate={{ width: `${roundedProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ HILLS ═══ */}
      <div className="absolute bottom-0 w-full h-[24vh] md:h-[32vh] z-30 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10vh] left-[-10%] w-[125%] h-[32vh] md:h-[44vh] rounded-[50%_50%_0_0] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#064e3b' : '#95d5b2' }} />
        <div className="absolute bottom-[-5vh] left-[-20%] w-[85%] h-[24vh] md:h-[34vh] rounded-[50%_50%_0_0] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#065f46' : '#74c69d' }} />
        <div className="absolute bottom-[-7vh] right-[-15%] w-[90%] h-[28vh] md:h-[38vh] rounded-[50%_50%_0_0] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#047857' : '#52b788' }} />
      </div>

      {/* ── Flower Garden ── */}
      <div className="absolute bottom-[2vh] md:bottom-[4vh] w-full h-[16vh] z-[32] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {flowers.map(f => <Flower key={f.id} x={f.x} type={f.type} isDark={isDark} />)}
        </AnimatePresence>
      </div>

      {/* ── Onboarding Hint ── */}
      <AnimatePresence>
        {interactions === 0 && mounted && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ delay: 2.5, duration: 0.8 }}
            className={`absolute bottom-[33vh] left-1/2 -translate-x-1/2 z-40 text-xs font-medium tracking-wider ${isDark ? 'text-white/40' : 'text-black/25'}`}>
            try clicking around ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div className={`absolute bottom-2 right-4 z-40 text-[9px] font-medium tracking-wider ${isDark ? 'text-white/15' : 'text-black/10'}`}>
        devwithdevansh
      </div>
    </div>
  );
};

export default UnderConstruction;
