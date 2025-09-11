import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Database,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

interface BulkEditOperation {
  type: 'update' | 'delete';
  publications: Publication[];
  changes?: Partial<Publication>;
}

export const PublicationBulkEditor = () => {
  const { toast } = useToast();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkChanges, setBulkChanges] = useState<Partial<Publication>>({});

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    filterPublications();
  }, [publications, searchTerm, categoryFilter, tierFilter]);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPublications(data || []);
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

  const filterPublications = () => {
    let filtered = publications;

    if (searchTerm) {
      filtered = filtered.filter(pub => 
        pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pub => pub.category === categoryFilter);
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(pub => pub.tier === tierFilter);
    }

    setFilteredPublications(filtered);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPublications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPublications.map(pub => pub.id));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select publications to update",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(bulkChanges).length === 0) {
      toast({
        title: "No Changes",
        description: "Please specify changes to apply",
        variant: "destructive"
      });
      return;
    }

    try {
      // Filter out undefined values
      const cleanChanges = Object.fromEntries(
        Object.entries(bulkChanges).filter(([_, value]) => value !== undefined && value !== '')
      );

      const { error } = await supabase
        .from('publications')
        .update(cleanChanges)
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedIds.length} publications`,
      });

      // Refresh data
      await fetchPublications();
      setSelectedIds([]);
      setBulkChanges({});
      setBulkEditMode(false);
    } catch (error) {
      console.error('Error updating publications:', error);
      toast({
        title: "Error",
        description: "Failed to update publications",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select publications to delete",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} publications? This action cannot be undone.`)) {
      return;
    }

    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('publications')
        .update({ is_active: false })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${selectedIds.length} publications`,
      });

      // Refresh data
      await fetchPublications();
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting publications:', error);
      toast({
        title: "Error",
        description: "Failed to delete publications",
        variant: "destructive"
      });
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(publications.map(pub => pub.category).filter(Boolean))];
    return categories.sort();
  };

  const getUniqueTiers = () => {
    const tiers = [...new Set(publications.map(pub => pub.tier).filter(Boolean))];
    return tiers.sort();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Publication Bulk Editor</h2>
          <p className="text-muted-foreground">Select and edit multiple publications at once</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <Badge variant="secondary">
              {selectedIds.length} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters and Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {getUniqueTiers().map(tier => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setBulkEditMode(!bulkEditMode)}
              variant={bulkEditMode ? "default" : "outline"}
            >
              <Edit className="w-4 h-4 mr-2" />
              {bulkEditMode ? 'Exit' : 'Bulk Edit'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Edit Panel */}
      {bulkEditMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Bulk Edit Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="bulk-category">Category</Label>
                <Select 
                  value={bulkChanges.category || ''} 
                  onValueChange={(value) => setBulkChanges(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="bulk-category">
                    <SelectValue placeholder="Change category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No change</SelectItem>
                    {getUniqueCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bulk-tier">Tier</Label>
                <Select 
                  value={bulkChanges.tier || ''} 
                  onValueChange={(value) => setBulkChanges(prev => ({ ...prev, tier: value }))}
                >
                  <SelectTrigger id="bulk-tier">
                    <SelectValue placeholder="Change tier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No change</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bulk-price">Price</Label>
                <Input
                  id="bulk-price"
                  type="number"
                  placeholder="New price..."
                  value={bulkChanges.price || ''}
                  onChange={(e) => setBulkChanges(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Changes will be applied to {selectedIds.length} selected publications
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
                <Button
                  onClick={handleBulkUpdate}
                  size="sm"
                  disabled={selectedIds.length === 0 || Object.keys(bulkChanges).length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publications Table */}
      <Card>
        <CardContent>
          {filteredPublications.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Publications Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || tierFilter !== 'all'
                  ? "No publications match your current filters."
                  : "No publications available."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === filteredPublications.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>DA/DR</TableHead>
                    <TableHead>Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublications.map((publication) => (
                    <TableRow key={publication.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(publication.id)}
                          onCheckedChange={() => toggleSelection(publication.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{publication.name}</div>
                        {publication.website_url && (
                          <div className="text-sm text-muted-foreground">
                            {publication.website_url}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{publication.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{publication.tier}</Badge>
                      </TableCell>
                      <TableCell>${publication.price}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          DA: {publication.da_score} / DR: {publication.dr_score}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {publication.dofollow_link && <Badge className="text-xs">Dofollow</Badge>}
                          {publication.sponsored && <Badge className="text-xs">Sponsored</Badge>}
                          {publication.indexed && <Badge className="text-xs">Indexed</Badge>}
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
    </div>
  );
};