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

  // Read filters from URL
  const sortBy = searchParams.get("sort") || "latest";
  const selectedBrands = searchParams.getAll("brand");
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");
  
  // Dynamic filters state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const category = categories.find(c => c.slug === slug);
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
    return products.filter(p =>
      p.categorySlug === slug ||
      p.categorySlug.includes(slug || "") ||
      (category?.subcategories?.some(s => s.slug === p.categorySlug))
    );
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
      <div className="border-b border-border/50 pb-6 last:border-0 transition-all duration-500">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">{title}</h3>
        <div className="space-y-2.5 transition-all duration-500">
          {displayOptions.map(opt => (
            <label key={opt} className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:py-1.5 px-1 rounded-md hover:bg-accent/30">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleFilter(filterKey, opt)}
                  className="peer appearance-none w-4 h-4 rounded border border-border checked:bg-primary checked:border-primary transition-all duration-200"
                />
                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white transition-opacity">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4L4 7L9 1" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{opt}</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
                ({baseProducts.filter(p => p[filterKey as keyof Product] === opt).length})
              </span>
            </label>
          ))}
          {options.length > limit && (
            <button
              onClick={() => setExpandedGroups(prev => ({ ...prev, [filterKey]: !isExpanded }))}
              className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest pt-1 flex items-center gap-1"
            >
              {isExpanded ? "Show Less" : `Show More (${options.length - limit})`}
              <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    );
  };

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
      <div className="border-b border-border/50 pb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Price Range</h3>
        <div className="px-2 space-y-6">
          <Slider
            value={priceSlider}
            onValueChange={(val) => setPriceSlider(val as [number, number])}
            onValueCommit={applyPriceFilter}
            min={priceRange.min}
            max={priceRange.max}
            step={Math.max(100, Math.floor((priceRange.max - priceRange.min) / 100))}
            minStepsBetweenThumbs={1}
            className="text-primary"
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 p-2 bg-accent/50 rounded-lg border border-border/50 text-center">
              <p className="text-[8px] uppercase text-muted-foreground font-bold mb-0.5">Min</p>
              <p className="text-xs font-mono font-bold">{formatPrice(priceSlider[0])}</p>
            </div>
            <div className="w-2 h-px bg-border" />
            <div className="flex-1 p-2 bg-accent/50 rounded-lg border border-border/50 text-center">
              <p className="text-[8px] uppercase text-muted-foreground font-bold mb-0.5">Max</p>
              <p className="text-xs font-mono font-bold">{formatPrice(priceSlider[1])}</p>
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
      {category?.subcategories && category.subcategories.length > 0 && (
        <div className="pt-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Explore More</h3>
          <div className="grid grid-cols-1 gap-2">
            {category.subcategories.map(sub => (
              <Link
                key={sub.slug}
                to={`/category/${sub.slug}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-accent/30 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all group"
              >
                <span className="text-xs font-medium">{sub.name}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
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
          <div className="flex flex-wrap items-center gap-2 mb-4 gsap-reveal">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {selectedBrands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleFilter("brand", brand)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {brand} <X size={12} />
              </button>
            ))}
            {activeFilterKeys.map(({ key, label }) => {
              const selected = searchParams.getAll(key);
              return selected.map(val => (
                <button
                  key={`${key}-${val}`}
                  onClick={() => toggleFilter(key, val)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <span className="opacity-60">{label}:</span> {val} <X size={12} />
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
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {formatPrice(Number(urlMinPrice || priceRange.min))} – {formatPrice(Number(urlMaxPrice || priceRange.max))}
                <X size={12} />
              </button>
            )}
            <button onClick={clearAllFilters} className="text-xs text-destructive hover:underline ml-2 font-medium">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6 sm:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-56 lg:shrink-0 group/sidebar gsap-reveal-sidebar">
            <div className="bg-card border border-border rounded-[var(--radius-outer)] p-4 shadow-[var(--shadow-sm)] lg:sticky lg:top-32">
              <h2 className="font-display font-semibold text-sm mb-4">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setFiltersOpen(false)}>
              <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
              <div
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-[var(--shadow-xl)] p-6 overflow-auto animate-slide-in-left"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-lg">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent">
                    <X size={20} />
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
