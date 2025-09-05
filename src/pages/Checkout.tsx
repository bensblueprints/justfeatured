import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CreditCard, Shield, CheckCircle, Star, TrendingUp, Zap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PUBLICATIONS } from "@/data/publications";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tat_days: number;
  isUpsell?: boolean;
}

interface CustomerInfo {
  fullName: string;
  email: string;
  businessName: string;
  industry: string;
  phone: string;
  website: string;
}

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    businessName: "",
    industry: "",
    phone: "",
    website: ""
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [packageType, setPackageType] = useState<'starter' | 'custom'>('custom');
  const [selectedStarterPublications, setSelectedStarterPublications] = useState<any[]>([]);
  const [availableStarterPubs] = useState(() => 
    PUBLICATIONS.filter(pub => pub.type === 'starter')
  );

  // Rush delivery pricing - $197 flat fee
  const rushDeliveryPrice = 19700; // $197
  const rushDeliveryItem = {
    id: 'rush-delivery',
    name: '⚡ 48-Hour Rush Delivery',
    price: rushDeliveryPrice,
    category: 'Priority Service',
    tat_days: 2,
    isUpsell: true
  };
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [rushDelivery, setRushDelivery] = useState(false);

  // Define upsell offers
  const upsellOffers = [
    {
      id: 'la-weekly',
      name: 'LA Weekly Premium',
      originalPrice: 350000,
      discountedPrice: 200000,
      savings: 150000,
      category: 'Premium Upgrade',
      tat_days: 1,
      description: 'Major Los Angeles publication with do-follow links',
      features: ['LA culture authority', 'Arts coverage', 'Do-follow links', 'Fast 1-day turnaround'],
      badge: 'POPULAR',
      color: 'bg-primary'
    },
    {
      id: 'usa-today-bundle',
      name: 'USA Today (50K Impressions)',
      originalPrice: 600000,
      discountedPrice: 400000,
      savings: 200000,
      category: 'National Reach',
      tat_days: 12,
      description: 'National newspaper with guaranteed impressions',
      features: ['National coverage', '50K guaranteed impressions', 'News authority', 'Broad audience'],
      badge: 'BEST VALUE',
      color: 'bg-accent'
    },
    {
      id: 'digital-trends',
      name: 'Digital Trends Tech Feature',
      originalPrice: 350000,
      discountedPrice: 250000,
      savings: 100000,
      category: 'Technology Focus',
      tat_days: 7,
      description: 'Leading technology publication',
      features: ['Tech authority', 'Product reviews', 'Consumer tech focus', 'Innovation coverage'],
      badge: 'LIMITED TIME',
      color: 'bg-gradient-luxury'
    }
  ];

  useEffect(() => {
    // Get selected publications from navigation state
    const selectedPublications = location.state?.selectedPublications || [];
    const type = location.state?.packageType || 'custom';
    const starterPubs = location.state?.selectedStarterPublications || [];
    
    setPackageType(type);
    
    if (type === 'starter') {
      if (starterPubs.length > 0) {
        setSelectedStarterPublications(starterPubs);
        // Calculate starter package pricing
        const starterItems = starterPubs.map((pub: any, index: number) => ({
          id: `starter-${pub.id}`,
          name: pub.name,
          price: index === 0 ? 9700 : 4700, // First publication $97, additional $47 each
          category: 'Starter Package',
          tat_days: 3
        }));
        setItems(starterItems);
      } else {
        // Redirect to starter selection if no publications selected
        navigate('/starter-selection');
        return;
      }
    } else {
      setItems(selectedPublications);
    }

    // If no items, redirect back to publications
    if (selectedPublications.length === 0 && type !== 'starter') {
      navigate('/publications');
    }
  }, [location.state, navigate]);

  const handleStarterPublicationToggle = (publication: any, checked: boolean) => {
    if (checked) {
      const newSelection = [...selectedStarterPublications, publication];
      setSelectedStarterPublications(newSelection);
      
      // Update items with new pricing structure
      const starterItems = newSelection.map((pub, index) => ({
        id: `starter-${pub.id}`,
        name: pub.name,
        price: index === 0 ? 9700 : 4700, // First $97, additional $47 each
        category: 'Starter Package',
        tat_days: 3
      }));
      setItems(starterItems);
    } else {
      const newSelection = selectedStarterPublications.filter(p => p.id !== publication.id);
      setSelectedStarterPublications(newSelection);
      
      // Update items
      const starterItems = newSelection.map((pub, index) => ({
        id: `starter-${pub.id}`,
        name: pub.name,
        price: index === 0 ? 9700 : 4700,
        category: 'Starter Package',
        tat_days: 3
      }));
      setItems(starterItems);
    }
  };

  const handleUpsellToggle = (upsellId: string, checked: boolean) => {
    const upsell = upsellOffers.find(u => u.id === upsellId);
    if (!upsell) return;

    if (checked) {
      setSelectedUpsells([...selectedUpsells, upsellId]);
      setItems(prev => [...prev, {
        id: upsell.id,
        name: upsell.name,
        price: upsell.discountedPrice,
        category: upsell.category,
        tat_days: upsell.tat_days,
        isUpsell: true
      }]);
    } else {
      setSelectedUpsells(selectedUpsells.filter(id => id !== upsellId));
      setItems(prev => prev.filter(item => item.id !== upsellId));
    }
  };

  const handleRushDeliveryToggle = (checked: boolean) => {
    setRushDelivery(checked);
    
    if (checked) {
      setItems(prev => [...prev, rushDeliveryItem]);
    } else {
      setItems(prev => prev.filter(item => item.id !== 'rush-delivery'));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = selectedUpsells.reduce((sum, upsellId) => {
    const upsell = upsellOffers.find(u => u.id === upsellId);
    return sum + (upsell?.savings || 0);
  }, 0);
  const processingFee = Math.round(subtotal * 0.029); // 2.9% processing fee
  const total = subtotal + processingFee;

  const industries = [
    "Technology", "Healthcare", "Finance", "Real Estate", "E-commerce",
    "Education", "Manufacturing", "Consulting", "Marketing", "Food & Beverage",
    "Fashion", "Entertainment", "Non-profit", "Legal", "Other"
  ];

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    // Validate required fields
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.businessName || !customerInfo.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the Stripe payment function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items,
          customerInfo,
          packageType,
          selectedStarterPublications: packageType === 'starter' ? selectedStarterPublications : undefined,
          selectedUpsells: selectedUpsells.length > 0 ? selectedUpsells : undefined,
          rushDelivery
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">No Items Selected</h1>
          <p className="text-muted-foreground mb-8">Please select publications to continue with checkout.</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/starter-selection')} variant="hero">
              $97 Starter Package
            </Button>
            <Button onClick={() => navigate('/publications')} variant="outline">
              Browse All Publications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-primary" />
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={customerInfo.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Select onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={customerInfo.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-muted/20 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Secure Checkout</p>
                      <p className="text-muted-foreground">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {packageType === 'starter' ? (
                    <div className="space-y-4">
                      {/* Multiple Starter Publication Selection */}
                      <div className="bg-gradient-hero text-white p-4 rounded-lg">
                        <Badge className="bg-warning text-warning-foreground mb-2">
                          Starter Package Special
                        </Badge>
                        <h3 className="font-bold text-lg mb-2">
                          Select Your Publications (1st: $97, Additional: $47 each)
                        </h3>
                        <p className="text-white/90 text-sm mb-4">Choose multiple publications from our starter collection</p>
                      </div>

                      <div className="space-y-3">
                        {availableStarterPubs.map(pub => (
                          <div key={pub.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                            <Checkbox
                              id={`starter-${pub.id}`}
                              checked={selectedStarterPublications.some(p => p.id === pub.id)}
                              onCheckedChange={(checked) => handleStarterPublicationToggle(pub, checked as boolean)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`starter-${pub.id}`} className="font-semibold cursor-pointer">
                                {pub.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{pub.description}</p>
                              <p className="text-xs text-muted-foreground">{pub.category} • {pub.tat_days} days</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {selectedStarterPublications.length === 0 || 
                                 selectedStarterPublications.findIndex(p => p.id === pub.id) === 0 
                                  ? '$97' : '$47'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedStarterPublications.length > 0 && (
                        <div className="bg-muted/20 p-3 rounded-lg">
                          <h4 className="font-semibold mb-2">Selected Publications:</h4>
                          {selectedStarterPublications.map((pub, index) => (
                            <div key={pub.id} className="flex justify-between text-sm">
                              <span>{pub.name}</span>
                              <span className="font-semibold">{index === 0 ? '$97' : '$47'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.filter(item => !item.isUpsell).map(item => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-muted/20 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-xs text-muted-foreground">{item.tat_days} days turnaround</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${(item.price / 100).toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rush Delivery Upsell - Prominent Position */}
                  <div className="bg-gradient-to-r from-warning/20 to-accent/20 border-2 border-warning/50 rounded-xl p-4 shadow-luxury">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="rush-delivery"
                        checked={rushDelivery}
                        onCheckedChange={handleRushDeliveryToggle}
                        className="h-5 w-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="h-5 w-5 text-warning" />
                          <Label htmlFor="rush-delivery" className="font-bold text-lg cursor-pointer">
                            ⚡ 48-Hour Rush Delivery
                          </Label>
                          <Badge className="bg-warning text-black font-bold animate-pulse">
                            PRIORITY
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">
                            <span className="line-through text-muted-foreground">Normal: 5-10 business days</span>
                            <span className="ml-2 text-warning">→ Rush: 48 hours guaranteed!</span>
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-success" />
                              Priority queue processing
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-success" />
                              Same-day press release writing
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-success" />
                              48-hour publication guarantee
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-warning">
                          +$197
                        </div>
                        <div className="text-xs text-muted-foreground">
                          One-time fee
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Upsells Section */}
                  <div className="space-y-4">
                    <Separator />
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-bold">🔥 Additional Premium Upgrades</h3>
                    </div>
                    
                    {upsellOffers.map(upsell => (
                      <div key={upsell.id} className="border-2 border-dashed border-accent/30 rounded-lg p-4 hover:border-accent/60 transition-colors">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={`upsell-${upsell.id}`}
                            checked={selectedUpsells.includes(upsell.id)}
                            onCheckedChange={(checked) => handleUpsellToggle(upsell.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Label htmlFor={`upsell-${upsell.id}`} className="font-bold cursor-pointer text-lg">
                                {upsell.name}
                              </Label>
                              <Badge className={`${upsell.color} text-white`}>
                                {upsell.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{upsell.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {upsell.features.map((feature, index) => (
                                <div key={index} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-accent" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-muted-foreground line-through">
                                ${(upsell.originalPrice / 100).toFixed(0)}
                              </span>
                              <span className="text-lg font-bold text-accent">
                                ${(upsell.discountedPrice / 100).toFixed(0)}
                              </span>
                              <span className="text-xs text-success font-semibold">
                                Save ${(upsell.savings / 100).toFixed(0)}!
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {items.filter(item => item.isUpsell).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-accent">Added Upgrades:</h4>
                      {items.filter(item => item.isUpsell).map(item => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-xs text-muted-foreground">{item.tat_days} days turnaround</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">${(item.price / 100).toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(subtotal / 100).toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-success font-semibold">
                        <span>Total Savings</span>
                        <span>-${(totalSavings / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing Fee (2.9%)</span>
                      <span>${(processingFee / 100).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <p className="text-sm text-success font-semibold text-center">
                        🎉 You're saving ${(totalSavings / 100).toFixed(2)} with these offers!
                      </p>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {isProcessing ? "Processing..." : "Proceed to Payment"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>100% Money Back Guarantee</p>
                    <p>Secure payment powered by Stripe</p>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Professional press release writing
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      SEO optimized content
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Publication proof links
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Social media assets
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      Email support throughout
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};