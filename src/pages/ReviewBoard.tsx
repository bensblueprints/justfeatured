import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Download,
  Edit,
  Eye,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  type PostCheckoutInfo, 
  type PressRelease, 
  type ReviewComment, 
  type ApprovalHistory,
  type ReviewStatus 
} from "@/types/press-release";

interface ReviewBoardProps {}

export const ReviewBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('customer');
  const [checkoutInfo, setCheckoutInfo] = useState<PostCheckoutInfo | null>(null);
  const [pressRelease, setPressRelease] = useState<PressRelease | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
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
        .single();
      
      if (roleData) {
        setUserRole(roleData.role);
      }
    };

    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (!id || !user) return;

    const fetchData = async () => {
      try {
        // Fetch checkout info
        const { data: checkoutData, error: checkoutError } = await supabase
          .from('post_checkout_info')
          .select('*')
          .eq('id', id)
          .single();

        if (checkoutError) throw checkoutError;
        setCheckoutInfo(checkoutData);

        // Fetch press release
        const { data: pressReleaseData } = await supabase
          .from('press_releases')
          .select('*')
          .eq('post_checkout_info_id', id)
          .order('version_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pressReleaseData) {
          setPressRelease(pressReleaseData);
          setEditedContent(pressReleaseData.content);

          // Fetch comments
          const { data: commentsData } = await supabase
            .from('review_comments')
            .select('*')
            .eq('press_release_id', pressReleaseData.id)
            .order('created_at', { ascending: true });

          setComments(commentsData || []);

          // Fetch approval history
          const { data: historyData } = await supabase
            .from('approval_history')
            .select('*')
            .eq('press_release_id', pressReleaseData.id)
            .order('created_at', { ascending: false });

          setApprovalHistory(historyData || []);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const pressReleaseChannel = supabase
      .channel('press_releases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'press_releases',
          filter: `post_checkout_info_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setPressRelease(payload.new as PressRelease);
            setEditedContent(payload.new.content);
          }
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel('comments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_comments'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments(prev => [...prev, payload.new as ReviewComment]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pressReleaseChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [id, user, toast]);

  const addComment = async () => {
    if (!newComment.trim() || !pressRelease || !user) return;

    try {
      const { error } = await supabase
        .from('review_comments')
        .insert({
          press_release_id: pressRelease.id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (newStatus: ReviewStatus, comment?: string) => {
    if (!pressRelease || !user) return;

    try {
      const { error } = await supabase
        .from('press_releases')
        .update({ status: newStatus })
        .eq('id', pressRelease.id);

      if (error) throw error;

      // Add to approval history
      await supabase
        .from('approval_history')
        .insert({
          press_release_id: pressRelease.id,
          user_id: user.id,
          action: newStatus,
          status: newStatus,
          comment: comment
        });

      toast({
        title: "Status Updated",
        description: `Press release status updated to ${newStatus.replace('_', ' ')}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const saveContent = async () => {
    if (!pressRelease || !user) return;

    try {
      const wordCount = editedContent.split(/\s+/).length;
      
      const { error } = await supabase
        .from('press_releases')
        .update({ 
          content: editedContent,
          word_count: wordCount,
          version_number: pressRelease.version_number + 1
        })
        .eq('id', pressRelease.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Content Saved",
        description: "Press release content has been updated"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'in_review': return 'bg-blue-500';
      case 'revision_requested': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const canEdit = () => {
    return userRole === 'editor' || userRole === 'admin' || userRole === 'super_admin';
  };

  const canApprove = () => {
    return userRole === 'admin' || userRole === 'super_admin';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading review board...</p>
        </div>
      </div>
    );
  }

  if (!checkoutInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p>Review board not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Review Board
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              {checkoutInfo.company_name} <span className="text-primary">Press Release</span>
            </h1>
            {pressRelease && (
              <div className="flex items-center justify-center gap-4">
                <Badge className={getStatusColor(pressRelease.status)}>
                  {pressRelease.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-muted-foreground">
                  Version {pressRelease.version_number}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Info Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Industry:</span> {checkoutInfo.industry_sector}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {checkoutInfo.contact_person_name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {checkoutInfo.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {checkoutInfo.phone_number}
                    </div>
                  </div>
                  {checkoutInfo.business_description && (
                    <div className="mt-4">
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground mt-1">{checkoutInfo.business_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Press Release Content */}
              {pressRelease ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Press Release Draft
                      </CardTitle>
                      <div className="flex gap-2">
                        {canEdit() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            {isEditing ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                            {isEditing ? "Preview" : "Edit"}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold">{pressRelease.title}</h2>
                    </div>
                    
                    {isEditing && canEdit() ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                        <div className="flex gap-2">
                          <Button onClick={saveContent}>Save Changes</Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setEditedContent(pressRelease.content);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap">{pressRelease.content}</div>
                      </div>
                    )}
                    
                    {pressRelease.word_count && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        Word count: {pressRelease.word_count}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : checkoutInfo.write_own_release && checkoutInfo.custom_press_release ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer-Provided Press Release</CardTitle>
                    <CardDescription>
                      This press release was provided by the customer and is pending review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{checkoutInfo.custom_press_release}</div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Press Release In Progress</CardTitle>
                    <CardDescription>
                      Our team is working on your press release. You'll be notified when it's ready for review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                      <p className="text-muted-foreground">
                        Estimated delivery: {checkoutInfo.write_own_release ? '24-48 hours' : '5-7 business days'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {pressRelease && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {pressRelease.status === 'draft' && canEdit() && (
                        <Button onClick={() => updateStatus('in_review')}>
                          Submit for Review
                        </Button>
                      )}
                      
                      {pressRelease.status === 'in_review' && canApprove() && (
                        <>
                          <Button onClick={() => updateStatus('approved')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => updateStatus('revision_requested')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Request Changes
                          </Button>
                        </>
                      )}
                      
                      {pressRelease.status === 'revision_requested' && canEdit() && (
                        <Button onClick={() => updateStatus('in_review')}>
                          Resubmit for Review
                        </Button>
                      )}
                      
                      {pressRelease.status === 'approved' && userRole === 'customer' && (
                        <Button onClick={() => updateStatus('approved')}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Final Approval
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border-l-2 border-primary pl-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                            <p className="mt-1">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No comments yet
                      </p>
                    )}
                  </ScrollArea>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      size="sm" 
                      onClick={addComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status History */}
              <Card>
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    {approvalHistory.length > 0 ? (
                      <div className="space-y-3">
                        {approvalHistory.map((history, index) => (
                          <div key={history.id} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(history.status)}`} />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {history.action.replace('_', ' ')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(history.created_at).toLocaleDateString()}
                              </div>
                              {history.comment && (
                                <p className="text-sm mt-1">{history.comment}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No history yet
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};