import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus,
  Upload,
  Search, 
  Edit,
  Trash2,
  Globe,
  Building,
  DollarSign,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Publication } from "@/types/index";

interface NewPublication {
  name: string;
  type: string;
  category: string;
  price: number;
  tat_days: string;
  description: string;
  features: string[];
  website_url: string;
  tier: string;
  da_score?: number;
  dr_score?: number;
  location?: string;
  guaranteed_placement: boolean;
  dofollow_link: boolean;
  social_media_post: boolean;
  homepage_placement: boolean;
  dedicated_article: boolean;
  press_release_distribution: boolean;
  author_byline: boolean;
  image_inclusion: boolean;
  video_inclusion: boolean;
  sponsored: boolean;
  indexed: boolean;
  erotic: boolean;
  health: boolean;
  cbd: boolean;
  crypto: boolean;
  gambling: boolean;
  placement_type: string;
}

const defaultPublication: NewPublication = {
  name: "",
  type: "standard",
  category: "",
  price: 0,
  tat_days: "7",
  description: "",
  features: [],
  website_url: "",
  tier: "standard",
  da_score: 0,
  dr_score: 0,
  location: "",
  guaranteed_placement: false,
  dofollow_link: true,
  social_media_post: false,
  homepage_placement: false,
  dedicated_article: false,
  press_release_distribution: false,
  author_byline: false,
  image_inclusion: false,
  video_inclusion: false,
  sponsored: false,
  indexed: true,
  erotic: false,
  health: false,
  cbd: false,
  crypto: false,
  gambling: false,
  placement_type: "standard",
};

