"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// This rig component controls the camera/lighting/rotation based on mouse position
function InteractiveRig() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state, delta) => {
    // state.mouse goes from -1 to 1 based on screen coordinates
    const targetX = (state.mouse.y * Math.PI) / 5;
    const targetY = (state.mouse.x * Math.PI) / 5;
    
    // Smoothly rotate the whole blob towards the mouse
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, delta * 3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, delta * 3);
    }

    // Move the shiny directional light exactly with the mouse for a dynamic reflection
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, state.mouse.x * 12, delta * 5);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, state.mouse.y * 12, delta * 5);
    }
  });

  return (
    <group ref={groupRef}>
      <directionalLight ref={lightRef} position={[0, 0, 5]} intensity={2} />
      
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  // We disable pointer events on the container so the user can easily scroll and click things over it,
  // but R3F still tracks the global mouse position for the parallax effect!
  return (
    <div className="absolute inset-0 -z-10 w-full h-full opacity-70 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        // This explicitly tells R3F to track the mouse globally across the whole window
        eventSource={typeof window !== "undefined" ? window.document.body : undefined}
      >
        <ambientLight intensity={0.2} />
        <InteractiveRig />
      </Canvas>
    </div>
  );
}
