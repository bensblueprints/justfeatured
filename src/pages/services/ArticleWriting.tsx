import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { FileText, Search, TrendingUp, Users } from "lucide-react";

const ArticleWriting = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Professional Article Writing Services
            </h1>
            <p className="hero-subtitle mb-8">
              Engage your audience with high-quality, SEO-optimized articles that 
              drive traffic, build authority, and convert readers into customers.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Order Your Article
            </a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Why Quality Content Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  In today's digital landscape, content is king. Well-written articles 
                  not only inform and engage your audience but also improve your search 
                  engine rankings and establish your brand as an industry authority.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our professional article writing service delivers compelling, 
                  research-backed content that resonates with your target audience 
                  and drives meaningful business results.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">SEO-optimized content</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">Industry expertise</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span className="font-medium">Engaging storytelling</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">70%</div>
                    <div className="text-sm text-gray-600">Traffic Increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">3.5x</div>
                    <div className="text-sm text-gray-600">More Engagement</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">85%</div>
                    <div className="text-sm text-gray-600">Brand Authority</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">48hr</div>
                    <div className="text-sm text-gray-600">Delivery Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              What You Get With Every Article
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-standard p-8">
                <Search className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">SEO Optimization</h3>
                <p className="text-gray-600 mb-4">
                  Every article is optimized for search engines with strategic 
                  keyword placement and proper SEO structure.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Target keyword research</li>
                  <li>• Meta descriptions included</li>
                  <li>• Header tag optimization</li>
                  <li>• Internal linking suggestions</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <FileText className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Quality Content</h3>
                <p className="text-gray-600 mb-4">
                  Original, well-researched articles written by professional 
                  writers with expertise in your industry.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 100% original content</li>
                  <li>• Fact-checked and verified</li>
                  <li>• Engaging writing style</li>
                  <li>• Proper citations and sources</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <Users className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Audience-Focused</h3>
                <p className="text-gray-600 mb-4">
                  Content tailored to your specific audience with the right 
                  tone, style, and messaging for maximum impact.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Target audience analysis</li>
                  <li>• Brand voice consistency</li>
                  <li>• Call-to-action optimization</li>
                  <li>• Reader engagement focus</li>
                </ul>
              </div>
              
              <div className="card-standard p-8">
                <TrendingUp className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Results-Driven</h3>
                <p className="text-gray-600 mb-4">
                  Strategic content designed to achieve your business goals 
                  and drive measurable results.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Goal-oriented writing</li>
                  <li>• Conversion optimization</li>
                  <li>• Performance tracking ready</li>
                  <li>• Shareability factors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Our Article Writing Process
            </h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Brief & Research</h3>
                  <p className="text-gray-600">
                    We start by understanding your requirements, target audience, 
                    and goals, then conduct thorough research on your topic and industry.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Outline & Structure</h3>
                  <p className="text-gray-600">
                    Create a detailed outline that ensures logical flow, covers all 
                    key points, and incorporates SEO best practices.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Writing & Optimization</h3>
                  <p className="text-gray-600">
                    Our expert writers craft engaging content that's optimized for 
                    both readers and search engines, maintaining your brand voice.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Review & Delivery</h3>
                  <p className="text-gray-600">
                    Quality assurance review, editing, and proofreading before 
                    delivering your polished article ready for publication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="section-title mb-12">
              Article Writing Pricing
            </h2>
            <div className="card-standard p-12 border-2 border-primary">
              <h3 className="text-3xl font-semibold mb-6">Professional Article Writing</h3>
              <div className="text-6xl font-bold text-primary mb-4">$99</div>
              <p className="text-gray-600 mb-8 text-lg">
                Get a high-quality, SEO-optimized article (800-1200 words) that 
                engages your audience and drives results.
              </p>
              <ul className="text-left space-y-3 mb-10 max-w-md mx-auto">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>800-1200 words of original content</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>SEO optimization & keyword research</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Meta description included</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Professional editing & proofreading</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>48-hour delivery guarantee</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>One round of revisions included</span>
                </li>
              </ul>
              <button className="cta-primary text-xl px-12 py-4">
                Order Article Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center mb-8">
              Ready to Create Compelling Content?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Let's discuss your content needs and create articles that engage 
              your audience and drive meaningful results for your business.
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

export default ArticleWriting;