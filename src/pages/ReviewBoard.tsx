import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Download,
  Edit,
  Eye,
  Send,
  Upload,
  Image,
  Building,
  X,
  ArrowLeft,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeContent, sanitizeText } from "@/lib/security";
import { 
  type PostCheckoutInfo, 
  type PressRelease, 
  type ReviewComment, 
  type ApprovalHistory,
  type ReviewStatus 
} from "@/types/press-release";

interface FileUpload {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  storageId?: string;
}

interface FileAttachment {
  id: string;
  file_name: string;
  file_type: string;
  storage_path: string;
  is_logo: boolean;
  created_at: string;
}

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
  const [editedTitle, setEditedTitle] = useState("");

  // Media upload states
  const [logo, setLogo] = useState<FileUpload | null>(null);
  const [images, setImages] = useState<(FileUpload | null)[]>([null, null]);
  const [existingAttachments, setExistingAttachments] = useState<FileAttachment[]>([]);
  const [uploading, setUploading] = useState(false);

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
        .maybeSingle();
      
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
          setEditedTitle(pressReleaseData.title);

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

        // Fetch existing file attachments
        const { data: attachmentsData } = await supabase
          .from('file_attachments')
          .select('*')
          .eq('post_checkout_info_id', id)
          .order('created_at', { ascending: false });

        if (attachmentsData) {
          setExistingAttachments(attachmentsData);
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
            setEditedTitle(payload.new.title);
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

  // Media upload functions
  const createFileUpload = (file: File): FileUpload => ({
    file,
    preview: URL.createObjectURL(file),
    uploading: false,
    uploaded: false
  });

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file for the logo",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Logo must be under 5MB",
        variant: "destructive"
      });
      return;
    }

    setLogo(createFileUpload(file));
  }, [toast]);

  const handleImageUpload = useCallback((index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Images must be under 10MB",
        variant: "destructive"
      });
      return;
    }

    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = createFileUpload(file);
      return newImages;
    });
  }, [toast]);

  const removeFile = (type: 'logo' | 'image', index?: number) => {
    if (type === 'logo') {
      if (logo?.preview) URL.revokeObjectURL(logo.preview);
      setLogo(null);
    } else if (index !== undefined) {
      setImages(prev => {
        const newImages = [...prev];
        if (newImages[index]?.preview) {
          URL.revokeObjectURL(newImages[index]!.preview);
        }
        newImages[index] = null;
        return newImages;
      });
    }
  };

  const uploadFile = async (fileUpload: FileUpload, bucketName: string, isLogo: boolean = false): Promise<string | null> => {
    try {
      const fileExt = fileUpload.file.name.split('.').pop();
      const fileName = `${checkoutInfo!.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileUpload.file);

      if (uploadError) throw uploadError;

      // Save file attachment record
      const { error: dbError } = await supabase
        .from('file_attachments')
        .insert({
          post_checkout_info_id: checkoutInfo!.id,
          file_name: fileUpload.file.name,
          file_type: fileUpload.file.type,
          file_size: fileUpload.file.size,
          storage_path: filePath,
          is_logo: isLogo
        });

      if (dbError) throw dbError;

      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleUploadFiles = async () => {
    const filesToUpload = [
      ...(logo ? [{ file: logo, isLogo: true }] : []),
      ...images.filter(img => img !== null).map(img => ({ file: img!, isLogo: false }))
    ];

    if (filesToUpload.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload logo
      if (logo) {
        setLogo(prev => prev ? { ...prev, uploading: true } : null);
        await uploadFile(logo, 'company-logos', true);
        setLogo(prev => prev ? { ...prev, uploading: false, uploaded: true } : null);
      }

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image) {
          setImages(prev => {
            const newImages = [...prev];
            if (newImages[i]) {
              newImages[i] = { ...newImages[i]!, uploading: true };
            }
            return newImages;
          });
          
          await uploadFile(image, 'press-attachments', false);
          
          setImages(prev => {
            const newImages = [...prev];
            if (newImages[i]) {
              newImages[i] = { ...newImages[i]!, uploading: false, uploaded: true };
            }
            return newImages;
          });
        }
      }

      // Refresh attachments
      const { data: attachmentsData } = await supabase
        .from('file_attachments')
        .select('*')
        .eq('post_checkout_info_id', checkoutInfo!.id)
        .order('created_at', { ascending: false });

      if (attachmentsData) {
        setExistingAttachments(attachmentsData);
      }

      // Clear upload states
      setLogo(null);
      setImages([null, null]);

      toast({
        title: "Upload successful",
        description: "All files have been uploaded successfully"
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

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
          title: editedTitle,
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
                    {isEditing && canEdit() ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title</label>
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            placeholder="Press release title..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="min-h-[400px] font-mono text-sm"
                            placeholder="Press release content..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveContent} disabled={!editedTitle.trim() || !editedContent.trim()}>
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setEditedContent(pressRelease.content);
                              setEditedTitle(pressRelease.title);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold leading-tight">{pressRelease.title}</h2>
                        </div>
                        <div className="prose max-w-none">
                          <div 
                            className="whitespace-pre-wrap leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sanitizeContent(pressRelease.content) }}
                          />
                        </div>
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
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(checkoutInfo.custom_press_release) }}
                      />
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
              {/* Media Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Media Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Attachments */}
                  {existingAttachments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {existingAttachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2">
                              {attachment.is_logo ? (
                                <Building className="w-4 h-4 text-primary" />
                              ) : (
                                <Image className="w-4 h-4 text-primary" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{attachment.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {attachment.is_logo ? "Logo" : "Image"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  )}

                  {/* Logo Upload */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      Company Logo
                    </h4>
                    {logo ? (
                      <div className="relative group">
                        <img 
                          src={logo.preview} 
                          alt="Logo preview" 
                          className="w-full h-20 object-contain bg-gray-50 rounded-lg border"
                        />
                        {logo.uploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        )}
                        {logo.uploaded && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => removeFile('logo')}
                          disabled={logo.uploading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">{logo.file.name}</p>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                          <Building className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">Upload Logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Images Upload */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      Supporting Images
                    </h4>
                    <div className="space-y-3">
                      {images.map((image, index) => (
                        <div key={index}>
                          {image ? (
                            <div className="relative group">
                              <img 
                                src={image.preview} 
                                alt={`Image ${index + 1} preview`} 
                                className="w-full h-20 object-cover bg-gray-50 rounded-lg border"
                              />
                              {image.uploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                              )}
                              {image.uploaded && (
                                <div className="absolute top-1 right-1">
                                  <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => removeFile('image', index)}
                                disabled={image.uploading}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1">{image.file.name}</p>
                            </div>
                          ) : (
                            <label className="block cursor-pointer">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-primary/50 transition-colors h-20 flex flex-col justify-center">
                                <Image className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs font-medium">Image {index + 1}</p>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload(index)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Actions */}
                  {(logo || images.some(Boolean)) && (
                    <div className="pt-4 border-t">
                      {uploading && (
                        <div className="mb-3">
                          <Progress value={50} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">Uploading files...</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => {
                            setLogo(null);
                            setImages([null, null]);
                          }}
                          disabled={uploading}
                        >
                          Clear
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleUploadFiles}
                          disabled={uploading}
                          className="flex-1"
                        >
                          {uploading ? "Uploading..." : "Upload Files"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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

              {/* Client Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">{checkoutInfo.contact_person_name}</p>
                    <p className="text-xs text-muted-foreground">Contact Person</p>
                  </div>
                  <div>
                    <p className="text-sm">{checkoutInfo.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                  <div>
                    <p className="text-sm">{checkoutInfo.phone_number}</p>
                    <p className="text-xs text-muted-foreground">Phone</p>
                  </div>
                  {checkoutInfo.company_website && (
                    <div>
                      <p className="text-sm">{checkoutInfo.company_website}</p>
                      <p className="text-xs text-muted-foreground">Website</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
