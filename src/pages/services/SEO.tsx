import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { Search, TrendingUp, Target, BarChart } from "lucide-react";

const SEO = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Search Engine Optimization
            </h1>
            <p className="hero-subtitle mb-8">
              Increase your online visibility, drive organic traffic, and dominate 
              search results with comprehensive SEO strategies that deliver lasting results.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Boost Your Rankings
            </a>
          </div>
        </div>
      </section>

      {/* SEO Services Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Comprehensive SEO Services
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* On-Page SEO */}
              <div className="card-standard p-8">
                <div className="flex items-center mb-6">
                  <Search className="h-12 w-12 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">On-Page SEO</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Optimize your website's individual pages to rank higher and earn 
                  more relevant traffic through strategic content and technical improvements.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Keyword research and optimization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Meta tags and descriptions optimization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Header structure and internal linking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Content optimization and enhancement</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Image optimization and alt text</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>URL structure optimization</span>
                  </li>
                </ul>
              </div>

              {/* Off-Page SEO */}
              <div className="card-standard p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-12 w-12 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Off-Page SEO</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Build your website's authority and credibility through strategic 
                  link building, brand mentions, and external optimization tactics.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>High-quality backlink acquisition</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Guest posting and content outreach</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Local citation building</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Social media signal optimization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Brand mention monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Competitor backlink analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Audit Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              SEO Audit & Strategy
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Comprehensive Website Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Our detailed SEO audit identifies opportunities and creates a 
                  roadmap for improving your search engine performance and rankings.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Technical SEO Analysis</h4>
                      <p className="text-gray-600 text-sm">
                        Website speed, mobile-friendliness, crawlability, and indexation assessment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Search className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Keyword Gap Analysis</h4>
                      <p className="text-gray-600 text-sm">
                        Identify high-value keywords and content opportunities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Competitor Research</h4>
                      <p className="text-gray-600 text-sm">
                        Analyze competitor strategies and find competitive advantages
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
                <h4 className="text-lg font-semibold mb-6 text-center">Audit Deliverables</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Technical Issues Report</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Keyword Opportunities</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Content Recommendations</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Backlink Analysis</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Action Plan & Priorities</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ROI Projections</span>
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results and Reporting Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Results & Reporting
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">285%</div>
                  <div className="text-gray-600">Average Traffic Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">67%</div>
                  <div className="text-gray-600">First Page Rankings</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">4.2x</div>
                  <div className="text-gray-600">Lead Generation Boost</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">12 mo</div>
                  <div className="text-gray-600">Average ROI Timeline</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Monthly Reports</h3>
                <p className="text-gray-600">
                  Detailed monthly performance reports with rankings, traffic, 
                  and conversion data analysis.
                </p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                <p className="text-gray-600">
                  Real-time dashboard access to monitor keyword rankings 
                  and website performance metrics.
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Goal Achievement</h3>
                <p className="text-gray-600">
                  Clear KPI tracking and goal measurement to ensure 
                  SEO efforts align with business objectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Our SEO Process
            </h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Research & Analysis</h3>
                  <p className="text-gray-600">
                    Comprehensive audit of your current SEO performance, competitor analysis, 
                    and keyword research to identify opportunities and create a strategic plan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Technical Optimization</h3>
                  <p className="text-gray-600">
                    Fix technical issues, improve site speed, enhance mobile experience, 
                    and ensure proper indexing and crawlability for search engines.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Content & On-Page SEO</h3>
                  <p className="text-gray-600">
                    Optimize existing content and create new, valuable content targeting 
                    high-value keywords while improving on-page elements and user experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Link Building & Authority</h3>
                  <p className="text-gray-600">
                    Build high-quality backlinks and improve domain authority through 
                    strategic outreach, content marketing, and relationship building.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Monitor & Optimize</h3>
                  <p className="text-gray-600">
                    Continuous monitoring of performance metrics, algorithm updates, 
                    and competitive landscape to refine and improve SEO strategies.
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
              Ready to Dominate Search Results?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Let's discuss your SEO goals and create a customized strategy 
              to improve your search rankings and drive organic traffic growth.
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

export default SEO;