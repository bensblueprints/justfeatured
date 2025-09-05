import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const PublicationsMarketplace = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Tier 2 Standard",
      price: "$150-160",
      count: "40 Publications",
      examples: "24 Hip Hop, Atlanta Wire, CEO Weekly",
      color: "bg-gradient-card"
    },
    {
      name: "Premium", 
      price: "$200-350",
      count: "169 Publications",
      examples: "Tech Bullion, Miami Weekly, NY Magazine",
      color: "bg-gradient-card"
    },
    {
      name: "Tier 1 Premium",
      price: "$400-900", 
      count: "85 Publications",
      examples: "AllHipHop, Broadway World, Galore Magazine",
      color: "bg-gradient-card"
    },
    {
      name: "Exclusive",
      price: "$1,000-1,500+",
      count: "61 Publications", 
      examples: "Chicago Tribune, NY Daily News, Hollywood Life",
      color: "bg-gradient-hero text-white"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Publications Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select exactly which news outlets you want to be featured in. Browse 355+ real publications organized by price and authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <Card key={index} className={`${tier.color} ${tier.color.includes('hero') ? 'border-primary' : ''}`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${tier.color.includes('hero') ? 'text-white' : ''}`}>
                  {tier.name}
                </CardTitle>
                <div className={`text-2xl font-bold ${tier.color.includes('hero') ? 'text-white' : 'text-primary'}`}>
                  {tier.price}
                </div>
                <p className={`text-sm ${tier.color.includes('hero') ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {tier.count}
                </p>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${tier.color.includes('hero') ? 'text-white/90' : 'text-muted-foreground'}`}>
                  {tier.examples}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate('/publications')}
          >
            🎯 BROWSE ALL 355+ PUBLICATIONS →
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            ✨ Each publication includes: Professional press release • SEO backlinks • Publication proof • Social media assets
          </p>
        </div>
      </div>
    </section>
  );
};