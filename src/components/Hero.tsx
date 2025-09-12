import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Zap, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedInteraction } from "@/components/ProtectedInteraction";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";

export const Hero = () => {
  const navigate = useNavigate();
  const { publications } = usePublicationsSync();


  // Get featured publications with logos from database
  const featuredPublications = publications
    .filter(pub => pub.logo_url && pub.logo_url.includes('http')) // Only publications with valid logo URLs
    .slice(0, 20) // Limit to 20 publications for marquee
    .map(pub => ({
      name: pub.name,
      logoUrl: pub.logo_url
    }));

  // Duplicate for seamless scrolling
  const duplicatedPublications = [...featuredPublications, ...featuredPublications];

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
                <span className="text-sm font-semibold">355+ Premium Outlets</span>
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

          {/* Floating Publication Cards */}
          <div className="relative mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-6 text-center text-white">Featured in 200+ Major News Outlets</h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-current to-transparent z-10 pointer-events-none opacity-20" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-current to-transparent z-10 pointer-events-none opacity-20" />
                
                <div className="overflow-hidden">
                  <div className="flex animate-scroll whitespace-nowrap">
                    {duplicatedPublications.map((publication, index) => (
                      <div key={`${publication.name}-${index}`} className="flex items-center space-x-8 mx-4">
                        <div className="flex items-center space-x-3">
                           <img 
                            src={publication.logoUrl} 
                            alt={publication.name}
                            className="h-8 w-auto max-w-24 object-contain bg-white/10 rounded p-1 hover:bg-white/20 transition-all"
                            onError={(e) => {
                              // Fallback to publication name if logo fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.classList.remove('hidden');
                            }}
                          />
                          <span className="hidden text-blue-200 font-semibold">{publication.name}</span>
                        </div>
                        <span className="text-blue-200 text-2xl">•</span>
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
              <div key={guarantee} className="trust-badge rounded-full px-6 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success icon-on-purple" />
                  <span className="text-sm font-semibold">{guarantee}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Social Proof */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm mb-6 uppercase tracking-wider font-semibold opacity-80" style={{ color: '#FFB6C1' }}>
              AS SEEN IN
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {featuredPublications.slice(0, 6).map((publication, index) => (
                <div key={`bottom-${publication.name}-${index}`} className="h-8 flex items-center">
                   <img 
                     src={publication.logoUrl} 
                     alt={publication.name}
                     className="h-8 w-auto max-w-20 object-contain bg-white/10 rounded p-1 hover:bg-white/20 transition-all cursor-pointer"
                    onError={(e) => {
                      // Fallback to publication name if logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden h-8 bg-white/20 rounded px-3 flex items-center justify-center text-white/80 text-sm font-semibold">
                    {publication.name}
                  </div>
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