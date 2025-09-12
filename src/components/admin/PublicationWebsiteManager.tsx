import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface WebsiteResult {
  id: string;
  name: string;
  status: 'success' | 'not_found' | 'error' | 'invalid_url' | 'update_error';
  url?: string;
  error?: string;
  logoFetched?: boolean;
}

export const PublicationWebsiteManager = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<WebsiteResult[]>([]);
  const { toast } = useToast();

  const findWebsites = async (batchSize: number = 10) => {
    setIsSearching(true);
    setResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('find-publication-websites', {
        body: { batchSize }
      });

      if (error) {
        console.error('Error finding websites:', error);
        toast({
          title: "Error",
          description: "Failed to search for websites. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setResults(data.results || []);
      
      const logoCount = data.results?.filter((r: any) => r.logoFetched).length || 0;
      toast({
        title: "Website Search Complete",
        description: `Processed ${data.processed} publications. Found ${data.successful} websites and ${logoCount} logos.`,
      });
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not_found':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      case 'error':
      case 'update_error':
      case 'invalid_url':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'not_found':
        return <Badge variant="secondary">Not Found</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'invalid_url':
        return <Badge variant="destructive">Invalid URL</Badge>;
      case 'update_error':
        return <Badge variant="destructive">Update Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Publication Website Manager
        </CardTitle>
        <CardDescription>
          Use AI to automatically find and populate website URLs for publications that are missing them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={() => findWebsites(10)} 
            disabled={isSearching}
            className="flex items-center gap-2"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isSearching ? 'Searching...' : 'Find Websites (Batch of 10)'}
          </Button>
          
          <Button 
            onClick={() => findWebsites(25)} 
            disabled={isSearching}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Large Batch (25)
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Results:</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium">{result.name}</div>
                      {result.url && (
                        <div className="text-sm text-muted-foreground truncate">
                          {result.url}
                        </div>
                      )}
                      {result.logoFetched !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          Logo: {result.logoFetched ? '✓ Fetched' : '✗ Failed/Fallback'}
                        </div>
                      )}
                      {result.error && (
                        <div className="text-sm text-red-600">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};