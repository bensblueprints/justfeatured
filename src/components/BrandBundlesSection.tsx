import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Globe, Award, PenTool, Link, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BrandBundle {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  category: 'media' | 'seo' | 'recognition' | 'premium';
}

const brandBundles: BrandBundle[] = [
  {
    id: 'press-release-bundle',
    name: 'Press Release Bundle',
    price: '$594.00',
    description: 'Distribute your brand story to top-tier outlets including AP News, ABC, NBC, CBS, Fox, and more. Includes professional press release writing, full-service distribution, "As Seen On" logos, and a detailed reporting dashboard. Guaranteed publication within days.',
    features: [
      'Top-tier media distribution',
      'Professional writing service',
      '"As Seen On" logos included',
      'Detailed reporting dashboard',
      'Guaranteed publication',
      'AP News, ABC, NBC, CBS, Fox'
    ],
    icon: <Globe className="h-6 w-6" />,
    category: 'media',
    popular: true
  },
  {
    id: 'best-of-award',
    name: '"Best Of" Award Service',
    price: '$394.00',
    description: 'Gain recognition with a customized award badge and editorial feature on trusted sites such as Business of Commerce, Business of E-Commerce, and Business of Shopping. Perfect for showcasing credibility with honors like Best Digital Agency, Top Service Provider, or Industry Leader.',
    features: [
      'Customized award badge',
      'Editorial feature placement',
      'Trusted business sites',
      'Credibility enhancement',
      'Industry recognition',
      'Badge usage rights'
    ],
    icon: <Award className="h-6 w-6" />,
    category: 'recognition'
  },
  {
    id: 'business-insider',
    name: 'Business Insider',
    price: '$694.00',
    description: 'Get your company featured in Business Insider, one of the most respected global media outlets. Leverage the Business Insider logo on your site, attract investor trust, and tap into millions of monthly readers for powerful brand authority.',
    features: [
      'Business Insider feature',
      'Logo usage rights',
      'Millions of monthly readers',
      'Investor trust building',
      'Global media coverage',
      'Brand authority boost'
    ],
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'premium'
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    price: '$694.00',
    description: 'Reach over 180 million readers with a guaranteed feature in Yahoo Finance. Includes logo usage, powerful do-follow backlinks, and exposure to a finance-savvy audience — ideal for startups, financial services, and entrepreneurs seeking credibility.',
    features: [
      '180+ million readers',
      'Guaranteed feature placement',
      'Logo usage rights',
      'Do-follow backlinks',
      'Finance-savvy audience',
      'Perfect for startups'
    ],
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'premium'
  },
  {
    id: 'medium-placement',
    name: 'Medium',
    price: '$394.00',
    description: 'Secure a guaranteed article placement on Medium, one of the internet\'s most recognized publishing platforms. Includes full writing service, permanent hosting, and backlinks on a DA 95+ domain. Perfect for thought leadership and SEO growth.',
    features: [
      'Guaranteed article placement',
      'Full writing service',
      'Permanent hosting',
      'DA 95+ backlinks',
      'Thought leadership',
      'SEO growth benefits'
    ],
    icon: <PenTool className="h-6 w-6" />,
    category: 'media'
  },
  {
    id: 'ultimate-seo',
    name: 'Ultimate SEO Package',
    price: '$1,994.00',
    description: 'Supercharge rankings with 100+ high-authority backlinks (DR 50–90) across news, lifestyle, and industry outlets. Includes full link-building strategy, guaranteed indexing, and traffic-driving placements. Designed for brands ready to dominate Google organically.',
    features: [
      '100+ high-authority backlinks',
      'DR 50-90 link sources',
      'Full link-building strategy',
      'Guaranteed indexing',
      'Traffic-driving placements',
      'Google domination focus'
    ],
    icon: <Link className="h-6 w-6" />,
    category: 'seo'
  },
  {
    id: 'google-knowledge-panel',
    name: 'Google Knowledge Panel',
    price: '$2,994.00',
    description: 'Take control of your online authority with a verified Google Knowledge Panel. Includes setup, verification, content curation, and integration of your logo, social links, and brand profile. A must-have for credibility, investor trust, and search visibility.',
    features: [
      'Verified Knowledge Panel',
      'Complete setup & verification',
      'Content curation',
      'Logo & social integration',
      'Search visibility boost',
      'Ultimate credibility'
    ],
    icon: <Search className="h-6 w-6" />,
    category: 'premium'
  }
];

const categoryColors = {
  media: 'bg-blue-500/10 text-blue-700 border-blue-200',
  seo: 'bg-green-500/10 text-green-700 border-green-200',
  recognition: 'bg-purple-500/10 text-purple-700 border-purple-200',
  premium: 'bg-gradient-to-r from-yellow-400/10 to-orange-500/10 text-orange-700 border-orange-200'
};

export const BrandBundlesSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = (bundleId: string) => {
    // For now, navigate to contact or checkout
    navigate('/starter-selection');
  };

  return (
    <main className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-700 border-purple-200">
            Brand Building Packages
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Accelerate Your Brand
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professional brand building packages designed to boost your credibility, visibility, and authority across the web. From press releases to SEO dominance.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brandBundles.map((bundle) => (
            <Card key={bundle.id} className={`relative group hover:shadow-lg transition-all duration-300 ${bundle.popular ? 'ring-2 ring-purple-500/20' : ''}`}>
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${categoryColors[bundle.category]}`}>
                    {bundle.icon}
                  </div>
                  <Badge variant="outline" className={categoryColors[bundle.category]}>
                    {bundle.category.charAt(0).toUpperCase() + bundle.category.slice(1)}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl mb-2">{bundle.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-4">{bundle.price}</div>
                <CardDescription className="text-sm leading-relaxed">
                  {bundle.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {bundle.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleGetStarted(bundle.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-muted-foreground mb-6">
            Let us create a tailored brand building strategy that fits your specific needs and budget.
          </p>
          <Button 
            onClick={() => navigate('/starter-selection')}
            variant="outline" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Contact Our Team
          </Button>
        </div>
      </div>
    </main>
  );
};