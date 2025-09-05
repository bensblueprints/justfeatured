import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileUp, Building, User, Mail, Phone, Globe, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_SECTORS, PRESS_RELEASE_TONES, type IndustrySector, type PressReleaseTone } from "@/types/press-release";

interface FormData {
  company_name: string;
  industry_sector: IndustrySector | "";
  contact_person_name: string;
  email: string;
  phone_number: string;
  company_website: string;
  business_description: string;
  recent_achievements: string;
  key_products_services: string;
  target_audience: string;
  preferred_tone: PressReleaseTone;
  important_dates: string;
  additional_notes: string;
  write_own_release: boolean;
  custom_press_release: string;
}

export const PostCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [files, setFiles] = useState<{
    logo: File | null;
    supportingImages: File[];
    documents: File[];
  }>({
    logo: null,
    supportingImages: [],
    documents: []
  });

  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    industry_sector: "",
    contact_person_name: "",
    email: "",
    phone_number: "",
    company_website: "",
    business_description: "",
    recent_achievements: "",
    key_products_services: "",
    target_audience: "",
    preferred_tone: "professional",
    important_dates: "",
    additional_notes: "",
    write_own_release: false,
    custom_press_release: ""
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }
      setUser(user);
      setFormData(prev => ({ ...prev, email: user.email || "" }));
    };

    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    // Calculate progress based on required fields
    const requiredFields = [
      'company_name', 'industry_sector', 'contact_person_name', 
      'email', 'phone_number', 'business_description'
    ];
    const filledFields = requiredFields.filter(field => formData[field as keyof FormData]);
    const hasLogo = files.logo !== null;
    const totalRequired = requiredFields.length + 1; // +1 for logo
    const totalFilled = filledFields.length + (hasLogo ? 1 : 0);
    setProgress((totalFilled / totalRequired) * 100);
  }, [formData, files.logo]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'logo' | 'supportingImages' | 'documents', file: File | File[]) => {
    if (type === 'logo' && file instanceof File) {
      setFiles(prev => ({ ...prev, logo: file }));
    } else if (type === 'supportingImages' && Array.isArray(file)) {
      setFiles(prev => ({ ...prev, supportingImages: [...prev.supportingImages, ...file] }));
    } else if (type === 'documents' && Array.isArray(file)) {
      setFiles(prev => ({ ...prev, documents: [...prev.documents, ...file] }));
    }
  };

  const uploadFiles = async (postCheckoutId: string) => {
    const uploads: Promise<any>[] = [];

    // Upload logo
    if (files.logo) {
      const logoPath = `${user.id}/logo-${Date.now()}-${files.logo.name}`;
      uploads.push(
        supabase.storage
          .from('company-logos')
          .upload(logoPath, files.logo)
          .then(({ error }) => {
            if (!error) {
              return supabase.from('file_attachments').insert({
                post_checkout_info_id: postCheckoutId,
                file_name: files.logo!.name,
                file_type: files.logo!.type,
                file_size: files.logo!.size,
                storage_path: logoPath,
                is_logo: true
              });
            }
          })
      );
    }

    // Upload supporting images
    files.supportingImages.forEach((file, index) => {
      const imagePath = `${user.id}/image-${Date.now()}-${index}-${file.name}`;
      uploads.push(
        supabase.storage
          .from('press-attachments')
          .upload(imagePath, file)
          .then(({ error }) => {
            if (!error) {
              return supabase.from('file_attachments').insert({
                post_checkout_info_id: postCheckoutId,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                storage_path: imagePath,
                is_logo: false
              });
            }
          })
      );
    });

    // Upload documents
    files.documents.forEach((file, index) => {
      const docPath = `${user.id}/doc-${Date.now()}-${index}-${file.name}`;
      uploads.push(
        supabase.storage
          .from('press-attachments')
          .upload(docPath, file)
          .then(({ error }) => {
            if (!error) {
              return supabase.from('file_attachments').insert({
                post_checkout_info_id: postCheckoutId,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                storage_path: docPath,
                is_logo: false
              });
            }
          })
      );
    });

    await Promise.all(uploads);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.industry_sector) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!files.logo) {
      toast({
        title: "Logo Required",
        description: "Please upload your company logo",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('post_checkout_info')
        .insert({
          user_id: user.id,
          order_id: searchParams.get('session_id') || undefined,
          ...formData,
          industry_sector: formData.industry_sector as IndustrySector
        })
        .select()
        .single();

      if (error) throw error;

      // Upload files
      await uploadFiles(data.id);

      toast({
        title: "Information Submitted Successfully!",
        description: "We'll start working on your press release and notify you when it's ready for review."
      });

      navigate(`/review-board/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Post-Checkout Setup
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Let's Build Your <span className="text-primary">Press Release</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us understand your business to create the perfect press release
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% Complete
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Basic information about your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry_sector">Industry *</Label>
                    <Select
                      value={formData.industry_sector}
                      onValueChange={(value) => handleInputChange('industry_sector', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_SECTORS.map((sector) => (
                          <SelectItem key={sector.value} value={sector.value}>
                            {sector.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person_name}
                      onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.company_website}
                      onChange={(e) => handleInputChange('company_website', e.target.value)}
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.business_description}
                    onChange={(e) => handleInputChange('business_description', e.target.value)}
                    placeholder="Briefly describe what your business does..."
                    maxLength={500}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.business_description.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Press Release Information */}
            <Card>
              <CardHeader>
                <CardTitle>Press Release Information</CardTitle>
                <CardDescription>
                  Details to help us craft your perfect press release
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="achievements">Recent Achievements & News</Label>
                  <Textarea
                    id="achievements"
                    value={formData.recent_achievements}
                    onChange={(e) => handleInputChange('recent_achievements', e.target.value)}
                    placeholder="Share your recent milestones, achievements, or newsworthy events..."
                    maxLength={2000}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.recent_achievements.length}/2000 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="products">Key Products/Services</Label>
                    <Textarea
                      id="products"
                      value={formData.key_products_services}
                      onChange={(e) => handleInputChange('key_products_services', e.target.value)}
                      placeholder="What are your main offerings?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Textarea
                      id="audience"
                      value={formData.target_audience}
                      onChange={(e) => handleInputChange('target_audience', e.target.value)}
                      placeholder="Who is your ideal customer or reader?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone">Preferred Tone</Label>
                    <Select
                      value={formData.preferred_tone}
                      onValueChange={(value) => handleInputChange('preferred_tone', value as PressReleaseTone)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRESS_RELEASE_TONES.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dates">Important Dates/Deadlines</Label>
                    <Input
                      id="dates"
                      value={formData.important_dates}
                      onChange={(e) => handleInputChange('important_dates', e.target.value)}
                      placeholder="Any specific dates to mention or deadlines?"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.additional_notes}
                    onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                    placeholder="Any other details or special requests?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Choice */}
            <Card>
              <CardHeader>
                <CardTitle>Content Creation Option</CardTitle>
                <CardDescription>
                  Choose how you'd like to handle your press release content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.write_own_release ? "own" : "justfeatured"}
                  onValueChange={(value) => handleInputChange('write_own_release', value === "own")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="justfeatured" id="justfeatured" />
                    <Label htmlFor="justfeatured" className="flex-1">
                      <div>
                        <div className="font-medium">Have JustFeatured write it</div>
                        <div className="text-sm text-muted-foreground">
                          Our expert writers will craft your press release (Estimated delivery: 5-7 business days)
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="own" id="own" />
                    <Label htmlFor="own" className="flex-1">
                      <div>
                        <div className="font-medium">Write my own press release</div>
                        <div className="text-sm text-muted-foreground">
                          Provide your own press release content for review and distribution
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.write_own_release && (
                  <div className="mt-4">
                    <Label htmlFor="custom_release">Your Press Release</Label>
                    <Textarea
                      id="custom_release"
                      value={formData.custom_press_release}
                      onChange={(e) => handleInputChange('custom_press_release', e.target.value)}
                      placeholder="Paste your press release content here..."
                      maxLength={5000}
                      className="min-h-[200px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.custom_press_release.length}/5000 characters
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="w-5 h-5" />
                  File Uploads
                </CardTitle>
                <CardDescription>
                  Upload your company logo and any supporting materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo">Company Logo *</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('logo', file);
                    }}
                    required
                  />
                  {files.logo && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {files.logo.name} uploaded
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="images">Supporting Images (Optional)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const fileArray = Array.from(e.target.files || []);
                      if (fileArray.length > 0) handleFileUpload('supportingImages', fileArray);
                    }}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum 5 images. These will be included with your press release.
                  </p>
                  {files.supportingImages.length > 0 && (
                    <div className="mt-2">
                      {files.supportingImages.map((file, index) => (
                        <p key={index} className="text-sm text-green-600">
                          ✓ {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="documents">Supporting Documents (Optional)</Label>
                  <Input
                    id="documents"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => {
                      const fileArray = Array.from(e.target.files || []);
                      if (fileArray.length > 0) handleFileUpload('documents', fileArray);
                    }}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF or Word documents only. These provide additional context for our writers.
                  </p>
                  {files.documents.length > 0 && (
                    <div className="mt-2">
                      {files.documents.map((file, index) => (
                        <p key={index} className="text-sm text-green-600">
                          ✓ {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading || progress < 100}
                className="min-w-[200px]"
              >
                {loading ? "Submitting..." : "Submit Information"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};