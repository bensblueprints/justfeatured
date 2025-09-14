import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface Publication {
  id: string;
  name: string;
  category: string;
  type?: string;
  tier?: string;
  monthly_readers: number;
  price: number;
  contact_info: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  tat_days?: string;
  location?: string;
  da_score?: number;
  dr_score?: number;
  dofollow_link?: boolean;
  sponsored?: boolean;
  indexed?: boolean;
  erotic?: boolean;
  health?: boolean;
  cbd?: boolean;
  crypto?: boolean;
  gambling?: boolean;
  popularity?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export function PublicationManagement() {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'standard',
    tier: 'standard',
    monthly_readers: 0,
    price: 0,
    contact_info: '',
    logo_url: '',
    website_url: '',
    description: '',
    tat_days: '1-3 Days',
    location: 'GLOBAL',
    da_score: 0,
    dr_score: 0,
    dofollow_link: false,
    sponsored: false,
    indexed: true,
    erotic: false,
    health: false,
    cbd: false,
    crypto: false,
    gambling: false,
    popularity: 50,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPublication) {
        const { error } = await supabase
          .from('publications')
          .update(formData)
          .eq('id', editingPublication.id);

        if (error) throw error;
        toast.success('Publication updated successfully');
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([formData]);

        if (error) throw error;
        toast.success('Publication created successfully');
      }

      setIsDialogOpen(false);
      setEditingPublication(null);
      resetForm();
      fetchPublications();
    } catch (error) {
      console.error('Error saving publication:', error);
      toast.error('Failed to save publication');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Publication deleted successfully');
      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      name: publication.name,
      category: publication.category,
      type: publication.type || 'standard',
      tier: publication.tier || 'standard',
      monthly_readers: publication.monthly_readers,
      price: publication.price,
      contact_info: publication.contact_info,
      logo_url: publication.logo_url || '',
      website_url: publication.website_url || '',
      description: publication.description || '',
      tat_days: publication.tat_days || '1-3 Days',
      location: publication.location || 'GLOBAL',
      da_score: publication.da_score || 0,
      dr_score: publication.dr_score || 0,
      dofollow_link: publication.dofollow_link || false,
      sponsored: publication.sponsored || false,
      indexed: publication.indexed !== false,
      erotic: publication.erotic || false,
      health: publication.health || false,
      cbd: publication.cbd || false,
      crypto: publication.crypto || false,
      gambling: publication.gambling || false,
      popularity: publication.popularity || 50,
      status: publication.status
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      type: 'standard',
      tier: 'standard',
      monthly_readers: 0,
      price: 0,
      contact_info: '',
      logo_url: '',
      website_url: '',
      description: '',
      tat_days: '1-3 Days',
      location: 'GLOBAL',
      da_score: 0,
      dr_score: 0,
      dofollow_link: false,
      sponsored: false,
      indexed: true,
      erotic: false,
      health: false,
      cbd: false,
      crypto: false,
      gambling: false,
      popularity: 50,
      status: 'active'
    });
    setEditingPublication(null);
  };

  if (loading) {
    return <div>Loading publications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Publications Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Website
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPublication ? 'Edit Publication' : 'Add New Publication'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Publication Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category/Genre</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="tier1">Tier 1</SelectItem>
                        <SelectItem value="tier2">Tier 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the publication"
                  />
                </div>
              </div>

              <Separator />

              {/* Pricing & Metrics */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Pricing & Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly_readers">Monthly Readers</Label>
                    <Input
                      id="monthly_readers"
                      type="number"
                      value={formData.monthly_readers}
                      onChange={(e) => setFormData({ ...formData, monthly_readers: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="da_score">DA Score</Label>
                    <Input
                      id="da_score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.da_score}
                      onChange={(e) => setFormData({ ...formData, da_score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dr_score">DR Score</Label>
                    <Input
                      id="dr_score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.dr_score}
                      onChange={(e) => setFormData({ ...formData, dr_score: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="popularity">Popularity (1-100)</Label>
                    <Input
                      id="popularity"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.popularity}
                      onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tat_days">Turnaround Time</Label>
                    <Select value={formData.tat_days} onValueChange={(value) => setFormData({ ...formData, tat_days: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3 Days">1-3 Days</SelectItem>
                        <SelectItem value="1 Week">1 Week</SelectItem>
                        <SelectItem value="1-2 Weeks">1-2 Weeks</SelectItem>
                        <SelectItem value="2-4 Weeks">2-4 Weeks</SelectItem>
                        <SelectItem value="1 Month">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact & URLs */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Contact & URLs</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="contact_info">Contact Info</Label>
                    <Input
                      id="contact_info"
                      value={formData.contact_info}
                      onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                      placeholder="Email or contact information"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location/Region</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="GLOBAL, USA, Europe, etc."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Features & Restrictions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Features & Link Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dofollow_link"
                      checked={formData.dofollow_link}
                      onCheckedChange={(checked) => setFormData({ ...formData, dofollow_link: !!checked })}
                    />
                    <Label htmlFor="dofollow_link">Dofollow Link</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sponsored"
                      checked={formData.sponsored}
                      onCheckedChange={(checked) => setFormData({ ...formData, sponsored: !!checked })}
                    />
                    <Label htmlFor="sponsored">Sponsored</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indexed"
                      checked={formData.indexed}
                      onCheckedChange={(checked) => setFormData({ ...formData, indexed: !!checked })}
                    />
                    <Label htmlFor="indexed">Indexed</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Content Restrictions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Content Restrictions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="health"
                      checked={formData.health}
                      onCheckedChange={(checked) => setFormData({ ...formData, health: !!checked })}
                    />
                    <Label htmlFor="health">Health Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cbd"
                      checked={formData.cbd}
                      onCheckedChange={(checked) => setFormData({ ...formData, cbd: !!checked })}
                    />
                    <Label htmlFor="cbd">CBD Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="crypto"
                      checked={formData.crypto}
                      onCheckedChange={(checked) => setFormData({ ...formData, crypto: !!checked })}
                    />
                    <Label htmlFor="crypto">Crypto Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gambling"
                      checked={formData.gambling}
                      onCheckedChange={(checked) => setFormData({ ...formData, gambling: !!checked })}
                    />
                    <Label htmlFor="gambling">Gambling Content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="erotic"
                      checked={formData.erotic}
                      onCheckedChange={(checked) => setFormData({ ...formData, erotic: !!checked })}
                    />
                    <Label htmlFor="erotic">Erotic Content</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPublication ? 'Update Publication' : 'Create Publication'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {publications.map((publication) => (
          <Card key={publication.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{publication.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={publication.status === 'active' ? 'default' : 'secondary'}>
                  {publication.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => handleEdit(publication)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(publication.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {publication.category}
                </div>
                <div>
                  <strong>Type:</strong> {publication.type || 'Standard'}
                </div>
                <div>
                  <strong>Monthly Readers:</strong> {publication.monthly_readers.toLocaleString()}
                </div>
                <div>
                  <strong>Price:</strong> ${publication.price}
                </div>
                <div>
                  <strong>DA/DR:</strong> {publication.da_score || 0}/{publication.dr_score || 0}
                </div>
                <div>
                  <strong>TAT:</strong> {publication.tat_days || '1-3 Days'}
                </div>
                <div>
                  <strong>Contact:</strong> {publication.contact_info}
                </div>
                <div>
                  <strong>Location:</strong> {publication.location || 'GLOBAL'}
                </div>
              </div>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-1 mt-3">
                {publication.dofollow_link && <Badge variant="secondary" className="text-xs">Dofollow</Badge>}
                {publication.sponsored && <Badge variant="secondary" className="text-xs">Sponsored</Badge>}
                {publication.indexed && <Badge variant="secondary" className="text-xs">Indexed</Badge>}
                {publication.health && <Badge variant="destructive" className="text-xs">Health</Badge>}
                {publication.cbd && <Badge variant="destructive" className="text-xs">CBD</Badge>}
                {publication.crypto && <Badge variant="destructive" className="text-xs">Crypto</Badge>}
                {publication.gambling && <Badge variant="destructive" className="text-xs">Gambling</Badge>}
                {publication.erotic && <Badge variant="destructive" className="text-xs">Erotic</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}