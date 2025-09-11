import { useState, useEffect, useCallback, useRef } from "react";
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
  FileText,
  Download,
  Image,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandFetchService } from "@/utils/brandFetch";

interface Publication {
  id: string;
  external_id?: string;
  name: string;
  type: string;
  category: string;
  price: number;
  tat_days: string;
  description?: string;
  features: string[];
  logo_url?: string;
  website_url?: string;
  tier: string;
  popularity: number;
  is_active: boolean;
  da_score?: number;
  dr_score?: number;
  location?: string;
  dofollow_link?: boolean;
  sponsored?: boolean;
  indexed?: boolean;
  erotic?: boolean;
  health?: boolean;
  cbd?: boolean;
  crypto?: boolean;
  gambling?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface NewPublication {
  name: string;
  type: string;
  category: string;
  price: number;
  tat_days: string;
  description: string;
  features: string;
  website_url?: string;
  tier: string;
  da_score?: number;
  dr_score?: number;
  location?: string;
  dofollow_link: boolean;
  sponsored: boolean;
  indexed: boolean;
  erotic: boolean;
  health: boolean;
  cbd: boolean;
  crypto: boolean;
  gambling: boolean;
}

interface CSVRow {
  Update?: string;
  PUBLICATION?: string;
  Price?: string;
  DA?: string;
  DR?: string;
  GENRE?: string;
  TAT?: string;
  SPONSORED?: string;
  INDEXED?: string;
  DOFOLLOW?: string;
  "REGION / LOCATION"?: string;
  EROTIC?: string;
  HEALTH?: string;
  CBD?: string;
  CRYPTO?: string;
  GAMBLING?: string;
}

const defaultPublication: NewPublication = {
  name: "",
  type: "standard",
  category: "News",
  price: 0,
  tat_days: "1-2 Weeks",
  description: "",
  features: "",
  website_url: "",
  tier: "standard",
  da_score: 0,
  dr_score: 0,
  location: "",
  dofollow_link: false,
  sponsored: false,
  indexed: true,
  erotic: false,
  health: false,
  cbd: false,
  crypto: false,
  gambling: false,
};

// Publication Form Component
const PublicationForm = ({ 
  newPublication, 
  onInputChange, 
  onNumberChange, 
  onSelectChange, 
  onCheckboxChange,
  onFetchLogo,
  fetchingLogo,
  isEdit = false 
}: { 
  newPublication: NewPublication;
  onInputChange: (field: keyof NewPublication) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (field: keyof NewPublication) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: keyof NewPublication) => (value: string) => void;
  onCheckboxChange: (field: keyof NewPublication) => (checked: boolean) => void;
  onFetchLogo: () => void;
  fetchingLogo: boolean;
  isEdit?: boolean;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Publication Name *</Label>
        <Input
          id="name"
          value={newPublication.name}
          onChange={onInputChange('name')}
          placeholder="Enter publication name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={newPublication.category}
          onChange={onInputChange('category')}
          placeholder="e.g., News, Business, Technology"
        />
      </div>

      <div>
        <Label htmlFor="tier">Tier</Label>
        <Select value={newPublication.tier} onValueChange={onSelectChange('tier')}>
          <SelectTrigger>
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="tier2">Tier 2</SelectItem>
            <SelectItem value="tier1">Tier 1</SelectItem>
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
            onChange={onNumberChange('price')}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="tat_days">TAT</Label>
          <Input
            id="tat_days"
            value={newPublication.tat_days}
            onChange={onInputChange('tat_days')}
            placeholder="e.g., 1-2 Weeks"
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
            onChange={onNumberChange('da_score')}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="dr_score">DR Score</Label>
          <Input
            id="dr_score"
            type="number"
            value={newPublication.dr_score || ""}
            onChange={onNumberChange('dr_score')}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website_url">Website URL</Label>
        <div className="flex gap-2">
          <Input
            id="website_url"
            value={newPublication.website_url}
            onChange={onInputChange('website_url')}
            placeholder="https://example.com"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onFetchLogo}
            disabled={!newPublication.website_url || fetchingLogo}
          >
            {fetchingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={newPublication.location || ""}
          onChange={onInputChange('location')}
          placeholder="e.g., United States, Global"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newPublication.description}
          onChange={onInputChange('description')}
          placeholder="Publication description"
          rows={3}
        />
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <Label>Publication Features</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dofollow_link"
              checked={newPublication.dofollow_link}
              onCheckedChange={onCheckboxChange('dofollow_link')}
            />
            <Label htmlFor="dofollow_link">Dofollow Link</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sponsored"
              checked={newPublication.sponsored}
              onCheckedChange={onCheckboxChange('sponsored')}
            />
            <Label htmlFor="sponsored">Sponsored Content</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="indexed"
              checked={newPublication.indexed}
              onCheckedChange={onCheckboxChange('indexed')}
            />
            <Label htmlFor="indexed">Indexed by Search Engines</Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Content Restrictions</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="erotic"
              checked={newPublication.erotic}
              onCheckedChange={onCheckboxChange('erotic')}
            />
            <Label htmlFor="erotic">Erotic Content Allowed</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="health"
              checked={newPublication.health}
              onCheckedChange={onCheckboxChange('health')}
            />
            <Label htmlFor="health">Health Content Allowed</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cbd"
              checked={newPublication.cbd}
              onCheckedChange={onCheckboxChange('cbd')}
            />
            <Label htmlFor="cbd">CBD Content Allowed</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="crypto"
              checked={newPublication.crypto}
              onCheckedChange={onCheckboxChange('crypto')}
            />
            <Label htmlFor="crypto">Crypto Content Allowed</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gambling"
              checked={newPublication.gambling}
              onCheckedChange={onCheckboxChange('gambling')}
            />
            <Label htmlFor="gambling">Gambling Content Allowed</Label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
  const [fetchingLogo, setFetchingLogo] = useState(false);
  const [quickAddName, setQuickAddName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        .order('popularity', { ascending: false });

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

  const handleFetchLogo = async () => {
    if (!newPublication.website_url) return;
    
    setFetchingLogo(true);
    try {
      const logoUrl = await BrandFetchService.getLogoWithFallback(newPublication.website_url);
      toast({
        title: "Success",
        description: "Logo fetched successfully",
      });
      // Note: In a real implementation, you'd save this logoUrl to the publication
      console.log("Fetched logo URL:", logoUrl);
    } catch (error) {
      console.error('Error fetching logo:', error);
      toast({
        title: "Warning",
        description: "Could not fetch logo automatically",
        variant: "destructive"
      });
    } finally {
      setFetchingLogo(false);
    }
  };

  const handleQuickAdd = async () => {
    if (!quickAddName.trim()) return;
    
    setUploading(true);
    try {
      // Try to fetch logo if it looks like a website URL
      let logoUrl = null;
      const websiteUrl = quickAddName.includes('.') ? `https://${quickAddName}` : null;
      
      if (websiteUrl) {
        try {
          logoUrl = await BrandFetchService.getLogoWithFallback(websiteUrl);
        } catch (error) {
          console.log("Could not fetch logo for:", websiteUrl);
        }
      }

      const publicationData = {
        external_id: crypto.randomUUID(),
        name: quickAddName.trim(),
        type: 'standard',
        category: 'News',
        price: 0,
        tat_days: '1-2 Weeks',
        description: '',
        features: [],
        website_url: websiteUrl,
        logo_url: logoUrl,
        tier: 'standard',
        da_score: 0,
        dr_score: 0,
        location: '',
        dofollow_link: false,
        sponsored: false,
        indexed: true,
        erotic: false,
        health: false,
        cbd: false,
        crypto: false,
        gambling: false,
        is_active: true,
        popularity: 0,
      };

      const { error } = await supabase
        .from('publications')
        .insert([publicationData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication added successfully",
      });

      setQuickAddName("");
      fetchPublications();
    } catch (error) {
      console.error('Error adding publication:', error);
      toast({
        title: "Error",
        description: "Failed to add publication",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPublication = async () => {
    try {
      if (!newPublication.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Publication name is required",
          variant: "destructive"
        });
        return;
      }

      if (!newPublication.category.trim()) {
        toast({
          title: "Validation Error", 
          description: "Category is required",
          variant: "destructive"
        });
        return;
      }

      const publicationData = {
        external_id: crypto.randomUUID(),
        name: newPublication.name.trim(),
        type: newPublication.type || 'standard',
        category: newPublication.category.trim(),
        price: Math.max(0, parseInt(newPublication.price.toString()) || 0),
        tat_days: newPublication.tat_days.trim() || '1-2 Weeks',
        description: newPublication.description.trim(),
        features: newPublication.features ? newPublication.features.split(',').map(f => f.trim()).filter(f => f) : [],
        website_url: newPublication.website_url?.trim() || null,
        tier: newPublication.tier || 'standard',
        da_score: Math.max(0, parseInt(newPublication.da_score?.toString() || '0') || 0),
        dr_score: Math.max(0, parseInt(newPublication.dr_score?.toString() || '0') || 0),
        location: newPublication.location?.trim() || null,
        dofollow_link: Boolean(newPublication.dofollow_link),
        sponsored: Boolean(newPublication.sponsored),
        indexed: Boolean(newPublication.indexed),
        erotic: Boolean(newPublication.erotic),
        health: Boolean(newPublication.health),
        cbd: Boolean(newPublication.cbd),
        crypto: Boolean(newPublication.crypto),
        gambling: Boolean(newPublication.gambling),
        is_active: true,
        popularity: 0,
      };

      const { error } = await supabase
        .from('publications')
        .insert([publicationData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication added successfully",
      });

      setNewPublication(defaultPublication);
      setIsAddDialogOpen(false);
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

  const handleCSVUpload = async () => {
    if (!csvFile) return;

    setUploading(true);
    try {
      const text = await csvFile.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const publications: any[] = [];
      
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length < headers.length || !values[1]) continue; // Skip if no publication name
        
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Convert boolean values
        const convertBoolean = (value: string) => {
          const val = value.toUpperCase();
          return val === 'Y' || val === 'YES' || val === 'TRUE' || val === 'DISCREET';
        };

        const publication = {
          external_id: crypto.randomUUID(),
          name: row.PUBLICATION || '',
          type: 'standard',
          category: row.GENRE || 'News',
          price: parseInt(row.Price) || 0,
          tat_days: row.TAT || '1-2 Weeks',
          description: '',
          features: [],
          website_url: null,
          tier: 'standard',
          da_score: parseInt(row.DA) || 0,
          dr_score: parseInt(row.DR) || 0,
          location: row['REGION / LOCATION'] || null,
          dofollow_link: convertBoolean(row.DOFOLLOW || ''),
          sponsored: convertBoolean(row.SPONSORED || ''),
          indexed: convertBoolean(row.INDEXED || 'Y'),
          erotic: convertBoolean(row.EROTIC || ''),
          health: convertBoolean(row.HEALTH || ''),
          cbd: convertBoolean(row.CBD || ''),
          crypto: convertBoolean(row.CRYPTO || ''),
          gambling: convertBoolean(row.GAMBLING || ''),
          is_active: true,
          popularity: 0,
        };

        if (publication.name) {
          publications.push(publication);
        }
      }

      if (publications.length === 0) {
        toast({
          title: "Error",
          description: "No valid publications found in CSV",
          variant: "destructive"
        });
        return;
      }

      // Insert in batches
      const batchSize = 50;
      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        const { error } = await supabase
          .from('publications')
          .insert(batch);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${publications.length} publications`,
      });

      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchPublications();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Error",
        description: "Failed to upload CSV file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePublication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('publications')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publication deleted successfully",
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

  const handleImportRepositoryCSV = async () => {
    setUploading(true);
    try {
      // Fetch the CSV file from the repository
      const response = await fetch('/Just Featured PR Sheet - All Publications.csv');
      if (!response.ok) {
        throw new Error('CSV file not found in repository');
      }
      
      const text = await response.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const publications = [];
      for (let i = 2; i < lines.length; i++) { // Start from line 2 to skip the "WRITING COST IS INCLUDED" row
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV with proper comma handling for quoted values
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        const row: any = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            row[header] = values[index].trim().replace(/"/g, '');
          }
        });
        
        // Only process rows with actual publication data
        if (row.PUBLICATION && row.PUBLICATION !== '' && row.PRICE) {
          // Clean up the publication name
          row.PUBLICATION = row.PUBLICATION.replace(/^,+|,+$/g, '').trim();
          
          if (row.PUBLICATION !== '' && row.PUBLICATION !== 'PUBLICATION') {
            // Convert boolean values
            const convertBoolean = (value: string) => {
              if (!value) return false;
              const val = value.toUpperCase();
              return val === 'Y' || val === 'YES' || val === 'TRUE' || val === 'DISCREET';
            };

            // Parse price - remove $ symbol and convert to number
            const parsePrice = (priceStr: string) => {
              if (!priceStr) return 0;
              const cleaned = priceStr.replace(/[$,]/g, '');
              return parseInt(cleaned) || 0;
            };

            const publication = {
              external_id: crypto.randomUUID(),
              name: row.PUBLICATION,
              type: 'standard',
              category: row.GENRE || 'News',
              price: parsePrice(row.PRICE),
              tat_days: row.TAT || '1-2 Weeks',
              description: '',
              features: [],
              website_url: null,
              tier: 'standard',
              da_score: parseInt(row.DA) || 0,
              dr_score: parseInt(row.DR) || 0,
              location: row['REGION / LOCATION'] || null,
              dofollow_link: convertBoolean(row.DOFOLLOW),
              sponsored: convertBoolean(row.SPONSORED),
              indexed: convertBoolean(row.INDEXED || 'Y'),
              erotic: convertBoolean(row.EROTIC),
              health: convertBoolean(row.HEALTH),
              cbd: convertBoolean(row.CBD),
              crypto: convertBoolean(row.CRYPTO),
              gambling: convertBoolean(row.GAMBLING),
              is_active: true,
              popularity: 0,
            };

            publications.push(publication);
          }
        }
      }

      console.log(`Found ${publications.length} publications to import`);
      
      if (publications.length === 0) {
        toast({
          title: "Error",
          description: "No valid publications found in CSV",
          variant: "destructive"
        });
        return;
      }
      
      // Import in batches to avoid overwhelming the database
      const batchSize = 50;
      let importedCount = 0;
      
      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        const { error } = await supabase.from('publications').insert(batch);
        
        if (error) {
          console.error('Error importing batch:', error);
          throw error;
        }
        
        importedCount += batch.length;
        console.log(`Imported ${importedCount}/${publications.length} publications`);
      }
      
      toast({
        title: "Success",
        description: `Successfully imported ${importedCount} publications from repository!`,
      });
      
      fetchPublications();
    } catch (error: any) {
      console.error('Error importing repository CSV:', error);
      toast({
        title: "Error",
        description: `Failed to import repository CSV: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      // Create CSV headers
      const headers = [
        'Publication Name',
        'Category',
        'Tier',
        'Price',
        'TAT',
        'DA Score',
        'DR Score',
        'Location',
        'Website URL',
        'Dofollow Link',
        'Sponsored',
        'Indexed',
        'Erotic',
        'Health',
        'CBD',
        'Crypto',
        'Gambling',
        'Created At',
        'Updated At'
      ];

      // Convert publications to CSV format
      const csvData = filteredPublications.map(pub => [
        pub.name,
        pub.category,
        pub.tier,
        pub.price,
        pub.tat_days,
        pub.da_score || 0,
        pub.dr_score || 0,
        pub.location || '',
        pub.website_url || '',
        pub.dofollow_link ? 'Y' : 'N',
        pub.sponsored ? 'Y' : 'N',
        pub.indexed ? 'Y' : 'N',
        pub.erotic ? 'Y' : 'N',
        pub.health ? 'Y' : 'N',
        pub.cbd ? 'Y' : 'N',
        pub.crypto ? 'Y' : 'N',
        pub.gambling ? 'Y' : 'N',
        pub.created_at || '',
        pub.updated_at || ''
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `publications_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Exported ${filteredPublications.length} publications to CSV`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}k`;
    }
    return `$${price}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'tier2': return 'bg-blue-100 text-blue-800';
      case 'tier1': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Event handlers
  const handleInputChange = useCallback((field: keyof NewPublication) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewPublication(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }, []);

  const handleNumberChange = useCallback((field: keyof NewPublication) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewPublication(prev => ({
        ...prev,
        [field]: value === '' ? undefined : Number(value)
      }));
    }, []);

  const handleSelectChange = useCallback((field: keyof NewPublication) => 
    (value: string) => {
      setNewPublication(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);

  const handleCheckboxChange = useCallback((field: keyof NewPublication) => 
    (checked: boolean) => {
      setNewPublication(prev => ({
        ...prev,
        [field]: checked
      }));
    }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Publication Management</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Publication</DialogTitle>
                <DialogDescription>
                  Add a new publication to the database
                </DialogDescription>
              </DialogHeader>
              <PublicationForm
                newPublication={newPublication}
                onInputChange={handleInputChange}
                onNumberChange={handleNumberChange}
                onSelectChange={handleSelectChange}
                onCheckboxChange={handleCheckboxChange}
                onFetchLogo={handleFetchLogo}
                fetchingLogo={fetchingLogo}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPublication}>Add Publication</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Add Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Add Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter publication name or website URL"
              value={quickAddName}
              onChange={(e) => setQuickAddName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            />
            <Button 
              onClick={handleQuickAdd}
              disabled={!quickAddName.trim() || uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CSV Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CSV Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button 
                onClick={handleCSVUpload}
                disabled={!csvFile || uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Import Repository Publications</h3>
                  <p className="text-sm text-muted-foreground">
                    Import all publications from the repository CSV file
                  </p>
                </div>
                <Button 
                  onClick={handleImportRepositoryCSV}
                  disabled={uploading}
                  variant="outline"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Import All Publications
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="tier2">Tier 2</SelectItem>
              <SelectItem value="tier1">Tier 1</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Publications Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publication</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>DA/DR</TableHead>
                <TableHead>TAT</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPublications.map((publication) => (
                <TableRow key={publication.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{publication.name}</div>
                      {publication.location && (
                        <div className="text-sm text-gray-500">{publication.location}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{publication.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTierColor(publication.tier)}>
                      {publication.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(publication.price)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>DA: {publication.da_score || 0}</div>
                      <div>DR: {publication.dr_score || 0}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{publication.tat_days}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {publication.dofollow_link && (
                        <Badge variant="secondary" className="text-xs">Dofollow</Badge>
                      )}
                      {publication.sponsored && (
                        <Badge variant="secondary" className="text-xs">Sponsored</Badge>
                      )}
                      {publication.indexed && (
                        <Badge variant="secondary" className="text-xs">Indexed</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePublication(publication.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredPublications.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No publications found</p>
        </div>
      )}
    </div>
  );
};