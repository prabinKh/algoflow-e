import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";
import { categories, formatPrice } from "@/data/products";
import { megaMenuData } from "@/data/megaMenu";
import { useState, useRef, useEffect } from "react";

export const CategorySidebar = () => {
  const location = useLocation();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (slug: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredSlug(slug);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredSlug(null);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const activeMegaMenu = hoveredSlug ? megaMenuData[hoveredSlug] : null;

  return (
    <div className="relative z-40 h-full">
      <nav className="w-full lg:w-64 h-full shrink-0 bg-card/50 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-3 shadow-2xl group/sidebar flex flex-col transition-all duration-500 ring-1 ring-white/10">
        <div className="px-4 py-3 mb-2 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Categories</p>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
        <ul className="space-y-1.5 transition-all duration-500 flex-1">
          {categories.map(cat => {
            const isActive = location.pathname.includes(cat.slug);
            const isHovered = hoveredSlug === cat.slug;
            
            return (
              <li 
                key={cat.slug}
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className={`flex items-center justify-between px-4 py-3.5 text-sm rounded-2xl transition-all duration-500 group/link
                    ${isActive || isHovered
                      ? "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 translate-x-2"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:translate-x-2"
                    }`}
                >
                  <span className="flex items-center gap-3.5">
                    <span className={`text-xl transition-transform duration-500 ${isHovered ? 'scale-125 rotate-12' : ''}`}>{cat.icon}</span>
                    <span className="tracking-tight font-bold">{cat.name}</span>
                  </span>
                  <ChevronRight size={16} className={`transition-all duration-500 ${isActive || isHovered ? "translate-x-1 opacity-100" : "opacity-0 -translate-x-2"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Sidebar Footer/Support */}
        <div className="mt-6 pt-6 border-t border-primary/5 px-4 pb-2">
          <Link to="/support" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <div className="w-2 h-2 rounded-full bg-accent" />
            Help & Support
          </Link>
        </div>
      </nav>

      {/* Mega Menu Flyout */}
      {activeMegaMenu && (
        <div 
          className="absolute left-full top-0 ml-6 w-[850px] xl:w-[950px] bg-card/95 backdrop-blur-3xl border border-primary/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-left-8 duration-500 flex flex-col ring-1 ring-white/20"
          onMouseEnter={() => handleMouseEnter(hoveredSlug!)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-10 grid grid-cols-3 gap-10 flex-1">
            {activeMegaMenu.columns.map((column, idx) => (
              <div key={idx} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
                    {column.title}
                  </h3>
                </div>
                
                {column.type === 'products' ? (
                  <div className="space-y-6">
                    {column.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="group/item flex gap-5 p-3 rounded-3xl hover:bg-primary/5 transition-all duration-500 border border-transparent hover:border-primary/10 shadow-none hover:shadow-xl">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 border border-primary/5 relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="flex flex-col justify-between py-1 min-w-0">
                          <div>
                            {item.badge && (
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-2 border border-primary/10">
                                {item.badge}
                              </span>
                            )}
                            <Link to={item.href} className="block text-sm font-black text-foreground hover:text-primary transition-colors truncate tracking-tight">
                              {item.name}
                            </Link>
                            <p className="text-sm font-black text-primary mt-1.5">
                              {item.price ? formatPrice(item.price) : 'N/A'}
                            </p>
                          </div>
                          <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-primary/80 transition-all mt-3 group/btn">
                            <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" /> 
                            <span className="tracking-widest">QUICK ADD</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-y-4">
                    {column.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link 
                          to={item.href}
                          className="group/sublink text-sm text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-3 font-bold tracking-tight"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/sublink:bg-primary group-hover/sublink:scale-150 transition-all duration-300" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          {activeMegaMenu.banner && (
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-t border-primary/10 p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {activeMegaMenu.banner.discount}%
                </div>
                <div>
                  <p className="text-lg font-black text-foreground tracking-tight">{activeMegaMenu.banner.text}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Limited time offer. Terms & conditions apply.</p>
                </div>
              </div>
              <Link 
                to={activeMegaMenu.banner.buttonHref}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 tracking-widest uppercase"
              >
                {activeMegaMenu.banner.buttonText}
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
