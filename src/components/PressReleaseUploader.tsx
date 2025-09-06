import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Image, 
  FileImage, 
  X, 
  CheckCircle,
  AlertCircle,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FileUpload {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  storageId?: string;
}

interface PressReleaseUploaderProps {
  checkoutInfoId: string;
  onUploadComplete?: () => void;
  className?: string;
}

export const PressReleaseUploader = ({ 
  checkoutInfoId, 
  onUploadComplete,
  className 
}: PressReleaseUploaderProps) => {
  const { toast } = useToast();
  const [logo, setLogo] = useState<FileUpload | null>(null);
  const [images, setImages] = useState<(FileUpload | null)[]>([null, null]);
  const [uploading, setUploading] = useState(false);

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
      const fileName = `${checkoutInfoId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileUpload.file);

      if (uploadError) throw uploadError;

      // Save file attachment record
      const { error: dbError } = await supabase
        .from('file_attachments')
        .insert({
          post_checkout_info_id: checkoutInfoId,
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

  const handleUploadAll = async () => {
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

      toast({
        title: "Upload successful",
        description: "All files have been uploaded successfully"
      });

      onUploadComplete?.();
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

  const getUploadProgress = () => {
    const totalFiles = [logo, ...images].filter(Boolean).length;
    const uploadedFiles = [logo, ...images].filter(f => f?.uploaded).length;
    return totalFiles > 0 ? (uploadedFiles / totalFiles) * 100 : 0;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Press Release Media Upload
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your company logo and up to 2 supporting images for your press release
          </p>
        </CardHeader>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building className="w-4 h-4 mr-2" />
            Company Logo
            <Badge variant="secondary" className="ml-2">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logo ? (
            <div className="relative">
              <div className="relative group">
                <img 
                  src={logo.preview} 
                  alt="Logo preview" 
                  className="w-full max-w-xs h-32 object-contain bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                />
                {logo.uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                {logo.uploaded && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile('logo')}
                  disabled={logo.uploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{logo.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(logo.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-2">Upload Company Logo</p>
                <p className="text-xs text-muted-foreground mb-4">
                  PNG, JPG, SVG up to 5MB
                </p>
                <Button size="sm" variant="outline">
                  Choose File
                </Button>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          )}
        </CardContent>
      </Card>

      {/* Images Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Image className="w-4 h-4 mr-2" />
            Supporting Images
            <Badge variant="outline" className="ml-2">Optional</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add up to 2 images to support your press release
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index}>
                {image ? (
                  <div className="relative group">
                    <img 
                      src={image.preview} 
                      alt={`Image ${index + 1} preview`} 
                      className="w-full h-48 object-cover bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    {image.uploaded && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile('image', index)}
                      disabled={image.uploading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">{image.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer h-48 flex flex-col justify-center">
                      <FileImage className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Upload Image {index + 1}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        PNG, JPG up to 10MB
                      </p>
                      <Button size="sm" variant="outline">
                        Choose File
                      </Button>
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
        </CardContent>
      </Card>

      {/* Upload Progress & Actions */}
      {(logo || images.some(Boolean)) && (
        <Card>
          <CardContent className="pt-6">
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(getUploadProgress())}%</span>
                </div>
                <Progress value={getUploadProgress()} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {[logo, ...images].filter(Boolean).length} file(s) selected
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLogo(null);
                    setImages([null, null]);
                  }}
                  disabled={uploading}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={handleUploadAll}
                  disabled={uploading || ![logo, ...images].some(Boolean)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload All Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};