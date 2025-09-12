import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bot, Sparkles, TrendingUp, Target, FileText, Search, PenTool } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AIPresAgentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("strategy");
  const [workflowStep, setWorkflowStep] = useState<'strategy' | 'research' | 'approval' | 'draft' | 'complete'>('strategy');
  const [formData, setFormData] = useState({
    budget: '',
    businessType: '',
    industry: '',
    goals: '',
    targetAudience: ''
  });
  const [pressReleaseData, setPressReleaseData] = useState({
    companyName: '',
    announcement: '',
    keyBenefits: '',
    targetMarket: '',
    quotes: '',
    companyBackground: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [researchResults, setResearchResults] = useState('');
  const [draftedPressRelease, setDraftedPressRelease] = useState('');
  const [suggestedPublications, setSuggestedPublications] = useState('');
  const { toast } = useToast();

  const handleFullWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setWorkflowStep('strategy');

    try {
      // Step 1: Get AI Strategy
      toast({
        title: "Starting AI Analysis",
        description: "Getting your personalized strategy...",
      });

      const strategyResponse = await supabase.functions.invoke('ai-press-agent', {
        body: {
          action: 'strategy',
          budget: formData.budget,
          businessType: formData.businessType,
          industry: formData.industry,
          goals: formData.goals,
          targetAudience: formData.targetAudience
        }
      });

      if (strategyResponse.error || !strategyResponse.data?.success) {
        throw new Error(strategyResponse.data?.error || 'Failed to generate strategy');
      }

      setRecommendation(strategyResponse.data.recommendation);
      setWorkflowStep('research');

      // Step 2: Conduct Research 
      toast({
        title: "Conducting Research",
        description: "Researching your industry with Perplexity...",
      });

      const researchResponse = await supabase.functions.invoke('ai-press-agent', {
        body: {
          action: 'research',
          industry: formData.industry,
          businessType: formData.businessType,
          announcement: pressReleaseData.announcement || `${formData.businessType} announcement in ${formData.industry}`,
          companyName: pressReleaseData.companyName || 'Your Company'
        }
      });

      if (researchResponse.error || !researchResponse.data?.success) {
        throw new Error(researchResponse.data?.error || 'Failed to complete research');
      }

      setResearchResults(researchResponse.data.research);
      setWorkflowStep('approval');

      toast({
        title: "Strategy & Research Complete",
        description: "Review the recommendations and approve to continue with drafting.",
      });

    } catch (error) {
      console.error('Error in full workflow:', error);
      toast({
        title: "Error",
        description: "Failed to complete analysis. Please try again.",
        variant: "destructive",
      });
      setWorkflowStep('strategy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalAndDraft = async () => {
    if (!pressReleaseData.companyName || !pressReleaseData.announcement) {
      toast({
        title: "Missing Information",
        description: "Please fill in company name and announcement details first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setWorkflowStep('draft');

    try {
      toast({
        title: "Drafting Press Release",
        description: "Creating your professional press release...",
      });

      const draftResponse = await supabase.functions.invoke('ai-press-agent', {
        body: {
          action: 'draft',
          ...pressReleaseData,
          industry: formData.industry,
          researchData: researchResults
        }
      });

      if (draftResponse.error || !draftResponse.data?.success) {
        throw new Error(draftResponse.data?.error || 'Failed to draft press release');
      }

      setDraftedPressRelease(draftResponse.data.pressRelease);
      setWorkflowStep('complete');

      toast({
        title: "Press Release Complete",
        description: "Your professional press release is ready!",
      });

    } catch (error) {
      console.error('Error drafting press release:', error);
      toast({
        title: "Error",
        description: "Failed to draft press release. Please try again.",
        variant: "destructive",
      });
      setWorkflowStep('approval');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-press-agent', {
        body: {
          action: 'research',
          industry: formData.industry,
          businessType: formData.businessType,
          announcement: pressReleaseData.announcement,
          companyName: pressReleaseData.companyName
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setResearchResults(data.research);
        toast({
          title: "Research Complete",
          description: "Industry research and competitor analysis ready!",
        });
      } else {
        throw new Error(data?.error || 'Failed to complete research');
      }
    } catch (error) {
      console.error('Error conducting research:', error);
      toast({
        title: "Error",
        description: "Failed to conduct research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-press-agent', {
        body: {
          action: 'draft',
          ...pressReleaseData,
          industry: formData.industry,
          researchData: researchResults
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setDraftedPressRelease(data.pressRelease);
        toast({
          title: "Press Release Drafted",
          description: "Your professional press release is ready for review!",
        });
      } else {
        throw new Error(data?.error || 'Failed to draft press release');
      }
    } catch (error) {
      console.error('Error drafting press release:', error);
      toast({
        title: "Error",
        description: "Failed to draft press release. Please try again.",
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
    setPressReleaseData({
      companyName: '',
      announcement: '',
      keyBenefits: '',
      targetMarket: '',
      quotes: '',
      companyBackground: ''
    });
    setRecommendation('');
    setResearchResults('');
    setDraftedPressRelease('');
    setSuggestedPublications('');
    setWorkflowStep('strategy');
    setActiveTab('strategy');
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bot className="h-6 w-6 text-primary" />
            AI Press Agent
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </DialogTitle>
          <DialogDescription>
            Complete AI-powered press release solution: get strategy recommendations, 
            conduct industry research with Perplexity, and draft professional press releases.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Draft PR
            </TabsTrigger>
          </TabsList>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <form onSubmit={handleFullWorkflow} className="space-y-4">
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
                          Get AI Strategy
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    AI Strategy Recommendation
                  </CardTitle>
                  <CardDescription>
                    Personalized press strategy for your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {workflowStep === 'strategy' && !recommendation ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Bot className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Ready to Analyze</p>
                      <p className="text-sm">
                        Fill out the form to get your personalized press release strategy.
                      </p>
                    </div>
                  ) : workflowStep === 'approval' ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-card p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2">AI Strategy & Research Results:</h4>
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed mb-4">
                            {recommendation}
                          </div>
                          <hr className="my-4" />
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {researchResults}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Ready to Continue?</h4>
                        <p className="text-sm text-yellow-700 mb-4">
                          Please fill in your press release details below, then approve to continue with drafting your press release.
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="companyNameApproval">Company Name</Label>
                            <Input
                              id="companyNameApproval"
                              placeholder="e.g., TechCorp Inc."
                              value={pressReleaseData.companyName}
                              onChange={(e) => setPressReleaseData(prev => ({ ...prev, companyName: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="announcementApproval">What are you announcing?</Label>
                            <Textarea
                              id="announcementApproval"
                              placeholder="e.g., New product launch, funding round, partnership, expansion..."
                              value={pressReleaseData.announcement}
                              onChange={(e) => setPressReleaseData(prev => ({ ...prev, announcement: e.target.value }))}
                              required
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="keyBenefitsApproval">Key Benefits/Impact</Label>
                            <Textarea
                              id="keyBenefitsApproval"
                              placeholder="e.g., 50% cost reduction, improved efficiency, market expansion..."
                              value={pressReleaseData.keyBenefits}
                              onChange={(e) => setPressReleaseData(prev => ({ ...prev, keyBenefits: e.target.value }))}
                              required
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="companyBackgroundApproval">Company Background</Label>
                            <Textarea
                              id="companyBackgroundApproval"
                              placeholder="Brief company description, founding year, mission..."
                              value={pressReleaseData.companyBackground}
                              onChange={(e) => setPressReleaseData(prev => ({ ...prev, companyBackground: e.target.value }))}
                              required
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleApprovalAndDraft}
                          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || !pressReleaseData.companyName || !pressReleaseData.announcement}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Drafting Press Release...
                            </>
                          ) : (
                            <>
                              <PenTool className="h-4 w-4 mr-2" />
                              Approve & Draft Press Release
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : workflowStep === 'complete' && draftedPressRelease ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-card p-4 rounded-lg border max-h-96 overflow-y-auto">
                        <h4 className="font-semibold mb-2">Your Professional Press Release:</h4>
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {draftedPressRelease}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigator.clipboard.writeText(draftedPressRelease)}
                          variant="outline"
                          className="flex-1"
                        >
                          Copy to Clipboard
                        </Button>
                        <Button 
                          onClick={() => {
                            resetForm();
                            setWorkflowStep('strategy');
                          }}
                          className="flex-1"
                        >
                          Start New Project
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-card p-4 rounded-lg border">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {recommendation}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Press Release Research
                  </CardTitle>
                  <CardDescription>
                    Let AI research your industry and find the best examples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResearchSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., TechCorp Inc."
                        value={pressReleaseData.companyName}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, companyName: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="announcement">What are you announcing?</Label>
                      <Textarea
                        id="announcement"
                        placeholder="e.g., New product launch, funding round, partnership, expansion..."
                        value={pressReleaseData.announcement}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, announcement: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-hero text-white hover:bg-gradient-hero/90"
                      disabled={isLoading || !formData.industry}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Researching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Research with Perplexity
                        </>
                      )}
                    </Button>
                    
                    {!formData.industry && (
                      <p className="text-sm text-muted-foreground">
                        Complete the Strategy tab first to enable research
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Research Results
                  </CardTitle>
                  <CardDescription>
                    Industry insights and competitive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {researchResults ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-card p-4 rounded-lg border max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {researchResults}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setActiveTab('draft')}
                        className="w-full"
                      >
                        Continue to Draft PR
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Search className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Ready to Research</p>
                      <p className="text-sm">
                        Provide your announcement details to get industry research.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Draft Tab */}
          <TabsContent value="draft" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Press Release Details
                  </CardTitle>
                  <CardDescription>
                    Provide details for your press release draft
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDraftSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="keyBenefits">Key Benefits/Impact</Label>
                      <Textarea
                        id="keyBenefits"
                        placeholder="e.g., 50% cost reduction, improved efficiency, market expansion..."
                        value={pressReleaseData.keyBenefits}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, keyBenefits: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="targetMarket">Target Market</Label>
                      <Input
                        id="targetMarket"
                        placeholder="e.g., Enterprise customers, SMBs, consumers..."
                        value={pressReleaseData.targetMarket}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, targetMarket: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="quotes">Key Quotes (Optional)</Label>
                      <Textarea
                        id="quotes"
                        placeholder="e.g., CEO quote, customer testimonial..."
                        value={pressReleaseData.quotes}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, quotes: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyBackground">Company Background</Label>
                      <Textarea
                        id="companyBackground"
                        placeholder="Brief company description, founding year, mission..."
                        value={pressReleaseData.companyBackground}
                        onChange={(e) => setPressReleaseData(prev => ({ ...prev, companyBackground: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-hero text-white hover:bg-gradient-hero/90"
                      disabled={isLoading || !pressReleaseData.companyName}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Drafting...
                        </>
                      ) : (
                        <>
                          <PenTool className="h-4 w-4 mr-2" />
                          Draft Press Release
                        </>
                      )}
                    </Button>
                    
                    {!pressReleaseData.companyName && (
                      <p className="text-sm text-muted-foreground">
                        Complete the Research tab first to enable drafting
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Press Release
                  </CardTitle>
                  <CardDescription>
                    AI-generated professional press release
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {draftedPressRelease ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-card p-4 rounded-lg border max-h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {draftedPressRelease}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigator.clipboard.writeText(draftedPressRelease)}
                          variant="outline"
                          className="flex-1"
                        >
                          Copy to Clipboard
                        </Button>
                        <Button 
                          onClick={() => {
                            resetForm();
                            setIsOpen(false);
                          }}
                          className="flex-1"
                        >
                          Start New Project
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <PenTool className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Ready to Draft</p>
                      <p className="text-sm">
                        Provide your press release details to generate a professional draft.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};