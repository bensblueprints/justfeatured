import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { Code, Smartphone, Zap, Shield } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

const WebsiteDevelopment = () => {
  const { addServiceToCart, isServiceInCart } = useCart();

  const handleAddToCart = (serviceId: string, serviceName: string) => {
    addServiceToCart(serviceId);
    toast({
      title: "Added to Cart",
      description: `${serviceName} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              Professional Website Development
            </h1>
            <p className="hero-subtitle mb-8">
              Build powerful, responsive websites that drive conversions and deliver 
              exceptional user experiences across all devices and platforms.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Our Development Process
            </h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Discovery & Planning</h3>
                  <p className="text-gray-600 mb-4">
                    We start by understanding your business goals, target audience, and 
                    project requirements to create a comprehensive development strategy.
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Business requirements analysis</li>
                    <li>• User persona development</li>
                    <li>• Technical architecture planning</li>
                    <li>• Project timeline and milestones</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Design & Prototyping</h3>
                  <p className="text-gray-600 mb-4">
                    Our design team creates intuitive, visually appealing interfaces 
                    that enhance user experience and reflect your brand identity.
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Wireframing and user flow mapping</li>
                    <li>• Visual design and branding</li>
                    <li>• Interactive prototypes</li>
                    <li>• Mobile-first responsive design</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Development & Testing</h3>
                  <p className="text-gray-600 mb-4">
                    Our development team builds your website using modern technologies 
                    and best practices, ensuring quality and performance.
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Clean, scalable code development</li>
                    <li>• Cross-browser compatibility testing</li>
                    <li>• Performance optimization</li>
                    <li>• Security implementation</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Launch & Support</h3>
                  <p className="text-gray-600 mb-4">
                    We handle the deployment process and provide ongoing support 
                    to ensure your website continues to perform optimally.
                  </p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Deployment and go-live support</li>
                    <li>• Staff training and documentation</li>
                    <li>• Ongoing maintenance and updates</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Technologies We Use
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Frontend Development</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>React & Next.js</li>
                  <li>Vue.js & Nuxt.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Backend Development</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>Node.js & Express</li>
                  <li>Python & Django</li>
                  <li>PHP & Laravel</li>
                  <li>Supabase & Firebase</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mobile & PWA</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>Progressive Web Apps</li>
                  <li>React Native</li>
                  <li>Flutter</li>
                  <li>Mobile Optimization</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Cloud & DevOps</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>AWS & Google Cloud</li>
                  <li>Docker & Kubernetes</li>
                  <li>CI/CD Pipelines</li>
                  <li>Performance Monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Website Features & Capabilities
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-standard p-8">
                <h3 className="text-xl font-semibold mb-6">Core Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>Responsive Mobile Design</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>Content Management System</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>SEO Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>Fast Loading Speed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>Security & SSL Certificates</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                    <span>Analytics Integration</span>
                  </div>
                </div>
              </div>
              
              <div className="card-standard p-8">
                <h3 className="text-xl font-semibold mb-6">Advanced Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>E-commerce Integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>User Authentication</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>API Development</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>Database Integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>Third-party Integrations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-3"></div>
                    <span>Custom Functionality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Portfolio & Results
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Websites Built</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2.3s</div>
                  <div className="text-gray-600">Average Load Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-standard p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">E-commerce Solutions</h3>
                <p className="text-gray-600 text-sm">
                  Custom online stores with payment processing, inventory management, 
                  and order fulfillment systems.
                </p>
              </div>
              
              <div className="card-standard p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Business Websites</h3>
                <p className="text-gray-600 text-sm">
                  Professional corporate websites with content management, 
                  lead capture, and business automation features.
                </p>
              </div>
              
              <div className="card-standard p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Web Applications</h3>
                <p className="text-gray-600 text-sm">
                  Custom web applications with complex functionality, 
                  user dashboards, and database integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Website Development Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-standard p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Basic Local Lead Generation Website</h3>
                <div className="text-5xl font-bold text-primary mb-4">$1,500</div>
                <p className="text-gray-600 mb-6">
                  Perfect for local businesses looking to generate leads and establish 
                  an online presence with essential features.
                </p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Responsive mobile design</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Contact forms & lead capture</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>SEO optimization</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Basic analytics setup</span>
                  </li>
                </ul>
                <button 
                  className="cta-primary w-full"
                  onClick={() => handleAddToCart('website-basic', 'Basic Local Lead Generation Website')}
                >
                  {isServiceInCart('website-basic') ? 'Added to Cart' : 'Get Started'}
                </button>
              </div>
              
              <div className="card-standard p-8 text-center border-2 border-primary">
                <div className="bg-primary text-white px-4 py-1 rounded-full text-sm mb-4 inline-block">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold mb-4">E-commerce Website</h3>
                <div className="text-5xl font-bold text-primary mb-4">$10,000</div>
                <p className="text-gray-600 mb-6">
                  Complete e-commerce solution with payment processing, inventory management, 
                  and advanced features for online stores.
                </p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Full e-commerce functionality</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Payment gateway integration</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Inventory management system</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Custom admin dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span>Advanced analytics & reporting</span>
                  </li>
                </ul>
                <button 
                  className="cta-primary w-full"
                  onClick={() => handleAddToCart('website-ecommerce', 'E-commerce Website')}
                >
                  {isServiceInCart('website-ecommerce') ? 'Added to Cart' : 'Get Started'}
                </button>
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
              Ready to Build Your Website?
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Let's discuss your website requirements and create a development 
              plan that brings your vision to life with modern technology.
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

export default WebsiteDevelopment;