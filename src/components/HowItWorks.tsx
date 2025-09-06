import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "STEP 1",
      description: "Choose your publications from our premium marketplace or start with our starter package."
    },
    {
      number: "2", 
      title: "STEP 2",
      description: "We will write your article and send it to you for approval."
    },
    {
      number: "3",
      title: "STEP 3", 
      description: "We publish your story across selected outlets and send you all the links."
    }
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How to Get Featured in 2025
          </h2>
          <p className="text-xl text-muted-foreground">
            Top-tier media coverage in 3 simple steps. We handle the entire process:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="bg-gradient-card text-center">
              <CardContent className="p-8">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-primary mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/publications')}
            >
              Choose Your Publications →
            </Button>
            <Button variant="outline" size="lg">
              Start with <span className="line-through text-gray-400">$497</span> <span className="text-green-600">$97</span> Package
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            *100% Money Back Guarantee
          </p>
        </div>
      </div>
    </section>
  );
};