import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Clock, CheckCircle, Globe, X, Edit } from "lucide-react";
import { Publication } from "@/types";
import { useState, useEffect } from "react";
import { BrandFetchService } from "@/utils/brandFetch";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { PublicationEditDialog } from "@/components/PublicationEditDialog";

interface PublicationCardProps {
  publication: Publication;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  onUpdate?: () => void;
}

export const PublicationCard = ({ publication, selected, onSelectionChange, onUpdate }: PublicationCardProps) => {
  const [logo, setLogo] = useState<string>(publication.logo_url || '');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { isAdmin } = useAdminCheck();

  // Fetch logo on component mount - prioritize cached logo from database
  useEffect(() => {
    const fetchLogo = async () => {
      // If we already have a logo_url from the database, use it
      if (publication.logo_url) {
        setLogo(publication.logo_url);
        return;
      }

      // Otherwise fetch from BrandFetch if we have a website URL
      if (publication.website_url) {
        try {
          const logoUrl = await BrandFetchService.getLogoWithFallback(publication.website_url);
          setLogo(logoUrl);
        } catch (error) {
          console.log('Failed to fetch logo for:', publication.name);
          // Use a better fallback for publications without logos
          setLogo('');
        }
      }
    };

    fetchLogo();
  }, [publication.website_url, publication.logo_url]);

  const formatPrice = (price: number | undefined | null) => {
    // Handle undefined, null, or 0 price
    if (!price || price === 0) {
      return "Contact for Price";
    }
    
    // Convert to number and format with proper thousands separators
    const numPrice = Number(price);
    
    if (numPrice >= 1000) {
      return `$${numPrice.toLocaleString()}`;
    }
    return `$${numPrice}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'tier2': return 'bg-blue-100 text-blue-800';
      case 'tier1': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${selected ? 'ring-2 ring-primary shadow-lg' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Logo */}
            <div className="flex justify-center mb-3">
              {logo ? (
                <img
                  src={logo}
                  alt={`${publication.name} logo`}
                  className="w-16 h-16 object-contain rounded-lg bg-white/50 p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-lg font-bold text-primary"
                style={{ display: logo ? 'none' : 'flex' }}
              >
                {publication.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Tier Badge */}
            <div className="flex justify-center mb-2">
              <Badge className={getTierColor(publication.tier)}>
                {publication.tier.toUpperCase()}
              </Badge>
            </div>
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
          {/* Publication Name */}
          <div className="text-center">
            <h3 className="font-bold text-lg leading-tight">{publication.name}</h3>
          </div>

          {/* Genre */}
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              {publication.category}
            </Badge>
          </div>

          {/* Price - Show sell price only */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {formatPrice(publication.price)}
            </div>
          </div>

          {/* DA/DR Scores */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">DA</div>
              <div className="text-2xl font-bold text-primary">{publication.da_score || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">DR</div>
              <div className="text-2xl font-bold text-primary">{publication.dr_score || 0}</div>
            </div>
          </div>

          {/* TAT */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{publication.tat_days}</span>
            </div>
          </div>

          {/* Location */}
          {publication.location && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{publication.location}</span>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Sponsored */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.sponsored 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">SPONSORED</span>
              {publication.sponsored ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Indexed */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.indexed 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">INDEXED</span>
              {publication.indexed ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Dofollow */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.dofollow_link 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">DOFOLLOW</span>
              {publication.dofollow_link ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Erotic */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.erotic 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">EROTIC</span>
              {publication.erotic ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Health */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.health 
                ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">HEALTH</span>
              {publication.health ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* CBD */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.cbd 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">CBD</span>
              {publication.cbd ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Crypto */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.crypto 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">CRYPTO</span>
              {publication.crypto ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>

            {/* Gambling */}
            <div className={`flex items-center justify-center gap-1 p-2 rounded-md transition-colors ${
              publication.gambling 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-gray-50 text-gray-500 border border-gray-200'
            }`}>
              <span className="font-bold text-[10px]">GAMBLING</span>
              {publication.gambling ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>
          </div>
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
              Visit
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          <Button
            variant={selected ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onSelectionChange(!selected)}
          >
            {selected ? 'Selected ✓' : 'Select'}
          </Button>
        </div>
        
        {/* Edit Dialog */}
        <PublicationEditDialog
          publication={publication}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={() => {
            onUpdate?.();
            setIsEditDialogOpen(false);
          }}
        />
      </CardFooter>
    </Card>
  );
};