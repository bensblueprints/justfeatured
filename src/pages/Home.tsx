import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, CheckCircle } from "lucide-react";
import { PUBLICATIONS } from "@/data/publications";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const featuredPublications = PUBLICATIONS.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Featured Publications */}
      <section id="publications" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Publications
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get featured in these premium publications and hundreds more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredPublications.map((pub) => (
              <Card key={pub.id} className="bg-gradient-card hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{pub.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1" />
                      {pub.popularity}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{pub.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${(pub.price / 100).toFixed(0)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {pub.tat_days} days
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pub.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/publications')}
            >
              View All 355+ Publications
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your path to media coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative bg-gradient-card border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter Package</CardTitle>
                <div className="text-4xl font-bold text-primary mt-4">$97</div>
                <p className="text-muted-foreground">Perfect for first-time users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "3 guaranteed publications",
                    "Professional press release",
                    "Email support",
                    "7-14 day turnaround",
                    "Basic reporting"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant="default" className="w-full mt-6">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-hero text-white border-2 border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-warning text-warning-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Custom Selection</CardTitle>
                <div className="text-4xl font-bold mt-4">$150+</div>
                <p className="text-white/80">Choose your publications</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Choose from 355+ publications",
                    "Tier 1 & Exclusive outlets available",
                    "Priority support",
                    "3-21 day turnaround",
                    "Detailed analytics",
                    "Unlimited revisions"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/publications')}
                >
                  Browse Publications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our clients say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechStart Inc.",
                quote: "Got featured in 5 major publications within 2 weeks. The ROI was incredible!",
                rating: 5
              },
              {
                name: "Michael Chen",
                company: "GrowthCo",
                quote: "Professional service, great results. Highly recommend for any serious entrepreneur.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                company: "Innovation Labs",
                quote: "The quality of publications exceeded my expectations. Worth every penny.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Featured?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of entrepreneurs who have successfully gained media coverage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
              Start for $97
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/publications')}
            >
              Browse Publications
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Just Featured. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};