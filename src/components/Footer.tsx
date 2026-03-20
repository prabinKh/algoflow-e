import { Link } from "react-router-dom";
import { Mail, Clock, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { useGSAPReveal } from "@/hooks/useGSAP";

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  
  useGSAPReveal(footerRef, ".gsap-reveal", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 });

  const storeLocations = [
    { name: "Jawalakhel", address: "Norkhang Complex | Next to Standard Chartered Bank", phone: "9801200105" },
    { name: "Maitighar", address: "D&D Complex | Opposite To St. Xaviers College", phone: "9801200104" },
    { name: "New Road", address: "Sasa Complex | Opposite To NMB Bank", phone: "9801200106" },
    { name: "Putalisadak", address: "IT Plaza | Opposite To Kathmandu Plaza", phone: "9801200108" },
    { name: "Pokhara", address: "Courtyard at Nadipur", phone: "9801200103" },
    { name: "Lazimpat", address: "Opposite of Trisara", phone: "9801200102" },
  ];

  return (
    <footer ref={footerRef} className="bg-foreground text-background/60 mt-16 sm:mt-24 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />
      
      <div className="neo-container py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="gsap-reveal flex flex-col items-start">
            <div className="text-2xl sm:text-3xl font-display font-black tracking-tighter text-background mb-6 uppercase italic">
              algoflow<span className="text-primary">.e</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed mb-6 max-w-xs">
              Your premier destination for high-end electronics and cutting-edge technology. Experience the future of shopping.
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3 group cursor-pointer hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-lg bg-background/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail size={14} className="shrink-0" />
                </div>
                <span>contact@algoflow-e.com</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-lg bg-background/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Clock size={14} className="shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span>Sun - Fri: 10AM - 7:30PM</span>
                  <span className="text-[10px] opacity-50">Saturday: 11AM - 6PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="gsap-reveal">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-background mb-6">Information</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/blog" className="hover:text-primary transition-colors flex items-center gap-2"><span>Blog</span></Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2"><span>About Us</span></Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><span>Contact Us</span></Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors flex items-center gap-2"><span>Careers</span></Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="gsap-reveal">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-background mb-6">Policies</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/privacy" className="hover:text-primary transition-colors flex items-center gap-2"><span>Privacy Policy</span></Link></li>
              <li><Link to="/return-policy" className="hover:text-primary transition-colors flex items-center gap-2"><span>Return Policy</span></Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors flex items-center gap-2"><span>Terms & Conditions</span></Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors flex items-center gap-2"><span>Shipping Info</span></Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="gsap-reveal">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-background mb-6">Customer Service</h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/store-locations" className="hover:text-primary transition-colors flex items-center gap-2"><span>Store Locations</span></Link></li>
              <li><Link to="/service-center" className="hover:text-primary transition-colors flex items-center gap-2"><span>Service Center</span></Link></li>
              <li><Link to="/track-orders" className="hover:text-primary transition-colors flex items-center gap-2"><span>Track Orders</span></Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2"><span>FAQs</span></Link></li>
            </ul>
          </div>
        </div>

        {/* Store Locations */}
        <div className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-background/5 gsap-reveal">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-background mb-2">Our Store Locations</h3>
            <div className="h-1 w-12 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {storeLocations.map(loc => (
              <div key={loc.name} className="text-[10px] sm:text-xs space-y-2 bg-background/5 rounded-xl p-4 border border-background/5 hover:border-primary/30 transition-all hover:bg-background/10 group">
                <p className="font-bold text-background uppercase tracking-wider group-hover:text-primary transition-colors">{loc.name}</p>
                <p className="text-background/40 leading-relaxed line-clamp-2">{loc.address}</p>
                <p className="flex items-center gap-2 text-background/60 font-mono">
                  <Phone size={10} className="text-primary" /> {loc.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-background/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-background/20 gsap-reveal">
          <p>© {new Date().getFullYear()} algoflow-e – All Rights Reserved</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-background transition-colors cursor-pointer">Facebook</span>
            <span className="hover:text-background transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-background transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-background transition-colors cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
