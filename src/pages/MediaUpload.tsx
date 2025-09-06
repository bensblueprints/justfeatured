import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone,
  Globe,
  Calendar,
  User,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type PostCheckoutInfo } from "@/types/press-release";
import { PressReleaseUploader } from "@/components/PressReleaseUploader";
import { sanitizeText } from "@/lib/security";

export const MediaUpload = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('customer');
  const [clientInfo, setClientInfo] = useState<PostCheckoutInfo | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (roleData) {
        setUserRole(roleData.role);
      }
    };

    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (!id || !user) return;

    const fetchClientInfo = async () => {
      try {
        let query = supabase
          .from('post_checkout_info')
          .select('*')
          .eq('id', id);

        // Non-admin users can only access their own records
        if (!['admin', 'super_admin', 'editor'].includes(userRole)) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this client information",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        setClientInfo(data);
      } catch (error) {
        console.error('Error fetching client info:', error);
        toast({
          title: "Error",
          description: "Failed to load client information",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
  }, [id, user, userRole, navigate, toast]);

  const handleUploadComplete = () => {
    toast({
      title: "Upload completed",
      description: "All media files have been uploaded successfully",
    });
    
    // Redirect back to dashboard or review board
    if (['admin', 'super_admin', 'editor'].includes(userRole)) {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading client information...</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(['admin', 'super_admin', 'editor'].includes(userRole) ? '/admin-dashboard' : '/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Media Upload</h1>
                <p className="text-muted-foreground mt-1">
                  Upload media files for press release
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {userRole === 'customer' ? 'Client Upload' : 'Admin Upload'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{clientInfo.company_name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {clientInfo.industry_sector}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{clientInfo.contact_person_name}</p>
                      <p className="text-xs text-muted-foreground">Contact Person</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{clientInfo.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{clientInfo.phone_number}</p>
                      <p className="text-xs text-muted-foreground">Phone</p>
                    </div>
                  </div>

                  {clientInfo.company_website && (
                    <div className="flex items-start space-x-2">
                      <Globe className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{clientInfo.company_website}</p>
                        <p className="text-xs text-muted-foreground">Website</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{new Date(clientInfo.created_at).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Project Created</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Business Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sanitizeText(clientInfo.business_description)}
                  </p>
                </div>

                {clientInfo.recent_achievements && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Recent Achievements</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sanitizeText(clientInfo.recent_achievements)}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upload Interface */}
          <div className="lg:col-span-2">
            <PressReleaseUploader
              checkoutInfoId={clientInfo.id}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};