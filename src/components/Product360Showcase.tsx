import React, { useState, useRef, useEffect } from 'react';

interface Product360ShowcaseProps {
  framesPath: string; // e.g. "/3d-laptop/ezgif-frame-"
  frameCount: number; // e.g. 240
}

const Product360Showcase: React.FC<Product360ShowcaseProps> = ({ framesPath, frameCount }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload images
  useEffect(() => {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameStr = i.toString().padStart(3, '0');
        img.src = `${framesPath}${frameStr}.jpg`;
    }
  }, [framesPath, frameCount]);

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const x = clientX - left;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    // We map 0 to 1 percentage to 1 to 240
    let frame = Math.floor(percentage * (frameCount - 1)) + 1;
    if (frame < 1) frame = 1;
    if (frame > frameCount) frame = frameCount;

    setCurrentFrame(frame);
  };

  const frameStr = currentFrame.toString().padStart(3, '0');
  const src = `${framesPath}${frameStr}.jpg`;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      className={`relative w-full ${expanded ? 'h-[800px]' : 'h-[600px]'} bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-primary/10 group ring-1 ring-white/10 transition-all duration-500 cursor-ew-resize select-none touch-none`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <img 
            src={src} 
            alt="360 view" 
            className="w-full h-full object-cover sm:object-contain"
            draggable={false}
         />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center z-10 pointer-events-auto">
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
      
      <div className="absolute top-12 left-12 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.4em]">Interactive Experience</span>
        </div>
        <h4 className="text-white text-2xl font-display font-black tracking-tight">3D Product Showcase</h4>
      </div>

      <div className="absolute top-12 right-12 pointer-events-none hidden sm:block">
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-700 ${expanded ? 'bg-primary shadow-[0_0_15px_#2563eb] scale-125' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none border-[30px] border-transparent group-hover:border-primary/5 transition-all duration-1000 rounded-[3rem]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono tracking-widest pointer-events-none animate-pulse bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
        &lt; DRAG TO ROTATE &gt;
      </div>
    </div>
  );
};

export default Product360Showcase;
