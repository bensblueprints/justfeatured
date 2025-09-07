import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  MessageSquare, 
  Send,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  Image,
  Building,
  X,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeContent } from "@/lib/security";
import { type PostCheckoutInfo, type PressRelease, type ReviewComment } from "@/types/press-release";
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

// Quill editor configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
    dangerouslyPasteHTML: false
  }
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet',
  'indent',
  'direction', 'align',
  'link', 'image', 'video',
  'blockquote', 'code-block'
];

export const ReviewBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<PostCheckoutInfo | null>(null);
  const [pressRelease, setPressRelease] = useState<PressRelease | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
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
      } else {
        setUserRole('customer');
      }
    };

    getCurrentUser();
  }, [navigate]);

  useEffect(() => {
    // Don't fetch data until we have both user and userRole loaded
    if (!id || !user || userRole === null) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch checkout info - admins can access any, customers only their own
        let checkoutQuery = supabase
          .from('post_checkout_info')
          .select('*')
          .eq('id', id);

        // Only restrict to user's own records if they're NOT an admin
        if (!['admin', 'super_admin', 'editor'].includes(userRole)) {
          checkoutQuery = checkoutQuery.eq('user_id', user.id);
        }

        const { data: checkoutData, error: checkoutError } = await checkoutQuery.maybeSingle();

        if (checkoutError) {
          throw checkoutError;
        }
        
        if (!checkoutData) {
          toast({
            title: "Not found",
            description: "Press release not found or you don't have permission to access it",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
        setCheckoutInfo(checkoutData);

        // Fetch press release
        const { data: pressReleaseData, error: prError } = await supabase
          .from('press_releases')
          .select('*')
          .eq('post_checkout_info_id', id)
          .order('version_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (prError && prError.code !== 'PGRST116') throw prError;

        if (pressReleaseData) {
          setPressRelease(pressReleaseData);
          setEditedContent(pressReleaseData.content);
          setEditedTitle(pressReleaseData.title);

          // Fetch comments
          const { data: commentsData } = await supabase
            .from('review_comments')
            .select('*')
            .eq('press_release_id', pressReleaseData.id)
            .order('created_at', { ascending: false });

          if (commentsData) {
            setComments(commentsData);
          }
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
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load press release data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, userRole, navigate, toast]);

  const canEdit = () => {
    return ['admin', 'super_admin', 'editor'].includes(userRole);
  };

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

  const saveContent = async () => {
    if (!pressRelease || !editedTitle.trim() || !editedContent.trim()) return;

    try {
      // Clean and count words from HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editedContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

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
        title: "Success",
        description: "Press release updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive"
      });
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
      
      // Refresh comments
      const { data: commentsData } = await supabase
        .from('review_comments')
        .select('*')
        .eq('press_release_id', pressRelease.id)
        .order('created_at', { ascending: false });

      if (commentsData) {
        setComments(commentsData);
      }

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

  const getStatusIcon = () => {
    if (!pressRelease) return <FileText className="w-5 h-5 text-muted-foreground" />;
    
    switch (pressRelease.status) {
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

  const getStatusBadge = () => {
    if (!pressRelease) return <Badge variant="secondary">No Press Release</Badge>;
    
    switch (pressRelease.status) {
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
          <p className="text-muted-foreground">Loading press release...</p>
        </div>
      </div>
    );
  }

  if (!checkoutInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(['admin', 'super_admin', 'editor'].includes(userRole) ? '/admin-dashboard' : '/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Press Release Editor</h1>
                <p className="text-muted-foreground mt-1">
                  {checkoutInfo.company_name} - {checkoutInfo.industry_sector}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Press Release */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div>
                      <h2 className="text-xl font-semibold">{checkoutInfo.company_name}</h2>
                      <p className="text-muted-foreground">{checkoutInfo.industry_sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge()}
                    {canEdit() && pressRelease && (
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "secondary" : "outline"}
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {pressRelease ? (
                  <>
                    {isEditing && canEdit() ? (
                      <div className="space-y-6">
                        {/* Title Editor */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title</label>
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-lg font-semibold"
                            placeholder="Enter press release title..."
                          />
                        </div>
                        
                        {/* Rich Text Editor */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <div className="border border-input rounded-md overflow-hidden">
                            <ReactQuill
                              theme="snow"
                              value={editedContent}
                              onChange={setEditedContent}
                              modules={quillModules}
                              formats={quillFormats}
                              placeholder="Write your press release content here..."
                              style={{
                                minHeight: '400px'
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Use the toolbar above to format your text with headers, links, lists, and more.
                          </p>
                        </div>
                        
                        {/* Save Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            onClick={saveContent} 
                            disabled={!editedTitle.trim() || !editedContent.trim()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Save className="w-4 h-4 mr-2" />
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
                          <h2 className="text-3xl font-bold leading-tight mb-4">{pressRelease.title}</h2>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <div 
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: sanitizeContent(pressRelease.content) }}
                          />
                        </div>
                        {pressRelease.word_count && (
                          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                            Word count: {pressRelease.word_count} words
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Press Release In Progress</h3>
                    <p className="text-muted-foreground">
                      Our team is working on your press release. You'll be notified when it's ready for review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            {pressRelease && (
              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Comments & Feedback
                  </h3>
                </CardHeader>
                <CardContent>
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Add feedback to start the conversation.
                    </p>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {comment.user_id === user?.id ? 'You' : 'Team Member'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="border-t pt-4">
                    <textarea
                      placeholder="Add your feedback or comments..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px] mb-3"
                    />
                    <Button 
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Media Upload & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Media Upload Section */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Media Assets
                </h3>
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

            {/* Client Info Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Client Information</h3>
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
  );
};
