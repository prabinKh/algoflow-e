import { Link, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { cartStore } from "@/data/cart";
import { wishlistStore } from "@/data/wishlist";

export const MobileBottomNav = () => {
  const location = useLocation();
  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const wishlistItems = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Heart, label: "Wishlist", path: "/wishlist", badge: wishlistCount },
    { icon: ShoppingCart, label: "Cart", path: "/checkout", badge: cartCount },
    { icon: User, label: "Account", path: "/signin" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:hidden ring-1 ring-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-1.5 px-2 py-1 min-w-[64px] transition-all duration-300
                ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"}`}
            >
              <div className="relative group">
                <div className={`absolute inset-0 bg-primary/20 rounded-full blur-lg transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`} />
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                  className="relative z-10 transition-transform duration-300"
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-4.5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg border-2 border-card z-20">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight uppercase font-black transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-card/80 backdrop-blur-2xl" />
    </nav>
  );
};
