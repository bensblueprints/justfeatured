import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { PublicationsMarketplace } from "@/components/PublicationsMarketplace";
import { HowItWorks } from "@/components/HowItWorks";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhyJustFeatured } from "@/components/WhyJustFeatured";
import { EmailCapture } from "@/components/EmailCapture";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProblemSolution />
      <PublicationsMarketplace />
      <HowItWorks />
      <TestimonialsSection />
      <WhyJustFeatured />
      <EmailCapture />
      
      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Just Featured. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};