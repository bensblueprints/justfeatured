import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Building, 
  BarChart3,
  Plus,
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalClients: number;
  totalPressReleases: number;
  draftPressReleases: number;
  inReviewPressReleases: number;
  approvedPressReleases: number;
  publishedPressReleases: number;
  totalUsers: number;
  totalPublications: number;
  activePublications: number;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalPressReleases: 0,
    draftPressReleases: 0,
    inReviewPressReleases: 0,
    approvedPressReleases: 0,
    publishedPressReleases: 0,
    totalUsers: 0,
    totalPublications: 0,
    activePublications: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

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

      // Get publications data
      const { count: totalPubCount } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true });

      const { count: activePubCount } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalClients: clientCount || 0,
        totalPressReleases: prCount || 0,
        draftPressReleases: statusCounts.draft || 0,
        inReviewPressReleases: statusCounts.in_review || 0,
        approvedPressReleases: statusCounts.approved || 0,
        publishedPressReleases: statusCounts.published || 0,
        totalUsers: userCount || 0,
        totalPublications: totalPubCount || 0,
        activePublications: activePubCount || 0
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Manage your press release platform
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePublications}</div>
            <p className="text-xs text-muted-foreground">
              Active of {stats.totalPublications} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Press Release Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm">Draft</span>
              </div>
              <Badge variant="secondary">{stats.draftPressReleases}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm">In Review</span>
              </div>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                {stats.inReviewPressReleases}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">Approved</span>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                {stats.approvedPressReleases}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm">Published</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {stats.publishedPressReleases}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Publications Active</span>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">
                  {stats.totalPublications > 0 
                    ? Math.round((stats.activePublications / stats.totalPublications) * 100) 
                    : 0}%
                </div>
                <div className="w-16 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.totalPublications > 0 
                        ? (stats.activePublications / stats.totalPublications) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completion Rate</span>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">
                  {stats.totalPressReleases > 0 
                    ? Math.round(((stats.approvedPressReleases + stats.publishedPressReleases) / stats.totalPressReleases) * 100) 
                    : 0}%
                </div>
                 <div className="w-16 bg-muted rounded-full h-2">
                   <div 
                     className="bg-success h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.totalPressReleases > 0 
                        ? ((stats.approvedPressReleases + stats.publishedPressReleases) / stats.totalPressReleases) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};