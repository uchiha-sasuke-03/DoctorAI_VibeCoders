"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-neutral-950 pointer-events-none">
      {/* Premium VengeanceUI Noise Overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03]" 
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
      />
      
      {/* VengeanceUI Aurora Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: ["0%", "10%", "0%"],
          y: ["0%", "5%", "0%"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/30 blur-[140px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: ["0%", "-10%", "0%"],
          y: ["0%", "-10%", "0%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] -right-[20%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: ["0%", "5%", "0%"],
          y: ["0%", "-5%", "0%"]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[130px]"
      />
    </div>
  );
}
