import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Zap, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();

  const featuredOutlets = [
    "USA TODAY", "FORBES", "CNN", "REUTERS", "BLOOMBERG", 
    "WALL STREET JOURNAL", "BUSINESS INSIDER", "CNBC", "TIME",
    "NEWSWEEK", "WASHINGTON POST", "NEW YORK TIMES", "AP NEWS",
    "NBC NEWS", "ABC NEWS", "CBS NEWS", "FOX NEWS", "YAHOO FINANCE"
  ];

  const duplicatedOutlets = [...featuredOutlets, ...featuredOutlets];

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-primary-secondary/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Glassmorphism Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-dot-pattern bg-opacity-20" />
      </div>

      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Floating Trust Badges */}
          <div className="flex justify-center items-center gap-4 mb-12 animate-slide-up">
            <div className="glass rounded-full px-6 py-3 magnetic">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-current" />
                <span className="text-sm font-semibold text-foreground">1,000+ Success Stories</span>
              </div>
            </div>
            <div className="glass rounded-full px-6 py-3 magnetic">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">355+ Premium Outlets</span>
              </div>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold leading-none mb-8">
              Get Featured in <br />
              <span className="bg-gradient-to-r from-primary via-primary-secondary to-accent bg-clip-text text-transparent font-extrabold drop-shadow-lg">
                Top News Outlets
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              We'll write an article for your business and get you featured in premium news publications. 
              <span className="text-foreground font-semibold block mt-2">
                Guaranteed placement starting at just $97.
              </span>
            </p>
          </div>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => navigate("/starter-selection")}
              className="btn-cta group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                🎯 GET STARTED FOR $97
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <Button 
              onClick={() => navigate("/publications")}
              variant="outline"
              size="lg"
              className="glass border-2 border-white/20 hover:border-primary/30 text-foreground hover:text-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-glow magnetic group"
            >
              355+ PREMIUM PUBLICATIONS
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>

          {/* Floating Publication Cards */}
          <div className="relative mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-card/90 backdrop-blur-md rounded-2xl p-8 mb-8 border border-primary/20 shadow-premium">
              <h3 className="text-2xl font-bold mb-6 text-primary text-center drop-shadow-sm">Featured in 200+ Major News Outlets</h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card/90 to-transparent z-10 pointer-events-none" />
                
                <div className="overflow-hidden py-2">
                  <div className="flex animate-scroll whitespace-nowrap">
                    {duplicatedOutlets.map((outlet, index) => (
                      <div key={index} className="flex items-center space-x-8 text-xl font-bold">
                        <span className="text-foreground hover:text-primary transition-colors cursor-pointer drop-shadow-sm">{outlet}</span>
                        <span className="text-primary/60">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            {[
              "100% Money Back Guarantee",
              "Real Publications",
              "Professional Press Releases"
            ].map((guarantee, index) => (
              <div key={guarantee} className="flex items-center gap-2 glass rounded-full px-6 py-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>

          {/* Premium Social Proof */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider font-semibold">
              AS SEEN IN
            </p>
            <div className="flex justify-center items-center gap-12 flex-wrap">
              {["NBC", "Forbes", "USA News", "AP", "ABC", "CBS", "FOX", "CNBC"].map((outlet, index) => (
                <div 
                  key={outlet}
                  className="text-2xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer magnetic"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  {outlet}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 120" className="w-full h-20">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--card))" />
              <stop offset="100%" stopColor="hsl(var(--background))" />
            </linearGradient>
          </defs>
          <path 
            fill="url(#waveGradient)" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};