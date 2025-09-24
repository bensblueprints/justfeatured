import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { CheckCircle, Target, TrendingUp, Users } from "lucide-react";

const DigitalBillboardAdvertising = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Digital Billboard Advertising
            </h1>
            <p className="hero-subtitle mb-8">
              Reach millions of potential customers with strategic billboard placements 
              that maximize visibility and drive results for your brand.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Get Your Campaign Started
            </a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Transform Your Brand Visibility
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  Digital billboard advertising offers unparalleled reach and frequency, 
                  allowing your brand to capture attention at scale. With strategic 
                  placement in high-traffic areas, your message reaches thousands of 
                  potential customers daily.
                </p>
                <p className="text-lg text-gray-600">
                  Our data-driven approach ensures optimal placement timing and 
                  locations to maximize your advertising investment and deliver 
                  measurable results.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-gray-600">Visibility Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Exposure</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">3M+</div>
                    <div className="text-sm text-gray-600">Daily Impressions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">150%</div>
                    <div className="text-sm text-gray-600">Brand Recall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Key Benefits & Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card-standard p-6 text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Strategic Placement</h3>
                <p className="text-gray-600">
                  Prime locations with high traffic volume and optimal viewing angles
                </p>
              </div>
              <div className="card-standard p-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
                <p className="text-gray-600">
                  Track impressions, engagement, and campaign performance in real-time
                </p>
              </div>
              <div className="card-standard p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Massive Reach</h3>
                <p className="text-gray-600">
                  Connect with thousands of potential customers daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Why Choose Our Billboard Advertising
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Premium Locations</h3>
                    <p className="text-gray-600">Access to the most sought-after billboard locations in major markets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Creative Excellence</h3>
                    <p className="text-gray-600">Professional design team creates compelling visuals that capture attention</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Flexible Campaigns</h3>
                    <p className="text-gray-600">Short-term and long-term options to fit your budget and goals</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Detailed Reporting</h3>
                    <p className="text-gray-600">Comprehensive analytics and performance reports for every campaign</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Support</h3>
                    <p className="text-gray-600">Dedicated account managers to optimize your campaign performance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                    <p className="text-gray-600">Best-in-market rates with transparent pricing and no hidden fees</p>
                  </div>
                </div>
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
              Ready to Launch Your Billboard Campaign?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Get in touch with our team to discuss your advertising goals and 
              receive a custom proposal for your billboard campaign.
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

export default DigitalBillboardAdvertising;