import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, GitCompareArrows, Eye, Check, Truck } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { wishlistStore } from "@/data/wishlist";
import { compareStore } from "@/data/compare";
import { toast } from "sonner";
import { useSyncExternalStore, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  product: Product;
  index?: number;
};

export const ProductCard = ({ product, index = 0 }: Props) => {
  const wishlist = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot);
  const compare = useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot);
  const isWishlisted = wishlist.some(p => p.id === product.id);
  const isComparing = compare.some(p => p.id === product.id);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || isAdding) return;
    
    setIsAdding(true);
    cartStore.addItem(product);
    
    toast.success(`${product.name} added to cart`, {
      icon: <ShoppingCart className="w-4 h-4 text-primary" />,
    });

    setTimeout(() => setIsAdding(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = wishlistStore.toggle(product);
    toast(added ? "Added to wishlist" : "Removed from wishlist", {
      icon: <Heart className={`w-4 h-4 ${added ? "text-destructive fill-destructive" : ""}`} />,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = compareStore.toggle(product);
    if (result === null) {
      toast.error("You can compare up to 4 products");
    } else {
      toast(result ? "Added to compare" : "Removed from compare", {
        icon: <GitCompareArrows className="w-4 h-4 text-primary" />,
      });
    }
  };

  return (
    <div
      className="h-full gsap-reveal"
    >
      <Link
        to={`/product/${product.slug}`}
        className="group product-card h-full flex flex-col"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <AnimatePresence>
            {product.discount && product.discount > 0 && (
              <motion.span 
                key="sale-badge"
                initial={{ scale: 0.8, opacity: 0, x: -10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                className="neo-badge-sale"
              >
                -{product.discount}%
              </motion.span>
            )}
            {product.isNew && (
              <motion.span 
                key="new-badge"
                initial={{ scale: 0.8, opacity: 0, x: -10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                className="neo-badge-new"
              >
                New
              </motion.span>
            )}
            {product.rating >= 4.8 && (
              <motion.span 
                key="best-seller-badge"
                initial={{ scale: 0.8, opacity: 0, x: -10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                className="neo-badge bg-amber-500 text-white shadow-sm flex items-center gap-1"
              >
                <Star size={10} className="fill-white" />
                Best Seller
              </motion.span>
            )}
            {product.price > 500 && (
              <motion.span 
                key="trust-badge"
                initial={{ scale: 0.8, opacity: 0, x: -10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                className="neo-badge-trust flex items-center gap-1"
              >
                <Truck size={10} />
                Free Shipping
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center shadow-sm transition-all duration-200
              ${isWishlisted
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-white/80 border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30"
              }`}
            title="Add to wishlist"
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCompare}
            className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center shadow-sm transition-all duration-200
              ${isComparing
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-white/80 border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30"
              }`}
            title="Add to compare"
          >
            <GitCompareArrows size={16} />
          </motion.button>
        </div>

        {/* Image */}
        <div className="product-card-image relative mb-3 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="bg-white text-primary px-4 py-2 rounded-full font-bold text-xs shadow-xl flex items-center gap-2"
            >
              <Eye size={14} />
              Quick View
            </motion.div>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center rounded-[var(--radius-inner)]">
              <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded-full border border-border">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 px-1 pb-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.15em]">{product.brand}</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-warning/10 rounded-full">
              <Star size={10} className="fill-warning text-warning" />
              <span className="text-[10px] font-bold text-warning-foreground/80">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Quick Specs */}
          <div className="flex gap-1.5 flex-wrap">
            {product.specs.slice(0, 2).map((spec, i) => (
              <span key={i} className="px-2 py-0.5 bg-accent/50 rounded text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                {spec}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black tracking-tighter text-foreground">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground/50 line-through decoration-destructive/30">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.isLimitedStock && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[9px] font-bold text-destructive uppercase tracking-widest">
                    Only a few left!
                  </span>
                  <div className="stock-progress-bar">
                    <motion.div 
                      initial={{ width: "100%" }}
                      animate={{ width: "25%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="stock-progress-fill" 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`w-10 h-10 rounded-xl text-primary-foreground
                       shadow-md shadow-primary/10
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300
                       flex items-center justify-center group/btn relative overflow-hidden
                       ${isAdding ? "bg-success" : "bg-primary"}`}
              title="Add to cart"
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.div
                    key="check"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                  >
                    <Check size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                  >
                    <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </div>
  );
};
