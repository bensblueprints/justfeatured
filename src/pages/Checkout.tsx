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
import { fetchPublications } from "@/lib/publications";

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
  const [availableStarterPubs, setAvailableStarterPubs] = useState<any[]>([]);

  // Rush delivery pricing - $197 flat fee
  const rushDeliveryPrice = 197; // $197
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
      originalPrice: 3500,
      discountedPrice: 2000,
      savings: 1500,
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
      originalPrice: 6000,
      discountedPrice: 4000,
      savings: 2000,
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
      originalPrice: 3500,
      discountedPrice: 2500,
      savings: 1000,
      category: 'Technology Focus',
      tat_days: 7,
      description: 'Leading technology publication',
      features: ['Tech authority', 'Product reviews', 'Consumer tech focus', 'Innovation coverage'],
      badge: 'LIMITED TIME',
      color: 'bg-gradient-luxury'
    }
  ];

  useEffect(() => {
    // Get selected publications and services from navigation state (fallback to sessionStorage for mobile)
    const statePublications = location.state?.selectedPublications || [];
    const stateServices = location.state?.selectedServices || [];
    const sessionItems = JSON.parse(sessionStorage.getItem('checkout_items') || '[]');
    
    // Combine state items and session items, prioritizing state
    const allItems = [...statePublications, ...stateServices];
    const finalItems = allItems.length > 0 ? allItems : sessionItems;
    
    const type = (location.state?.packageType as 'starter' | 'custom') || (sessionStorage.getItem('checkout_package_type') as 'starter' | 'custom') || 'custom';
    const starterPubs = location.state?.selectedStarterPublications || [];
    
    console.log('Checkout useEffect:', {
      statePublications,
      stateServices,
      sessionItems,
      finalItems,
      type
    });
    
    setPackageType(type);
    
    if (type === 'starter') {
      if (starterPubs.length > 0) {
        setSelectedStarterPublications(starterPubs);
        // Calculate starter package pricing
        const starterItems = starterPubs.map((pub: any, index: number) => ({
          id: `starter-${pub.id}`,
          name: pub.name,
          price: index === 0 ? 97 : 87,
          category: 'Starter Package',
          tat_days: 3,
        }));
        setItems(starterItems);
      } else {
        navigate('/starter-selection');
        return;
      }
    } else {
      setItems(finalItems);
    }

    // Clean up persisted data once loaded
    if (finalItems.length > 0) {
      sessionStorage.removeItem('checkout_items');
      sessionStorage.removeItem('checkout_package_type');
    }

    // If no items, redirect back to publications
    if (finalItems.length === 0 && type !== 'starter') {
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
        price: index === 0 ? 97 : 87, // First $97, additional $87 each (discounted from $97)
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
        price: index === 0 ? 97 : 87, // First $97, additional $87 each (discounted from $97)
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
  const processingFee = Math.round(subtotal * 0.029 * 100) / 100; // 2.9% processing fee
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
              <span className="line-through text-gray-300">$497</span> <span className="text-green-300">$97</span> Starter Package
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
      
      {/* Hero Section - Convert Better Copy */}
      <div className="bg-gradient-to-br from-destructive/20 to-destructive/10 border-b border-destructive/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-destructive">
              You've been doing it the HARD way
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Writing pitches that get rejected, hiring expensive PR firms that over-promise and under-deliver, hoping for breakthrough results...
            </p>
            <div className="bg-primary text-primary-foreground rounded-lg p-6 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">THERE'S A BETTER WAY.</h2>
              <p className="text-lg mb-4">Demolish your credibility gap with our Professional PR Solution.</p>
              <p className="text-base opacity-90">We handle the heavy lifting while you focus on what you do best.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">STOP OVERTHINKING - 3 SIMPLE STEPS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-bold mb-2">Complete Our Quick Form</h3>
                <p className="text-sm text-muted-foreground">Takes 2 minutes</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-bold mb-2">We Create Authority Content</h3>
                <p className="text-sm text-muted-foreground">Professional article that positions you perfectly</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-bold mb-2">Dominate Your Competition</h3>
                <p className="text-sm text-muted-foreground">Feature goes live, you get credibility assets</p>
              </div>
            </div>
          </div>

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
                          Select Your Publications (1st: <span className="line-through text-gray-400">$497</span> <span className="text-green-600">$97</span>, Additional: <span className="line-through">$497</span> $87 each)
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
                                  ? (
                                    <span>
                                      <span className="line-through text-muted-foreground text-sm">$497</span>
                                      <span className="ml-1 text-green-600">$97</span>
                                    </span>
                                  ) : (
                                    <span>
                                      <span className="line-through text-muted-foreground text-sm">$497</span>
                                      <span className="ml-1 text-success">$87</span>
                                    </span>
                                  )}
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
                              <span className="font-semibold">
                                {index === 0 ? (
                                  <span>
                                    <span className="line-through text-muted-foreground">$497</span>
                                    <span className="ml-1 text-green-600">$97</span>
                                  </span>
                                ) : (
                                  <span>
                                    <span className="line-through text-muted-foreground">$497</span>
                                    <span className="ml-1 text-success">$87</span>
                                  </span>
                                )}
                              </span>
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
                            <p className="font-bold">${item.price.toFixed(0)}</p>
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
                            <p className="font-bold text-accent">${item.price.toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-success font-semibold">
                        <span>Total Savings</span>
                        <span>-${totalSavings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing Fee (2.9%)</span>
                      <span>${processingFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <p className="text-sm text-success font-semibold text-center">
                        🎉 You're saving ${totalSavings.toFixed(2)} with these offers!
                      </p>
                    )}
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>

          {/* Checkout Section - Separated and Prominent */}
          <div className="mt-12 border-t-4 border-primary/30 pt-8">
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-3">Complete Your Order</h2>
                <p className="text-lg text-muted-foreground">Join 1,000+ businesses who've transformed their credibility</p>
              </div>
              
              {/* Order Summary */}
              <div className="bg-background/90 rounded-xl p-6 mb-8 border border-primary/10 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">Your Investment Summary</h3>
                
                <div className="space-y-4">
                  {/* Main Package */}
                  <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <span className="font-semibold text-lg">Professional PR Feature</span>
                      <p className="text-sm text-muted-foreground">Premium publication placement</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">${packageType === 'starter' ? '97' : subtotal.toFixed(0)}</span>
                  </div>

                  {/* Upsells */}
                  {selectedUpsells.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-accent">Premium Upgrades Added:</p>
                      {selectedUpsells.map((upsellId) => {
                        const upsell = upsellOffers.find(u => u.id === upsellId);
                        return upsell ? (
                          <div key={upsellId} className="flex justify-between text-sm p-3 bg-accent/5 rounded border border-accent/20">
                            <span>{upsell.name}</span>
                            <span className="font-semibold">+${upsell.discountedPrice.toFixed(0)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Rush Delivery */}
                  {rushDelivery && (
                    <div className="flex justify-between text-sm p-3 bg-warning/10 rounded border border-warning/20">
                      <span>⚡ 48-Hour Rush Delivery</span>
                      <span className="font-semibold">+$197</span>
                    </div>
                  )}

                  <Separator />
                  
                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border-2 border-primary/30">
                    <span className="text-xl font-bold">Total Investment:</span>
                    <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-success font-bold">🎉 You're saving ${totalSavings.toFixed(2)} with these upgrades!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-6">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-2xl py-8 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-8 w-8 mr-4" />
                  {isProcessing ? "Processing..." : "CHECKOUT →"}
                </Button>

                {/* Guarantees */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <Shield className="h-6 w-6 text-success" />
                    <span className="font-bold text-success text-lg">100% CONVERSION GUARANTEE</span>
                  </div>
                  <p className="text-sm font-semibold">Stop Struggling and Let Us Build Your Authority!</p>
                  <p className="text-xs text-muted-foreground">If we can't boost your credibility within 10 days, you get every penny back.</p>
                  <p className="text-xs text-muted-foreground">🔒 Secure payment powered by Stripe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Urgency and Social Proof - Now Separate */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-destructive mb-4">TRANSFORM YOUR RESULTS:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold text-destructive">NEVER compete on price again</p>
                    <p className="font-bold text-destructive">NEVER lose deals to inferior competitors</p>
                    <p className="font-bold text-destructive">NEVER struggle for respect in your market</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Proof Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-primary mb-4">SOCIAL PROOF:</h4>
                  <p className="text-sm font-semibold mb-2">We've helped 1,000+ businesses break through credibility barriers</p>
                  <p className="text-lg font-bold text-primary">YOUR BREAKTHROUGH IS NEXT.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What's Included Section */}
          <div className="mt-8">
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

          {/* FAQ Section */}
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Who needs this most?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Any business, entrepreneur, consultant, coach, author, expert, agency, or brand tired of losing deals to competitors with better credibility.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What exactly do I get?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">A conversion-boosting feature in outlets like Business Today or Market Review, with guaranteed publication within 10 days or full refund. We handle everything while you get the authority you deserve.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I control the final content?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Absolutely. You approve everything and can request revisions until it perfectly represents your brand.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Will this improve my SEO results?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Yes. High-authority backlink that search engines respect. Stop letting competitors outrank you.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I use "Featured In" everywhere?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">YES. Display "Featured In" badges on your website, ads, proposals, social media - everywhere prospects need to see your credibility.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's your guarantee?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-success">Complete 100% money-back guarantee. If we can't feature your business within 10 days, you get everything back.</p>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* Footer CTA */}
          <div className="text-center py-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg mt-8">
            <h3 className="text-2xl font-bold mb-4 text-primary">Just Featured - Stop Losing, Start Converting</h3>
            <p className="text-sm text-muted-foreground">Copyright © 2025 Just Featured. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};