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
import { Publication } from "@/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CartDrawerProps {
  selectedPublications: string[];
  publications: Publication[];
  onRemoveFromCart: (publicationId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer = ({ 
  selectedPublications, 
  publications, 
  onRemoveFromCart,
  onClearCart 
}: CartDrawerProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartItems = publications?.filter(pub => selectedPublications?.includes(pub.id)) || [];
  const totalAmount = cartItems.reduce((sum, pub) => sum + (pub.price || 0), 0);
  const cartCount = selectedPublications?.length || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
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
              : `${cartCount} publication${cartCount === 1 ? '' : 's'} selected`
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