import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, ExternalLink, ArrowRight } from "lucide-react";
import { Publication, Service } from "@/types";
import { services } from "@/lib/services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CartDrawerProps {
  selectedPublications: string[];
  selectedServices: string[];
  publications: Publication[];
  onRemoveFromCart: (publicationId: string) => void;
  onRemoveServiceFromCart: (serviceId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer = ({ 
  selectedPublications, 
  selectedServices,
  publications, 
  onRemoveFromCart,
  onRemoveServiceFromCart,
  onClearCart 
}: CartDrawerProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Get publications from both database and hardcoded $97 publications
  const hardcodedPublications = [
    { id: 'artist-recap', name: 'Artist Recap', price: 97, tier: 'premium', category: 'Entertainment', da_score: 45, dr_score: 42, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'atoz-times', name: 'AtoZ Times', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'womens-reporter', name: 'Womens Reporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 42, dr_score: 44, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'miami-highlight', name: 'Miami Highlight', price: 97, tier: 'premium', category: 'Local News', da_score: 40, dr_score: 38, tat_days: '1-2 Days', location: 'Miami', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'artist-highlight', name: 'Artist Highlight', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 43, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'texas-recap', name: 'Texas Recap', price: 97, tier: 'premium', category: 'Local News', da_score: 44, dr_score: 41, tat_days: '1-3 Days', location: 'Texas', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'leader-report', name: 'The Leader Report', price: 97, tier: 'premium', category: 'Business', da_score: 50, dr_score: 48, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'golden-state-review', name: 'Golden State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 43, dr_score: 40, tat_days: '1-3 Days', location: 'California', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'mens-reporter', name: 'MensReporter', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 41, dr_score: 39, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'best-in-houses', name: 'Best in Houses', price: 97, tier: 'premium', category: 'Real Estate', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'juris-review', name: 'Juris Review', price: 97, tier: 'premium', category: 'Legal', da_score: 47, dr_score: 45, tat_days: '2-4 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'todays-read', name: 'Todays Read', price: 97, tier: 'premium', category: 'General News', da_score: 43, dr_score: 41, tat_days: '1-2 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'celeb-digest', name: 'Celeb Digest', price: 97, tier: 'premium', category: 'Entertainment', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'primetime-press', name: 'Primetime Press', price: 97, tier: 'premium', category: 'Entertainment', da_score: 46, dr_score: 44, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'mens-newspaper', name: 'Mens Newspaper', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 40, dr_score: 38, tat_days: '1-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'rent-magazine', name: 'Rent Magazine', price: 97, tier: 'premium', category: 'Real Estate', da_score: 42, dr_score: 40, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'empire-state-review', name: 'Empire State Review', price: 97, tier: 'premium', category: 'Local News', da_score: 45, dr_score: 43, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'top-listings', name: 'Top Listings', price: 97, tier: 'premium', category: 'Real Estate', da_score: 41, dr_score: 39, tat_days: '1-2 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'good-morning-us', name: 'Good Morning US', price: 97, tier: 'premium', category: 'General News', da_score: 48, dr_score: 46, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'biz-recap', name: 'Biz Recap', price: 97, tier: 'premium', category: 'Business', da_score: 47, dr_score: 45, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'womens-insider', name: 'Womens Insider', price: 97, tier: 'premium', category: 'Lifestyle', da_score: 44, dr_score: 42, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'ny-review', name: 'NY Review', price: 97, tier: 'premium', category: 'Local News', da_score: 46, dr_score: 44, tat_days: '1-3 Days', location: 'New York', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'biz-weekly', name: 'Biz Weekly', price: 97, tier: 'premium', category: 'Business', da_score: 45, dr_score: 43, tat_days: '2-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'tech-daily', name: 'Tech Daily', price: 97, tier: 'premium', category: 'Technology', da_score: 49, dr_score: 47, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'health-spotlight', name: 'Health Spotlight', price: 97, tier: 'premium', category: 'Health', da_score: 43, dr_score: 41, tat_days: '2-4 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'finance-focus', name: 'Finance Focus', price: 97, tier: 'premium', category: 'Finance', da_score: 48, dr_score: 46, tat_days: '1-3 Days', location: 'Global', dofollow_link: true, indexed: true, sponsored: false },
    { id: 'startup-stories', name: 'Startup Stories', price: 97, tier: 'premium', category: 'Business', da_score: 44, dr_score: 42, tat_days: '2-3 Days', location: 'US', dofollow_link: true, indexed: true, sponsored: false }
  ];

  const allPublications = [...(publications || []), ...hardcodedPublications];
  const cartItems = allPublications.filter(pub => selectedPublications?.includes(pub.id)) || [];
  const cartServices = services.filter(service => selectedServices?.includes(service.id)) || [];
  const totalAmount = cartItems.reduce((sum, pub) => sum + (pub.price || 0), 0) + 
                     cartServices.reduce((sum, service) => sum + (service.price || 0), 0);
  const cartCount = (selectedPublications?.length || 0) + (selectedServices?.length || 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    try {
      const checkoutPublications = cartItems.map(pub => ({
        id: pub.id,
        name: pub.name,
        price: Number(pub.price),
        category: pub.category,
        tat_days: parseInt(String(pub.tat_days)) || 3,
        type: 'publication'
      }));
      
      const checkoutServices = cartServices.map(service => ({
        id: service.id,
        name: service.name,
        price: Number(service.price),
        category: service.category,
        type: 'service'
      }));
      
      const allItems = [...checkoutPublications, ...checkoutServices];
      
      // Persist as fallback for navigation on mobile
      sessionStorage.setItem('checkout_items', JSON.stringify(allItems));
      sessionStorage.setItem('checkout_package_type', 'custom');
      setIsOpen(false);
      // Navigate after closing animation to avoid sheet focus trap issues on mobile
      setTimeout(() => {
        navigate('/checkout', {
          state: {
            selectedPublications: checkoutPublications,
            selectedServices: checkoutServices,
            packageType: 'custom',
          },
        });
      }, 50);
    } catch (e) {
      console.error('Failed to proceed to checkout', e);
      navigate('/checkout');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="glass" 
          size="sm" 
          className="relative magnetic"
        >
          <ShoppingCart className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] md:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cartCount})
          </SheetTitle>
          <SheetDescription>
            {cartCount === 0 
              ? "Your cart is empty" 
              : `${cartItems.length} publication${cartItems.length === 1 ? '' : 's'}${cartServices.length > 0 ? ` and ${cartServices.length} service${cartServices.length === 1 ? '' : 's'}` : ''} selected`
            }
          </SheetDescription>
        </SheetHeader>

        {cartCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Browse our publications and add items to your cart to get started.
              </p>
            </div>
            <Button 
              onClick={() => {
                setIsOpen(false);
                navigate('/publications');
              }}
              className="mt-4"
            >
              Browse Publications
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <ScrollArea className="flex-1 mt-6">
              <div className="space-y-4">
                {cartServices.length > 0 && (
                  <>
                    <h4 className="font-semibold text-sm text-muted-foreground">Services</h4>
                    {cartServices.map((service) => (
                      <Card key={service.id} className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveServiceFromCart(service.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm pr-8">{service.name}</CardTitle>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(service.price)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-muted-foreground">
                            <span>{service.type === 'recurring' ? `Monthly ${service.category}` : 'One-time service'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {cartItems.length > 0 && <Separator />}
                  </>
                )}
                
                {cartItems.length > 0 && (
                  <>
                    <h4 className="font-semibold text-sm text-muted-foreground">Publications</h4>
                    {cartItems.map((publication) => (
                      <Card key={publication.id} className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCart(publication.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm pr-8">{publication.name}</CardTitle>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {publication.category}
                            </Badge>
                            <div className="text-lg font-bold text-primary">
                              {formatPrice(publication.price)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>TAT: {publication.tat_days}</span>
                            <div className="flex items-center gap-2">
                              <span>DA: {publication.da_score || 0}</span>
                              <span>DR: {publication.dr_score || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="mt-auto space-y-4 border-t pt-4 bg-background/95 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearCart}
                  disabled={selectedPublications.length === 0}
                  className="w-full sm:w-auto"
                >
                  Clear Cart
                </Button>
                <div className="text-right w-full sm:w-auto">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={selectedPublications.length === 0}
                className="w-full h-12 text-base sm:text-lg sticky bottom-0"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};