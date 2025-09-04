import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              🚀 355+ Premium Publications Available
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Get Featured in{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Major Publications
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with top-tier journalists and publications. Get your story featured in 
              prestigious outlets like Forbes, NBC, and hundreds of other premium publications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate('/publications')}
            >
              Browse Publications
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Start for $97
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="space-y-2">
              <div className="flex justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">355+ Publications</h3>
              <p className="text-sm text-muted-foreground">Premium outlets</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">10,000+ Features</h3>
              <p className="text-sm text-muted-foreground">Success stories</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">3-21 Day TAT</h3>
              <p className="text-sm text-muted-foreground">Fast turnaround</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">98% Success Rate</h3>
              <p className="text-sm text-muted-foreground">Guaranteed results</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">Trusted by entrepreneurs worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">NBC</div>
              <div className="text-2xl font-bold">Forbes</div>
              <div className="text-2xl font-bold">Chicago Tribune</div>
              <div className="text-2xl font-bold">Dallas Observer</div>
              <div className="text-2xl font-bold">AllHipHop</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};