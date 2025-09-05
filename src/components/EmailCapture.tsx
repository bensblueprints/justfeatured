import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const EmailCapture = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-hero text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Featured?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
          Join the entrepreneurs who have transformed their businesses with media coverage.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-primary"
            required
          />
          <Button type="submit" variant="outline" className="bg-white text-primary hover:bg-white/90">
            Get Started
          </Button>
        </form>
        
        <p className="text-sm text-white/80 mt-4">
          *100% Money Back Guarantee
        </p>
      </div>
    </section>
  );
};