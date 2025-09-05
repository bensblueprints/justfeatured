import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { PUBLICATIONS } from '@/data/publications';
import { Publication } from '@/types';

interface StarterPackageSelectionProps {
  onSelectionComplete: (selectedPublication: Publication) => void;
}

export const StarterPackageSelection = ({ onSelectionComplete }: StarterPackageSelectionProps) => {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const navigate = useNavigate();

  // Get starter package publications
  const starterPublications = PUBLICATIONS.filter(pub => pub.type === 'starter');

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
              Starter Package - $97
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
            {starterPublications.map((publication) => (
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
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {publication.category}
                    </Badge>
                    {selectedPublication?.id === publication.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{publication.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {publication.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Turnaround:</span>
                      <span className="font-medium">{publication.tat_days} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Popularity:</span>
                      <span className="font-medium">{publication.popularity}/100</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {publication.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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