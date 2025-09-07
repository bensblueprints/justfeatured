import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { fetchPublicationsByTier } from '@/lib/publications';
import { PublicationCard } from '@/components/PublicationCard';
import { Publication } from '@/types';

interface StarterPackageSelectionProps {
  onSelectionComplete: (selectedPublication: Publication) => void;
}

export const StarterPackageSelection = ({ onSelectionComplete }: StarterPackageSelectionProps) => {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch publications from database
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublicationsByTier('starter');
        setPublications(data); // Show all starter options
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {publications.map((publication) => (
              <div key={publication.id} className={`relative ${
                selectedPublication?.id === publication.id 
                  ? 'ring-2 ring-primary rounded-lg' 
                  : ''
              }`}>
                <PublicationCard
                  publication={publication}
                  selected={selectedPublication?.id === publication.id}
                  onSelectionChange={(selected) => {
                    if (selected) {
                      handleSelect(publication);
                    } else {
                      setSelectedPublication(null);
                    }
                  }}
                />
                {selectedPublication?.id === publication.id && (
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
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