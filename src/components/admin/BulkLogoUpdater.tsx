import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const BulkLogoUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePublicationLogos = async () => {
    setIsUpdating(true);
    try {
      // Get all publications without logos
      const { data: publications, error: fetchError } = await supabase
        .from('publications')
        .select('id, name')
        .is('logo_url', null);

      if (fetchError) throw fetchError;

      if (!publications || publications.length === 0) {
        toast.success('All publications already have logos!');
        setIsUpdating(false);
        return;
      }

      // Update each publication with a generated logo
      for (const pub of publications) {
        const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(pub.name)}&background=e2e8f0&color=475569&size=64`;
        
        const { error: updateError } = await supabase
          .from('publications')
          .update({ logo_url: logoUrl })
          .eq('id', pub.id);

        if (updateError) {
          console.error(`Failed to update logo for ${pub.name}:`, updateError);
        }
      }

      toast.success(`Updated logos for ${publications.length} publications!`);
    } catch (error) {
      console.error('Error updating publication logos:', error);
      toast.error('Failed to update publication logos');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Bulk Logo Updater
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Update logos for publications that don't have them using generated avatars.
        </p>
        <Button 
          onClick={updatePublicationLogos}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? "Updating..." : "Update Publication Logos"}
        </Button>
      </CardContent>
    </Card>
  );
};