import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useGSAPReveal } from "@/hooks/useGSAP";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, type Product, formatPrice } from "@/data/products";
import { ChevronRight, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const SORT_OPTIONS = [
  { value: "latest", label: "Sort by latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name: A to Z" },
];

const LAPTOP_FILTER_KEYS = [
  { key: "laptopSeries", label: "Laptop Series" },
  { key: "displaySize", label: "Display Size" },
  { key: "processor", label: "Processor" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "graphicCard", label: "Graphic Card" },
  { key: "generation", label: "Generation" },
] as const;

const MONITOR_FILTER_KEYS = [
  { key: "screenSize", label: "Screen Size" },
  { key: "refreshRate", label: "Refresh Rate" },
  { key: "panelType", label: "Panel Type" },
] as const;

const MOBILE_FILTER_KEYS = [
  { key: "mobileProcessor", label: "Processor" },
  { key: "mobileRam", label: "RAM" },
  { key: "mobileStorage", label: "Storage" },
] as const;

const CategoryPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Reveal animations for products and sidebar
  useGSAPReveal(containerRef, ".gsap-reveal", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 });
  useGSAPReveal(containerRef, ".gsap-reveal-sidebar", { opacity: 0, x: -30, duration: 1 });
  useGSAPReveal(containerRef, ".gsap-reveal-filter", { opacity: 0, y: 20, duration: 0.6, stagger: 0.05 });

  // Read filters from URL
  const sortBy = searchParams.get("sort") || "latest";
  const selectedBrands = searchParams.getAll("brand");
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");
  
  // Dynamic filters state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const category = useMemo(() => {
    for (const cat of categories) {
      if (cat.slug === slug) return cat;
      const sub = cat.subcategories?.find(s => s.slug === slug);
      if (sub) return { ...sub, icon: cat.icon, parent: cat };
    }
    return null;
  }, [slug]);

  const isLaptopCategory = slug === "laptops-computers" || slug?.includes("laptop");
  const isMonitorCategory = slug === "monitors";
  const isMobileCategory = slug === "mobiles-tablets" || slug?.includes("mobile") || slug === "tablets";
  
  const title = category?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Products";

  // Determine which dynamic filters to show
  const activeFilterKeys = useMemo(() => {
    if (isLaptopCategory) return LAPTOP_FILTER_KEYS;
    if (isMonitorCategory) return MONITOR_FILTER_KEYS;
    if (isMobileCategory) return MOBILE_FILTER_KEYS;
    return [];
  }, [isLaptopCategory, isMonitorCategory, isMobileCategory]);

  // Base products for this category
  const baseProducts = useMemo(() => {
    if (slug === "new-arrivals") return products.filter(p => p.isNew);
    if (slug === "best-price") return products.filter(p => p.discount && p.discount > 0);
    if (slug === "popular") return [...products].sort((a, b) => b.reviews - a.reviews);
    
    return products.filter(p => {
      // Direct match
      if (p.categorySlug === slug) return true;
      
      // If this is a parent category, include all products from its subcategories
      if (category && 'subcategories' in category) {
        return category.subcategories?.some(s => s.slug === p.categorySlug);
      }
      
      return false;
    });
  }, [slug, category]);

  // Price range from base products
  const priceRange = useMemo(() => {
    const prices = baseProducts.map(p => p.price);
    if (prices.length === 0) return { min: 0, max: 1000000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [baseProducts]);

  const [priceSlider, setPriceSlider] = useState<[number, number]>([
    urlMinPrice ? Number(urlMinPrice) : priceRange.min,
    urlMaxPrice ? Number(urlMaxPrice) : priceRange.max,
  ]);

  // Sync slider with URL on slug change
  useEffect(() => {
    setPriceSlider([
      urlMinPrice ? Number(urlMinPrice) : priceRange.min,
      urlMaxPrice ? Number(urlMaxPrice) : priceRange.max,
    ]);
  }, [slug, priceRange.min, priceRange.max, urlMinPrice, urlMaxPrice]);

  const availableBrands = useMemo(() => [...new Set(baseProducts.map(p => p.brand))].sort(), [baseProducts]);

  // Available options for dynamic filters
  const dynamicFilterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    activeFilterKeys.forEach(({ key }) => {
      const vals = baseProducts
        .map(p => p[key as keyof Product] as string)
        .filter(Boolean);
      options[key] = [...new Set(vals)].sort();
    });
    return options;
  }, [baseProducts, activeFilterKeys]);

  // Update URL params
  const updateParams = useCallback((key: string, value: string | string[] | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (Array.isArray(value)) {
        next.delete(key);
        value.forEach(v => next.append(key, v));
      } else if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value as string);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const toggleFilter = (key: string, value: string) => {
    const current = searchParams.getAll(key);
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateParams(key, next);
  };

  const applyPriceFilter = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (priceSlider[0] > priceRange.min) next.set("minPrice", String(priceSlider[0]));
      else next.delete("minPrice");
      if (priceSlider[1] < priceRange.max) next.set("maxPrice", String(priceSlider[1]));
      else next.delete("maxPrice");
      return next;
    }, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
    setPriceSlider([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters = useMemo(() => {
    if (selectedBrands.length > 0 || urlMinPrice || urlMaxPrice || sortBy !== "latest") return true;
    return activeFilterKeys.some(({ key }) => searchParams.getAll(key).length > 0);
  }, [selectedBrands, urlMinPrice, urlMaxPrice, sortBy, searchParams, activeFilterKeys]);

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...baseProducts];

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Apply dynamic filters
    activeFilterKeys.forEach(({ key }) => {
      const selected = searchParams.getAll(key);
      if (selected.length > 0) {
        result = result.filter(p => selected.includes(p[key as keyof Product] as string));
      }
    });

    const minP = urlMinPrice ? Number(urlMinPrice) : priceRange.min;
    const maxP = urlMaxPrice ? Number(urlMaxPrice) : priceRange.max;
    result = result.filter(p => p.price >= minP && p.price <= maxP);

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "popularity": result.sort((a, b) => b.reviews - a.reviews); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [baseProducts, selectedBrands, urlMinPrice, urlMaxPrice, sortBy, priceRange, searchParams, activeFilterKeys]);

  const displayBrands = showAllBrands ? availableBrands : availableBrands.slice(0, 5);

  const FilterGroup = ({ title, options, filterKey, limit = 5 }: { title: string, options: string[], filterKey: string, limit?: number }) => {
    const isExpanded = expandedGroups[filterKey];
    const displayOptions = isExpanded ? options : options.slice(0, limit);
    const selected = searchParams.getAll(filterKey);

    if (options.length === 0) return null;

    return (
      <div className="border-b border-border/40 pb-6 last:border-0 gsap-reveal-filter">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">{title}</h3>
          {selected.length > 0 && (
            <button 
              onClick={() => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev);
                  next.delete(filterKey);
                  return next;
                }, { replace: true });
              }}
              className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {displayOptions.map(opt => (
            <label 
              key={opt} 
              className={`flex items-center gap-3 group cursor-pointer transition-all duration-300 py-1.5 px-2 rounded-lg
                ${selected.includes(opt) ? "bg-primary/5 ring-1 ring-primary/10" : "hover:bg-accent/40"}`}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleFilter(filterKey, opt)}
                  className="peer appearance-none w-4 h-4 rounded border border-border/60 checked:bg-primary checked:border-primary transition-all duration-200"
                />
                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white transition-opacity">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4L4 7L9 1" />
                  </svg>
                </div>
              </div>
              <span className={`text-xs transition-colors ${selected.includes(opt) ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                {opt}
              </span>
              <span className="ml-auto text-[9px] font-mono text-muted-foreground/40 font-bold">
                {baseProducts.filter(p => p[filterKey as keyof Product] === opt).length}
              </span>
            </label>
          ))}
          {options.length > limit && (
            <button
              onClick={() => setExpandedGroups(prev => ({ ...prev, [filterKey]: !isExpanded }))}
              className="text-[10px] font-bold text-primary/80 hover:text-primary uppercase tracking-widest pt-2 flex items-center gap-1.5 w-full justify-center border-t border-border/20 mt-2"
            >
              {isExpanded ? "Show Less" : `Show More (${options.length - limit})`}
              <ChevronDown size={12} className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const exploreCategories = useMemo(() => {
    if (category && 'subcategories' in category) return category.subcategories;
    if (category && 'parent' in category) return category.parent.subcategories;
    return null;
  }, [category]);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Clear all */}
      {hasActiveFilters && (
        <button 
          onClick={clearAllFilters} 
          className="w-full py-2 bg-destructive/5 text-destructive hover:bg-destructive/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-destructive/10"
        >
          Reset All Filters
        </button>
      )}

      {/* Price Range Slider */}
      <div className="border-b border-border/40 pb-8 gsap-reveal-filter">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-6">Price Range</h3>
        <div className="px-2 space-y-6">
          <Slider
            value={priceSlider}
            onValueChange={(val) => setPriceSlider(val as [number, number])}
            onValueCommit={applyPriceFilter}
            min={priceRange.min}
            max={priceRange.max}
            step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
            minStepsBetweenThumbs={1}
            className="text-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-accent/30 rounded-xl border border-border/40 text-center group transition-all hover:border-primary/30">
              <p className="text-[8px] uppercase text-muted-foreground/60 font-bold mb-1 tracking-widest">Min Price</p>
              <p className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{formatPrice(priceSlider[0])}</p>
            </div>
            <div className="p-2.5 bg-accent/30 rounded-xl border border-border/40 text-center group transition-all hover:border-primary/30">
              <p className="text-[8px] uppercase text-muted-foreground/60 font-bold mb-1 tracking-widest">Max Price</p>
              <p className="text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">{formatPrice(priceSlider[1])}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <FilterGroup 
        title="Brand" 
        options={availableBrands} 
        filterKey="brand" 
      />

      {/* Dynamic Filters */}
      {activeFilterKeys.map(({ key, label }) => (
        <FilterGroup 
          key={key} 
          title={label} 
          options={dynamicFilterOptions[key] || []} 
          filterKey={key} 
        />
      ))}

      {/* Subcategories */}
      {exploreCategories && exploreCategories.length > 0 && (
        <div className="pt-4 gsap-reveal-filter">
          <div className="flex items-center gap-3 mb-6 border-b border-border/40 pb-4">
            <div className="w-1.5 h-6 bg-accent rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Explore More</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {exploreCategories.map(sub => (
              <Link
                key={sub.slug}
                to={`/category/${sub.slug}`}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group
                  ${slug === sub.slug 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 translate-x-1" 
                    : "bg-accent/20 hover:bg-primary/10 hover:text-primary border-transparent hover:border-primary/20 hover:translate-x-1"
                  }`}
              >
                <span className="text-xs font-bold tracking-tight">{sub.name}</span>
                <ChevronRight size={16} className={`transition-all duration-500 ${slug === sub.slug ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"}`} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background pb-16 lg:pb-0">
      <Header />
      <main className="neo-container py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-4 sm:mb-6 gsap-reveal">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{title}</span>
        </nav>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 gsap-reveal">
            <div className="flex items-center gap-2 mr-2">
              <SlidersHorizontal size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Active filters:</span>
            </div>
            {selectedBrands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleFilter("brand", brand)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/10 hover:bg-primary/10 transition-all"
              >
                {brand} <X size={10} className="opacity-60" />
              </button>
            ))}
            {activeFilterKeys.map(({ key, label }) => {
              const selected = searchParams.getAll(key);
              return selected.map(val => (
                <button
                  key={`${key}-${val}`}
                  onClick={() => toggleFilter(key, val)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/10 hover:bg-primary/10 transition-all"
                >
                  <span className="opacity-50">{label}:</span> {val} <X size={10} className="opacity-60" />
                </button>
              ));
            })}
            {(urlMinPrice || urlMaxPrice) && (
              <button
                onClick={() => {
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.delete("minPrice");
                    next.delete("maxPrice");
                    return next;
                  }, { replace: true });
                  setPriceSlider([priceRange.min, priceRange.max]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/10 hover:bg-primary/10 transition-all"
              >
                {formatPrice(Number(urlMinPrice || priceRange.min))} – {formatPrice(Number(urlMaxPrice || priceRange.max))}
                <X size={10} className="opacity-60" />
              </button>
            )}
            <button 
              onClick={clearAllFilters} 
              className="text-[10px] font-bold text-destructive hover:text-destructive/80 uppercase tracking-widest ml-2 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6 sm:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-64 lg:shrink-0 group/sidebar gsap-reveal-sidebar">
            <div className="glass-card p-6 lg:sticky lg:top-32 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 border-primary/10 ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-4">
                <h2 className="font-display font-black text-sm uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-primary" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden" onClick={() => setFiltersOpen(false)}>
              <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md animate-in fade-in duration-300" />
              <div
                className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card shadow-2xl p-8 overflow-auto animate-in slide-in-from-left duration-500 rounded-r-[3rem] border-r border-primary/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                  <h2 className="font-display font-black text-xl uppercase tracking-widest text-foreground flex items-center gap-3">
                    <SlidersHorizontal size={20} className="text-primary" />
                    Filters
                  </h2>
                  <button 
                    onClick={() => setFiltersOpen(false)} 
                    className="p-3 text-muted-foreground hover:text-primary rounded-2xl hover:bg-primary/5 transition-all active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 gsap-reveal">
              <div>
                <h1 className="text-lg sm:text-xl font-display font-bold truncate">{title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} products found</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <SlidersHorizontal size={14} /> Filters
                  {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                <select
                  value={sortBy}
                  onChange={e => updateParams("sort", e.target.value === "latest" ? null : e.target.value)}
                  className="text-xs sm:text-sm bg-accent border border-border rounded-lg px-2 sm:px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 sm:py-24 text-muted-foreground gsap-reveal">
                <p className="text-base sm:text-lg mb-2">No products found</p>
                <p className="text-xs sm:text-sm">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="mt-4 btn-outline text-xs">Clear all filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 gsap-reveal">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CategoryPage;
