import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

export const AffordablePublicationsSection = () => {
  const { addToCart, isInCart } = useCart();

  // All 27 $97 publications based on provided list
  const affordablePublications = [
    { id: 'artist-recap', name: 'Artist Recap', price: 97, tier: 'premium', category: 'Entertainment', da_score: 45, dr_score: 42, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'atoz-times', name: 'AtoZ Times', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'womens-reporter', name: 'Womens Reporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 42, dr_score: 44, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'miami-highlight', name: 'Miami Highlight', price: 97, tier: 'premium', category: 'Local News', da_score: 40, dr_score: 38, tat_days: '1-2 Days', location: 'Miami', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'artist-highlight', name: 'Artist Highlight', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 43, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'texas-recap', name: 'Texas Recap', price: 97, tier: 'premium', category: 'Local News', da_score: 44, dr_score: 41, tat_days: '1-3 Days', location: 'Texas', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'leader-report', name: 'The Leader Report', price: 97, tier: 'premium', category: 'Business', da_score: 50, dr_score: 48, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'golden-state-review', name: 'Golden State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 43, dr_score: 40, tat_days: '1-3 Days', location: 'California', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'mens-reporter', name: 'MensReporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 41, dr_score: 39, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'best-in-houses', name: 'Best in Houses', price: 97, tier: 'premium', category: 'Real Estate', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'juris-review', name: 'Juris Review', price: 97, tier: 'premium', category: 'Legal', da_score: 47, dr_score: 45, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'todays-read', name: 'Todays Read', price: 97, tier: 'premium', category: 'General News', da_score: 43, dr_score: 41, tat_days: '1-2 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'celeb-digest', name: 'Celeb Digest', price: 97, tier: 'premium', category: 'Entertainment', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'primetime-press', name: 'Primetime Press', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 44, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'mens-newspaper', name: 'Mens Newspaper', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 40, dr_score: 38, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'rent-magazine', name: 'Rent Magazine', price: 97, tier: 'premium', category: 'Real Estate', da_score: 42, dr_score: 40, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'empire-state-review', name: 'Empire State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 45, dr_score: 43, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'top-listings', name: 'Top Listings', price: 97, tier: 'premium', category: 'Real Estate', da_score: 41, dr_score: 39, tat_days: '1-2 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'good-morning-us', name: 'Good Morning US', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'biz-recap', name: 'Biz Recap', price: 97, tier: 'premium', category: 'Business', da_score: 47, dr_score: 45, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'womens-insider', name: 'Womens Insider', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 44, dr_score: 42, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'ny-review', name: 'NY Review', price: 97, tier: 'premium', category: 'Local News', da_score: 46, dr_score: 44, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'biz-weekly', name: 'Biz Weekly', price: 97, tier: 'premium', category: 'Business', da_score: 45, dr_score: 43, tat_days: '2-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'tech-daily', name: 'Tech Daily', price: 97, tier: 'premium', category: 'Technology', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'health-spotlight', name: 'Health Spotlight', price: 97, tier: 'premium', category: 'Health', da_score: 43, dr_score: 41, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'finance-focus', name: 'Finance Focus', price: 97, tier: 'premium', category: 'Finance', da_score: 48, dr_score: 46, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'startup-stories', name: 'Startup Stories', price: 97, tier: 'premium', category: 'Business', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false }
  ];

  // No need to fetch logos for hardcoded data - we'll use initials

  const handleAddToCart = (publication: any) => {
    console.log('Adding to cart:', publication);
    addToCart(publication.id);
    toast({
      title: "Added to Cart",
      description: `${publication.name} has been added to your cart.`,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 text-green-700 border-green-200">
            Budget Publications · $97
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Budget Publications at $97
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