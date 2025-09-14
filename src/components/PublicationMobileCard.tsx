import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ExternalLink, MapPin, Clock } from "lucide-react";
import { Publication } from "@/types";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";
import { LogoLinkService } from "@/utils/logoLink";

interface PublicationMobileCardProps {
  publication: Publication;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export const PublicationMobileCard = ({
  publication,
  selected,
  onSelectionChange
}: PublicationMobileCardProps) => {
  const [logo, setLogo] = useState<string>(() => 
    LogoLinkService.getBestLogoUrl(
      publication.logo_link_url,
      publication.logo_url,
      publication.website_url,
      { type: 'icon', theme: 'light', fallback: true }
    )
  );

  useEffect(() => {
    // Update logo URL when publication changes
    const bestLogo = LogoLinkService.getBestLogoUrl(
      publication.logo_link_url,
      publication.logo_url,
      publication.website_url,
      { type: 'icon', theme: 'light', fallback: true }
    );
    setLogo(bestLogo);
  }, [publication.logo_link_url, publication.logo_url, publication.website_url]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getFeatureBadges = () => {
    const badges = [];
    if (publication.sponsored) badges.push("Sponsored");
    if (publication.dofollow_link) badges.push("DoFollow");
    if (publication.indexed) badges.push("Indexed");
    return badges.slice(0, 2); // Limit for mobile space
  };

  return (
    <Card className="w-full h-auto overflow-hidden transition-all duration-200 hover:shadow-lg border border-border/50">
      <CardContent className="p-4 space-y-3">
        {/* Header with Logo and Title */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {logo ? (
              <img 
                src={logo} 
                alt={`${publication.name} logo`}
                className="w-8 h-8 object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const fallbacks = BrandFetchService.getMultipleFallbackLogos(publication.website_url);
                  const currentSrc = target.src;
                  const currentIndex = fallbacks.indexOf(currentSrc);
                  
                  if (currentIndex < fallbacks.length - 1) {
                    target.src = fallbacks[currentIndex + 1];
                  } else {
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded text-primary text-xs font-bold flex items-center justify-center" style={logo ? {display: 'none'} : {}}>
              {publication.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
              {publication.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {publication.category}
              </Badge>
              {publication.location && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-20">{publication.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features and Stats */}
        <div className="space-y-2">
          {/* Feature badges */}
          {getFeatureBadges().length > 0 && (
            <div className="flex flex-wrap gap-1">
              {getFeatureBadges().map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {publication.da_score && (
                <div className="text-muted-foreground">
                  DA <span className="font-medium text-foreground">{publication.da_score}</span>
                </div>
              )}
              {publication.dr_score && (
                <div className="text-muted-foreground">
                  DR <span className="font-medium text-foreground">{publication.dr_score}</span>
                </div>
              )}
              {publication.tat_days && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{publication.tat_days}d</span>
                </div>
              )}
            </div>
            
            {publication.popularity > 0 && (
              <div className="flex items-center text-muted-foreground">
                <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                <span className="text-xs">{publication.popularity}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-lg font-bold text-primary">
            {formatPrice(publication.price)}
          </div>
          
          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              variant={selected ? "secondary" : "default"}
              onClick={() => onSelectionChange(!selected)}
              className="h-8 px-3 text-xs w-full"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              {selected ? "Remove" : "Add"}
            </Button>
            {publication.website_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(publication.website_url, '_blank', 'noopener,noreferrer')}
                className="h-8 px-3 text-xs w-full"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Visit Website
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};