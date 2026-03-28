"use client";

import { useState, Suspense, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader } from "@react-three/drei";
import { NARRATION_DATA, ROTATION_NARRATIONS, ZOOM_NARRATIONS } from "@/lib/narration-data";

// Type casting for dynamic import
const SceneWithModel = dynamic(() => import("@/components/3d/ClientModelScene"), {
  ssr: false,
  loading: () => null,
}) as React.ComponentType<{ 
  activeModel: string; 
  onRotate: (angle: number, dist: number) => void; 
  onAnimTime: (pct: number) => void;
}>;

export default function ViewerPage() {
  const [activeModel, setActiveModel] = useState<"cpr1.fbx" | "bleeding.fbx">("cpr1.fbx");
  const [playTrigger, setPlayTrigger] = useState(0); // Bumping this forces the model scene to remount and restart animation
  const [isMuted, setIsMuted] = useState(false);
  const [narrations, setNarrations] = useState<{ id: string, text: string }[]>([]);

  // Refs for debouncing
  const debounceRef = useRef<any>(null);
  const lastRotRef = useRef("");
  const lastZoomRef = useRef("");
  const lastPhaseRef = useRef("");

  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  const processQueue = useCallback(() => {
    if (isSpeakingRef.current) return;
    if (speechQueueRef.current.length === 0) return;

    const text = speechQueueRef.current.shift()!;
    isSpeakingRef.current = true;

    // Show the visual bubble only when this item starts playing
    setNarrations(prev => {
      const newArr = [...prev, { id: Date.now().toString() + Math.random(), text }];
      if (newArr.length > 3) newArr.shift();
      return newArr;
    });

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const cleanText = text
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '')
        .replace(/\*\*/g, '')
        .replace(/\u2014/g, ',')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        isSpeakingRef.current = false;
        processQueue();
      };
      utterance.onerror = () => {
        isSpeakingRef.current = false;
        processQueue();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      isSpeakingRef.current = false;
      setTimeout(() => processQueue(), 2000);
    }
  }, [isMuted]);

  const addNarration = useCallback((text: string) => {
    speechQueueRef.current.push(text);
    processQueue();
  }, [processQueue]);

  const handleRotate = useCallback((angle: number, distance: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Throttled heavily so it doesn't queue 100 sentences while spinning the camera
    debounceRef.current = setTimeout(() => {
      // Only process camera narrations if the bot isn't already speaking something critical
      if (typeof window !== "undefined" && window.speechSynthesis.speaking) return;

      const normalizedAngle = ((angle % 360) + 360) % 360;
      let direction = "";

      if (normalizedAngle >= 315 || normalizedAngle < 45) direction = "front";
      else if (normalizedAngle >= 45 && normalizedAngle < 135) direction = "right";
      else if (normalizedAngle >= 135 && normalizedAngle < 225) direction = "back";
      else direction = "left";

      if (direction !== lastRotRef.current) {
        lastRotRef.current = direction;
        addNarration(ROTATION_NARRATIONS[direction]);
      }

      let zoomLevel = "";
      if (distance < 3) zoomLevel = "close";
      else if (distance > 7) zoomLevel = "far";
      else zoomLevel = "medium";

      if (zoomLevel !== lastZoomRef.current) {
        lastZoomRef.current = zoomLevel;
        addNarration(ZOOM_NARRATIONS[zoomLevel]);
      }
    }, 1200);
  }, [addNarration]);

  const handleAnimTime = useCallback((pct: number) => {

    const key = activeModel === "cpr1.fbx" ? "cpr" : "bleeding";
    const data = NARRATION_DATA[key];
    
    let phase = "";
    if (pct < 0.1) phase = "begin";
    else if (pct > 0.4 && pct < 0.5) phase = key === "cpr" ? "halfway" : "elevation";
    else if (pct > 0.8 && pct < 0.9) phase = key === "cpr" ? "headtilt" : "tourniquet";
    else if (pct > 0.95) phase = "end";

    if (phase && phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      const text = (data as any)[phase];
      if (text) {
        addNarration(text);
      }
    }
  }, [activeModel, addNarration]);

  // Handle clicking the specific buttons (also replays animation if already on it)
  const handleSelectModel = (model: "cpr1.fbx" | "bleeding.fbx") => {
    window.speechSynthesis.cancel();
    speechQueueRef.current = [];
    isSpeakingRef.current = false;
    lastPhaseRef.current = "";
    lastRotRef.current = "";
    lastZoomRef.current = "";
    setNarrations([]);
    setActiveModel(model);
    setPlayTrigger(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden text-white selection:bg-blue-500">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2">
          <span className="text-blue-500">aid</span>AR.
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              window.speechSynthesis.cancel();
            }}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 transition-colors"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <span className="text-sm font-mono text-neutral-500">3D Interactive Atlas</span>
        </div>
      </header>

      {/* AR Narrator Overlay */}
      <div className="absolute top-24 left-6 z-40 w-80 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {narrations.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              className="bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl"
            >
              <div className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center justify-between">
                <span>AR Narrator</span>
                {!isMuted && <span className="animate-pulse w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\\n/g, '<br/>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') }} className="text-sm leading-relaxed text-neutral-100" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* R3F Canvas Area */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <SceneWithModel 
            key={`${activeModel}-${playTrigger}`} 
            activeModel={activeModel} 
            onRotate={handleRotate} 
            onAnimTime={handleAnimTime} 
          />
        </Suspense>
        {/* R3F native Loading overlay */}
        <Loader containerStyles={{ background: 'black' }} innerStyles={{ width: '400px' }} />
      </div>

      {/* VengeanceUI Style Control Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4"
      >
        <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 w-full shadow-2xl">
          <button
            onClick={() => handleSelectModel("cpr1.fbx")}
            className={
              activeModel === "cpr1.fbx" 
                ? "flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 bg-white text-black shadow-lg scale-[1.02]" 
                : "flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5"
            }
          >
            CPR Training
          </button>
          <button
            onClick={() => handleSelectModel("bleeding.fbx")}
            className={
              activeModel === "bleeding.fbx" 
                ? "flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 bg-white text-black shadow-lg scale-[1.02]" 
                : "flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5"
            }
          >
            Bleeding Control
          </button>
        </div>
      </motion.div>
    </div>
  );
}
