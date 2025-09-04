import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Clock, Star } from "lucide-react";
import { Publication } from "@/types";

interface PublicationCardProps {
  publication: Publication;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export const PublicationCard = ({ publication, selected, onSelectionChange }: PublicationCardProps) => {
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
            
            <h3 className="text-lg font-semibold mb-1">{publication.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{publication.category}</p>
            
            {publication.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${(publication.price / 100).toFixed(0)}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {publication.tat_days} days
            </div>
          </div>

          {publication.features && publication.features.length > 0 && (
            <div className="space-y-1">
              {publication.features.slice(0, 3).map((feature, index) => (
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