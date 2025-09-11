import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Publication } from '@/types';

interface PublicationEditDialogProps {
  publication: Publication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const PublicationEditDialog = ({ publication, isOpen, onClose, onUpdate }: PublicationEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Publication>>(publication || {});
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when publication changes
  useEffect(() => {
    if (publication) {
      setFormData(publication);
    }
  }, [publication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publication?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('publications')
        .update({
          name: formData.name,
          category: formData.category,
          price: formData.price,
          da_score: formData.da_score,
          dr_score: formData.dr_score,
          tat_days: formData.tat_days,
          location: formData.location,
          sponsored: formData.sponsored,
          indexed: formData.indexed,
          dofollow_link: formData.dofollow_link,
          erotic: formData.erotic,
          health: formData.health,
          cbd: formData.cbd,
          crypto: formData.crypto,
          gambling: formData.gambling,
          is_active: formData.is_active,
          type: formData.type,
          tier: formData.tier,
          popularity: formData.popularity,
          logo_url: formData.logo_url,
          website_url: formData.website_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', publication.id);

      if (error) throw error;

      toast.success('Publication updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating publication:', error);
      toast.error('Failed to update publication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Publication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Publication: {publication?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Publication Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || 0}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tat_days">Turnaround Time</Label>
              <Input
                id="tat_days"
                value={formData.tat_days || ''}
                onChange={(e) => handleChange('tat_days', e.target.value)}
                placeholder="e.g., 1-3 Days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="da_score">DA Score</Label>
              <Input
                id="da_score"
                type="number"
                value={formData.da_score || 0}
                onChange={(e) => handleChange('da_score', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dr_score">DR Score</Label>
              <Input
                id="dr_score"
                type="number"
                value={formData.dr_score || 0}
                onChange={(e) => handleChange('dr_score', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., UNITED STATES"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="popularity">Popularity Score</Label>
              <Input
                id="popularity"
                type="number"
                value={formData.popularity || 0}
                onChange={(e) => handleChange('popularity', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type || ''} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="tier1">Tier 1</SelectItem>
                  <SelectItem value="tier2">Tier 2</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select value={formData.tier || ''} onValueChange={(value) => handleChange('tier', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="tier1">Tier 1</SelectItem>
                  <SelectItem value="tier2">Tier 2</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url || ''}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url || ''}
                onChange={(e) => handleChange('website_url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features & Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active || false}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sponsored"
                  checked={formData.sponsored || false}
                  onCheckedChange={(checked) => handleChange('sponsored', checked)}
                />
                <Label htmlFor="sponsored">Sponsored</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="indexed"
                  checked={formData.indexed || false}
                  onCheckedChange={(checked) => handleChange('indexed', checked)}
                />
                <Label htmlFor="indexed">Indexed</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dofollow_link"
                  checked={formData.dofollow_link || false}
                  onCheckedChange={(checked) => handleChange('dofollow_link', checked)}
                />
                <Label htmlFor="dofollow_link">DoFollow Link</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="erotic"
                  checked={formData.erotic || false}
                  onCheckedChange={(checked) => handleChange('erotic', checked)}
                />
                <Label htmlFor="erotic">Adult Content</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="health"
                  checked={formData.health || false}
                  onCheckedChange={(checked) => handleChange('health', checked)}
                />
                <Label htmlFor="health">Health</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cbd"
                  checked={formData.cbd || false}
                  onCheckedChange={(checked) => handleChange('cbd', checked)}
                />
                <Label htmlFor="cbd">CBD</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="crypto"
                  checked={formData.crypto || false}
                  onCheckedChange={(checked) => handleChange('crypto', checked)}
                />
                <Label htmlFor="crypto">Cryptocurrency</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="gambling"
                  checked={formData.gambling || false}
                  onCheckedChange={(checked) => handleChange('gambling', checked)}
                />
                <Label htmlFor="gambling">Gambling</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};