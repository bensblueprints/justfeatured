import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  description = "Join entrepreneurs who get featured in top news outlets. Be the first to know about new opportunities!"
}: EmailCollectionPopupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.trim().toLowerCase(),
          source,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            page_url: window.location.href
          }
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.success("You're already on our list! Continuing...");
        } else {
          throw error;
        }
      } else {
        toast.success("Thanks for joining! You'll be the first to know about opportunities.");
      }

      setIsSubmitted(true);
      
      // Auto close and continue after 1.5 seconds
      setTimeout(() => {
        onEmailSubmitted();
        onClose();
        setIsSubmitted(false);
        setEmail('');
      }, 1500);

    } catch (error: any) {
      console.error('Error saving email:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setIsSubmitted(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <DialogHeader>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              {description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? 'Joining...' : 'Get Access & Continue'}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Welcome aboard! 🎉</h3>
              <p className="text-muted-foreground text-sm">
                You'll be notified about exclusive opportunities
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};