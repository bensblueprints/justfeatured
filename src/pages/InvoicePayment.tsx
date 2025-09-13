import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InvoiceData {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  total_amount: number;
  status: string;
  due_date?: string;
  notes?: string;
  publications: Array<{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    customPrice?: number;
    category?: string;
    tier?: string;
  }>;
}

export default function InvoicePayment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { clearCart, addToCart } = useCart();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!token) {
        setError('Invalid invoice link');
        setLoading(false);
        return;
      }

      try {
        const { data: invoiceData, error } = await supabase
          .from('invoices')
          .select(`
            *,
            invoice_items (*)
          `)
          .eq('payment_token', token)
          .single();

        if (error) throw error;

        if (!invoiceData) {
          setError('Invoice not found');
          setLoading(false);
          return;
        }

        // Transform data to match interface
        const formattedInvoice: InvoiceData = {
          id: invoiceData.id,
          invoice_number: invoiceData.invoice_number,
          client_name: invoiceData.client_name,
          client_email: invoiceData.client_email,
          client_company: invoiceData.client_company,
          total_amount: invoiceData.total_amount,
          status: invoiceData.status,
          due_date: invoiceData.due_date,
          notes: invoiceData.notes,
          publications: invoiceData.invoice_items.map((item: any) => ({
            id: item.publication_id,
            name: item.publication_name,
            quantity: item.quantity,
            price: item.unit_price,
            customPrice: item.custom_price,
            category: item.category,
            tier: item.tier
          }))
        };

        setInvoice(formattedInvoice);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [token]);

  const handleProceedToPayment = async () => {
    if (!invoice) return;

    setLoadingCart(true);
    try {
      // Clear existing cart
      clearCart();

      // Add invoice publications to cart
      for (const pub of invoice.publications) {
        if (pub.id) {
          // Repeat addToCart for quantity
          for (let i = 0; i < pub.quantity; i++) {
            addToCart(pub.id);
          }
        }
      }

      // Store invoice data for checkout pre-filling
      sessionStorage.setItem('invoiceCheckoutData', JSON.stringify({
        clientName: invoice.client_name,
        clientEmail: invoice.client_email,
        clientCompany: invoice.client_company,
        invoiceNumber: invoice.invoice_number
      }));

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error setting up cart:', error);
      setError('Failed to prepare cart. Please try again.');
    } finally {
      setLoadingCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              {error || 'Invoice not found'}
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Invoice Payment
            </CardTitle>
            <p className="text-muted-foreground">
              Complete your payment for Invoice #{invoice.invoice_number}
            </p>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Invoice Number:</strong> {invoice.invoice_number}
              </div>
              <div>
                <strong>Client:</strong> {invoice.client_name}
                {invoice.client_company && <div className="text-sm text-muted-foreground">{invoice.client_company}</div>}
              </div>
              <div>
                <strong>Email:</strong> {invoice.client_email}
              </div>
              <div>
                <strong>Total Amount:</strong> 
                <span className="text-2xl font-bold text-primary ml-2">
                  ${invoice.total_amount.toFixed(2)}
                </span>
              </div>
              {invoice.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="text-sm text-muted-foreground mt-1">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publications List */}
          <Card>
            <CardHeader>
              <CardTitle>Publications Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.publications.map((pub, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{pub.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {pub.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${((pub.customPrice || pub.price) * pub.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${(pub.customPrice || pub.price).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Action */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to Complete Payment?</h3>
              <p className="text-muted-foreground">
                Click below to proceed to our secure checkout page. Your cart will be automatically populated with the publications from this invoice.
              </p>
              <Button 
                onClick={handleProceedToPayment}
                disabled={loadingCart}
                size="lg"
                className="w-full max-w-md"
              >
                {loadingCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up payment...
                  </>
                ) : (
                  `Proceed to Payment - $${invoice.total_amount.toFixed(2)}`
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Secure payment powered by Stripe
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}