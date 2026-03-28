"use client";

import { Canvas } from "@react-three/fiber";
import ModelViewer from "@/components/3d/ModelViewer";

export default function ClientModelScene({ 
  activeModel,
  onRotate,
  onAnimTime 
}: { 
  activeModel: "cpr1.fbx" | "bleeding.fbx";
  onRotate?: (angle: number, distance: number) => void;
  onAnimTime?: (percentage: number) => void;
}) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
      {/* The model loaded dynamically inside the safe client canvas */}
      <ModelViewer key={activeModel} modelUrl={"/models/" + activeModel} onRotate={onRotate} onAnimTime={onAnimTime} />
    </Canvas>
  );
}
