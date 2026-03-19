import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Environment, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

interface Product3DShowcaseProps {
  mainImage: string;
  additionalImages?: string[];
}

const ImagePlane = ({ url, index, expanded }: { url: string; index: number; expanded: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  
  // Target positions
  // When expanded, spread them out horizontally.
  // When not expanded, stack them slightly offset in Z and rotation.
  const targetX = expanded ? (index - 1) * 2.2 : 0;
  const targetY = expanded ? 0 : 0;
  const targetZ = expanded ? 0 : -index * 0.2;
  const targetRotationY = expanded ? 0 : (index - 1) * 0.15;
  const targetScale = expanded ? 1 : 1 - index * 0.05;

  useFrame((state, delta) => {
    if (ref.current) {
      easing.damp3(ref.current.position, [targetX, targetY, targetZ], 0.25, delta);
      easing.damp(ref.current.rotation, 'y', targetRotationY, 0.25, delta);
      easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.25, delta);
    }
  });

  return (
    <group ref={ref}>
      <Image 
        url={url} 
        scale={[2, 3]} 
        transparent 
        opacity={1} 
        side={THREE.DoubleSide}
      />
    </group>
  );
};

const Product3DShowcase: React.FC<Product3DShowcaseProps> = ({ mainImage, additionalImages = [] }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Ensure we have 3 images for the effect
  const displayImages = [
    mainImage, 
    additionalImages[0] || mainImage, 
    additionalImages[1] || mainImage
  ];

  return (
    <div className="relative w-full h-[500px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <group position={[0, 0, 0]}>
            {displayImages.map((url, i) => (
              <ImagePlane key={i} url={url} index={i} expanded={expanded} />
            ))}
          </group>
        </Float>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
          makeDefault 
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center z-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="group/btn relative px-8 py-3 bg-white text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {expanded ? 'Collapse View' : 'Explore More'}
            <svg 
              className={`w-4 h-4 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
      
      <div className="absolute top-8 left-8 flex flex-col gap-1">
        <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">Interactive Experience</span>
        <h4 className="text-white text-lg font-light tracking-tight">3D Product Showcase</h4>
      </div>

      <div className="absolute top-8 right-8">
        <div className="flex gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${expanded ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${expanded ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${expanded ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-white/5 transition-all duration-700 rounded-3xl" />
    </div>
  );
};

export default Product3DShowcase;
