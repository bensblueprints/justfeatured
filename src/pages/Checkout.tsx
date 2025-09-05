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
import { ShoppingCart, CreditCard, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tat_days: number;
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

  useEffect(() => {
    // Get selected publications from navigation state
    const selectedPublications = location.state?.selectedPublications || [];
    const type = location.state?.packageType || 'custom';
    
    setPackageType(type);
    
    if (type === 'starter') {
      setItems([{
        id: 'starter-package',
        name: 'Starter Package',
        price: 9700, // $97.00
        category: 'Package Deal',
        tat_days: 10
      }]);
    } else {
      setItems(selectedPublications);
    }

    // If no items, redirect back to publications
    if (selectedPublications.length === 0 && type !== 'starter') {
      navigate('/publications');
    }
  }, [location.state, navigate]);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
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
      // TODO: Integrate with Stripe payment processing
      // For now, show success message
      toast({
        title: "Checkout Initiated",
        description: "Payment processing will be implemented with Stripe integration.",
      });
      
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
        // navigate('/payment-success');
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
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
          <Button onClick={() => navigate('/publications')}>
            Browse Publications
          </Button>
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
                    <div className="bg-gradient-hero text-white p-4 rounded-lg">
                      <Badge className="bg-warning text-warning-foreground mb-2">
                        Most Popular
                      </Badge>
                      <h3 className="font-bold text-lg">Starter Package</h3>
                      <p className="text-white/90 text-sm mb-3">Perfect for first-time users</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          3 guaranteed publications
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Professional press release
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          7-14 day turnaround
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Email support
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map(item => (
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

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing Fee (2.9%)</span>
                      <span>${(processingFee / 100).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
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