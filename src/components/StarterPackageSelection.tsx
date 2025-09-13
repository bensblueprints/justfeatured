import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Publication } from '@/types';
import { toast } from '@/hooks/use-toast';

interface StarterPackageSelectionProps {
  onSelectionComplete: (selectedPublications: Publication[]) => void;
}

export const StarterPackageSelection = ({ onSelectionComplete }: StarterPackageSelectionProps) => {
  const [selectedPublications, setSelectedPublications] = useState<Publication[]>([]);
  const navigate = useNavigate();

  // All 27 $97 publications from AffordablePublicationsSection
  const affordablePublications: Publication[] = [
    { id: 'artist-recap', name: 'Artist Recap', price: 97, tier: 'premium', category: 'Entertainment', da_score: 45, dr_score: 42, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'atoz-times', name: 'AtoZ Times', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'womens-reporter', name: 'Womens Reporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 42, dr_score: 44, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'miami-highlight', name: 'Miami Highlight', price: 97, tier: 'premium', category: 'Local News', da_score: 40, dr_score: 38, tat_days: '1-2 Days', location: 'Miami', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'artist-highlight', name: 'Artist Highlight', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 43, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'texas-recap', name: 'Texas Recap', price: 97, tier: 'premium', category: 'Local News', da_score: 44, dr_score: 41, tat_days: '1-3 Days', location: 'Texas', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'leader-report', name: 'The Leader Report', price: 97, tier: 'premium', category: 'Business', da_score: 50, dr_score: 48, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'golden-state-review', name: 'Golden State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 43, dr_score: 40, tat_days: '1-3 Days', location: 'California', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'mens-reporter', name: 'MensReporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 41, dr_score: 39, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'best-in-houses', name: 'Best in Houses', price: 97, tier: 'premium', category: 'Real Estate', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'juris-review', name: 'Juris Review', price: 97, tier: 'premium', category: 'Legal', da_score: 47, dr_score: 45, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'todays-read', name: 'Todays Read', price: 97, tier: 'premium', category: 'General News', da_score: 43, dr_score: 41, tat_days: '1-2 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'celeb-digest', name: 'Celeb Digest', price: 97, tier: 'premium', category: 'Entertainment', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'primetime-press', name: 'Primetime Press', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 44, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'mens-newspaper', name: 'Mens Newspaper', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 40, dr_score: 38, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'rent-magazine', name: 'Rent Magazine', price: 97, tier: 'premium', category: 'Real Estate', da_score: 42, dr_score: 40, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'empire-state-review', name: 'Empire State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 45, dr_score: 43, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'top-listings', name: 'Top Listings', price: 97, tier: 'premium', category: 'Real Estate', da_score: 41, dr_score: 39, tat_days: '1-2 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'good-morning-us', name: 'Good Morning US', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'biz-recap', name: 'Biz Recap', price: 97, tier: 'premium', category: 'Business', da_score: 47, dr_score: 45, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'womens-insider', name: 'Womens Insider', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 44, dr_score: 42, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'ny-review', name: 'NY Review', price: 97, tier: 'premium', category: 'Local News', da_score: 46, dr_score: 44, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'biz-weekly', name: 'Biz Weekly', price: 97, tier: 'premium', category: 'Business', da_score: 45, dr_score: 43, tat_days: '2-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'tech-daily', name: 'Tech Daily', price: 97, tier: 'premium', category: 'Technology', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'health-spotlight', name: 'Health Spotlight', price: 97, tier: 'premium', category: 'Health', da_score: 43, dr_score: 41, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'finance-focus', name: 'Finance Focus', price: 97, tier: 'premium', category: 'Finance', da_score: 48, dr_score: 46, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] },
    { id: 'startup-stories', name: 'Startup Stories', price: 97, tier: 'premium', category: 'Business', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false, type: 'standard', popularity: 50, is_active: true, features: ['DoFollow', 'Indexed', 'Editorial'] }
  ];

  const handleSelect = (publication: Publication) => {
    const isSelected = selectedPublications.some(p => p.id === publication.id);
    if (isSelected) {
      setSelectedPublications(prev => prev.filter(p => p.id !== publication.id));
      toast({
        title: "Removed from selection",
        description: `${publication.name} has been removed from your selection.`,
      });
    } else {
      setSelectedPublications(prev => [...prev, publication]);
      toast({
        title: "Added to selection",
        description: `${publication.name} has been added to your selection.`,
      });
    }
  };

  const handleContinue = () => {
    if (selectedPublications.length > 0) {
      onSelectionComplete(selectedPublications);
    }
  };

  const totalPrice = selectedPublications.reduce((sum, pub) => sum + pub.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Star className="h-3 w-3 mr-1" />
              $97 Publications • Select Multiple
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Publications
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select one or more publications from our $97 collection. Each publication offers excellent value and professional coverage.
            </p>
            {selectedPublications.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  {selectedPublications.length} publication{selectedPublications.length > 1 ? 's' : ''} selected • Total: <span className="font-bold">${totalPrice}</span>
                </p>
              </div>
            )}
          </div>

          {/* Publication Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {affordablePublications.map((publication) => {
              const isSelected = selectedPublications.some(p => p.id === publication.id);
              
              return (
                <Card 
                  key={publication.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    isSelected 
                      ? 'ring-2 ring-green-500 border-green-500 bg-green-50' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleSelect(publication)}
                >
                  <CardHeader className="p-4">
                    {/* Logo Display */}
                    <div className="flex justify-center mb-3">
                      <div 
                        className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-lg font-bold text-primary"
                      >
                        {publication.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Tier, Price and Selection */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                        {publication.tier?.toUpperCase() || 'PREMIUM'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">
                          $97
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
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
                  </CardHeader>
                  
                  <CardContent className="pt-0 px-4 pb-4">
                    <p className="text-xs leading-tight text-muted-foreground text-center line-clamp-2">
                      {publication.category}
                    </p>
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
              disabled={selectedPublications.length === 0}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Continue to Checkout {selectedPublications.length > 0 && `(${selectedPublications.length} selected)`}
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