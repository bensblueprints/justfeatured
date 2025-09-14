import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Building } from "lucide-react";

interface CreateClientDialogProps {
  onClientCreated: (clientId: string) => void;
  children?: React.ReactNode;
}

export const CreateClientDialog = ({ onClientCreated, children }: CreateClientDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person_name: "",
    contact_email: "",
    phone_number: "",
    company_website: "",
    industry_sector: "",
    business_description: "",
    target_audience: "",
    key_messages: "",
    preferred_tone: "professional",
    additional_notes: "",
  });

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Real Estate",
    "Hospitality",
    "Entertainment",
    "Non-profit",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      contact_person_name: "",
      contact_email: "",
      phone_number: "",
      company_website: "",
      industry_sector: "",
      business_description: "",
      target_audience: "",
      key_messages: "",
      preferred_tone: "professional",
      additional_notes: "",
    });
  };

  const createClient = async () => {
    if (!formData.company_name.trim() || !formData.contact_email.trim()) {
      toast({
        title: "Missing Information",
        description: "Company name and contact email are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user to associate with the client
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Create new client (post_checkout_info record)
      const { data: clientData, error: clientError } = await supabase
        .from('post_checkout_info')
        .insert({
          user_id: user.id, // Associate with current admin user
          company_name: formData.company_name.trim(),
          contact_person_name: formData.contact_person_name.trim() || null,
          contact_email: formData.contact_email.trim(),
          email: formData.contact_email.trim(), // Duplicate for compatibility
          phone_number: formData.phone_number.trim() || null,
          company_website: formData.company_website.trim() || null,
          industry_sector: formData.industry_sector || null,
          industry: formData.industry_sector || null, // Duplicate for compatibility
          business_description: formData.business_description.trim() || null,
          target_audience: formData.target_audience.trim() || null,
          key_messages: formData.key_messages.trim() || null,
          preferred_tone: formData.preferred_tone,
          additional_notes: formData.additional_notes.trim() || null,
          status: 'completed' as any // Mark as completed since admin is creating it
        })
        .select('id')
        .single();

      if (clientError) throw clientError;

      toast({
        title: "Success",
        description: `Client "${formData.company_name}" created successfully`
      });

      onClientCreated(clientData.id);
      resetForm();
      setOpen(false);

    } catch (error: any) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create client",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Create New Client
          </DialogTitle>
          <DialogDescription>
            Add a new client to the system. This will create a client profile that you can then upload press releases for.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person_name">Contact Person</Label>
                <Input
                  id="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                  placeholder="Contact person name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_website">Company Website</Label>
                <Input
                  id="company_website"
                  value={formData.company_website}
                  onChange={(e) => handleInputChange('company_website', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry_sector">Industry</Label>
                <Select
                  value={formData.industry_sector}
                  onValueChange={(value) => handleInputChange('industry_sector', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Business Details
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Textarea
                id="business_description"
                value={formData.business_description}
                onChange={(e) => handleInputChange('business_description', e.target.value)}
                placeholder="Brief description of the business and what they do..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Input
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                placeholder="Who is their target audience?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key_messages">Key Messages</Label>
              <Textarea
                id="key_messages"
                value={formData.key_messages}
                onChange={(e) => handleInputChange('key_messages', e.target.value)}
                placeholder="Key messages they want to communicate..."
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_tone">Preferred Tone</Label>
                <Select
                  value={formData.preferred_tone}
                  onValueChange={(value) => handleInputChange('preferred_tone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_notes">Additional Notes</Label>
              <Textarea
                id="additional_notes"
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                placeholder="Any additional notes or special requirements..."
                className="min-h-[60px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={createClient} disabled={loading || !formData.company_name.trim() || !formData.contact_email.trim()}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};