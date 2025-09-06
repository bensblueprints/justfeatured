import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Clock, Star, CheckCircle, Globe, Link as LinkIcon, Home, Users, Image, Play, UserCheck } from "lucide-react";
import { Publication } from "@/types";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";

interface PublicationCardProps {
  publication: Publication;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export const PublicationCard = ({ publication, selected, onSelectionChange }: PublicationCardProps) => {
  const [logo, setLogo] = useState<string>('');

  // Fetch logo on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      if (publication.website_url) {
        const logoUrl = await BrandFetchService.getLogoWithFallback(publication.website_url);
        setLogo(logoUrl);
      }
    };

    fetchLogo();
  }, [publication.website_url]);

  const getTierColor = (type: string) => {
    switch (type) {
      case 'tier2': return 'bg-secondary text-secondary-foreground';
      case 'premium': return 'bg-primary text-primary-foreground';
      case 'tier1': return 'bg-warning text-warning-foreground';
      case 'exclusive': return 'bg-gradient-hero text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTierLabel = (type: string) => {
    switch (type) {
      case 'tier2': return 'Standard';
      case 'premium': return 'Premium';
      case 'tier1': return 'Tier 1';
      case 'exclusive': return 'Exclusive';
      default: return type;
    }
  };

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-medium ${selected ? 'ring-2 ring-primary shadow-medium' : ''} bg-gradient-card`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTierColor(publication.type)}>
                {getTierLabel(publication.type)}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1" />
                {publication.popularity}
              </div>
            </div>

            {/* Logo Display */}
            <div className="flex justify-center mb-4">
              {logo ? (
                <img
                  src={logo}
                  alt={`${publication.name} logo`}
                  className="w-20 h-20 object-contain rounded-lg bg-white/10 p-2"
                  onError={(e) => {
                    // Fallback to Google favicon service if brand logo fails
                    const target = e.target as HTMLImageElement;
                    target.src = BrandFetchService.getFallbackLogo(publication.website_url);
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse w-10 h-10 bg-muted rounded"></div>
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">{publication.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{publication.category}</p>
            </div>
            
            {publication.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 text-center">
                {publication.description}
              </p>
            )}
          </div>
          
          <Checkbox
            checked={selected}
            onCheckedChange={onSelectionChange}
            className="ml-2"
          />
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-4">
          {/* Price and Timeline */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${(publication.price / 100).toFixed(0)}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {publication.timeline || `${publication.tat_days} days`}
            </div>
          </div>

          {/* DA/DR Scores */}
          {(publication.da_score || publication.dr_score) && (
            <div className="flex gap-4 text-sm">
              {publication.da_score && (
                <div className="flex items-center text-muted-foreground">
                  <span className="font-medium mr-1">DA:</span>
                  <span className="text-primary font-bold">{publication.da_score}</span>
                </div>
              )}
              {publication.dr_score && (
                <div className="flex items-center text-muted-foreground">
                  <span className="font-medium mr-1">DR:</span>
                  <span className="text-primary font-bold">{publication.dr_score}</span>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {publication.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="h-4 w-4 mr-2" />
              {publication.location}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-1 text-xs">
            {publication.guaranteed_placement && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Guaranteed
              </div>
            )}
            {publication.dofollow_link && (
              <div className="flex items-center text-blue-600">
                <LinkIcon className="h-3 w-3 mr-1" />
                Do-follow
              </div>
            )}
            {publication.homepage_placement && (
              <div className="flex items-center text-purple-600">
                <Home className="h-3 w-3 mr-1" />
                Homepage
              </div>
            )}
            {publication.social_media_post && (
              <div className="flex items-center text-pink-600">
                <Users className="h-3 w-3 mr-1" />
                Social Post
              </div>
            )}
            {publication.image_inclusion && (
              <div className="flex items-center text-orange-600">
                <Image className="h-3 w-3 mr-1" />
                Images
              </div>
            )}
            {publication.video_inclusion && (
              <div className="flex items-center text-red-600">
                <Play className="h-3 w-3 mr-1" />
                Video
              </div>
            )}
            {publication.author_byline && (
              <div className="flex items-center text-indigo-600">
                <UserCheck className="h-3 w-3 mr-1" />
                Byline
              </div>
            )}
            {publication.placement_type && publication.placement_type !== 'standard' && (
              <div className="flex items-center text-yellow-600 col-span-2">
                <Badge variant="outline" className="text-xs">
                  {publication.placement_type}
                </Badge>
              </div>
            )}
          </div>

          {/* Original Features (if any) */}
          {publication.features && publication.features.length > 0 && (
            <div className="space-y-1">
              {publication.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex w-full gap-2">
          {publication.website_url && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(publication.website_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Site
            </Button>
          )}
          <Button
            variant={selected ? "success" : "default"}
            size="sm"
            className="flex-1"
            onClick={() => onSelectionChange(!selected)}
          >
            {selected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};