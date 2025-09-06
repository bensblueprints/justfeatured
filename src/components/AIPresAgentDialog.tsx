import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bot, Sparkles, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AIPresAgentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    businessType: '',
    industry: '',
    goals: '',
    targetAudience: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-press-agent', {
        body: {
          budget: formData.budget,
          businessType: formData.businessType,
          industry: formData.industry,
          goals: formData.goals,
          targetAudience: formData.targetAudience
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setRecommendation(data.recommendation);
        toast({
          title: "AI Recommendation Generated",
          description: "Your personalized press strategy is ready!",
        });
      } else {
        throw new Error(data?.error || 'Failed to generate recommendation');
      }
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      budget: '',
      businessType: '',
      industry: '',
      goals: '',
      targetAudience: ''
    });
    setRecommendation('');
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Real Estate', 'Retail', 'Manufacturing',
    'Education', 'Entertainment', 'Food & Beverage', 'Automotive', 'Energy',
    'Telecommunications', 'Travel & Tourism', 'Fashion', 'Sports', 'Non-profit',
    'Consulting', 'Legal', 'Marketing', 'Other'
  ];

  const businessTypes = [
    'Startup', 'Small Business', 'Mid-size Company', 'Enterprise', 'Non-profit',
    'Personal Brand', 'E-commerce', 'SaaS', 'Agency', 'Franchise', 'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="bg-gradient-hero text-white hover:bg-gradient-hero/90 flex items-center gap-2"
          onClick={() => resetForm()}
        >
          <Bot className="h-4 w-4" />
          AI Press Agent
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-primary" />
            AI Press Agent
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </DialogTitle>
          <DialogDescription>
            Get personalized publication recommendations based on your budget and business goals. 
            Our AI will analyze your needs and suggest the optimal press release strategy.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Tell us about your business and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    required
                    min="400"
                    step="100"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goals">PR Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., Brand awareness, product launch, thought leadership, crisis management..."
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="e.g., Tech professionals, consumers, investors, media..."
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hero text-white hover:bg-gradient-hero/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Get AI Recommendation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recommendation Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Recommendation
              </CardTitle>
              <CardDescription>
                Personalized press strategy for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendation ? (
                <div className="space-y-4">
                  <div className="bg-gradient-card p-4 rounded-lg border">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {recommendation}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      resetForm();
                      setIsOpen(false);
                    }}
                    variant="outline" 
                    className="w-full"
                  >
                    Apply Recommendations
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Ready to Analyze</p>
                  <p className="text-sm">
                    Fill out the form on the left to get your personalized press release strategy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};