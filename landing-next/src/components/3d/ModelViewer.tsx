"use client";

import { useFBX, useAnimations, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ModelViewer({ 
  modelUrl, 
  onRotate,
  onAnimTime 
}: { 
  modelUrl: string;
  onRotate?: (angle: number, distance: number) => void;
  onAnimTime?: (percentage: number) => void;
}) {
  const fbx = useFBX(modelUrl);
  const { actions, names, mixer } = useAnimations(fbx.animations, fbx);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }

    return () => {
      if (names.length > 0 && actions[names[0]]) {
        actions[names[0]]?.fadeOut(0.5);
      }
    };
  }, [fbx, actions, names]);

  // Report the current animation percentage to trigger narrations
  useFrame(() => {
    if (onAnimTime && actions[names[0]]) {
      const clip = actions[names[0]]?.getClip();
      if (clip) {
        const duration = clip.duration;
        const process = (mixer.time % duration) / duration;
        onAnimTime(process);
      }
    }
  });

  const handleControlsChange = () => {
    if (!controlsRef.current || !onRotate) return;
    const angle = THREE.MathUtils.radToDeg(controlsRef.current.getAzimuthalAngle());
    const distance = controlsRef.current.getDistance();
    onRotate(angle, distance);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Environment preset="city" />
      
      <group position={[0, -2, 0]} scale={0.02}>
        <primitive object={fbx} />
      </group>

      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        autoRotate 
        autoRotateSpeed={0.5} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
        onChange={handleControlsChange}
      />
    </>
  );
}
