import { brands } from "@/data/products";

export const BrandStrip = () => {
  return (
    <section className="py-12 sm:py-20 border-t border-border/10 bg-accent/5">
      <div className="neo-container">
        <div className="flex items-center gap-6 mb-12 sm:mb-16">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-primary/60 whitespace-nowrap bg-card px-6 py-2 rounded-full border border-primary/10 shadow-sm">
            Authorized Partners
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/40" />
        </div>
        
        <div className="flex items-center justify-center gap-10 sm:gap-16 md:gap-24 flex-wrap">
          {brands.map(brand => (
            <div
              key={brand.name}
              className="group relative"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-muted-foreground/10 group-hover:text-primary transition-all duration-700 cursor-pointer tracking-tighter grayscale group-hover:grayscale-0 group-hover:scale-110">
                {brand.logo}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary/20 group-hover:w-full transition-all duration-500 rounded-full blur-[2px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
