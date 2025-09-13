import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, FileText } from "lucide-react";

interface CreatePressReleaseDialogProps {
  checkoutInfoId?: string;
  onSuccess: () => void;
  userRole?: string;
  standalone?: boolean;
}

export const CreatePressReleaseDialog = ({ checkoutInfoId, onSuccess, userRole, standalone = false }: CreatePressReleaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCheckoutInfo, setSelectedCheckoutInfo] = useState("");
  const [checkoutInfoOptions, setCheckoutInfoOptions] = useState<Array<{id: string, company_name: string}>>([]);
  const { toast } = useToast();

  // Load checkout info options for standalone mode
  useEffect(() => {
    if (standalone && ['admin', 'super_admin', 'editor'].includes(userRole || '')) {
      const loadCheckoutOptions = async () => {
        const { data, error } = await supabase
          .from('post_checkout_info')
          .select('id, company_name, user_id')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setCheckoutInfoOptions(data);
        }
      };
      loadCheckoutOptions();
    }
  }, [standalone, userRole]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    // Check if user has permission to create press releases
    if (!['admin', 'super_admin', 'editor'].includes(userRole || '')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to create press releases",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let targetUserId: string;
      let targetCheckoutInfoId: string | null = null;

      if (standalone) {
        // For standalone mode, get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        targetUserId = user.id;
        
        // If a checkout info is selected, use it
        if (selectedCheckoutInfo) {
          targetCheckoutInfoId = selectedCheckoutInfo;
          // Get the user_id from the selected checkout info
          const { data: checkoutData, error: checkoutError } = await supabase
            .from('post_checkout_info')
            .select('user_id')
            .eq('id', selectedCheckoutInfo)
            .single();
          
          if (checkoutError) throw checkoutError;
          targetUserId = checkoutData.user_id;
        }
      } else {
        // For linked mode, get user_id from the provided checkout info
        if (!checkoutInfoId) throw new Error("Checkout info ID required");
        
        const { data: checkoutData, error: checkoutError } = await supabase
          .from('post_checkout_info')
          .select('user_id')
          .eq('id', checkoutInfoId)
          .single();

        if (checkoutError) throw checkoutError;
        targetUserId = checkoutData.user_id;
        targetCheckoutInfoId = checkoutInfoId;
      }

      // Calculate word count
      const wordCount = content.split(/\s+/).length;

      // Create the press release
      const { error } = await supabase
        .from('press_releases')
        .insert({
          post_checkout_info_id: targetCheckoutInfoId,
          user_id: targetUserId,
          title: title.trim(),
          content: content.trim(),
          word_count: wordCount,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Press release created successfully"
      });

      setTitle("");
      setContent("");
      setSelectedCheckoutInfo("");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create press release",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          {standalone ? "Add New Press Release" : "Create Press Release"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {standalone ? "Add New Press Release" : "Create Press Release"}
          </DialogTitle>
          <DialogDescription>
            {standalone 
              ? "Create a new press release with all pertinent data required for publication."
              : "Create a new press release for this client project."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {standalone && checkoutInfoOptions.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="checkout-info">Associated Client (Optional)</Label>
              <Select value={selectedCheckoutInfo} onValueChange={setSelectedCheckoutInfo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client or leave blank for standalone..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No associated client</SelectItem>
                  {checkoutInfoOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="title">Press Release Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter compelling press release headline..."
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Press Release Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full press release content including lead paragraph, body, quotes, company information, and contact details..."
              className="min-h-[300px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Include: Company background, announcement details, quotes from executives, 
              relevant statistics, and contact information for media inquiries.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Press Release"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};