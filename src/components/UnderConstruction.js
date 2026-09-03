import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Activity, AlertCircle, Music, Play, Pause, Volume2 } from 'lucide-react';

const TRACKS = [
  { name: "Lofi Study", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" },
  { name: "Chill Vibes", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b817cfbd.mp3?filename=chill-abstract-intention-116199.mp3" },
  { name: "Empty Mind", url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=empty-mind-118973.mp3" }
];

const Cat = ({ isDark }) => (
  <div className="absolute bottom-[calc(100%-2px)] left-[15%] cursor-pointer group z-20">
    <svg viewBox="0 0 120 50" className="w-20 md:w-24 h-auto drop-shadow-lg overflow-visible">
       <path d="M 20 50 Q 20 25 50 25 L 70 25 Q 90 25 90 50 Z" fill={isDark ? "#121417" : "#2c2f33"} />
       <path d="M 25 30 L 20 10 L 40 22 Z" fill={isDark ? "#121417" : "#2c2f33"} />
       <path d="M 45 22 L 55 10 L 60 27 Z" fill={isDark ? "#121417" : "#2c2f33"} />
       <motion.path 
         d="M 85 45 Q 110 45 105 25" 
         stroke={isDark ? "#121417" : "#2c2f33"} strokeWidth="6" fill="none" strokeLinecap="round"
         animate={{ d: ["M 85 45 Q 110 45 105 25", "M 85 45 Q 110 45 100 15", "M 85 45 Q 110 45 105 25"] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
       />
    </svg>
    <motion.div 
      animate={{ opacity: [0, 1, 0], y: [-5, -20], x: [0, 10] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      className={`absolute top-0 right-4 font-bold text-xs ${isDark ? 'text-gray-400' : 'text-[#2c2f33]'}`}
    >
      z
    </motion.div>
    <motion.div 
      animate={{ opacity: [0, 1, 0], y: [-5, -25], x: [0, 15] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
      className={`absolute -top-2 right-6 font-bold text-sm ${isDark ? 'text-gray-400' : 'text-[#2c2f33]'}`}
    >
      Z
    </motion.div>
  </div>
);

const Cloud = ({ top, duration, delay, scale, opacity, isDark }) => (
  <motion.div 
    initial={{ x: '-20vw' }}
    animate={{ x: '120vw' }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    className="absolute pointer-events-none"
    style={{ top, scale, opacity }}
  >
    <div className={`w-48 h-12 rounded-full blur-[4px] transition-colors duration-1000 ${isDark ? 'bg-white/10' : 'bg-white'}`} />
    <div className={`w-32 h-12 rounded-full blur-[4px] absolute -top-6 left-8 transition-colors duration-1000 ${isDark ? 'bg-white/10' : 'bg-white'}`} />
  </motion.div>
);

const FlyingNotes = ({ isPlaying, isDark }) => {
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    if (!isPlaying) {
      setNotes([]);
      return;
    }
    const interval = setInterval(() => {
      setNotes(prev => [
        ...prev, 
        { id: Date.now(), x: Math.random() * 30 - 15, note: ['♪', '♫', '♩'][Math.floor(Math.random() * 3)] }
      ].slice(-4));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="absolute top-2 right-12 pointer-events-none z-0">
      <AnimatePresence>
        {notes.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10, x: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], y: -40, x: n.x, scale: 1.2, rotate: n.x > 0 ? 15 : -15 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className={`absolute text-[10px] md:text-xs font-bold drop-shadow-sm ${isDark ? 'text-gray-300' : 'text-[#f2a54a]'}`}
          >
            {n.note}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const UnderConstruction = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e) => setIsDark(e.matches);
    
    if(mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    const timer = setInterval(() => setTime(new Date()), 1000);
    
    return () => {
      clearInterval(timer);
      if(mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index) => {
    setCurrentTrack(index);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = TRACKS[currentTrack].url;
      audioRef.current.volume = volume;
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log(e));
      }
    }
  }, [currentTrack]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-end font-sans select-none transition-colors duration-1000"
      style={{ 
        background: isDark 
          ? 'linear-gradient(to bottom, #111827, #374151, #4b5563)'
          : 'linear-gradient(to bottom, #bfe4f7, #eef8fc)'
      }}
    >
      
      <audio ref={audioRef} loop preload="auto" />
      
      {/* Sun / Moon */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[15%] md:right-[20%] w-24 h-24 md:w-32 md:h-32 rounded-full blur-[4px] shadow-[0_0_60px_rgba(255,255,255,0.5)] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: isDark ? '#f3f4f6' : '#ffecd2' }}
      />
      
      {/* Stars */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${isDark ? 'opacity-100' : 'opacity-0'}`}>
         {mounted && Array.from({ length: 25 }).map((_, i) => (
           <motion.div 
             key={i}
             animate={{ opacity: [0.1, 0.8, 0.1] }}
             transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
             className="absolute bg-white rounded-full"
             style={{
               top: `${Math.random() * 50}%`,
               left: `${Math.random() * 100}%`,
               width: `${Math.random() * 3 + 1}px`,
               height: `${Math.random() * 3 + 1}px`
             }}
           />
         ))}
      </div>

      {/* Floating Clouds */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Cloud top="15%" duration={45} delay={0} scale={1} opacity={0.6} isDark={isDark} />
          <Cloud top="25%" duration={60} delay={-20} scale={0.7} opacity={0.4} isDark={isDark} />
          <Cloud top="35%" duration={50} delay={-10} scale={1.2} opacity={0.5} isDark={isDark} />
        </div>
      )}

      {/* Main Billboard Scene */}
      <div className="relative z-20 w-full max-w-[900px] mb-[18vh] md:mb-[22vh] px-4 md:px-8 flex justify-center">
        
        {/* Support Pillars */}
        <div 
          className="absolute -bottom-[25vh] left-[20%] md:left-[25%] w-6 md:w-8 h-[30vh] border-l-4 rounded-t-sm shadow-xl transition-colors duration-1000" 
          style={{ backgroundColor: isDark ? '#1f2937' : '#3a3f47', borderColor: isDark ? '#111827' : '#2c2f33' }} 
        />
        <div 
          className="absolute -bottom-[25vh] right-[20%] md:right-[25%] w-6 md:w-8 h-[30vh] border-l-4 rounded-t-sm shadow-xl transition-colors duration-1000" 
          style={{ backgroundColor: isDark ? '#1f2937' : '#3a3f47', borderColor: isDark ? '#111827' : '#2c2f33' }} 
        />
        
        {/* Catwalk Platform */}
        <div 
          className="absolute -bottom-3 md:-bottom-4 left-[10%] w-[80%] h-3 md:h-4 border-t-2 rounded-sm z-10 shadow-lg transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#111827' : '#2c2f33', borderColor: isDark ? '#374151' : '#4f5660' }}
        />

        {/* Billboard Frame */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative w-full p-3 md:p-5 rounded-xl md:rounded-2xl shadow-2xl border-b-[6px] md:border-b-8 transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#111827' : '#2c2f33', borderColor: isDark ? '#030712' : '#1e2124' }}
        >
          {/* Lo-Fi Cat */}
          <Cat isDark={isDark} />

          {/* Inner Screen */}
          <div 
            className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] transition-colors duration-1000"
            style={{ backgroundColor: isDark ? '#1f2937' : '#fdfbf7' }}
          >
             
             {/* Left Info Panel */}
             <div 
               className="w-full sm:w-[35%] border-b sm:border-b-0 sm:border-r p-4 md:p-6 flex flex-col justify-between shrink-0 transition-colors duration-1000"
               style={{ backgroundColor: isDark ? '#374151' : '#f4eee1', borderColor: isDark ? '#4b5563' : '#e8dcc4' }}
             >
                <div>
                  <div className={`flex items-center gap-2 mb-2 md:mb-4 transition-colors duration-1000 ${isDark ? 'text-gray-300' : 'text-[#8b7e6a]'}`}>
                    <Activity className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase">Status</span>
                  </div>
                  <h2 className={`text-xl md:text-2xl lg:text-3xl font-black leading-none mb-1 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#5c5446]'}`}>
                    SITE UNDER<br/>CONSTRUCTION.
                  </h2>
                </div>
                
                <div 
                  className="rounded-lg p-3 md:p-4 mt-4 sm:mt-0 shadow-inner transition-colors duration-1000"
                  style={{ backgroundColor: isDark ? '#1f2937' : '#e8dcc4' }}
                >
                  <div className={`text-[9px] md:text-[10px] font-bold uppercase mb-1 tracking-wider transition-colors duration-1000 ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`}>Local Time</div>
                  <div className={`font-mono text-lg md:text-2xl font-black tracking-tight flex items-center gap-2 transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#5c5446]'}`}>
                    {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "00:00"}
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
             </div>

             {/* Right Content Panel */}
             <div className="w-full sm:w-[65%] p-5 md:p-8 flex flex-col justify-center relative">
                
                {/* Advanced Music Player Widget */}
                <div 
                  className="absolute top-4 right-4 z-30"
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  {/* Main Pill Button */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`shadow-md border rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 cursor-pointer transition-colors duration-1000 relative z-10 ${isDark ? 'bg-[#374151] border-[#4b5563] hover:bg-[#4b5563]' : 'bg-white border-[#e8dcc4] hover:bg-[#fdfbf7]'}`}
                    onClick={toggleMusic}
                  >
                    <motion.div animate={isPlaying ? { rotate: 360 } : {}} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                      <Music className={`w-3 h-3 md:w-4 md:h-4 transition-colors ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-[#8b7e6a] group-hover:text-[#f2a54a]'}`} />
                    </motion.div>
                    <span className={`text-[10px] md:text-xs font-bold select-none transition-colors ${isDark ? 'text-gray-300' : 'text-[#8b7e6a]'}`}>
                      {TRACKS[currentTrack].name}
                    </span>
                    {isPlaying ? (
                       <Pause className={`w-3 h-3 hidden group-hover:block transition-colors ${isDark ? 'text-gray-300' : 'text-[#8b7e6a]'}`} />
                    ) : (
                       <Play className={`w-3 h-3 hidden group-hover:block transition-colors ${isDark ? 'text-gray-300' : 'text-[#8b7e6a]'}`} />
                    )}
                  </motion.div>

                  {/* Hover Controls (Tracks & Volume) */}
                  <AnimatePresence>
                    {showControls && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full right-0 mt-2 p-3 md:p-4 rounded-xl shadow-xl border flex gap-4 transition-colors duration-1000 ${isDark ? 'bg-[#1f2937] border-[#374151]' : 'bg-white border-[#e8dcc4]'}`}
                      >
                        {/* Track List */}
                        <div className="flex flex-col gap-2 min-w-[100px]">
                          <div className={`text-[8px] uppercase font-bold tracking-widest mb-1 transition-colors ${isDark ? 'text-gray-500' : 'text-[#8b7e6a]'}`}>Tracks</div>
                          {TRACKS.map((track, idx) => (
                             <div 
                               key={idx}
                               onClick={() => playTrack(idx)}
                               className={`text-[10px] md:text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 ${
                                 currentTrack === idx 
                                   ? 'text-[#f2a54a]' 
                                   : isDark ? 'text-gray-400 hover:text-white' : 'text-[#8b7e6a] hover:text-[#5c5446]'
                               }`}
                             >
                               {currentTrack === idx && isPlaying ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-[#f2a54a] rounded-full" /> : <div className="w-1.5 h-1.5 rounded-full bg-transparent" />}
                               {track.name}
                             </div>
                          ))}
                        </div>

                        {/* Divider */}
                        <div className={`w-[1px] rounded-full transition-colors ${isDark ? 'bg-[#374151]' : 'bg-[#e8dcc4]'}`} />

                        {/* Vertical Volume Slider */}
                        <div className="flex flex-col items-center justify-between py-1 w-6">
                           <div className="relative h-16 w-full flex justify-center items-center">
                              {/* Visible Track */}
                              <div className={`absolute h-full w-1.5 rounded-full pointer-events-none z-0 overflow-hidden flex flex-col justify-end transition-colors ${isDark ? 'bg-gray-700' : 'bg-[#e8dcc4]'}`}>
                                <div className="w-full bg-[#f2a54a] transition-all" style={{ height: `${volume * 100}%` }} />
                              </div>
                              {/* Invisible rotated input handling drag events */}
                              <input 
                                type="range" 
                                min="0" max="1" step="0.01"
                                value={volume}
                                onChange={e => setVolume(parseFloat(e.target.value))}
                                className="absolute w-16 h-4 opacity-0 cursor-pointer origin-center -rotate-90 z-10"
                              />
                           </div>
                           <Volume2 className={`w-3 h-3 mt-2 transition-colors ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Flying Music Notes */}
                  <FlyingNotes isPlaying={isPlaying} isDark={isDark} />
                </div>

                {/* Typography */}
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-[#f2a54a]" />
                  <span className="text-[#f2a54a] font-bold text-[10px] uppercase tracking-widest">Notice</span>
                </div>
                
                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight transition-colors duration-1000 ${isDark ? 'text-white' : 'text-[#5c5446]'}`}>
                  We are currently rebuilding our website.
                </h1>
                
                <p className={`text-[10px] md:text-[13px] max-w-[90%] leading-relaxed mb-6 font-medium transition-colors duration-1000 ${isDark ? 'text-gray-300' : 'text-[#8b7e6a]'}`}>
                  Our team is working hard behind the scenes to bring you a better experience. Please check back later.
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-[85%] mt-auto">
                  <div className={`flex justify-between text-[9px] md:text-[10px] font-bold mb-2 uppercase tracking-widest transition-colors duration-1000 ${isDark ? 'text-gray-400' : 'text-[#8b7e6a]'}`}>
                    <span>Progress</span>
                    <span>72%</span>
                  </div>
                  <div 
                    className="w-full h-2 md:h-3 rounded-full overflow-hidden shadow-inner transition-colors duration-1000"
                    style={{ backgroundColor: isDark ? '#4b5563' : '#e8dcc4' }}
                  >
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#ffb7b2] to-[#f2a54a]"
                      initial={{ width: '0%' }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Floating Thematic Icon */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute bottom-6 right-8 transition-colors duration-1000 ${isDark ? 'text-gray-600' : 'text-[#e8dcc4]'}`}
                >
                  <Coffee className="w-16 h-16 md:w-24 md:h-24 opacity-40 drop-shadow-sm" />
                </motion.div>

             </div>

          </div>
        </motion.div>
      </div>

      {/* The Layered Grassy Hills */}
      <div className="absolute bottom-0 w-full h-[25vh] md:h-[30vh] z-30 pointer-events-none overflow-hidden flex flex-col justify-end">
        <div 
          className="absolute bottom-[-10vh] left-[-10%] w-[120%] h-[35vh] md:h-[40vh] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#064e3b' : '#95d5b2' }}
        />
        <div 
          className="absolute bottom-[-5vh] left-[-20%] w-[80%] h-[25vh] md:h-[30vh] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#065f46' : '#74c69d' }}
        />
        <div 
          className="absolute bottom-[-8vh] right-[-15%] w-[85%] h-[28vh] md:h-[35vh] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-1000"
          style={{ backgroundColor: isDark ? '#047857' : '#52b788' }}
        />
      </div>

    </div>
  );
};

export default UnderConstruction;
