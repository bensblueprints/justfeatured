import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";

export const PublicationsMarketplace = () => {
  const navigate = useNavigate();
  const [logos, setLogos] = useState<Record<string, string>>({});
  const { publications, loading } = usePublicationsSync();

  // Featured publications strictly limited to DB-listed ones, in desired order
  const featuredPublicationNames = ['Reuters','Bloomberg','Forbes USA','Time.com','Yahoo','Business Insider','Fox News','Benzinga','Billboard'];

  const normalize = (s?: string) => (s || '').toLowerCase().trim();

  const matchesTarget = (pubName: string, target: string) => {
    const p = normalize(pubName);
    const t = normalize(target);
    return p === t || 
      (t === 'yahoo' && p.includes('yahoo finance')) ||
      (t === 'time.com' && (p === 'time.com' || p === 'time magazine')) ||
      (t === 'forbes usa' && p.includes('forbes usa')) ||
      (t === 'fox news' && p.includes('fox news channel')) ||
      (p.includes(t) && t !== 'time' && t !== 'forbes'); // Avoid generic "time" or "forbes" matches
  };

  // Local logo overrides from uploaded assets
  const localLogos: { match: string; src: string }[] = [
    { match: 'forbes', src: '/assets/logos/forbes.png' },
    { match: 'reuters', src: '/assets/logos/reuters.png' },
    { match: 'bloomberg', src: '/assets/logos/bloomberg.png' },
    { match: 'time', src: '/assets/logos/time.png' },
    { match: 'yahoo', src: '/assets/logos/yahoo.png' },
    { match: 'business insider', src: '/assets/logos/business-insider.png' },
    { match: 'fox news', src: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_News_Channel_logo.svg' },
    { match: 'benzinga', src: '/assets/logos/benzinga.png' },
    { match: 'billboard', src: '/assets/logos/billboard.png' },
  ];

  const getLocalLogo = (name: string): string | undefined => {
    const n = normalize(name);
    const found = localLogos.find(l => n.includes(l.match));
    return found?.src;
  };

  // Only show the specified publications that exist in the DB, in the specified order
  const popularPublications = publications
    .filter(pub => pub.is_active && pub.price > 0 && featuredPublicationNames.some(n => matchesTarget(pub.name, n)))
    .sort((a, b) => {
      const ai = featuredPublicationNames.findIndex(n => matchesTarget(a.name, n));
      const bi = featuredPublicationNames.findIndex(n => matchesTarget(b.name, n));
      return ai - bi;
    });

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
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
            Get featured in these top-rated news outlets trusted by thousands of businesses. Browse over 1,241 publications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popularPublications.map((publication) => (
            <Card key={publication.id} className={`card-premium transition-all duration-200 hover:shadow-lg hover:scale-105`}>
              <CardHeader className="p-4">
                {/* Logo Display */}
                <div className="flex justify-center mb-3">
                  <img
                    src={getLocalLogo(publication.name) || logos[publication.id] || BrandFetchService.getFallbackLogo(publication.website_url)}
                    alt={`${publication.name} logo`}
                    className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2"
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
                    className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg items-center justify-center text-lg font-bold text-primary hidden"
                    style={{ display: 'none' }}
                  >
                    {publication.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Tier and Price Row */}
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {publication.tier?.toUpperCase() || publication.type?.toUpperCase() || 'STANDARD'}
                  </Badge>
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(publication.price)}
                  </div>
                </div>
                
                {/* Publication Name */}
                <CardTitle className="text-sm font-semibold text-center mb-2 line-clamp-2">
                  {publication.name}
                </CardTitle>
                
                {/* DA/DR Scores */}
                <div className="flex justify-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">{publication.da_score || 0}</div>
                    <div className="text-xs text-muted-foreground">DA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-primary">{publication.dr_score || 0}</div>
                    <div className="text-xs text-muted-foreground">DR</div>
                  </div>
                </div>
                
                {/* TAT and Location */}
                <div className="text-center text-xs text-muted-foreground mb-2">
                  {publication.tat_days} • {publication.location || 'Global'}
                </div>
                
                {/* Feature Icons */}
                <div className="flex justify-center gap-2 mb-2">
                  {publication.dofollow_link && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      ✓ DoFollow
                    </Badge>
                  )}
                  {publication.indexed && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      ✓ Indexed
                    </Badge>
                  )}
                  {!publication.sponsored && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      ✓ Editorial
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <p className="text-xs leading-tight text-muted-foreground text-center line-clamp-2">
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