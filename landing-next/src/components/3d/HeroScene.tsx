"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Meteors({ number = 20 }: { number?: number }) {
  const [meteors, setMeteors] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random meteors only on client so we don't get hydration mismatches
    const arr = new Array(number).fill(true).map(() => ({
      id: Math.random(),
      left: Math.floor(Math.random() * (100 - 0) + 0) + "vw",
      delay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
      duration: Math.floor(Math.random() * (10 - 5) + 5) + "s",
    }));
    setMeteors(arr);
  }, [number]);

  return (
    <>
      {meteors.map((el) => (
        <span
          key={el.id}
          className="pointer-events-none absolute top-[-20%] h-[2px] w-[100px] -rotate-45 animate-meteor rounded-[9999px] bg-slate-300 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            left: el.left,
            animationDelay: el.delay,
            animationDuration: el.duration,
          }}
        >
          {/* Meteor Tail */}
          <div className="absolute top-1/2 -z-10 h-[2px] w-[100px] -translate-y-1/2 bg-gradient-to-r from-blue-500 to-transparent" />
        </span>
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-neutral-950 pointer-events-none">
      {/* VengeanceUI Interactive Grid Background (Brighter white lines) */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated Glowing Spotlight (Brighter blue) */}
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.25, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[600px] rounded-full bg-blue-600/40 blur-[130px]"
      />

      {/* VengeanceUI Meteor Shower */}
      <Meteors number={30} />
      
      {/* Vignette shadow to blend edges into the dark theme */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(10,10,10,1)]"></div>
    </div>
  );
}
