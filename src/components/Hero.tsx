import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Zap, Sparkles, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedInteraction } from "@/components/ProtectedInteraction";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const navigate = useNavigate();
  const { publications } = usePublicationsSync();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();


  // Featured premium tier publications from the newly added ones
  const featuredPublications = [
    {
      name: 'Artist Recap',
      logoUrl: 'https://ui-avatars.com/api/?name=Artist%20Recap&background=e2e8f0&color=475569&size=64',
      website_url: 'https://artistrecap.com',
      tier: 'Premium',
      dbId: '55c50f90-0b49-4d44-aefc-4f481ec3cab5'
    },
    {
      name: 'AtoZ Times',
      logoUrl: 'https://ui-avatars.com/api/?name=AtoZ%20Times&background=e2e8f0&color=475569&size=64',
      website_url: 'https://atoztimes.com',
      tier: 'Premium',
      dbId: '741104c6-2518-4e79-9d42-a239d66581c2'
    },
    {
      name: 'Artist Highlight',
      logoUrl: 'https://ui-avatars.com/api/?name=Artist%20Highlight&background=e2e8f0&color=475569&size=64',
      website_url: 'https://artisthighlight.com',
      tier: 'Premium',
      dbId: '6434a354-de36-4c5e-96da-c5c8a729563d'
    },
    {
      name: 'Tech Daily',
      logoUrl: 'https://ui-avatars.com/api/?name=Tech%20Daily&background=e2e8f0&color=475569&size=64',
      website_url: 'https://techdaily.com',
      tier: 'Premium',
      dbId: null // Will be updated with correct ID once we find it
    },
    {
      name: 'Finance Focus',
      logoUrl: 'https://ui-avatars.com/api/?name=Finance%20Focus&background=e2e8f0&color=475569&size=64',
      website_url: 'https://financefocus.com',
      tier: 'Premium',
      dbId: null // Will be updated with correct ID once we find it
    },
    {
      name: 'Biz Weekly',
      logoUrl: 'https://ui-avatars.com/api/?name=Biz%20Weekly&background=e2e8f0&color=475569&size=64',
      website_url: 'https://bizweekly.com',
      tier: 'Premium',
      dbId: null // Will be updated with correct ID once we find it
    },
    {
      name: 'Celeb Digest',
      logoUrl: 'https://ui-avatars.com/api/?name=Celeb%20Digest&background=e2e8f0&color=475569&size=64',
      website_url: 'https://celebdigest.com',
      tier: 'Premium',
      dbId: null // Will be updated with correct ID once we find it
    },
    {
      name: 'Health Spotlight',
      logoUrl: 'https://ui-avatars.com/api/?name=Health%20Spotlight&background=e2e8f0&color=475569&size=64',
      website_url: 'https://healthspotlight.com',
      tier: 'Premium',
      dbId: null // Will be updated with correct ID once we find it
    }
  ];

  const handleAddToCart = (publication: any) => {
    if (publication.dbId) {
      addToCart(publication.dbId);
      toast({
        title: "Added to Cart",
        description: `${publication.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Publication Unavailable",
        description: `${publication.name} is not available for selection at the moment.`,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="hero-section purple-section relative min-h-screen overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-5"
        style={{
          backgroundImage: `url('/lovable-uploads/be400704-4ad3-4cf0-aec5-328f556d2e19.png')`,
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative Pink Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-300/15 to-transparent rounded-full blur-3xl" />

      <div className="container relative z-10 pt-0 md:pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Floating Trust Badges */}
          <div className="flex justify-center items-center gap-4 mb-12 animate-slide-up">
            <div className="trust-badge rounded-full px-6 py-3 magnetic">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 icon-on-purple fill-current" />
                <span className="text-sm font-semibold">1,000+ Success Stories</span>
              </div>
            </div>
            <div className="trust-badge rounded-full px-6 py-3 magnetic">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success icon-on-purple" />
                <span className="text-sm font-semibold">1200+ Premium Outlets</span>
              </div>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="hero-title text-5xl md:text-7xl xl:text-8xl leading-none mb-8">
              Get Featured in <br />
              <span className="text-gradient">
                Top News Outlets
              </span>
            </h1>

            <p className="hero-subtitle text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed">
              We'll write an article for your business and get you featured in premium news publications. 
              <span className="font-semibold block mt-2" style={{ color: '#FFFFFF' }}>
                Guaranteed placement starting at just <span className="line-through text-gray-400">$497</span> <span className="text-green-400">$97</span>.
              </span>
            </p>
          </div>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <ProtectedInteraction action={() => navigate("/starter-selection")} source="hero_get_started_button">
              <Button 
                className="cta-primary group relative overflow-hidden"
                size="lg"
              >
                <span className="relative z-10 flex items-center">
                  🎯 GET STARTED FOR <span className="line-through text-gray-400 mx-1">$497</span> <span className="text-green-400">$97</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </ProtectedInteraction>
            
            <ProtectedInteraction action={() => navigate("/publications")} source="hero_publications_button">
              <Button 
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                BROWSE OVER 1,241 PUBLICATIONS
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </ProtectedInteraction>
          </div>

          {/* Featured Publications */}
          <div className="relative mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-8">
              <p className="text-lg md:text-xl mb-6 uppercase tracking-wider font-bold text-white">
                Get Featured In 1241 Publications
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {featuredPublications.map((publication, index) => (
                  <div key={`featured-${publication.name}-${index}`} className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="h-16 flex items-center justify-center mb-3 w-full">
                      <img 
                        src={publication.logoUrl} 
                        alt={publication.name}
                        className="h-12 w-auto object-contain transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <h3 className="text-white text-sm font-medium text-center mb-3 min-h-[2rem] flex items-center">
                      {publication.name}
                    </h3>
                    <Button
                      onClick={() => handleAddToCart(publication)}
                      disabled={!publication.dbId || isInCart(publication.dbId)}
                      className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                    >
                      {publication.dbId ? (
                        isInCart(publication.dbId) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </>
                        )
                      ) : (
                        'Unavailable'
                      )}
                    </Button>
                  </div>
                ))}
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
              <div key={guarantee} className="trust-badge rounded-full px-6 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success icon-on-purple" />
                  <span className="text-sm font-semibold">{guarantee}</span>
                </div>
              </div>
            ))}
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