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
    <div className="relative w-full h-[600px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-primary/10 group ring-1 ring-white/10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <Environment preset="night" />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
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
      <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="group/btn relative px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden tracking-widest uppercase text-xs"
        >
          <span className="relative z-10 flex items-center gap-3">
            {expanded ? 'Collapse View' : 'Explore Details'}
            <svg 
              className={`w-4 h-4 transition-transform duration-700 ${expanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
      
      <div className="absolute top-12 left-12 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.4em]">Interactive Experience</span>
        </div>
        <h4 className="text-white text-2xl font-display font-black tracking-tight">3D Product Showcase</h4>
      </div>

      <div className="absolute top-12 right-12">
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-700 ${expanded ? 'bg-primary shadow-[0_0_15px_#2563eb] scale-125' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none border-[30px] border-transparent group-hover:border-primary/5 transition-all duration-1000 rounded-[3rem]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Product3DShowcase;
