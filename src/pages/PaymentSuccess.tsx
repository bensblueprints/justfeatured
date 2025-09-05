import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueToSetup = () => {
    navigate(`/post-checkout${sessionId ? `?session_id=${sessionId}` : ""}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-xl text-muted-foreground">Thank you for your purchase</p>
          </div>

          {/* Order Confirmation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Order Confirmation
              </CardTitle>
              <CardDescription>
                A confirmation email has been sent to your inbox with all the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm">{sessionId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-600 font-medium">Paid</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Processing:</span>
                  <span className="text-primary font-medium">Starting within 24 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Business Information Collection</h4>
                    <p className="text-muted-foreground text-sm">
                      Complete your business details to help us create the perfect press release for your company.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Content Creation & Review</h4>
                    <p className="text-muted-foreground text-sm">
                      Our team will create your press release and collaborate with you through our review board.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Publication Outreach</h4>
                    <p className="text-muted-foreground text-sm">
                      Once approved, we'll begin reaching out to your selected publications and securing placement.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Delivery & Reporting</h4>
                    <p className="text-muted-foreground text-sm">
                      You'll receive live links as they go live, plus a comprehensive report upon completion.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our team is here to help you every step of the way. If you have any questions about your order, 
                don't hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleContinueToSetup}>
              Continue to Business Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <div>
              <button 
                onClick={() => navigate("/")} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now - Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;