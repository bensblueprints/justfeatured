import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/50 to-background relative overflow-hidden">
      {/* Luxury background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-luxury opacity-10 blur-3xl rounded-full"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-muted-foreground">
              Do You Have A Personal Brand, Product, or Service?
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Get Published in a Major News Outlet Like{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                USA News, New York Review, CEO Times, Business Weekly, and Women's Insider for Only $97
              </span>
            </h2>
            
            <div className="bg-gradient-card p-8 rounded-xl border border-accent/20 shadow-luxury backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-accent">Your Success Story Here</h3>
              <p className="text-muted-foreground">Featured in 200+ Major News Outlets</p>
            </div>
          </div>

          <div className="space-y-6">
            <Badge variant="secondary" className="text-lg px-6 py-2 bg-accent/20 text-accent border-accent/30">
              🔥 NEW: CHOOSE YOUR OWN PUBLICATIONS
            </Badge>
            
            <h3 className="text-2xl md:text-3xl font-bold">Or Browse 355+ Premium Publications</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Want something bigger? Select from premium outlets like LA Weekly ($2,000), Rolling Stone ($25,000), Wall Street Journal ($15,000), and more high-tier publications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 order-1 sm:order-1"
              onClick={() => navigate('/starter-selection')}
            >
              🎯 GET STARTED FOR $97 →
            </Button>
            <div className="text-lg text-muted-foreground order-2 sm:order-2">Or browse our</div>
            <Button 
              variant="luxury" 
              size="lg" 
              className="text-lg px-8 order-3 sm:order-3"
              onClick={() => navigate('/publications')}
            >
              355+ PREMIUM PUBLICATIONS →
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-accent">
              <span>✅ 100% Money Back Guarantee</span>
              <span>✅ Real Publications</span>
              <span>✅ Professional Press Releases</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4 font-semibold">AS SEEN IN</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 text-foreground/80">
              <div className="text-2xl font-bold hover:text-accent transition-colors">NBC</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">Forbes</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">USA News</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">AP</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">ABC</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">CBS</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">FOX</div>
              <div className="text-2xl font-bold hover:text-accent transition-colors">CNBC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};