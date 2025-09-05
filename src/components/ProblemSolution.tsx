import { Card, CardContent } from "@/components/ui/card";
import { X, CheckCircle } from "lucide-react";

export const ProblemSolution = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            WE SCALE BRANDS INTO INDUSTRY LEADERS IN 2025
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* The Problem */}
          <Card className="bg-gradient-card border-destructive/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-destructive">The Problem</h3>
              <div className="space-y-4">
                {[
                  "Blending in with competitors",
                  "Little to no online presence", 
                  "Weak SEO ranking",
                  "High lead costs",
                  "Low sales conversion"
                ].map((problem, index) => (
                  <div key={index} className="flex items-center text-muted-foreground">
                    <X className="h-5 w-5 text-destructive mr-3 flex-shrink-0" />
                    <span>{problem}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* The Solution */}
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary-foreground">The Solution</h3>
              <div className="space-y-4">
                {[
                  "Featured in top news outlets",
                  "Distinctive brand authority",
                  "Improved SEO ranking", 
                  "Lower cost per lead",
                  "Increased sales"
                ].map((solution, index) => (
                  <div key={index} className="flex items-center text-primary-foreground">
                    <CheckCircle className="h-5 w-5 text-primary-foreground mr-3 flex-shrink-0" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We know how tough it is to grow a business... You pour your heart, soul, and resources into building something amazing, but there's always a never-ending to-do list and not enough hours in the day. But you don't have to do it all alone...
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            That's why we'll write an article for your business and get you featured in a top-tier news outlet, just like we've done for over 1,000 other businesses...
          </p>
          <p className="text-xl font-semibold mt-6">
            We'll handle everything for a one-time payment starting at $97, guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
};