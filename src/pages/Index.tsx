import { useRef } from "react";
import { useGSAPReveal, useGSAPParallax } from "@/hooks/useGSAP";
import { gsap } from "@/hooks/useGSAP";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CategorySidebar } from "@/components/CategorySidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";
import { ProductCard } from "@/components/ProductCard";
import { BrandStrip } from "@/components/BrandStrip";
import { DealCountdown } from "@/components/DealCountdown";
import {
  getNewArrivals,
  getBestPrice,
  getDealOfTheWeek,
  getPopular,
  products,
} from "@/data/products";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dealSectionRef = useRef<HTMLElement>(null);

  const newArrivals = getNewArrivals();
  const bestPrice = getBestPrice().slice(0, 6);
  const deals = getDealOfTheWeek();
  const popular = getPopular();
  const laptops = products.filter(p => p.categorySlug.includes("laptop")).slice(0, 4);
  const mobiles = products.filter(p => p.categorySlug.includes("mobil")).slice(0, 6);

  // Reveal animations for sections
  useGSAPReveal(containerRef, ".gsap-reveal", { opacity: 0, y: 50, duration: 1, stagger: 0.2 });

  // Parallax effect for deal section
  useGSAPReveal(containerRef, ".deal-section-glow", { 
    scale: 0.95, 
    opacity: 0.8, 
    duration: 1.5 
  }, { 
    scrub: 1, 
    start: "top bottom", 
    end: "center center" 
  });

  // Parallax for hero image
  useGSAPParallax(containerRef, ".hero-parallax-img", 15);
  
  // Parallax for deal background elements
  useGSAPParallax(containerRef, ".deal-bg-1", -30);
  useGSAPParallax(containerRef, ".deal-bg-2", 40);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pb-16 lg:pb-0">
      <Header />
      <main>
        <div className="neo-container gsap-reveal">
          {/* Hero + Categories */}
          <div className="flex gap-4 sm:gap-6 py-4 sm:py-8 items-stretch">
            <div className="hidden lg:block h-full">
              <CategorySidebar />
            </div>
            <div className="flex-1 min-w-0">
              <HeroBanner />
            </div>
          </div>

          {/* New Arrivals - Full Width (First) */}
          <div className="gsap-reveal">
            <ProductSection 
              title="New Arrivals" 
              products={newArrivals.slice(0, 5)} 
              viewAllLink="/category/new-arrivals" 
            />
          </div>
        </div>

        <div className="neo-container">
          {/* Deal of the Week */}
          <section ref={dealSectionRef} className="relative overflow-hidden py-16 sm:py-24 my-20 rounded-[3rem] sm:rounded-[4rem] bg-gradient-to-br from-primary/5 via-accent/10 to-background border border-primary/10 deal-section-glow shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none deal-bg-1" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none deal-bg-2" />
            
            <div className="relative z-10 px-6 sm:px-16">
              <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-16 sm:mb-24 gap-12">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left gsap-reveal">
                  <div className="w-2.5 h-20 bg-primary rounded-full shadow-[0_0_30px_rgba(37,99,235,0.6)] hidden sm:block" />
                  <div>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-5 border border-primary/20">
                      Limited Time Offer
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tighter leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Deal Of The Week
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-lg mx-auto sm:mx-0 leading-relaxed font-medium">
                      Experience the future of electronics with our handpicked weekly exclusives at prices that won't last.
                    </p>
                  </div>
                </div>
                <div className="bg-card/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-primary/10 shadow-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-12 w-full lg:w-auto gsap-reveal ring-1 ring-white/20">
                  <div className="flex flex-col items-center sm:items-start gap-1">
                    <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.3em] whitespace-nowrap">Offer Ends In:</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Hurry, stock is limited!</span>
                  </div>
                  <DealCountdown />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 gsap-reveal">
                {deals.slice(0, 5).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
          
          {/* Best Price - Full Width (Second) */}
          <section className="bg-accent/5 py-16 sm:py-24 lg:py-32 border-y border-border/10 gsap-reveal my-20 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12">
            <div className="neo-container">
              <ProductSection 
                title="Best Price" 
                products={bestPrice.slice(0, 5)} 
                viewAllLink="/category/best-price" 
              />
            </div>
          </section>

          {/* Laptops */}
          <div className="gsap-reveal">
            <ProductSection title="Laptops" products={laptops} viewAllLink="/category/laptops-computers" />
          </div>

          {/* Mobiles */}
          <div className="gsap-reveal">
            <ProductSection title="Mobiles And Tablets" products={mobiles.slice(0, 5)} viewAllLink="/category/mobiles-tablets" />
          </div>

          {/* Popular */}
          <div className="gsap-reveal">
            <ProductSection title="Popular" products={popular.slice(0, 5)} viewAllLink="/category/popular" />
          </div>

          {/* Brand Strip */}
          <div className="gsap-reveal">
            <BrandStrip />
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
