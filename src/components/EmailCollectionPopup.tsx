import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailCollectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: () => void;
  source: string;
  title?: string;
  description?: string;
}

export const EmailCollectionPopup = ({
  isOpen,
  onClose,
  onEmailSubmitted,
  source,
  title = "Get Exclusive Access",
  description = "Join thousands of entrepreneurs who've transformed their businesses with media coverage."
}: EmailCollectionPopupProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            page_url: window.location.href
          }
        });

      if (error) {
        // If it's a duplicate email, treat it as success
        if (error.code === '23505') {
          setIsSuccess(true);
          toast.success("Welcome back! You're already on our list.");
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast.success("Success! You're now on our exclusive list.");
      }

      // Wait a moment then close and continue
      setTimeout(() => {
        onEmailSubmitted();
        onClose();
        setIsSuccess(false);
        setEmail("");
      }, 2000);

    } catch (error: any) {
      console.error('Email submission error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setEmail("");
      setIsSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center space-y-3 pt-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {isSuccess ? (
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              ) : (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>
            
            <DialogTitle className="text-xl font-bold text-foreground">
              {isSuccess ? "You're In!" : title}
            </DialogTitle>
            
            {!isSuccess && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            )}
            
            {isSuccess && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                We'll keep you updated on the latest opportunities to get featured in top publications.
              </p>
            )}
          </div>
        </DialogHeader>

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border-border focus:border-primary"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? "Joining..." : "Get Exclusive Access"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};