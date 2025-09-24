import { Header } from "@/components/Header";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { ShoppingCart, Stethoscope, BarChart, Users } from "lucide-react";

const InStoreDigitalAdvertising = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-6">
              In-Store Digital Advertising
            </h1>
            <p className="hero-subtitle mb-8">
              Capture customers at the point of decision with targeted digital displays 
              in grocery stores, doctor's offices, and high-traffic retail locations.
            </p>
            <a href="#contact" className="cta-primary inline-block">
              Start Your Campaign
            </a>
          </div>
        </div>
      </section>

      {/* Subsections */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Strategic In-Store Advertising Solutions
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Grocery Store Advertising */}
              <div className="card-standard p-8">
                <div className="flex items-center mb-6">
                  <ShoppingCart className="h-12 w-12 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Grocery Store Advertising</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Reach customers while they're making purchasing decisions. Our grocery 
                  store digital displays are strategically placed in high-traffic areas 
                  including checkout lines, produce sections, and main aisles.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Checkout lane displays with 100% visibility</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Department-specific targeting (produce, deli, pharmacy)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Peak shopping hour optimization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Local and national chain partnerships</span>
                  </li>
                </ul>
              </div>

              {/* Doctor's Office Advertising */}
              <div className="card-standard p-8">
                <div className="flex items-center mb-6">
                  <Stethoscope className="h-12 w-12 text-primary mr-4" />
                  <h3 className="text-2xl font-bold">Doctor's Office Advertising</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Connect with patients during their wait time in medical facilities. 
                  Our healthcare network includes family practices, specialists, 
                  and urgent care centers across major metropolitan areas.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Waiting room displays with engaged audiences</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Health and wellness content integration</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Compliance with healthcare advertising regulations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                    <span>Specialized medical practice targeting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Benefits of In-Store Digital Advertising
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Captive Audience</h3>
                <p className="text-gray-600 text-sm">
                  Reach customers when they have time to focus on your message
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">High Engagement</h3>
                <p className="text-gray-600 text-sm">
                  Digital displays command attention and drive action
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Point of Purchase</h3>
                <p className="text-gray-600 text-sm">
                  Influence buying decisions at the perfect moment
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Targeted Reach</h3>
                <p className="text-gray-600 text-sm">
                  Reach specific demographics based on location type
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-12">
              Reach & Engagement Statistics
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2.5M+</div>
                  <div className="text-gray-600">Monthly Impressions</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <div className="text-gray-600">Attention Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">450+</div>
                  <div className="text-gray-600">Active Locations</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3.2x</div>
                  <div className="text-gray-600">Higher Recall</div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">65%</div>
                    <div className="text-sm text-gray-600">Grocery shoppers notice displays</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">12 min</div>
                    <div className="text-sm text-gray-600">Average wait time in medical offices</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">78%</div>
                    <div className="text-sm text-gray-600">Patients pay attention to waiting room content</div>
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
              Launch Your In-Store Campaign
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Ready to reach customers at the point of decision? Contact our team 
              to discuss your in-store advertising strategy and available locations.
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

export default InStoreDigitalAdvertising;