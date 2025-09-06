import { useState } from "react";
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
import { Plus } from "lucide-react";

interface CreatePressReleaseDialogProps {
  checkoutInfoId: string;
  onSuccess: () => void;
  userRole?: string;
}

export const CreatePressReleaseDialog = ({ checkoutInfoId, onSuccess, userRole }: CreatePressReleaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

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
      // Get the user_id from the checkout info
      const { data: checkoutData, error: checkoutError } = await supabase
        .from('post_checkout_info')
        .select('user_id')
        .eq('id', checkoutInfoId)
        .single();

      if (checkoutError) throw checkoutError;

      // Calculate word count
      const wordCount = content.split(/\s+/).length;

      // Create the press release
      const { error } = await supabase
        .from('press_releases')
        .insert({
          post_checkout_info_id: checkoutInfoId,
          user_id: checkoutData.user_id,
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
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Press Release
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create Press Release</DialogTitle>
          <DialogDescription>
            Create a new press release for this client project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter press release title..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter press release content..."
              className="min-h-[300px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Press Release"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};