import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";
import { fetchPublicationsByTier } from "@/lib/publications";
import { Publication } from "@/types";

export const PublicationsMarketplace = () => {
  const navigate = useNavigate();
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch publications from database
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublicationsByTier('starter');
        setPublications(data);
      } catch (error) {
        console.error('Error loading publications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  // Get starter package publications
  const popularPublications = publications
    .filter(pub => pub.is_active && (pub.type === 'starter' || pub.tier === 'starter'))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  // Fetch logos on component mount
  useEffect(() => {
    if (publications.length === 0) return;
    
    const fetchLogos = async () => {
      const logoPromises = popularPublications.map(async (pub) => {
        const logoUrl = await BrandFetchService.getLogoWithFallback(pub.website_url);
        return { id: pub.id, logoUrl };
      });

      const logoResults = await Promise.allSettled(logoPromises);
      const logoMap: Record<string, string> = {};

      logoResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          logoMap[result.value.id] = result.value.logoUrl;
        }
      });

      setLogos(logoMap);
    };

    fetchLogos();
  }, [publications, popularPublications]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(0)}k`;
    } else if (price >= 100000) {
      return `$${(price / 100000).toFixed(0)}00`;
    } else {
      return `$${price}`;
    }
  };

  const getTierColor = (type: string) => {
    switch (type) {
      case 'exclusive': return 'bg-gradient-hero text-white border-primary';
      case 'tier1': return 'bg-accent/10 border-primary/20';
      case 'premium': return 'bg-gradient-card border-border';
      case 'tier2': return 'bg-muted/50 border-muted';
      case 'starter': return 'bg-background border-border';
      default: return 'bg-card border-border';
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Most Popular Publications
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get featured in these top-rated news outlets trusted by thousands of businesses. Browse over 1,200 publications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popularPublications.map((publication) => (
            <Card key={publication.id} className={`${getTierColor(publication.type)} transition-all duration-200 hover:shadow-lg hover:scale-105`}>
              <CardHeader className="text-center">
                {/* Logo Display */}
                <div className="flex justify-center mb-4">
                  <img
                    src={logos[publication.id] || BrandFetchService.getFallbackLogo(publication.website_url)}
                    alt={`${publication.name} logo`}
                    className="w-24 h-24 object-contain rounded-lg bg-white/10 p-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbacks = BrandFetchService.getMultipleFallbackLogos(publication.website_url);
                      const currentIndex = fallbacks.indexOf(target.src);
                      const nextIndex = currentIndex + 1;
                      
                      if (nextIndex < fallbacks.length) {
                        target.src = fallbacks[nextIndex];
                      } else {
                        // Final fallback - show placeholder with publication initial
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg items-center justify-center text-xl font-bold text-primary hidden"
                    style={{ display: 'none' }}
                  >
                    {publication.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {publication.type.toUpperCase()}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    ⭐ {publication.popularity}
                  </div>
                </div>
                <CardTitle className={`text-sm font-semibold ${publication.type === 'exclusive' ? 'text-white' : 'text-foreground'}`}>
                  {publication.name}
                </CardTitle>
                <div className={`text-lg font-bold ${publication.type === 'exclusive' ? 'text-white' : 'text-primary'}`}>
                  {publication.type === 'starter' ? (
                    <>
                      <span className="line-through text-muted-foreground text-sm">$497</span>{" "}
                      <span>$97</span>
                    </>
                  ) : (
                    formatPrice(publication.price)
                  )}
                </div>
                <p className={`text-xs ${publication.type === 'exclusive' ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {publication.tat_days} days delivery
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`text-xs leading-tight ${publication.type === 'exclusive' ? 'text-white/90' : 'text-muted-foreground'}`}>
                  {publication.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate('/publications')}
          >
            🎯 BROWSE ALL PUBLICATIONS →
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            ✨ Each publication includes: Professional press release • SEO backlinks • Publication proof • Social media assets
          </p>
        </div>
      </div>
    </section>
  );
};