import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { fetchPublicationsByTier } from '@/lib/publications';
import { PublicationCard } from '@/components/PublicationCard';
import { Publication } from '@/types';
import { BrandFetchService } from '@/utils/brandFetch';

interface StarterPackageSelectionProps {
  onSelectionComplete: (selectedPublication: Publication) => void;
}

export const StarterPackageSelection = ({ onSelectionComplete }: StarterPackageSelectionProps) => {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [logos, setLogos] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Fetch publications from database
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublicationsByTier('starter');
        setPublications(data); // Show all starter options
        
        // Fetch logos for each publication
        const logoPromises = data.map(async (publication) => {
          if (publication.logo_url) {
            return { id: publication.id, logo: publication.logo_url };
          } else if (publication.website_url) {
            try {
              const logoUrl = await BrandFetchService.getLogoWithFallback(publication.website_url);
              return { id: publication.id, logo: logoUrl };
            } catch (error) {
              console.log('Failed to fetch logo for:', publication.name);
              return { id: publication.id, logo: '' };
            }
          }
          return { id: publication.id, logo: '' };
        });
        
        const logoResults = await Promise.all(logoPromises);
        const logoMap: { [key: string]: string } = {};
        logoResults.forEach(result => {
          logoMap[result.id] = result.logo;
        });
        setLogos(logoMap);
      } catch (error) {
        console.error('Error loading publications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  const handleSelect = (publication: Publication) => {
    setSelectedPublication(publication);
  };

  const handleContinue = () => {
    if (selectedPublication) {
      onSelectionComplete(selectedPublication);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-warning text-warning-foreground mb-4">
              <Star className="h-3 w-3 mr-1" />
              Starter Package - <span className="line-through text-gray-400">$497</span> <span className="text-green-600">$97</span>
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Publication
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select one publication from our starter collection. Perfect for first-time users to get professional media coverage.
            </p>
          </div>

          {/* Publication Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {publications.map((publication) => {
              // Determine target audience based on publication category
              const getTargetAudience = (category: string, name: string) => {
                const categoryLower = category.toLowerCase();
                const nameLower = name.toLowerCase();
                
                if (categoryLower.includes('business') || nameLower.includes('ceo') || nameLower.includes('biz')) {
                  return "Perfect for CEOs, entrepreneurs, and business leaders";
                } else if (categoryLower.includes('news') || nameLower.includes('news')) {
                  return "Ideal for newsworthy announcements and press releases";
                } else if (categoryLower.includes('lifestyle') || nameLower.includes('men') || nameLower.includes('women')) {
                  return "Great for lifestyle brands, personal brands, and consumer products";
                } else if (categoryLower.includes('entertainment') || nameLower.includes('celeb')) {
                  return "Best for entertainment industry and celebrity news";
                } else if (categoryLower.includes('real estate') || nameLower.includes('rent') || nameLower.includes('houses')) {
                  return "Perfect for real estate professionals and property announcements";
                } else if (categoryLower.includes('legal') || nameLower.includes('juris')) {
                  return "Ideal for law firms and legal professionals";
                } else if (categoryLower.includes('arts') || categoryLower.includes('culture') || nameLower.includes('artist')) {
                  return "Great for artists, galleries, and cultural organizations";
                } else if (categoryLower.includes('regional') || nameLower.includes('state') || nameLower.includes('texas') || nameLower.includes('miami') || nameLower.includes('california')) {
                  return "Perfect for local businesses and regional announcements";
                } else {
                  return "Suitable for general business announcements and brand awareness";
                }
              };

              return (
                <Card 
                  key={publication.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPublication?.id === publication.id 
                      ? 'ring-2 ring-primary border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleSelect(publication)}
                >
                  <CardHeader className="pb-3">
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                      {logos[publication.id] ? (
                        <img
                          src={logos[publication.id]}
                          alt={`${publication.name} logo`}
                          className="w-20 h-20 object-contain rounded-lg bg-white/50 p-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-xl font-bold text-primary"
                        style={{ display: logos[publication.id] ? 'none' : 'flex' }}
                      >
                        {publication.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {publication.category}
                      </Badge>
                      {selectedPublication?.id === publication.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-lg text-center">{publication.name}</CardTitle>
                    <CardDescription className="text-sm text-center">
                      {getTargetAudience(publication.category, publication.name)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-primary">$97</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Turnaround:</span>
                        <span className="font-medium">{publication.tat_days}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium text-xs">{publication.location}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {publication.indexed ? 'Indexed' : 'Not Indexed'}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {publication.dofollow_link ? 'Dofollow' : 'Nofollow'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/publications')}
              className="w-full sm:w-auto"
            >
              Back to Publications
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedPublication}
              size="lg"
              className="w-full sm:w-auto"
            >
              Continue to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* What's Included */}
          <div className="mt-12">
            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-center">What's Included in Your Starter Package</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>Professional press release writing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>SEO optimized content</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>Publication proof link</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>Email support throughout</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>3-day turnaround guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span>100% money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};