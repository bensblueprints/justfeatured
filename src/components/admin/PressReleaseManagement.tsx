import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Eye, 
  Search, 
  FileText, 
  Calendar,
  Building,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type PressRelease, type PostCheckoutInfo, type ReviewStatus } from "@/types/press-release";

interface PressReleaseWithClient {
  pressRelease: PressRelease;
  client: PostCheckoutInfo;
}

export const PressReleaseManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pressReleases, setPressReleases] = useState<PressReleaseWithClient[]>([]);
  const [filteredPressReleases, setFilteredPressReleases] = useState<PressReleaseWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPressReleases();
  }, []);

  useEffect(() => {
    let filtered = pressReleases.filter(item => 
      item.pressRelease.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.pressRelease.status === statusFilter);
    }

    setFilteredPressReleases(filtered);
  }, [pressReleases, searchTerm, statusFilter]);

  const fetchPressReleases = async () => {
    try {
      const { data: pressReleasesData, error: prError } = await supabase
        .from('press_releases')
        .select(`
          *,
          post_checkout_info (*)
        `)
        .order('created_at', { ascending: false });

      if (prError) throw prError;

      const pressReleasesWithClients: PressReleaseWithClient[] = (pressReleasesData || []).map(pr => ({
        pressRelease: {
          ...pr,
          version_number: pr.version_number || 1
        } as any,
        client: pr.post_checkout_info as any
      }));

      setPressReleases(pressReleasesWithClients);
    } catch (error) {
      console.error('Error fetching press releases:', error);
      toast({
        title: "Error",
        description: "Failed to load press releases data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (pressReleaseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('press_releases')
        .update({ status: newStatus as any })
        .eq('id', pressReleaseId);

      if (error) throw error;

      // Update local state
      setPressReleases(prev => prev.map(item => 
        item.pressRelease.id === pressReleaseId 
          ? { ...item, pressRelease: { ...item.pressRelease, status: newStatus as any } }
          : item
      ));

      toast({
        title: "Success",
        description: "Press release status updated successfully"
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update press release status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'revision_requested':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'in_review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-none">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between flex-wrap gap-4">
            <span className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Press Release Management
            </span>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Button 
                onClick={() => navigate('/admin-upload')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Press Release
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="revision_requested">Needs Revision</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search press releases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPressReleases.length === 0 ? (
            <div className="text-center py-8 px-6">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Press Releases Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "No press releases match your search criteria." 
                  : "No press releases have been created yet."
                }
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">Title</TableHead>
                    <TableHead className="min-w-[200px]">Client</TableHead>
                    <TableHead className="min-w-[80px]">Version</TableHead>
                    <TableHead className="min-w-[80px]">Words</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Created</TableHead>
                    <TableHead className="text-right min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPressReleases.map((item) => (
                    <TableRow key={item.pressRelease.id}>
                      <TableCell className="min-w-[250px]">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.pressRelease.status)}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {item.pressRelease.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {item.pressRelease.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div>
                          <div className="flex items-center text-sm">
                            <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.client.company_name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {item.client.contact_person_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        <Badge variant="outline">
                          v{item.pressRelease.version_number || 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        <span className="text-sm">
                          {item.pressRelease.word_count || 0} words
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <Select 
                          value={item.pressRelease.status as string} 
                          onValueChange={(value) => updateStatus(item.pressRelease.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="revision_requested">Needs Revision</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(item.pressRelease.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right min-w-[150px]">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/review-board/${item.client.id}`)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/review-board/${item.client.id}`)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};