export const PublicationManagement = () => {
  const { toast } = useToast();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [newPublication, setNewPublication] = useState<NewPublication>(defaultPublication);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    let filtered = publications.filter(pub => 
      pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.tier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (tierFilter !== "all") {
      filtered = filtered.filter(pub => pub.tier === tierFilter);
    }

    setFilteredPublications(filtered);
  }, [publications, searchTerm, tierFilter]);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications((data || []) as Publication[]);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: "Error",
        description: "Failed to load publications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublication = async () => {
    try {
      const publicationData = {
        ...newPublication,
        external_id: crypto.randomUUID(),
        is_active: true,
        popularity: 0,
        tat_days: newPublication.tat_days,
      };

      const { error } = await supabase
        .from('publications')
        .insert([publicationData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication added successfully"
      });

      setIsAddDialogOpen(false);
      setNewPublication(defaultPublication);
      fetchPublications();
    } catch (error) {
      console.error('Error adding publication:', error);
      toast({
        title: "Error",
        description: "Failed to add publication",
        variant: "destructive"
      });
    }
  };

  const handleEditPublication = async () => {
    if (!editingPublication) return;

    try {
      const { error } = await supabase
        .from('publications')
        .update(newPublication)
        .eq('id', editingPublication.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication updated successfully"
      });

      setIsEditDialogOpen(false);
      setEditingPublication(null);
      setNewPublication(defaultPublication);
      fetchPublications();
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Error",
        description: "Failed to update publication",
        variant: "destructive"
      });
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication deleted successfully"
      });

      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Error",
        description: "Failed to delete publication",
        variant: "destructive"
      });
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    setUploading(true);
    const errors: string[] = [];
    let successCount = 0;
    
    try {
      // Read the CSV file
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }

      // Get headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Parse data rows
      const publications = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
          // Better CSV parsing to handle quoted values
          const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
          
          const publication: any = {
            external_id: crypto.randomUUID(),
            is_active: true,
            popularity: 0,
          };

          // Map CSV columns with proper data type conversion
          headers.forEach((header, index) => {
            const value = cleanValues[index] || '';
            
            // Handle boolean conversions for CSV columns that map to boolean fields
            if (['SPONSORED', 'INDEXED', 'DOFOLLOW', 'EROTIC', 'HEALTH', 'CBD', 'CRYPTO', 'GAMBLING'].includes(header)) {
              const upperValue = value.toUpperCase();
              if (upperValue === 'Y' || upperValue === 'DISCREET') {
                publication[header] = 'Y';
              } else if (upperValue === 'N' || value === '') {
                publication[header] = 'N';
              } else {
                publication[header] = value;
              }
            }
            // Handle numeric fields
            else if (['Price', 'DA', 'DR', 'TAT'].includes(header)) {
              const numValue = parseInt(value);
              publication[header] = isNaN(numValue) ? null : numValue;
            }
            // Handle text fields
            else {
              publication[header] = value || null;
            }
          });

          // Validate required fields
          const requiredFields = ['PUBLICATION', 'Price'];
          const missingFields = requiredFields.filter(field => 
            !publication[field] || publication[field] === ''
          );
          
          if (missingFields.length > 0) {
            errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
            continue;
          }

          publications.push(publication);
        } catch (rowError) {
          errors.push(`Row ${i + 1}: ${rowError instanceof Error ? rowError.message : 'Parse error'}`);
        }
      }

      if (publications.length === 0) {
        throw new Error('No valid data rows found in CSV');
      }

      // Insert publications in batches with error handling
      const batchSize = 10; // Smaller batches for better error handling
      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('publications')
            .insert(batch);

          if (error) {
            // Log the specific error and which batch failed
            console.error(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error);
            errors.push(`Batch ${Math.floor(i/batchSize) + 1} (rows ${i + 1}-${i + batch.length}): ${error.message}`);
          } else {
            successCount += batch.length;
          }
        } catch (batchError) {
          console.error(`Batch ${Math.floor(i/batchSize) + 1} error:`, batchError);
          errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
        }
      }

      // Show results
      if (successCount > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} publications${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
        });
      }

      if (errors.length > 0) {
        console.error('CSV Import Errors:', errors);
        toast({
          title: "Import Errors",
          description: `${errors.length} rows failed. Check console for details.`,
          variant: "destructive"
        });
      }

      setCsvFile(null);
      fetchPublications();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload CSV",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (publication: Publication) => {
    setEditingPublication(publication);
    setNewPublication({
      name: publication.name,
      type: publication.type,
      category: publication.category,
      price: publication.price,
      tat_days: publication.tat_days?.toString() || "7",
      description: publication.description,
      features: publication.features,
      website_url: publication.website_url || "",
      tier: publication.tier,
      da_score: publication.da_score,
      dr_score: publication.dr_score,
      location: publication.location || "",
      guaranteed_placement: publication.guaranteed_placement || false,
      dofollow_link: publication.dofollow_link || true,
      social_media_post: publication.social_media_post || false,
      homepage_placement: publication.homepage_placement || false,
      dedicated_article: publication.dedicated_article || false,
      press_release_distribution: publication.press_release_distribution || false,
      author_byline: publication.author_byline || false,
      image_inclusion: publication.image_inclusion || false,
      video_inclusion: publication.video_inclusion || false,
      sponsored: publication.sponsored || false,
      indexed: publication.indexed !== false,
      erotic: publication.erotic || false,
      health: publication.health || false,
      cbd: publication.cbd || false,
      crypto: publication.crypto || false,
      gambling: publication.gambling || false,
      placement_type: publication.placement_type || "standard",
    });
    setIsEditDialogOpen(true);
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      exclusive: "bg-purple-100 text-purple-800 border-purple-200",
      tier1: "bg-blue-100 text-blue-800 border-blue-200",
      premium: "bg-green-100 text-green-800 border-green-200",
      tier2: "bg-yellow-100 text-yellow-800 border-yellow-200",
      standard: "bg-gray-100 text-gray-800 border-gray-200",
      starter: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return <Badge className={colors[tier as keyof typeof colors] || colors.standard}>{tier}</Badge>;
  };

  // Memoized handlers to prevent input field refocus issues
  const handleInputChange = useCallback((field: keyof NewPublication) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNewPublication(prev => ({ ...prev, [field]: value }));
    }, []);

  const handleNumberChange = useCallback((field: keyof NewPublication) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      setNewPublication(prev => ({ ...prev, [field]: value }));
    }, []);

  const handleSelectChange = useCallback((field: keyof NewPublication) => 
    (value: string) => {
      setNewPublication(prev => ({ ...prev, [field]: value }));
    }, []);

  const handleCheckboxChange = useCallback((field: keyof NewPublication) => 
    (checked: boolean) => {
      setNewPublication(prev => ({ ...prev, [field]: checked }));
    }, []); 

  const PublicationForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Publication Name *</Label>
          <Input
            id="name"
            value={newPublication.name}
            onChange={handleInputChange('name')}
            placeholder="Enter publication name"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={newPublication.category}
            onChange={handleInputChange('category')}
            placeholder="e.g., News, Business, Technology"
          />
        </div>

        <div>
          <Label htmlFor="tier">Tier</Label>
          <Select value={newPublication.tier} onValueChange={handleSelectChange('tier')}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exclusive">Exclusive</SelectItem>
              <SelectItem value="tier1">Tier 1</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="tier2">Tier 2</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={newPublication.type} onValueChange={handleSelectChange('type')}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exclusive">Exclusive</SelectItem>
              <SelectItem value="tier1">Tier 1</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="tier2">Tier 2</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              value={newPublication.price}
              onChange={handleNumberChange('price')}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="tat_days">TAT (Days)</Label>
            <Input
              id="tat_days"
              value={newPublication.tat_days}
              onChange={handleInputChange('tat_days')}
              placeholder="e.g., 7, 1-2 Weeks"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="da_score">DA Score</Label>
            <Input
              id="da_score"
              type="number"
              value={newPublication.da_score || ""}
              onChange={handleNumberChange('da_score')}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="dr_score">DR Score</Label>
            <Input
              id="dr_score"
              type="number"
              value={newPublication.dr_score || ""}
              onChange={handleNumberChange('dr_score')}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            value={newPublication.website_url}
            onChange={handleInputChange('website_url')}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={newPublication.location || ""}
            onChange={handleInputChange('location')}
            placeholder="e.g., UNITED STATES, GLOBAL"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newPublication.description}
            onChange={handleInputChange('description')}
            placeholder="Publication description"
            rows={3}
          />
        </div>

        <div>
          <Label>Features</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.guaranteed_placement}
                onCheckedChange={(checked) => handleCheckboxChange('guaranteed_placement')(!!checked)}
              />
              <Label className="text-sm">Guaranteed Placement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.dofollow_link}
                onCheckedChange={(checked) => handleCheckboxChange('dofollow_link')(!!checked)}
              />
              <Label className="text-sm">Dofollow Link</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.social_media_post}
                onCheckedChange={(checked) => handleCheckboxChange('social_media_post')(!!checked)}
              />
              <Label className="text-sm">Social Media Post</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.homepage_placement}
                onCheckedChange={(checked) => handleCheckboxChange('homepage_placement')(!!checked)}
              />
              <Label className="text-sm">Homepage Placement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.author_byline}
                onCheckedChange={(checked) => handleCheckboxChange('author_byline')(!!checked)}
              />
              <Label className="text-sm">Author Byline</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.image_inclusion}
                onCheckedChange={(checked) => handleCheckboxChange('image_inclusion')(!!checked)}
              />
              <Label className="text-sm">Image Inclusion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.video_inclusion}
                onCheckedChange={(checked) => handleCheckboxChange('video_inclusion')(!!checked)}
              />
              <Label className="text-sm">Video Inclusion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.sponsored}
                onCheckedChange={(checked) => handleCheckboxChange('sponsored')(!!checked)}
              />
              <Label className="text-sm">Sponsored</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.indexed}
                onCheckedChange={(checked) => handleCheckboxChange('indexed')(!!checked)}
              />
              <Label className="text-sm">Indexed</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Content Restrictions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.erotic}
                onCheckedChange={(checked) => handleCheckboxChange('erotic')(!!checked)}
              />
              <Label className="text-sm">Erotic Content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.health}
                onCheckedChange={(checked) => handleCheckboxChange('health')(!!checked)}
              />
              <Label className="text-sm">Health Content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.cbd}
                onCheckedChange={(checked) => handleCheckboxChange('cbd')(!!checked)}
              />
              <Label className="text-sm">CBD Content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.crypto}
                onCheckedChange={(checked) => handleCheckboxChange('crypto')(!!checked)}
              />
              <Label className="text-sm">Crypto Content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newPublication.gambling}
                onCheckedChange={(checked) => handleCheckboxChange('gambling')(!!checked)}
              />
              <Label className="text-sm">Gambling Content</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            Publication Management
          </span>
          <div className="flex items-center space-x-2">
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="tier1">Tier 1</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="tier2">Tier 2</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* CSV Upload */}
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="w-auto"
              />
              <Button
                onClick={handleCsvUpload}
                disabled={!csvFile || uploading}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Publication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add New Publication</DialogTitle>
                  <DialogDescription>
                    Add a new publication to the marketplace manually.
                  </DialogDescription>
                </DialogHeader>
                <PublicationForm />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewPublication(defaultPublication);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPublication}>
                    Add Publication
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredPublications.length === 0 ? (
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Publications Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || tierFilter !== "all" 
                ? "No publications match your search criteria." 
                : "No publications have been added yet."
              }
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publication</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>TAT</TableHead>
                  <TableHead>DA/DR</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPublications.map((publication) => (
                  <TableRow key={publication.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium truncate max-w-[200px]">
                            {publication.name}
                          </div>
                          {publication.website_url && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Globe className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-[150px]">
                                {publication.website_url.replace(/^https?:\/\//, '')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{publication.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {getTierBadge(publication.tier)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {publication.price.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {publication.tat_days}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>DA: {publication.da_score || 0}</div>
                        <div>DR: {publication.dr_score || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(publication)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePublication(publication.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Publication</DialogTitle>
              <DialogDescription>
                Update the publication details.
              </DialogDescription>
            </DialogHeader>
            <PublicationForm isEdit />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingPublication(null);
                  setNewPublication(defaultPublication);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPublication}>
                Update Publication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};