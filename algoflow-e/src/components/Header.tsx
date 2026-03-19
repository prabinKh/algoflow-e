import { useState, useSyncExternalStore, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Package, Star, MapPin, Heart, GitCompareArrows, LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import { cartStore } from "@/data/cart";
import { wishlistStore } from "@/data/wishlist";
import { compareStore } from "@/data/compare";
import { products, categories } from "@/data/products";
import { CartSidebar } from "./CartSidebar";
import { megaMenuData } from "@/data/megaMenu";
import { formatPrice } from "@/data/products";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedMenuCat, setExpandedMenuCat] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const dropdownRef = useState<HTMLDivElement | null>(null)[0]; // We'll use a ref instead
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Close categories when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCategories && !target.closest('.category-dropdown-container')) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategories]);

  useEffect(() => {
    setShowCategories(false);
  }, [location.pathname]);

  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const wishlistItems = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot);
  const compareItems = useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const searchResults = searchQuery.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-[var(--shadow-sm)]">
        <div className="neo-container">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="text-xl sm:text-2xl font-display font-bold tracking-tighter text-primary">
                  algoflow-e
                </div>
              </Link>

              {/* Mobile Category Toggle */}
              <div className="lg:hidden relative category-dropdown-container">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <LayoutGrid size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Cats</span>
                </button>
                
                {showCategories && (
                  <div className="fixed inset-0 bg-background z-[100] flex flex-col animate-in fade-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={20} className="text-primary" />
                        <h2 className="text-lg font-bold uppercase tracking-widest">Categories</h2>
                      </div>
                      <button 
                        onClick={() => setShowCategories(false)} 
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-4">
                        {categories.map(cat => {
                          const isExpanded = expandedCat === cat.slug;
                          return (
                            <div key={cat.slug} className="space-y-2">
                              <button
                                onClick={() => setExpandedCat(isExpanded ? null : cat.slug)}
                                className={`flex items-center justify-between w-full p-4 border rounded-2xl transition-all ${
                                  isExpanded 
                                    ? "bg-primary/5 border-primary/30 shadow-sm" 
                                    : "bg-accent/30 border-border hover:bg-accent/50"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl shadow-sm transition-colors ${
                                    isExpanded ? "bg-primary text-primary-foreground" : "bg-card"
                                  }`}>
                                    {cat.icon}
                                  </span>
                                  <span className={`font-bold text-sm ${isExpanded ? "text-primary" : "text-foreground"}`}>
                                    {cat.name}
                                  </span>
                                </div>
                                <ChevronDown 
                                  size={18} 
                                  className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-primary" : "text-muted-foreground"}`} 
                                />
                              </button>

                              {/* Accordion Content */}
                              {isExpanded && megaMenuData[cat.slug] && (
                                <div className="mx-2 p-4 bg-card border border-border rounded-2xl space-y-6 animate-in slide-in-from-top-2 duration-300">
                                  {/* Quick Link to Category Page */}
                                  <Link
                                    to={`/category/${cat.slug}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/20 transition-colors"
                                    onClick={() => setShowCategories(false)}
                                  >
                                    View All {cat.name}
                                  </Link>

                                  {megaMenuData[cat.slug].columns.map((col, idx) => (
                                    <div key={idx} className="space-y-3">
                                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <span className="w-1 h-3 bg-primary/40 rounded-full" />
                                        {col.title}
                                      </h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        {col.items.map((item, iIdx) => (
                                          <Link 
                                            key={iIdx} 
                                            to={item.href} 
                                            className="flex flex-col gap-2 p-2 rounded-xl hover:bg-accent transition-colors group"
                                            onClick={() => setShowCategories(false)}
                                          >
                                            {col.type === 'products' && item.image ? (
                                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                              </div>
                                            ) : null}
                                            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                                              {item.name}
                                            </span>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 border-t border-border bg-accent/10">
                      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em]">
                        algoflow-e navigation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search products, brands, specs..."
                  className="w-full h-10 pl-4 pr-10 bg-accent border border-border rounded-lg text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20
                           focus:border-primary transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <Search size={16} />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-[var(--shadow-lg)] overflow-hidden z-50">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="price-display text-xs">Rs.{product.price.toLocaleString()}</p>
                          <span className="text-[10px] text-muted-foreground font-mono">{product.brand}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-center py-2.5 text-xs text-primary font-medium hover:bg-accent/50 border-t border-border transition-colors"
                    onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                  >
                    View all results →
                  </Link>
                </div>
              )}
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link to="/compare" className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors relative">
                <GitCompareArrows size={14} />
                <span className="hidden md:inline">Compare</span>
                {compareItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {compareItems.length}
                  </span>
                )}
              </Link>
              <Link to="/wishlist" className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors relative">
                <Heart size={14} />
                <span className="hidden md:inline">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link to="/track-orders" className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors">
                <Package size={14} />
                <span className="hidden md:inline">Track</span>
              </Link>
              <Link to="/signin" className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors">
                <User size={16} />
                <span className="hidden md:inline">Sign In</span>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-2 sm:px-3 py-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-fade-in-up">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-10 bg-accent border border-border rounded-lg text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Sub nav */}
        <div className="hidden lg:block border-t border-border bg-card/50">
          <div className="neo-container flex items-center justify-between h-10">
            <div className="flex items-center h-full gap-6">
              {/* Category Toggle Button - Only on non-home pages */}
              {!isHomePage && (
                <div className="relative h-full category-dropdown-container">
                  <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className={`flex items-center gap-2 px-4 h-full text-xs font-bold uppercase tracking-wider transition-all
                      ${showCategories 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-accent text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    <LayoutGrid size={16} />
                    Browse Categories
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Categories Dropdown */}
                  {showCategories && (
                    <div className="absolute top-full left-0 w-64 bg-card border border-border shadow-[var(--shadow-xl)] z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <ul className="space-y-0.5 px-2">
                        {categories.map(cat => (
                          <li 
                            key={cat.slug}
                            onMouseEnter={() => setHoveredCat(cat.slug)}
                            onMouseLeave={() => setHoveredCat(null)}
                            className="relative"
                          >
                            <Link
                              to={`/category/${cat.slug}`}
                              className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                              onClick={() => setShowCategories(false)}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className="text-base">{cat.icon}</span>
                                {cat.name}
                              </span>
                              <ChevronRight size={14} className="opacity-40" />
                            </Link>

                            {/* Mega Menu for Dropdown */}
                            {hoveredCat === cat.slug && megaMenuData[cat.slug] && (
                              <div className="absolute left-full top-[-8px] ml-2 w-[700px] bg-card border border-border rounded-xl shadow-[var(--shadow-2xl)] p-6 z-[70] animate-in fade-in slide-in-from-left-2 duration-200 grid grid-cols-3 gap-6">
                                {megaMenuData[cat.slug].columns.map((col, idx) => (
                                  <div key={idx} className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                                      {col.title}
                                    </h4>
                                    {col.type === 'products' ? (
                                      <div className="space-y-3">
                                        {col.items.map((item, iIdx) => (
                                          <Link key={iIdx} to={item.href} className="flex gap-3 group/mitem">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-muted object-cover" />
                                            <div className="min-w-0">
                                              <p className="text-xs font-semibold truncate group-hover/mitem:text-primary transition-colors">{item.name}</p>
                                              <p className="text-[10px] text-muted-foreground">{item.price ? formatPrice(item.price) : ''}</p>
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    ) : (
                                      <ul className="space-y-1.5">
                                        {col.items.map((item, iIdx) => (
                                          <li key={iIdx}>
                                            <Link to={item.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                              {item.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Link to="/emi" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <Star size={12} className="text-warning" /> EMI
              </Link>
              <Link to="/feedback" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                Feedback
              </Link>
            </div>
            <Link to="/service-center" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              <MapPin size={12} /> Service Center
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <nav className="absolute left-0 top-0 bottom-0 w-80 bg-card shadow-[var(--shadow-xl)] flex flex-col animate-slide-in-left" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="text-xl font-display font-bold tracking-tighter text-primary">
                algoflow-e
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-accent rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Main Categories</h3>
                  <div className="space-y-1">
                    {categories.map(cat => {
                      const isExpanded = expandedMenuCat === cat.slug;
                      return (
                        <div key={cat.slug} className="space-y-1">
                          <button
                            onClick={() => setExpandedMenuCat(isExpanded ? null : cat.slug)}
                            className={`flex items-center gap-3 w-full px-3 py-3 text-sm rounded-xl transition-colors ${
                              isExpanded ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                            <ChevronDown 
                              size={14} 
                              className={`ml-auto transition-transform duration-300 ${isExpanded ? "rotate-180" : "opacity-40"}`} 
                            />
                          </button>

                          {isExpanded && megaMenuData[cat.slug] && (
                            <div className="ml-9 py-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
                              {megaMenuData[cat.slug].columns.map((col, idx) => (
                                <div key={idx} className="space-y-2">
                                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    {col.title}
                                  </h4>
                                  <div className="space-y-1">
                                    {col.items.map((item, iIdx) => (
                                      <Link
                                        key={iIdx}
                                        to={item.href}
                                        className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <Link
                                to={`/category/${cat.slug}`}
                                className="block py-2 text-xs font-bold text-primary hover:underline"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                View All {cat.name} →
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Account & Support</h3>
                  <div className="space-y-1">
                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                      <Heart size={18} className="text-destructive" /> 
                      <span>Wishlist</span>
                      {wishlistItems.length > 0 && <span className="ml-auto bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlistItems.length}</span>}
                    </Link>
                    <Link to="/compare" className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                      <GitCompareArrows size={18} className="text-primary" /> 
                      <span>Compare</span>
                      {compareItems.length > 0 && <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{compareItems.length}</span>}
                    </Link>
                    <Link to="/track-orders" className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                      <Package size={18} className="text-emerald-500" /> 
                      <span>Track Orders</span>
                    </Link>
                    <Link to="/service-center" className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                      <MapPin size={18} className="text-muted-foreground" /> 
                      <span>Service Center</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-accent/10">
              <Link 
                to="/signin" 
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                Sign In / Register
              </Link>
            </div>
          </nav>
        </div>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
