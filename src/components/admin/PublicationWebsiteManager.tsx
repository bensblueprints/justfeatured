import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Search, CheckCircle, XCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface WebsiteResult {
  id: string;
  name: string;
  status: 'success' | 'not_found' | 'error' | 'invalid_url' | 'update_error' | 'api_error';
  url?: string;
  error?: string;
  logoFetched?: boolean;
}

export const PublicationWebsiteManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<WebsiteResult[]>([]);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [currentItem, setCurrentItem] = useState('');
  const { toast } = useToast();

  // Get initial count
  useEffect(() => {
    const getInitialCount = async () => {
      try {
        const { data } = await supabase.functions.invoke('find-publication-websites', {
          body: { mode: 'count' }
        });
        if (data?.remaining) {
          setTotalRemaining(data.remaining);
        }
      } catch (error) {
        console.error('Error getting count:', error);
      }
    };
    getInitialCount();
  }, []);

  const processNextPublication = async (): Promise<boolean> => {
    if (isPaused) return false;

    try {
      const { data, error } = await supabase.functions.invoke('find-publication-websites', {
        body: { mode: 'single' }
      });

      if (error) {
        console.error('Error processing publication:', error);
        toast({
          title: "Error",
          description: "Failed to process publication. Stopping.",
          variant: "destructive",
        });
        return false;
      }

      if (data.completed) {
        toast({
          title: "All Complete!",
          description: "All publications have been processed successfully.",
        });
        return false;
      }

      if (data.result) {
        setResults(prev => [data.result, ...prev.slice(0, 9)]); // Keep last 10 results
        setCurrentItem(data.result.name);
        setProcessed(prev => prev + 1);
        setTotalRemaining(data.remaining || 0);
      }

      return data.hasMore;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Stopping.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setIsPaused(false);
    setResults([]);
    setProcessed(0);
    
    // Get fresh count
    try {
      const { data } = await supabase.functions.invoke('find-publication-websites', {
        body: { mode: 'count' }
      });
      if (data?.remaining) {
        setTotalRemaining(data.remaining);
      }
    } catch (error) {
      console.error('Error getting count:', error);
    }

    let hasMore = true;
    while (hasMore && !isPaused) {
      hasMore = await processNextPublication();
      if (hasMore) {
        // Wait 3 seconds between each publication
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    setIsProcessing(false);
    setCurrentItem('');
    
    if (!isPaused) {
      toast({
        title: "Processing Complete",
        description: `Finished processing all publications. ${processed} total processed.`,
      });
    }
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
    toast({
      title: "Processing Paused",
      description: "You can resume processing at any time.",
    });
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
      case 'api_error':
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
      case 'api_error':
        return <Badge variant="destructive">API Error</Badge>;
      case 'invalid_url':
        return <Badge variant="destructive">Invalid URL</Badge>;
      case 'update_error':
        return <Badge variant="destructive">Update Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const progressPercentage = totalRemaining > 0 ? ((processed / (processed + totalRemaining)) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          AI Publication Website Finder
        </CardTitle>
        <CardDescription>
          Automatically find and populate website URLs for publications one by one, then fetch their logos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        {(totalRemaining > 0 || processed > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {processed} processed, {totalRemaining} remaining</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            {isProcessing && currentItem && (
              <div className="text-sm text-muted-foreground">
                Currently processing: <span className="font-medium">{currentItem}</span>
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isProcessing ? (
            <Button 
              onClick={startProcessing} 
              disabled={totalRemaining === 0}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {processed > 0 ? 'Resume Processing' : 'Start Processing All'}
            </Button>
          ) : (
            <Button 
              onClick={pauseProcessing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause Processing
            </Button>
          )}
          
          <Button 
            onClick={async () => {
              const { data } = await supabase.functions.invoke('find-publication-websites', {
                body: { mode: 'count' }
              });
              if (data?.remaining) {
                setTotalRemaining(data.remaining);
                toast({
                  title: "Count Updated",
                  description: `${data.remaining} publications still need websites.`,
                });
              }
            }}
            variant="ghost"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Results:</h3>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div 
                  key={`${result.id}-${index}`} 
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

        {totalRemaining === 0 && processed === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            All publications already have website URLs assigned.
          </div>
        )}
      </CardContent>
    </Card>
  );
};