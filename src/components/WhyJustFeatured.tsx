import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp } from "lucide-react";

export const WhyJustFeatured = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Just Featured?
          </h2>
          <p className="text-xl text-muted-foreground">
            Our awards and results speak for themselves. At Just Featured, we practice what we preach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Our Achievements */}
          <Card className="bg-gradient-card">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Our Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center space-y-2">
                <p className="font-semibold text-primary">Featured in Forbes</p>
                <p className="font-semibold text-primary">2024's "Best Marketing Agency"</p>
                <p className="font-semibold text-primary">"Best PR and Branding Agency"</p>
                <p className="font-semibold text-primary">2024 "Global Recognition Award"</p>
              </div>
            </CardContent>
          </Card>

          {/* Our Results */}
          <Card className="bg-gradient-card">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Our Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center space-y-2">
                <p className="font-semibold text-primary">1,000+ Businesses Featured</p>
                <p className="font-semibold text-primary">200+ News Outlets</p>
                <p className="font-semibold text-primary">95% Customer Satisfaction</p>
                <p className="font-semibold text-primary">Over 1 Million Followers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};