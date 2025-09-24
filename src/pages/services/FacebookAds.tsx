import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { Target, BarChart, DollarSign, Users } from "lucide-react";

const FacebookAds = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Facebook Ads Management
            </h1>
            <p className="hero-subtitle mb-8">
              Drive qualified leads, increase sales, and maximize ROI with expertly 
              managed Facebook advertising campaigns tailored to your business goals.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Start Advertising
            </a>
          </div>
        </div>
      </section>

      {/* Types of Facebook Ads Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Types of Facebook Ads We Manage
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card-standard p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Lead Generation Ads</h3>
                <p className="text-gray-600 text-center">
                  Capture high-quality leads directly on Facebook with optimized 
                  forms and compelling offers.
                </p>
              </div>

              <div className="card-standard p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Conversion Campaigns</h3>
                <p className="text-gray-600 text-center">
                  Drive sales and conversions with targeted campaigns optimized 
                  for purchase behavior.
                </p>
              </div>

              <div className="card-standard p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Brand Awareness</h3>
                <p className="text-gray-600 text-center">
                  Increase brand visibility and reach new audiences with 
                  engaging awareness campaigns.
                </p>
              </div>

              <div className="card-standard p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Retargeting Campaigns</h3>
                <p className="text-gray-600 text-center">
                  Re-engage website visitors and past customers with personalized 
                  retargeting messages.
                </p>
              </div>

              <div className="card-standard p-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Local Business Ads</h3>
                <p className="text-gray-600 text-center">
                  Drive foot traffic and local awareness for brick-and-mortar 
                  businesses and service providers.
                </p>
              </div>

              <div className="card-standard p-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">App Promotion</h3>
                <p className="text-gray-600 text-center">
                  Increase app downloads and user engagement with mobile-focused 
                  advertising campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Optimization Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Campaign Optimization Strategies
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Audience Targeting</h3>
                    <p className="text-gray-600">
                      Precision targeting using demographics, interests, behaviors, 
                      and custom audiences for maximum relevance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Creative Testing</h3>
                    <p className="text-gray-600">
                      A/B testing of ad creatives, copy, and formats to identify 
                      top-performing combinations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bid Optimization</h3>
                    <p className="text-gray-600">
                      Strategic bidding strategies to maximize results while 
                      controlling costs and improving efficiency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Conversion Tracking</h3>
                    <p className="text-gray-600">
                      Comprehensive tracking setup to measure and optimize for 
                      your most valuable actions and outcomes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Landing Page Sync</h3>
                    <p className="text-gray-600">
                      Ensuring ad messaging aligns with landing pages for 
                      consistent user experience and higher conversions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Analysis</h3>
                    <p className="text-gray-600">
                      Regular analysis and reporting with actionable insights 
                      for continuous campaign improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI and Performance Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              ROI & Performance Tracking
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">4.2x</div>
                  <div className="text-gray-600">Average ROAS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">65%</div>
                  <div className="text-gray-600">Lower CPC</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3.8x</div>
                  <div className="text-gray-600">Higher CTR</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">52%</div>
                  <div className="text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Reporting</h3>
                <p className="text-gray-600">
                  Access detailed performance metrics and insights through 
                  our comprehensive reporting dashboard.
                </p>
              </div>
              
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">ROI Optimization</h3>
                <p className="text-gray-600">
                  Continuous optimization focused on maximizing return on 
                  advertising spend and improving profitability.
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Goal Tracking</h3>
                <p className="text-gray-600">
                  Track and measure progress against your specific business 
                  objectives and KPIs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center mb-8">
              Ready to Scale Your Facebook Advertising?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Let's discuss your advertising goals and create a customized Facebook 
              ads strategy that delivers measurable results for your business.
            </p>
            <ServiceContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Just Featured. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FacebookAds;