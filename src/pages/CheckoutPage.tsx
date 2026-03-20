import { useSyncExternalStore, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAPReveal } from "@/hooks/useGSAP";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cartStore } from "@/data/cart";
import { formatPrice } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag, Shield, Truck } from "lucide-react";

const CheckoutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useGSAPReveal(containerRef, ".gsap-reveal", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 });
  useGSAPReveal(containerRef, ".gsap-reveal-sidebar", { opacity: 0, x: 20, duration: 0.8 });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background" ref={containerRef}>
        <Header />
        <div className="neo-container py-16 sm:py-24 text-center gsap-reveal">
          <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag size={40} className="text-muted-foreground/40" strokeWidth={1} />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-semibold mb-3">Your cart is empty</h1>
          <p className="text-sm text-muted-foreground mb-6">Add some products to get started</p>
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />
      <main className="neo-container py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold mb-6 sm:mb-8 gsap-reveal">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-xl shadow-[var(--shadow-sm)] gsap-reveal">
                <img src={item.product.image} alt={item.product.name} className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg bg-accent" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="text-xs sm:text-sm font-medium hover:text-primary transition-colors line-clamp-2">
                    {item.product.name}
                  </Link>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                  <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs sm:text-sm font-mono tabular-nums w-6 sm:w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="price-display text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                      <button
                        onClick={() => cartStore.removeItem(item.product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-5 sm:p-6 h-fit sticky top-24 shadow-[var(--shadow-md)] gsap-reveal-sidebar">
            <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-mono tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-mono text-success font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="price-display">{formatPrice(total)}</span>
              </div>
            </div>
            <button className="btn-primary w-full justify-center mt-6 py-3">
              Place Order
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] sm:text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield size={12} /> Secure</span>
              <span className="flex items-center gap-1"><Truck size={12} /> Free Delivery</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
