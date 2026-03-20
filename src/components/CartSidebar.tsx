import { useSyncExternalStore } from "react";
import { X, Minus, Plus, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cartStore } from "@/data/cart";
import { wishlistStore } from "@/data/wishlist";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";

type Props = { open: boolean; onClose: () => void };

export const CartSidebar = ({ open, onClose }: Props) => {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (!open) return null;

  const handleSaveForLater = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      wishlistStore.toggle(item.product);
      cartStore.removeItem(productId);
      toast("Saved to wishlist");
    }
  };

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md animate-in fade-in duration-500" />
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card/95 backdrop-blur-3xl shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col ring-1 ring-white/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-display font-black tracking-tight">Your Cart <span className="text-primary ml-1">({items.length})</span></h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-2xl hover:bg-primary/10 transition-all duration-300">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-accent/50 flex items-center justify-center text-muted-foreground/30 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-pulse" />
              <ShoppingBag size={48} strokeWidth={1} className="relative z-10" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto">Looks like you haven't added anything to your cart yet.</p>
            </div>
            <button 
              onClick={onClose} 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-xs font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 tracking-widest uppercase"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {items.map(item => (
                <div key={item.product.id} className="group flex gap-5 p-4 bg-accent/30 border border-primary/5 rounded-[2rem] hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 border border-primary/5 relative">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-black truncate tracking-tight text-foreground">{item.product.name}</p>
                        <button
                          onClick={() => cartStore.removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-primary font-black text-sm mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-card rounded-xl border border-primary/10 p-1 shadow-sm">
                        <button
                          onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-black tabular-nums w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleSaveForLater(item.product.id)}
                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/10"
                        title="Save for later"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t border-primary/10 space-y-6 bg-card/50 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-black">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="font-medium">Shipping</span>
                  <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">Calculated at checkout</span>
                </div>
                <div className="h-px bg-primary/5 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black tracking-tight">Total</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 tracking-widest uppercase"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-xs font-black text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
