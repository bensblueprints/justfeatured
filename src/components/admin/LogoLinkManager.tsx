import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LogoLinkService } from "@/utils/logoLink";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, Image } from "lucide-react";

interface LogoLinkResult {
  id: string;
  name: string;
  website_url: string;
  status: 'pending' | 'success' | 'failed' | 'skipped';
  logoLinkUrl?: string;
  error?: string;
}

export const LogoLinkManager: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<LogoLinkResult[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, skipped: 0 });

  const generateLogoLinks = async () => {
    setIsProcessing(true);
    setProgress(0);
    setResults([]);
    setStats({ total: 0, success: 0, failed: 0, skipped: 0 });

    try {
      // Fetch publications that need Logo Link URLs
      const { data: publications, error } = await supabase
        .from('publications')
        .select('id, name, website_url, logo_link_url')
        .not('website_url', 'is', null)
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw error;
      }

      if (!publications || publications.length === 0) {
        toast.info("No publications found with website URLs");
        return;
      }

      const total = publications.length;
      setStats(prev => ({ ...prev, total }));

      // Initialize results
      const initialResults: LogoLinkResult[] = publications.map(pub => ({
        id: pub.id,
        name: pub.name,
        website_url: pub.website_url,
        status: 'pending'
      }));
      setResults(initialResults);

      // Process publications in batches
      const batchSize = 5;
      let processed = 0;
      let successCount = 0;
      let failedCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (publication) => {
          try {
            // Skip if Logo Link URL already exists
            if (publication.logo_link_url) {
              setResults(prev => prev.map(r => 
                r.id === publication.id 
                  ? { ...r, status: 'skipped' as const, logoLinkUrl: publication.logo_link_url }
                  : r
              ));
              skippedCount++;
              return;
            }

            // Generate Logo Link URL
            const logoLinkUrl = LogoLinkService.getLogoLinkUrl(publication.website_url, {
              type: 'icon',
              theme: 'light',
              fallback: true
            });

            if (!logoLinkUrl) {
              throw new Error('Failed to generate Logo Link URL');
            }

            // Update publication in database
            const { error: updateError } = await supabase
              .from('publications')
              .update({ logo_link_url: logoLinkUrl })
              .eq('id', publication.id);

            if (updateError) {
              throw updateError;
            }

            // Update result
            setResults(prev => prev.map(r => 
              r.id === publication.id 
                ? { ...r, status: 'success' as const, logoLinkUrl }
                : r
            ));
            successCount++;

          } catch (error) {
            console.error(`Error processing ${publication.name}:`, error);
            setResults(prev => prev.map(r => 
              r.id === publication.id 
                ? { 
                    ...r, 
                    status: 'failed' as const, 
                    error: error instanceof Error ? error.message : 'Unknown error'
                  }
                : r
            ));
            failedCount++;
          }
        });

        await Promise.all(batchPromises);
        processed += batch.length;
        
        setProgress((processed / total) * 100);
        setStats({ total, success: successCount, failed: failedCount, skipped: skippedCount });

        // Small delay between batches
        if (i + batchSize < publications.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      toast.success(`Logo Link generation completed! ${successCount} updated, ${skippedCount} skipped, ${failedCount} failed`);

    } catch (error) {
      console.error('Error in Logo Link generation:', error);
      toast.error("Failed to generate Logo Links");
    } finally {
      setIsProcessing(false);
    }
  };

  const retryFailed = async () => {
    const failedResults = results.filter(r => r.status === 'failed');
    
    if (failedResults.length === 0) {
      toast.info("No failed items to retry");
      return;
    }

    // Reset failed items to pending
    setResults(prev => prev.map(r => 
      r.status === 'failed' ? { ...r, status: 'pending' as const, error: undefined } : r
    ));

    // Process failed items
    for (const result of failedResults) {
      try {
        const logoLinkUrl = LogoLinkService.getLogoLinkUrl(result.website_url, {
          type: 'icon',
          theme: 'light',
          fallback: true
        });

        if (!logoLinkUrl) {
          throw new Error('Failed to generate Logo Link URL');
        }

        const { error: updateError } = await supabase
          .from('publications')
          .update({ logo_link_url: logoLinkUrl })
          .eq('id', result.id);

        if (updateError) {
          throw updateError;
        }

        setResults(prev => prev.map(r => 
          r.id === result.id 
            ? { ...r, status: 'success' as const, logoLinkUrl }
            : r
        ));
        
        setStats(prev => ({ 
          ...prev, 
          success: prev.success + 1, 
          failed: prev.failed - 1 
        }));

      } catch (error) {
        setResults(prev => prev.map(r => 
          r.id === result.id 
            ? { 
                ...r, 
                status: 'failed' as const, 
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            : r
        ));
      }

      // Small delay between retries
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast.success("Retry completed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Logo Link Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={generateLogoLinks} 
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate Logo Links
          </Button>
          
          {results.some(r => r.status === 'failed') && (
            <Button 
              variant="outline" 
              onClick={retryFailed}
              disabled={isProcessing}
            >
              Retry Failed
            </Button>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Processing publications...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {stats.total > 0 && (
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-muted-foreground">Success</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.skipped}</div>
              <div className="text-sm text-muted-foreground">Skipped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <h4 className="font-medium">Results:</h4>
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {result.logoLinkUrl && (
                    <img 
                      src={result.logoLinkUrl} 
                      alt={result.name}
                      className="w-8 h-8 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.website_url}</div>
                    {result.error && (
                      <div className="text-sm text-red-600">{result.error}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      result.status === 'success' ? 'default' :
                      result.status === 'failed' ? 'destructive' :
                      result.status === 'skipped' ? 'secondary' :
                      'outline'
                    }
                  >
                    {result.status}
                  </Badge>
                  {result.logoLinkUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.logoLinkUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};