import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Building, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  Plus,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type PostCheckoutInfo, type PressRelease } from "@/types/press-release";
import { CreatePressReleaseDialog } from "@/components/CreatePressReleaseDialog";
import { useAuth } from "@/components/AuthWrapper";

interface ClientWithPressRelease {
  client: PostCheckoutInfo;
  pressRelease?: PressRelease;
}

export const ClientManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientWithPressRelease[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientWithPressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string>('customer');

  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;
      
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

    getUserRole();
    fetchClients();
  }, [user]);

  useEffect(() => {
    const filtered = clients.filter(item => 
      item.client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.industry_sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const fetchClients = async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('post_checkout_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // For each client, get their latest press release
      const clientsWithPressReleases: ClientWithPressRelease[] = [];
      for (const client of clientsData || []) {
        const { data: pressReleaseData } = await supabase
          .from('press_releases')
          .select('*')
          .eq('post_checkout_info_id', client.id)
          .order('version_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        clientsWithPressReleases.push({
          client,
          pressRelease: pressReleaseData || undefined
        });
      }

      setClients(clientsWithPressReleases);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Client Management
          </span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Clients Found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No clients match your search criteria." : "No clients have been added yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Press Release</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((item) => (
                  <TableRow key={item.client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.client.company_name}</div>
                        {item.client.company_website && (
                          <div className="text-sm text-muted-foreground">
                            {item.client.company_website}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {item.client.contact_person_name}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 mr-1" />
                          {item.client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.client.industry_sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.client.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.pressRelease ? (
                        <div>
                          <div className="text-sm font-medium truncate max-w-[200px]">
                            {item.pressRelease.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            v{item.pressRelease.version_number} • {item.pressRelease.word_count || 0} words
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Not created
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.pressRelease?.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!item.pressRelease && (
                          <CreatePressReleaseDialog 
                            checkoutInfoId={item.client.id}
                            onSuccess={fetchClients}
                            userRole={userRole}
                          />
                        )}
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
  );
};