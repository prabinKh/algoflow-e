import { useRef } from "react";
import { useGSAPReveal } from "@/hooks/useGSAP";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAPReveal(containerRef, ".gsap-reveal", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 });

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />
      <main className="neo-container py-10 sm:py-16 flex justify-center">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center gsap-reveal">
            <div className="text-3xl font-display font-bold tracking-tighter text-primary mb-2">neo</div>
            <h1 className="text-xl sm:text-2xl font-display font-bold">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">Sign in to your NeoStore account</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-md)] gsap-reveal">
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full h-10 pl-10 pr-4 bg-accent border border-border rounded-lg text-sm
                             placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-4 bg-accent border border-border rounded-lg text-sm
                             placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-2.5">
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-xs sm:text-sm text-muted-foreground gsap-reveal">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;
