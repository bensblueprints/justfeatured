import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, ArrowLeft } from "lucide-react";

interface ClientInfo {
  id: string;
  company_name: string;
  email: string;
  industry_sector: string;
}

export const AdminUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('customer');
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
      
      // Check if user has admin permissions
      if (!roleData || !['admin', 'super_admin', 'editor'].includes(roleData.role)) {
        navigate("/dashboard");
        return;
      }
    };

    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (!user || !['admin', 'super_admin', 'editor'].includes(userRole)) return;

    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('post_checkout_info')
          .select('id, company_name, email, industry_sector')
          .order('company_name');

        if (error) throw error;
        setClients(data || []);
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Error",
          description: "Failed to load client list",
          variant: "destructive"
        });
      }
    };

    fetchClients();
  }, [user, userRole, toast]);

  const uploadPressRelease = async () => {
    if (!selectedClient || !title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get the client's post_checkout_info
      const { data: checkoutInfo, error: checkoutError } = await supabase
        .from('post_checkout_info')
        .select('user_id')
        .eq('id', selectedClient)
        .single();

      if (checkoutError) throw checkoutError;

      // Check if press release already exists for this client
      const { data: existingPR } = await supabase
        .from('press_releases')
        .select('id, version_number')
        .eq('post_checkout_info_id', selectedClient)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const wordCount = content.split(/\s+/).length;
      const versionNumber = existingPR ? existingPR.version_number + 1 : 1;

      // Insert or update the press release
      const { error: insertError } = await supabase
        .from('press_releases')
        .insert({
          post_checkout_info_id: selectedClient,
          user_id: checkoutInfo.user_id,
          title: title.trim(),
          content: content.trim(),
          version_number: versionNumber,
          status: 'in_review',
          word_count: wordCount,
          actual_delivery_date: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Add to approval history
      await supabase
        .from('approval_history')
        .insert({
          press_release_id: existingPR?.id || selectedClient, // This will be updated by the trigger
          user_id: user.id,
          action: 'uploaded',
          status: 'in_review',
          comment: 'Press release uploaded by admin'
        });

      toast({
        title: "Success",
        description: "Press release uploaded successfully"
      });

      // Reset form
      setSelectedClient("");
      setTitle("");
      setContent("");
      
      // Navigate back to dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error('Error uploading press release:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload press release",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !['admin', 'super_admin', 'editor'].includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. Admin permissions required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Upload Press Release</h1>
                <p className="text-muted-foreground mt-1">
                  Upload a completed press release for a client
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Press Release
              </CardTitle>
              <CardDescription>
                Select a client and upload their completed press release
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client">Select Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name} - {client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Press Release Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the press release title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Press Release Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the complete press release content here..."
                  className="min-h-[400px]"
                />
                {content && (
                  <p className="text-sm text-muted-foreground">
                    Word count: {content.split(/\s+/).length}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={uploadPressRelease}
                  disabled={loading || !selectedClient || !title.trim() || !content.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Upload Press Release
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;