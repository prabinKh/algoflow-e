import { Link } from "react-router-dom";
import { ArrowRight, Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";

export const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-outer bg-gradient-to-br from-foreground via-foreground/95 to-primary/30 text-background min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex items-center shadow-2xl shadow-primary/10">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-10 p-6 sm:p-10 lg:p-16 w-full">
        <div className="flex-1 space-y-5 sm:space-y-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-pill text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary-foreground mx-auto lg:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            New Tech Arrival
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black tracking-tighter leading-[1.1] text-balance">
            Precision Tools for<br className="hidden sm:block" />
            <span className="text-primary">Modern Workflow</span>
          </h1>
          <p className="text-background/70 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
            Powering performance, built for every ambition. Explore our curated collection of premium electronics.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-10 pt-2 flex-wrap">
            {[
              { icon: Cpu, label: "Processor", value: "Intel® Core™ i5", show: true },
              { icon: MemoryStick, label: "RAM", value: "8 GB DDR5", show: true },
              { icon: HardDrive, label: "Storage", value: "512 GB SSD", showClass: "hidden sm:flex" },
            ].map((spec, i) => (
              <div key={i} className={`${spec.showClass || "flex"} items-center gap-3`}>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-inner bg-primary/20 flex items-center justify-center border border-primary/20 backdrop-blur-sm">
                  <spec.icon size={18} className="text-primary sm:w-5 sm:h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-background/40 font-bold">{spec.label}</p>
                  <p className="text-xs sm:text-sm font-bold text-background">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to="/category/laptops-computers"
              className="btn-primary group"
            >
              Explore Catalog 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center w-full lg:w-auto">
          <div className="relative group">
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="relative bg-gradient-to-br from-white/10 to-transparent p-4 rounded-[2rem] backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop"
                alt="Featured laptop"
                className="w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] object-contain rounded-2xl transform group-hover:scale-[1.05] transition-all duration-700 hero-parallax-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
};
