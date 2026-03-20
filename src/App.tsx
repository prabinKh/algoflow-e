/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SearchPage from "@/pages/SearchPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "@/pages/WishlistPage";
import ComparePage from "@/pages/ComparePage";
import SignInPage from "@/pages/SignInPage";
import StoreLocationsPage from "@/pages/StoreLocationsPage";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SmoothScroll } from "@/components/SmoothScroll";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/stores" element={<StoreLocationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScroll>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
