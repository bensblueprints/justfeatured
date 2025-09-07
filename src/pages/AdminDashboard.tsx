import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  Building, 
  BarChart3,
  Plus,
  Settings,
  Upload,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClientManagement } from "@/components/admin/ClientManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { PressReleaseManagement } from "@/components/admin/PressReleaseManagement";
import { PublicationManagement } from "@/components/admin/PublicationManagement";

interface DashboardStats {
  totalClients: number;
  totalPressReleases: number;
  draftPressReleases: number;
  inReviewPressReleases: number;
  approvedPressReleases: number;
  publishedPressReleases: number;
  totalUsers: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('customer');
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalPressReleases: 0,
    draftPressReleases: 0,
    inReviewPressReleases: 0,
    approvedPressReleases: 0,
    publishedPressReleases: 0,
    totalUsers: 0
  });

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
      
      console.log('User role data:', roleData); // Debug log
      
      if (roleData) {
        setUserRole(roleData.role);
        console.log('Setting user role:', roleData.role); // Debug log
        
        // Check if user is admin after setting the role
        if (!['admin', 'super_admin', 'editor'].includes(roleData.role)) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
      } else {
        // No role found, redirect to regular dashboard
        console.log('No role found for user, redirecting to dashboard'); // Debug log
        toast({
          title: "Access Denied", 
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }
    };

    getCurrentUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (!user || !userRole || userRole === 'customer') return;

    const fetchStats = async () => {
      try {
        // Get total clients
        const { count: clientCount } = await supabase
          .from('post_checkout_info')
          .select('*', { count: 'exact', head: true });

        // Get total press releases
        const { count: prCount } = await supabase
          .from('press_releases')
          .select('*', { count: 'exact', head: true });

        // Get press releases by status
        const { data: pressReleases } = await supabase
          .from('press_releases')
          .select('status');

        const statusCounts = pressReleases?.reduce((acc, pr) => {
          acc[pr.status] = (acc[pr.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Get total users
        const { count: userCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalClients: clientCount || 0,
          totalPressReleases: prCount || 0,
          draftPressReleases: statusCounts.draft || 0,
          inReviewPressReleases: statusCounts.in_review || 0,
          approvedPressReleases: statusCounts.approved || 0,
          publishedPressReleases: statusCounts.published || 0,
          totalUsers: userCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, userRole, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage clients, press releases, and user accounts
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/admin-upload')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Press Release
              </Button>
              <Button 
                onClick={() => navigate('/post-checkout')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Client Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Active client projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Press Releases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPressReleases}</div>
              <p className="text-xs text-muted-foreground">
                Total press releases created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inReviewPressReleases}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedPressReleases}</div>
              <p className="text-xs text-muted-foreground">
                Ready for publication
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Press Release Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Draft</Badge>
                <span className="text-sm text-muted-foreground">{stats.draftPressReleases}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Review</Badge>
                <span className="text-sm text-muted-foreground">{stats.inReviewPressReleases}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                <span className="text-sm text-muted-foreground">{stats.approvedPressReleases}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Published</Badge>
                <span className="text-sm text-muted-foreground">{stats.publishedPressReleases}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="press-releases" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Press Releases
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-6">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="press-releases" className="mt-6">
            <PressReleaseManagement />
          </TabsContent>

          <TabsContent value="publications" className="mt-6">
            <PublicationManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;