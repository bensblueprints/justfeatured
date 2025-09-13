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
    // For now, we'll store invoices in localStorage since we don't have invoice tables yet
    // In a real implementation, this would fetch from a database
    const storedInvoices = localStorage.getItem('manual_invoices');
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
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
      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        client_name: clientName,
        client_email: clientEmail,
        client_company: clientCompany,
        invoice_number: generateInvoiceNumber(),
        total_amount: calculateTotal(),
        status: 'draft',
        due_date: dueDate,
        notes,
        created_at: new Date().toISOString(),
        publications: selectedPublications
      };

      // Store in localStorage for now
      const existingInvoices = JSON.parse(localStorage.getItem('manual_invoices') || '[]');
      const updatedInvoices = [...existingInvoices, newInvoice];
      localStorage.setItem('manual_invoices', JSON.stringify(updatedInvoices));

      setInvoices(updatedInvoices);
      
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
      // Call edge function to send invoice email
      const { error } = await supabase.functions.invoke('send-invoice', {
        body: {
          invoice,
          clientEmail: invoice.client_email
        }
      });

      if (error) throw error;

      // Update invoice status
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: 'sent' as const } : inv
      );
      localStorage.setItem('manual_invoices', JSON.stringify(updatedInvoices));
      setInvoices(updatedInvoices);
      
      toast.success('Invoice sent successfully!');
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