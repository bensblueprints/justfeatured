import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DollarSign, 
  FileText, 
  Plus, 
  X, 
  Send, 
  Calculator,
  User,
  Building2,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Publication {
  id: string;
  name: string;
  price: number;
  category: string;
  tier: string;
  logo_url?: string;
}

interface SelectedPublication extends Publication {
  quantity: number;
  customPrice?: number;
}

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  invoice_number: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  notes?: string;
  created_at: string;
  publications: SelectedPublication[];
  payment_token?: string;
}

export const ManualBillingPortal = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublications, setSelectedPublications] = useState<SelectedPublication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPublications();
    fetchInvoices();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('id, name, price, category, tier, logo_url')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Failed to load publications');
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data: invoicesData, error } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Invoice interface
      const formattedInvoices: Invoice[] = invoicesData.map(inv => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        client_name: inv.client_name,
        client_email: inv.client_email,
        client_company: inv.client_company,
        total_amount: inv.total_amount,
        status: inv.status as 'draft' | 'sent' | 'paid' | 'overdue',
        due_date: inv.due_date,
        notes: inv.notes,
        created_at: inv.created_at,
        payment_token: inv.payment_token,
        publications: inv.invoice_items.map((item: any) => ({
          id: item.publication_id,
          name: item.publication_name,
          quantity: item.quantity,
          price: item.unit_price,
          customPrice: item.custom_price,
          category: item.category,
          tier: item.tier
        }))
      }));

      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const addPublication = (publication: Publication) => {
    const existing = selectedPublications.find(p => p.id === publication.id);
    if (existing) {
      setSelectedPublications(prev => 
        prev.map(p => 
          p.id === publication.id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedPublications(prev => [
        ...prev, 
        { ...publication, quantity: 1 }
      ]);
    }
  };

  const removePublication = (id: string) => {
    setSelectedPublications(prev => prev.filter(p => p.id !== id));
  };

  const updatePublicationQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removePublication(id);
      return;
    }
    setSelectedPublications(prev => 
      prev.map(p => 
        p.id === id ? { ...p, quantity } : p
      )
    );
  };

  const updateCustomPrice = (id: string, customPrice: number) => {
    setSelectedPublications(prev => 
      prev.map(p => 
        p.id === id ? { ...p, customPrice } : p
      )
    );
  };

  const calculateTotal = () => {
    return selectedPublications.reduce((total, pub) => {
      const price = pub.customPrice || pub.price;
      return total + (price * pub.quantity);
    }, 0);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const createInvoice = async () => {
    if (!clientName || !clientEmail || selectedPublications.length === 0) {
      toast.error('Please fill in all required fields and select at least one publication');
      return;
    }

    setIsLoading(true);
    
    try {
      const invoiceNumber = generateInvoiceNumber();
      const total = calculateTotal();

      // Insert invoice into database
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          client_name: clientName,
          client_email: clientEmail,
          client_company: clientCompany || null,
          total_amount: total,
          status: 'draft',
          due_date: dueDate || null,
          notes: notes || null,
          created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const invoiceItems = selectedPublications.map(pub => ({
        invoice_id: invoiceData.id,
        publication_id: pub.id || null,
        publication_name: pub.name,
        quantity: pub.quantity,
        unit_price: pub.price,
        custom_price: pub.customPrice || null,
        category: pub.category || null,
        tier: pub.tier || null
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) throw itemsError;

      // Update local state with new invoice data
      const newInvoice: Invoice = {
        id: invoiceData.id,
        invoice_number: invoiceData.invoice_number,
        client_name: invoiceData.client_name,
        client_email: invoiceData.client_email,
        client_company: invoiceData.client_company,
        total_amount: invoiceData.total_amount,
        status: invoiceData.status as 'draft' | 'sent' | 'paid' | 'overdue',
        due_date: invoiceData.due_date,
        notes: invoiceData.notes,
        created_at: invoiceData.created_at,
        payment_token: invoiceData.payment_token,
        publications: selectedPublications
      };

      setInvoices(prev => [newInvoice, ...prev]);
      
      // Reset form
      setClientName('');
      setClientEmail('');
      setClientCompany('');
      setDueDate('');
      setNotes('');
      setSelectedPublications([]);
      setShowCreateDialog(false);
      
      toast.success('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvoice = async (invoice: Invoice) => {
    try {
      // Call edge function to send invoice email with payment token
      const { error } = await supabase.functions.invoke('send-invoice', {
        body: {
          invoice,
          clientEmail: invoice.client_email,
          paymentToken: invoice.payment_token
        }
      });

      if (error) throw error;

      // Update invoice status in database
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', invoice.id);

      if (updateError) throw updateError;

      // Update local state
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'sent' as const } : inv
      );
      setInvoices(updatedInvoices);
      
      toast.success('Invoice sent successfully with payment link!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manual Billing Portal</h2>
          <p className="text-muted-foreground">Create and send custom invoices to clients</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientEmail">Email Address *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clientCompany">Company (Optional)</Label>
                    <Input
                      id="clientCompany"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="Company Inc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes or terms..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Publication Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Publications & Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Available Publications</Label>
                      <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                        {publications.map((pub) => (
                          <div
                            key={pub.id}
                            className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                            onClick={() => addPublication(pub)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{pub.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {pub.tier}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {pub.category}
                              </span>
                            </div>
                            <span className="font-semibold text-sm">
                              ${pub.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Publications */}
                    {selectedPublications.length > 0 && (
                      <div>
                        <Label>Selected Publications</Label>
                        <div className="space-y-2 mt-2">
                          {selectedPublications.map((pub) => (
                            <div key={pub.id} className="border rounded-md p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{pub.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePublication(pub.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Quantity</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={pub.quantity}
                                    onChange={(e) => updatePublicationQuantity(pub.id, parseInt(e.target.value) || 1)}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Custom Price</Label>
                                  <Input
                                    type="number"
                                    placeholder={`$${pub.price}`}
                                    value={pub.customPrice || ''}
                                    onChange={(e) => updateCustomPrice(pub.id, parseFloat(e.target.value) || pub.price)}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <span className="text-sm font-semibold">
                                  Total: ${((pub.customPrice || pub.price) * pub.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createInvoice} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice List */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Recent Invoices</h3>
        
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices created yet</p>
              <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{invoice.invoice_number}</h4>
                        <Badge 
                          variant={
                            invoice.status === 'paid' ? 'default' :
                            invoice.status === 'sent' ? 'secondary' :
                            invoice.status === 'overdue' ? 'destructive' : 'outline'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {invoice.client_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {invoice.client_email}
                        </span>
                        {invoice.client_company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {invoice.client_company}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(invoice.created_at).toLocaleDateString()}
                        {invoice.due_date && ` • Due: ${new Date(invoice.due_date).toLocaleDateString()}`}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">
                        ${invoice.total_amount.toFixed(2)}
                      </div>
                      {invoice.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => sendInvoice(invoice)}
                          className="flex items-center gap-1"
                        >
                          <Send className="h-4 w-4" />
                          Send Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {invoice.publications.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Publications:</div>
                      <div className="space-y-1">
                        {invoice.publications.map((pub, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{pub.name} × {pub.quantity}</span>
                            <span>${((pub.customPrice || pub.price) * pub.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};