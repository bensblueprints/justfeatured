import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Eye,
  Upload,
  Building,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText } from "@/lib/security";
import { type PostCheckoutInfo, type PressRelease } from "@/types/press-release";
import { CreatePressReleaseDialog } from "@/components/CreatePressReleaseDialog";

interface DashboardItem {
  checkoutInfo: PostCheckoutInfo;
  pressRelease?: PressRelease;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('customer');
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);

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
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch all checkout info for this user or all if admin/editor
        let query = supabase.from('post_checkout_info').select('*');
        
        if (!['admin', 'super_admin', 'editor'].includes(userRole)) {
          query = query.eq('user_id', user.id);
        }
        
        const { data: checkoutData, error: checkoutError } = await query
          .order('created_at', { ascending: false });

        if (checkoutError) throw checkoutError;

        // For each checkout info, get the latest press release
        const items: DashboardItem[] = [];
        for (const checkout of checkoutData || []) {
          const { data: pressReleaseData } = await supabase
            .from('press_releases')
            .select('*')
            .eq('post_checkout_info_id', checkout.id)
            .order('version_number', { ascending: false })
            .limit(1)
            .maybeSingle();

          items.push({
            checkoutInfo: checkout,
            pressRelease: pressReleaseData || undefined
          });
        }

        setDashboardItems(items);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userRole, toast]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'revision_requested':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'revision_requested':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Revision</Badge>;
      case 'in_review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Review</Badge>;
      case 'published':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Published</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect admin users to admin dashboard
  if (['admin', 'super_admin', 'editor'].includes(userRole)) {
    navigate('/admin-dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Press Releases</h1>
              <p className="text-muted-foreground mt-1">
                Track the progress of your press releases
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/post-checkout')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Press Release
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {dashboardItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Press Releases Yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first press release
              </p>
              <Button 
                onClick={() => navigate('/starter-selection')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Press Release
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {dashboardItems.map((item) => (
              <Card key={item.checkoutInfo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.pressRelease?.status)}
                      <div>
                        <CardTitle className="text-foreground">
                          {item.checkoutInfo.company_name}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {item.checkoutInfo.industry_sector}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(item.checkoutInfo.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(item.pressRelease?.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/media-upload/${item.checkoutInfo.id}`)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Media
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/review-board/${item.checkoutInfo.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Business Description</h4>
                      <p className="text-muted-foreground text-sm">
                        {sanitizeText(item.checkoutInfo.business_description)}
                      </p>
                    </div>
                    
                    {item.pressRelease && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Press Release</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-foreground font-medium">
                                {item.pressRelease.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Version {item.pressRelease.version_number} • 
                                {item.pressRelease.word_count ? ` ${item.pressRelease.word_count} words` : ' Draft'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {!item.pressRelease && (
                      <>
                        <Separator />
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm mb-4">
                            Press release not yet created. Our team will start working on it soon.
                          </p>
                          {['admin', 'super_admin', 'editor'].includes(userRole) && (
                            <CreatePressReleaseDialog 
                              checkoutInfoId={item.checkoutInfo.id}
                              onSuccess={() => window.location.reload()}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;