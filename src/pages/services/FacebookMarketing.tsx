import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { Users, Target, TrendingUp, MessageCircle } from "lucide-react";

const FacebookMarketing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Facebook Marketing Services
            </h1>
            <p className="hero-subtitle mb-8">
              Build your brand presence, engage your audience, and drive meaningful 
              results with comprehensive Facebook marketing strategies tailored to your business.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Grow Your Presence
            </a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Strategic Facebook Marketing
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  Facebook marketing goes beyond just posting content. It's about 
                  building authentic relationships with your audience, creating 
                  engaging experiences, and developing a community around your brand.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our comprehensive approach combines content strategy, community 
                  management, audience analysis, and performance optimization to 
                  maximize your Facebook presence and drive real business results.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">Content Strategy & Creation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">Community Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">Performance Analytics</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">2.9B+</div>
                    <div className="text-sm text-gray-600">Monthly Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">65%</div>
                    <div className="text-sm text-gray-600">Daily Usage Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">200M+</div>
                    <div className="text-sm text-gray-600">Businesses on Platform</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50min</div>
                    <div className="text-sm text-gray-600">Daily Time Spent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Strategies Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Our Facebook Marketing Strategies
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-standard p-8">
                <Users className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Content Strategy & Creation</h3>
                <p className="text-gray-600 mb-4">
                  Develop engaging content that resonates with your audience and 
                  drives meaningful interactions.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Visual content creation and curation</li>
                  <li>• Video marketing and storytelling</li>
                  <li>• User-generated content campaigns</li>
                  <li>• Content calendar planning</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <MessageCircle className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Community Management</h3>
                <p className="text-gray-600 mb-4">
                  Build and nurture an active community around your brand with 
                  responsive engagement and relationship building.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time response management</li>
                  <li>• Community engagement strategies</li>
                  <li>• Crisis communication handling</li>
                  <li>• Brand voice development</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <Target className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Audience Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Deep insights into your audience behavior, preferences, and 
                  engagement patterns to optimize your strategy.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Demographic and psychographic analysis</li>
                  <li>• Engagement pattern identification</li>
                  <li>• Competitor audience research</li>
                  <li>• Content performance optimization</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <TrendingUp className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Growth Strategies</h3>
                <p className="text-gray-600 mb-4">
                  Proven tactics to increase your follower base, improve engagement 
                  rates, and expand your organic reach.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Organic growth optimization</li>
                  <li>• Hashtag strategy and trends</li>
                  <li>• Cross-platform promotion</li>
                  <li>• Influencer collaboration opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Benefits of Facebook Marketing
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Massive Reach</h3>
                <p className="text-gray-600">
                  Access to billions of users worldwide with sophisticated 
                  targeting capabilities to reach your ideal customers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Precise Targeting</h3>
                <p className="text-gray-600">
                  Advanced targeting options based on demographics, interests, 
                  behaviors, and custom audiences.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Measurable Results</h3>
                <p className="text-gray-600">
                  Comprehensive analytics and reporting to track performance 
                  and optimize your marketing efforts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Our Facebook Marketing Approach
            </h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Strategy Development</h3>
                  <p className="text-gray-600">
                    We start by understanding your business goals, target audience, and 
                    competitive landscape to develop a customized Facebook marketing strategy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Content Creation & Planning</h3>
                  <p className="text-gray-600">
                    Our creative team develops engaging content and creates a comprehensive 
                    content calendar aligned with your brand voice and marketing objectives.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Implementation & Management</h3>
                  <p className="text-gray-600">
                    We execute your strategy with consistent posting, active community 
                    management, and real-time engagement with your audience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Analysis & Optimization</h3>
                  <p className="text-gray-600">
                    Continuous monitoring and analysis of performance metrics to optimize 
                    content, timing, and strategy for maximum results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center mb-8">
              Ready to Elevate Your Facebook Presence?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Let's discuss how our Facebook marketing services can help you build 
              a stronger brand presence and connect with your audience effectively.
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

export default FacebookMarketing;