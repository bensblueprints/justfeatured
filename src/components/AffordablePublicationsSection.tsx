import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

export const AffordablePublicationsSection = () => {
  const [logos, setLogos] = useState<Record<string, string>>({});
  const { publications, loading } = usePublicationsSync();
  const { addToCart, isInCart } = useCart();

  // Filter for $97 publications
  const affordablePublications = publications
    .filter(pub => pub.is_active && pub.price === 97)
    .slice(0, 8); // Show first 8 publications

  // Fetch logos on component mount
  useEffect(() => {
    if (affordablePublications.length === 0) return;
    
    const fetchLogos = async () => {
      const logoPromises = affordablePublications.map(async (pub) => {
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
  }, [affordablePublications]);

  const handleAddToCart = (publication: any) => {
    addToCart(publication.id);
    toast({
      title: "Added to Cart",
      description: `${publication.name} has been added to your cart.`,
    });
  };

  if (loading || affordablePublications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 text-green-700 border-green-200">
            $97 Featured Publications
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium Publications at $97
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality publications perfect for building credibility without breaking the bank. Each publication offers excellent value and professional coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {affordablePublications.map((publication) => (
            <Card key={publication.id} className="card-premium transition-all duration-200 hover:shadow-lg hover:scale-105">
              <CardHeader className="p-4">
                {/* Logo Display */}
                <div className="flex justify-center mb-3">
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-lg font-bold text-primary"
                  >
                    {publication.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Tier and Price Row */}
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                    {publication.tier?.toUpperCase() || 'PREMIUM'}
                  </Badge>
                  <div className="text-lg font-bold text-primary">
                    $97
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
                <div className="flex justify-center gap-2 mb-3">
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

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(publication)}
                  disabled={isInCart(publication.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  size="sm"
                >
                  {isInCart(publication.id) ? 'In Cart ✓' : 'Add to Cart'}
                </Button>
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
          <p className="text-sm text-muted-foreground">
            ✨ Each publication includes: Professional press release • SEO backlinks • Publication proof • Social media assets
          </p>
        </div>
      </div>
    </section>
  );
};