"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WelcomeScreen from "@/components/animations/WelcomeScreen";
import VengeanceDock from "@/components/navigation/VengeanceDock";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 w-full h-full bg-neutral-950" />
});

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLHeadingElement>(null);
  
  // Parallax for hero text using framer-motion
  const { scrollY } = useScroll();
  const yHeroText = useTransform(scrollY, [0, 1000], [0, 400]);

  useEffect(() => {
    if (!textRevealRef.current) return;

    // GSAP ScrollTrigger Text Reveal
    gsap.fromTo(
      textRevealRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: textRevealRef.current,
          start: "top 80%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <main ref={containerRef} className="relative w-full min-h-screen">
      <WelcomeScreen />
      <VengeanceDock />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <HeroScene />
        <motion.div 
          style={{ y: yHeroText }}
          className="z-10 text-center px-4 mix-blend-difference"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-blue-400 font-mono tracking-widest text-sm uppercase mb-4"
          >
            Intelligence in Healthcare
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-7xl md:text-9xl font-bold tracking-tighter"
          >
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">aidAR</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="mt-6 text-xl text-neutral-400 max-w-lg mx-auto"
          >
            A premium, highly interactive virtual doctor experience. Scroll down to explore the future.
          </motion.p>
        </motion.div>
      </section>

      {/* GSAP Reveal Section */}
      <section className="h-screen w-full flex items-center justify-center bg-white text-black">
        <div className="max-w-5xl mx-auto px-4">
          <h2 
            ref={textRevealRef} 
            className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight flex flex-wrap gap-3 overflow-hidden"
          >
            {/* Split text for GSAP to target children */}
            {["Precision.", "Speed.", "Empathy.", "All", "powered", "by", "AI."].map((word, i) => (
              <span key={i} className="inline-block">{word}</span>
            ))}
          </h2>
          <p className="mt-10 max-w-2xl text-2xl text-neutral-500">
            Our diagnostic engine leverages the latest local Large Language Models to provide you with secure, private, and instantaneous medical guidance directly in your browser.
          </p>
        </div>
      </section>

      {/* Footer / Routing Links */}
      <footer className="h-[50vh] flex flex-col items-center justify-center bg-neutral-950 text-neutral-500">
        <h3 className="text-4xl font-bold mb-8 text-white">Experience the Future</h3>
        <div className="flex gap-4">
          <a href="/doctor" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-2xl">
            Start Consultation
          </a>
          <a href="/viewer" className="px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
            Interactive 3D Atlas
          </a>
        </div>
      </footer>
    </main>
  );
}
