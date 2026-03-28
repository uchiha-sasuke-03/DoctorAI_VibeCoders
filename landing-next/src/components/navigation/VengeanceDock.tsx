"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const DOCK_ITEMS = [
  { 
    label: "Home", 
    href: "/", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> 
  },
  { 
    label: "AI Doctor", 
    href: "/doctor", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 
  },
  { 
    label: "3D Atlas", 
    href: "/viewer", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0"/><circle cx="12" cy="12" r="4"/><path d="M12 2v6"/><path d="M12 16v6"/><path d="M22 12h-6"/><path d="M8 12H2"/></svg> 
  },
];

function DockItem({ item, mouseX }: { item: typeof DOCK_ITEMS[0], mouseX: any }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Calculate distance from mouse to center of this element
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate scale based on distance
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref as any}
      style={{ scale }}
      className="relative flex group"
    >
      <Link 
        href={item.href} 
        className="flex items-center justify-center w-14 h-14 bg-neutral-900 border border-neutral-700/50 rounded-full text-2xl hover:bg-neutral-800 transition-colors shadow-xl"
      >
        <span>{item.icon}</span>

        {/* Tooltip */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
          {item.label}
        </span>
      </Link>
    </motion.div>
  );
}

export default function VengeanceDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="flex items-end gap-4 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 1 }}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.label} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  );
}
