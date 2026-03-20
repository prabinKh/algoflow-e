import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import gsap from 'gsap';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 lg:bottom-12 right-8 z-50 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center ring-1 ring-white/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <ChevronUp size={28} strokeWidth={3} className="relative z-10" />
    </button>
  );
};
