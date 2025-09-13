import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry_sector: z.string().min(1, "Industry sector is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  company_website: z.string().optional(),
  business_description: z.string().min(1, "Business description is required"),
  recent_achievements: z.string().optional(),
  key_products_services: z.string().optional(),
  target_audience: z.string().optional(),
  preferred_tone: z.enum(["professional", "casual", "technical", "inspirational"]),
  important_dates: z.string().optional(),
  additional_notes: z.string().optional(),
  write_own_release: z.boolean(),
  custom_press_release: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const formData = form.watch();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      form.setValue("email", user.email || "");

      // Check if we're continuing an existing setup
      const continueId = searchParams.get('continue');
      if (continueId) {
        try {
          const { data: existingData, error } = await supabase
            .from('post_checkout_info')
            .select('*')
            .eq('id', continueId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          if (existingData) {
            // Pre-fill form with existing data
            form.setValue('company_name', existingData.company_name);
            form.setValue('industry_sector', existingData.industry_sector || '');
            form.setValue('contact_person_name', existingData.contact_person_name || '');
            form.setValue('email', existingData.email || user.email || '');
            form.setValue('phone_number', existingData.phone_number || '');
            form.setValue('company_website', existingData.company_website || '');
            form.setValue('business_description', existingData.business_description || '');
            form.setValue('recent_achievements', existingData.recent_achievements || '');
            form.setValue('key_products_services', existingData.key_products_services || '');
            form.setValue('target_audience', existingData.target_audience || '');
            form.setValue('preferred_tone', (existingData.preferred_tone || 'professional') as 'professional' | 'casual' | 'technical' | 'inspirational');
            form.setValue('important_dates', existingData.important_dates || '');
            form.setValue('additional_notes', existingData.additional_notes || '');
            form.setValue('write_own_release', existingData.write_own_release || false);
            form.setValue('custom_press_release', existingData.custom_press_release || '');
          }
        } catch (error) {
          console.error('Error loading existing data:', error);
        }
      }
    };

    getCurrentUser();
  }, [navigate, form, searchParams]);

  useEffect(() => {
    // Calculate progress based on required fields
    const requiredFields = [
      'company_name', 'industry_sector', 'contact_person_name', 
      'email', 'phone_number', 'business_description'
    ];
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return value && value.toString().trim() !== "";
    });
    const hasLogo = files.logo !== null;
    const totalRequired = requiredFields.length + 1; // +1 for logo
    const totalFilled = filledFields.length + (hasLogo ? 1 : 0);
    setProgress((totalFilled / totalRequired) * 100);
  }, [formData, files.logo]);

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

  const onSubmit = async (data: FormData, saveAsDraft = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to continue",
        variant: "destructive"
      });
      return;
    }

    // Only require logo for final submission, not for drafts
    if (!saveAsDraft && !files.logo) {
      toast({
        title: "Logo Required",
        description: "Please upload your company logo to complete submission",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        user_id: user.id,
        order_id: searchParams.get('session_id') || undefined,
        company_name: data.company_name,
        industry_sector: data.industry_sector,
        contact_person_name: data.contact_person_name,
        contact_email: data.email,
        email: data.email,
        phone_number: data.phone_number,
        company_website: data.company_website || undefined,
        business_description: data.business_description,
        recent_achievements: data.recent_achievements || undefined,
        key_products_services: data.key_products_services || undefined,
        target_audience: data.target_audience || undefined,
        preferred_tone: data.preferred_tone,
        important_dates: data.important_dates || undefined,
        additional_notes: data.additional_notes || undefined,
        write_own_release: data.write_own_release,
        custom_press_release: data.custom_press_release || undefined,
        status: (saveAsDraft ? 'in_progress' : 'pending') as any,
      };

      const continueId = searchParams.get('continue');
      let insertData;
      
      if (continueId) {
        // Update existing record
        const { data, error } = await supabase
          .from('post_checkout_info')
          .update(submitData)
          .eq('id', continueId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        insertData = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('post_checkout_info')
          .insert(submitData)
          .select()
          .single();
        
        if (error) throw error;
        insertData = data;
      }

      // Upload files if any exist
      if (files.logo || files.supportingImages.length > 0 || files.documents.length > 0) {
        await uploadFiles(insertData.id);
      }

      if (saveAsDraft) {
        toast({
          title: "Draft Saved!",
          description: "Your information has been saved. You can continue later from your dashboard."
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Information Submitted Successfully!",
          description: "We'll start working on your press release and notify you when it's ready for review."
        });
        navigate(`/review-board/${insertData.id}`);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-8">
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
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry_sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRY_SECTORS.map((sector) => (
                                <SelectItem key={sector.value} value={sector.value}>
                                  {sector.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact_person_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="business_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe what your business does..." 
                            maxLength={500}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="recent_achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recent Achievements & News</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your recent milestones, achievements, or newsworthy events..." 
                            maxLength={2000}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/2000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="key_products_services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Products/Services</FormLabel>
                          <FormControl>
                            <Textarea placeholder="What are your main offerings?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="target_audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Who is your ideal customer or reader?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferred_tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Tone</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRESS_RELEASE_TONES.map((tone) => (
                                <SelectItem key={tone.value} value={tone.value}>
                                  {tone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="important_dates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Important Dates/Deadlines</FormLabel>
                          <FormControl>
                            <Input placeholder="Any specific dates to mention or deadlines?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any other details or special requests?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="write_own_release"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value ? "own" : "justfeatured"}
                            onValueChange={(value) => field.onChange(value === "own")}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formData.write_own_release && (
                    <FormField
                      control={form.control}
                      name="custom_press_release"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Your Press Release</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Paste your press release content here..." 
                              maxLength={5000}
                              className="min-h-[200px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/5000 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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

              <div className="flex justify-center gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  size="lg" 
                  disabled={loading}
                  onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
                  className="min-w-[200px]"
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </Button>
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
          </Form>
        </div>
      </div>
    </div>
  );
};