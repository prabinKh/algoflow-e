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
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="neo-container">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all active:scale-95"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-2xl sm:text-3xl font-display font-black tracking-tighter text-foreground uppercase italic leading-none">
                algoflow<span className="text-primary group-hover:animate-pulse">.e</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl relative">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search for products, brands, tech..."
                  className="w-full h-12 pl-12 pr-12 bg-accent/50 border border-border/50 rounded-2xl text-sm font-medium
                           placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10
                           focus:border-primary focus:bg-card transition-all"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-3 w-full bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="flex items-center gap-4 p-3 hover:bg-accent rounded-xl transition-all group/item"
                        onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-accent overflow-hidden shrink-0 border border-border/50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate group-hover/item:text-primary transition-colors">{product.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-xs font-mono font-bold text-primary">{formatPrice(product.price)}</p>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{product.brand}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-center py-4 text-xs text-primary font-bold uppercase tracking-widest hover:bg-primary/5 border-t border-border/50 transition-colors"
                    onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                  >
                    View all results
                  </Link>
                </div>
              )}
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/compare" className="hidden md:flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all relative group">
                <GitCompareArrows size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden xl:inline">Compare</span>
                {compareItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    {compareItems.length}
                  </span>
                )}
              </Link>
              
              <Link to="/wishlist" className="hidden md:flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all relative group">
                <Heart size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-destructive/20">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <div className="h-8 w-px bg-border/50 mx-1 hidden md:block" />

              <Link to="/signin" className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/5 transition-all group">
                <User size={20} className="group-hover:translate-y-[-1px] transition-transform" />
                <span className="hidden lg:inline">Account</span>
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 group"
              >
                <ShoppingCart size={20} className="group-hover:rotate-[-12deg] transition-transform" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-foreground text-background text-[10px] font-black rounded-full flex items-center justify-center shadow-xl border-2 border-card animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-11 pl-11 pr-4 bg-accent/50 border border-border/50 rounded-xl text-sm font-medium
                         placeholder:text-muted-foreground/60 focus:outline-none focus:ring-4 focus:ring-primary/10
                         focus:border-primary focus:bg-card transition-all"
              />
            </form>
          </div>
        </div>

        {/* Sub nav */}
        <div className="hidden lg:block border-t border-border/50 bg-card/50">
          <div className="neo-container flex items-center justify-between h-12">
            <div className="flex items-center h-full gap-8">
              {/* Category Toggle Button - Only on non-home pages */}
              {!isHomePage && (
                <div className="relative h-full category-dropdown-container">
                  <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className={`flex items-center gap-3 px-6 h-full text-[11px] font-black uppercase tracking-[0.2em] transition-all
                      ${showCategories 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-accent/50 text-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    <LayoutGrid size={16} />
                    Categories
                    <ChevronDown size={14} className={`transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Categories Dropdown */}
                  {showCategories && (
                    <div className="absolute top-full left-0 w-72 bg-card border border-border/50 shadow-2xl z-[60] py-3 animate-in fade-in slide-in-from-top-2 duration-200 rounded-b-2xl">
                      <ul className="space-y-1 px-2">
                        {categories.map(cat => (
                          <li 
                            key={cat.slug}
                            onMouseEnter={() => setHoveredCat(cat.slug)}
                            onMouseLeave={() => setHoveredCat(null)}
                            className="relative"
                          >
                            <Link
                              to={`/category/${cat.slug}`}
                              className="flex items-center justify-between px-4 py-3 text-xs font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all group/cat"
                              onClick={() => setShowCategories(false)}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-xl group-hover/cat:scale-110 transition-transform">{cat.icon}</span>
                                <span className="uppercase tracking-wider">{cat.name}</span>
                              </span>
                              <ChevronRight size={14} className="opacity-0 group-hover/cat:opacity-100 transition-all -translate-x-2 group-hover/cat:translate-x-0" />
                            </Link>

                            {/* Mega Menu for Dropdown */}
                            {hoveredCat === cat.slug && megaMenuData[cat.slug] && (
                              <div className="absolute left-full top-[-12px] ml-3 w-[800px] bg-card border border-border/50 rounded-2xl shadow-2xl p-8 z-[70] animate-in fade-in slide-in-from-left-2 duration-200 grid grid-cols-3 gap-8">
                                {megaMenuData[cat.slug].columns.map((col, idx) => (
                                  <div key={idx} className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary border-b border-primary/10 pb-3">
                                      {col.title}
                                    </h4>
                                    {col.type === 'products' ? (
                                      <div className="space-y-4">
                                        {col.items.map((item, iIdx) => (
                                          <Link key={iIdx} to={item.href} className="flex gap-4 group/mitem">
                                            <div className="w-14 h-14 rounded-xl bg-accent overflow-hidden shrink-0 border border-border/50">
                                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/mitem:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="min-w-0 flex flex-col justify-center">
                                              <p className="text-xs font-bold truncate group-hover/mitem:text-primary transition-colors uppercase tracking-tight">{item.name}</p>
                                              <p className="text-[10px] font-mono font-bold text-muted-foreground mt-1">{item.price ? formatPrice(item.price) : ''}</p>
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    ) : (
                                      <ul className="space-y-2.5">
                                        {col.items.map((item, iIdx) => (
                                          <li key={iIdx}>
                                            <Link to={item.href} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link">
                                              <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/link:bg-primary transition-colors" />
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

              <div className="flex items-center gap-8">
                <Link to="/emi" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
                  <Star size={14} className="text-warning group-hover:rotate-45 transition-transform" /> 
                  <span>EMI Plans</span>
                </Link>
                <Link to="/feedback" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                  Feedback
                </Link>
                <Link to="/track-orders" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                  Track Order
                </Link>
              </div>
            </div>
            <Link to="/service-center" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
              <MapPin size={14} className="text-primary group-hover:animate-bounce" /> 
              <span>Service Center</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-md lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <nav className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card shadow-2xl flex flex-col animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-accent/5">
              <div className="text-2xl font-display font-black tracking-tighter text-foreground uppercase italic">
                algoflow<span className="text-primary">.e</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 hover:bg-primary/5 rounded-xl transition-all">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-primary/20" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => {
                    const isExpanded = expandedMenuCat === cat.slug;
                    return (
                      <div key={cat.slug} className="space-y-2">
                        <button
                          onClick={() => setExpandedMenuCat(isExpanded ? null : cat.slug)}
                          className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${
                            isExpanded ? "bg-primary/10 text-primary shadow-sm" : "bg-accent/30 text-foreground hover:bg-accent/50"
                          }`}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-bold text-sm uppercase tracking-wider">{cat.name}</span>
                          <ChevronDown 
                            size={16} 
                            className={`ml-auto transition-transform duration-300 ${isExpanded ? "rotate-180" : "opacity-40"}`} 
                          />
                        </button>

                        {isExpanded && megaMenuData[cat.slug] && (
                          <div className="ml-4 pl-4 border-l-2 border-primary/10 py-2 space-y-6 animate-in slide-in-from-top-2 duration-300">
                            {megaMenuData[cat.slug].columns.map((col, idx) => (
                              <div key={idx} className="space-y-3">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                  {col.title}
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {col.items.map((item, iIdx) => (
                                    <Link
                                      key={iIdx}
                                      to={item.href}
                                      className="block py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
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
                              className="inline-flex items-center gap-2 py-3 px-6 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              View All {cat.name} <ChevronRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-10 border-t border-border/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-primary/20" />
                  Support
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/track-orders" className="flex flex-col items-center gap-3 p-4 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                    <Package size={20} className="text-primary" /> 
                    <span className="text-[10px] font-bold uppercase tracking-wider">Track</span>
                  </Link>
                  <Link to="/service-center" className="flex flex-col items-center gap-3 p-4 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                    <MapPin size={20} className="text-muted-foreground" /> 
                    <span className="text-[10px] font-bold uppercase tracking-wider">Service</span>
                  </Link>
                  <Link to="/emi" className="flex flex-col items-center gap-3 p-4 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                    <Star size={20} className="text-warning" /> 
                    <span className="text-[10px] font-bold uppercase tracking-wider">EMI</span>
                  </Link>
                  <Link to="/feedback" className="flex flex-col items-center gap-3 p-4 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                    <Star size={20} className="text-emerald-500" /> 
                    <span className="text-[10px] font-bold uppercase tracking-wider">Feedback</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-accent/5">
              <Link 
                to="/signin" 
                className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
