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
    <main ref={containerRef} className="relative w-full min-h-screen bg-neutral-950 text-neutral-100">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="mt-8 max-w-2xl mx-auto flex flex-col gap-3"
          >
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-200">
              Your Personal AI Medical Assistant
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
              aidAR combines 3D anatomy visualization, an intelligent diagnostic chatbot, and AR-guided first-aid procedures — all in one platform. Get instant symptom assessments, first-aid instructions, and OTC medicine suggestions.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section 
        className="min-h-screen w-full flex flex-col justify-center text-white relative z-10 py-32 border-t border-white/5 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,1), rgba(10,10,10,0.4), rgba(10,10,10,1)), url('/ambient_bg.png')` }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full relative z-20">

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="mb-24 md:pl-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 text-xs font-mono mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              How It Works
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] text-white">
              Three steps <br /> to <br /> <span className="text-neutral-500 italic font-medium">immediate</span> <br /> help
            </h2>
          </motion.div>

          <div className="relative w-full mt-16">
            {/* Connecting Line (Animated draw effect) */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="absolute top-8 left-12 w-[calc(100%-6rem)] h-[1px] bg-gradient-to-r from-blue-900/50 via-blue-500/50 to-blue-900/50 hidden md:block origin-left" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center md:items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-950 border border-blue-500/50 flex items-center justify-center text-blue-400 font-mono text-xl mb-8 shadow-[0_0_25px_rgba(59,130,246,0.15)] relative backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]">
                  1
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4 text-neutral-100">Describe Your Situation</h3>
                <p className="text-neutral-400 leading-relaxed text-sm max-w-[280px]">
                  Type or speak your symptoms in plain language. aidAR understands context, severity, and urgency from natural conversation.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center md:items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-950 border border-blue-500/50 flex items-center justify-center text-blue-400 font-mono text-xl mb-8 shadow-[0_0_25px_rgba(59,130,246,0.15)] relative backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]">
                  2
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4 text-neutral-100">AI Analyzes & Responds</h3>
                <p className="text-neutral-400 leading-relaxed text-sm max-w-[280px]">
                  Our AI engine cross-references your symptoms against thousands of conditions and provides a structured, prioritized assessment.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center md:items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-950 border border-blue-500/50 flex items-center justify-center text-blue-400 font-mono text-xl mb-8 shadow-[0_0_25px_rgba(59,130,246,0.15)] relative backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]">
                  3
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4 text-neutral-100">Follow Visual Guidance</h3>
                <p className="text-neutral-400 leading-relaxed text-sm max-w-[280px]">
                  The 3D viewer and AR narrator walk you through procedures step-by-step with synchronized animations and voice narration.
                </p>
              </motion.div>

            </div>
          </div>
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
