import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-muted-foreground">
              Do You Have A Personal Brand, Product, or Service?
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Get Published in a Major News Outlet Like{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                USA News, New York Review, CEO Times, Biz Weekly, and Women's Insider
              </span>
            </h2>
            
            <div className="bg-gradient-card p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Your Success Story Here</h3>
              <p className="text-muted-foreground">Featured in 200+ Major News Outlets</p>
            </div>
          </div>

          <div className="space-y-6">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              🔥 NEW: CHOOSE YOUR OWN PUBLICATIONS
            </Badge>
            
            <h3 className="text-2xl md:text-3xl font-bold">Browse 355+ Premium Publications</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select exactly which news outlets you want to be featured in. From $150 local publications to $1,500+ major outlets like Chicago Tribune, NY Daily News, and Hollywood Life.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/publications')}
            >
              🎯 BROWSE 355+ PUBLICATIONS →
            </Button>
            <div className="text-lg text-muted-foreground">Or start with our</div>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/starter-selection')}
            >
              $97 Starter Package
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-success">
              <span>✅ 100% Money Back Guarantee</span>
              <span>✅ Real Publications</span>
              <span>✅ Professional Press Releases</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4 font-semibold">AS SEEN IN</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <div className="text-2xl font-bold">NBC</div>
              <div className="text-2xl font-bold">Forbes</div>
              <div className="text-2xl font-bold">USA News</div>
              <div className="text-2xl font-bold">AP</div>
              <div className="text-2xl font-bold">ABC</div>
              <div className="text-2xl font-bold">CBS</div>
              <div className="text-2xl font-bold">FOX</div>
              <div className="text-2xl font-bold">CNBC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};