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
      <nav className="w-full lg:w-56 h-full shrink-0 bg-card border border-border rounded-[var(--radius-outer)] p-2 shadow-[var(--shadow-sm)] group/sidebar flex flex-col transition-all duration-500">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300">Categories</p>
        <ul className="space-y-0.5 transition-all duration-500 flex-1">
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
                  className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-300
                    ${isActive || isHovered
                      ? "bg-primary/10 text-primary font-medium border border-primary/20 py-4"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:py-4"
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{cat.icon}</span>
                    <span className="transition-all duration-300 group-hover/sidebar:translate-x-1">{cat.name}</span>
                  </span>
                  <ChevronRight size={14} className={isActive || isHovered ? "text-primary translate-x-0.5" : "text-muted-foreground/40 transition-all duration-300 group-hover/sidebar:translate-x-1"} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mega Menu Flyout */}
      {activeMegaMenu && (
        <div 
          className="absolute left-full top-0 ml-4 w-[800px] xl:w-[900px] bg-card border border-border rounded-[var(--radius-outer)] shadow-[var(--shadow-xl)] overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col"
          onMouseEnter={() => handleMouseEnter(hoveredSlug!)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-8 grid grid-cols-3 gap-8 flex-1">
            {activeMegaMenu.columns.map((column, idx) => (
              <div key={idx} className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground border-b border-border pb-3">
                  {column.title}
                </h3>
                
                {column.type === 'products' ? (
                  <div className="space-y-4">
                    {column.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="group/item flex gap-4 p-2 rounded-xl hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            {item.badge && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider mb-1">
                                {item.badge}
                              </span>
                            )}
                            <Link to={item.href} className="block text-sm font-semibold text-foreground hover:text-primary transition-colors truncate">
                              {item.name}
                            </Link>
                            <p className="text-sm font-mono text-muted-foreground mt-1">
                              {item.price ? formatPrice(item.price) : 'N/A'}
                            </p>
                          </div>
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors mt-2">
                            <ShoppingCart size={12} /> QUICK ADD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 gap-y-2.5">
                    {column.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link 
                          to={item.href}
                          className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
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
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {activeMegaMenu.banner.discount}%
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{activeMegaMenu.banner.text}</p>
                  <p className="text-xs text-muted-foreground">Limited time offer. Terms & conditions apply.</p>
                </div>
              </div>
              <Link 
                to={activeMegaMenu.banner.buttonHref}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                {activeMegaMenu.banner.buttonText}
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
