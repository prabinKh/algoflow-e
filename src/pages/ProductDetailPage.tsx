import { useParams, Link } from "react-router-dom";
import { useState, useSyncExternalStore, useRef } from "react";
import { useGSAPReveal, useGSAPParallax } from "@/hooks/useGSAP";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { wishlistStore } from "@/data/wishlist";
import { compareStore } from "@/data/compare";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, products, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { ChevronRight, ShoppingCart, Truck, Shield, RotateCcw, Star, CheckCircle, Heart, GitCompareArrows, Search, Box } from "lucide-react";
import { toast } from "sonner";
import Product3DShowcase from "@/components/Product3DShowcase";
import Product360Showcase from "@/components/Product360Showcase";
import { motion } from "motion/react";

const ProductDetailPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  const scrollToShowcase = () => {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reveal animations
  useGSAPReveal(containerRef, ".gsap-reveal", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 });
  useGSAPReveal(containerRef, ".gsap-reveal-img", { opacity: 0, scale: 0.9, duration: 1 });
  
  // Parallax for product image
  useGSAPParallax(containerRef, ".product-parallax-img", 10);

  // Subscribe to stores to trigger re-renders
  useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot);
  useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="neo-container text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you are looking for might have been moved, deleted, or the link is incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="neo-button bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Back to Home
              </Link>
              <Link 
                to="/search" 
                className="neo-button bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Search Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const related = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    cartStore.addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={containerRef}>
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="neo-container space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${product.categorySlug}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Images */}
            <div className="gsap-reveal-img relative group">
              <div className="bg-gradient-to-br from-accent to-muted rounded-[var(--radius-outer)] p-6 sm:p-8 flex items-center justify-center aspect-square border border-border/50 shadow-[var(--shadow-sm)] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 product-parallax-img"
                />
                
                <button 
                  onClick={scrollToShowcase}
                  className="absolute bottom-4 right-4 bg-emerald-500/90 hover:bg-emerald-500 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-2 px-4"
                >
                  <Box size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">View 3D</span>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 sm:space-y-6 gsap-reveal">
              <div>
                <p className="spec-label mb-2">{product.brand}</p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold tracking-tight">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-border"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Specs */}
              <div className="flex gap-2 flex-wrap">
                {product.specs.map((spec, i) => (
                  <span key={i} className="px-3 py-1.5 bg-accent border border-border/50 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 bg-accent/50 border border-border/50 rounded-xl p-4">
                <span className="price-display text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="price-original text-base sm:text-lg">{formatPrice(product.originalPrice)}</span>
                )}
                {product.discount && (
                  <span className="neo-badge-sale ml-auto">{product.discount}% off</span>
                )}
              </div>

              {/* Stock */}
              <div className="text-sm flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <CheckCircle size={16} className="text-success" />
                    <span className="text-success font-medium font-mono">
                      In Stock{product.stockCount ? `: ${product.stockCount} Units` : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={() => { const added = wishlistStore.toggle(product); toast(added ? "Added to wishlist" : "Removed from wishlist"); }}
                  className={`btn-outline py-3 px-4 ${wishlistStore.has(product.id) ? "text-destructive border-destructive/20 bg-destructive/5" : ""}`}
                  title="Add to wishlist"
                >
                  <Heart size={18} className={wishlistStore.has(product.id) ? "fill-current" : ""} />
                </button>
                <button
                  onClick={() => { const r = compareStore.toggle(product); if (r === null) toast.error("Max 4 products"); else toast(r ? "Added to compare" : "Removed"); }}
                  className={`btn-outline py-3 px-4 ${compareStore.has(product.id) ? "text-primary border-primary/20 bg-primary/5" : ""}`}
                  title="Add to compare"
                >
                  <GitCompareArrows size={18} />
                </button>
                <button
                  onClick={scrollToShowcase}
                  className="btn-outline py-3 px-4 text-emerald-500 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"
                  title="View 3D Experience"
                >
                  <Box size={18} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border">
                {[
                  { icon: Truck, label: "Free Delivery" },
                  { icon: Shield, label: "3 Year Warranty" },
                  { icon: RotateCcw, label: "Easy Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-accent/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Showcase Section */}
          <div ref={showcaseRef} className="mt-12 sm:mt-16 gsap-reveal">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-1 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              <h2 className="section-title">Immersive 3D Experience</h2>
            </div>
            {product.slug === "dell-inspiron-15-3520" ? (
              <Product360Showcase 
                framesPath="/3d-laptop/ezgif-frame-" 
                frameCount={240} 
              />
            ) : (
              <Product3DShowcase 
                mainImage={product.image} 
                additionalImages={product.images} 
              />
            )}
          </div>

          {/* Tabs */}
          <div className="mt-12 sm:mt-16 gsap-reveal">
            <div className="flex border-b border-border gap-0">
              {(["description", "specs"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors capitalize
                    ${activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab === "specs" ? "Specifications" : "Description"}
                </button>
              ))}
            </div>
            <div className="py-6 sm:py-8">
              {activeTab === "description" ? (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {product.description}
                </p>
              ) : (
                <div className="max-w-lg">
                  {product.detailedSpecs ? (
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(product.detailedSpecs).map(([key, val]) => (
                          <tr key={key} className="border-b border-border">
                            <td className="py-3 font-medium text-foreground w-32 sm:w-40">{key}</td>
                            <td className="py-3 text-muted-foreground font-mono text-xs">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No detailed specifications available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="py-8 sm:py-12 border-t border-border gsap-reveal">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="section-title">Related Products</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ProductDetailPage;
