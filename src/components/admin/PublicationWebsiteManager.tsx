import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Search, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';

interface WebsiteResult {
  id: string;
  name: string;
  status: 'success' | 'not_found' | 'error' | 'invalid_url' | 'update_error' | 'api_error' | 'no_email_found' | 'invalid_email';
  url?: string;
  email?: string;
  error?: string;
  logoFetched?: boolean;
  contact_info?: string;
}

export const PublicationWebsiteManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<WebsiteResult[]>([]);
  const { toast } = useToast();

  const extractDomainsFromContact = async () => {
    setIsProcessing(true);
    setResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-domains-from-contact', {
        body: { batchSize: 100 }
      });

      if (error) {
        console.error('Error extracting domains:', error);
        toast({
          title: "Error",
          description: "Failed to extract domains from contact info.",
          variant: "destructive",
        });
        return;
      }

      setResults(data.results || []);
      
      toast({
        title: "Domain Extraction Complete",
        description: `Processed ${data.processed} publications. ${data.successful} websites extracted from contact emails.`,
      });
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not_found':
      case 'no_email_found':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      case 'error':
      case 'update_error':
      case 'invalid_url':
      case 'api_error':
      case 'invalid_email':
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
      case 'no_email_found':
        return <Badge variant="secondary">No Email</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'api_error':
        return <Badge variant="destructive">API Error</Badge>;
      case 'invalid_url':
        return <Badge variant="destructive">Invalid URL</Badge>;
      case 'invalid_email':
        return <Badge variant="destructive">Invalid Email</Badge>;
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
          <Mail className="h-5 w-5" />
          Publication Website Manager
        </CardTitle>
        <CardDescription>
          Extract website URLs from contact email addresses and automatically fetch publication logos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={extractDomainsFromContact}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isProcessing ? 'Extracting...' : 'Extract from Contact Emails'}
          </Button>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Results ({results.length}):</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div 
                  key={`${result.id}-${index}`} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium">{result.name}</div>
                      {result.email && (
                        <div className="text-sm text-blue-600">
                          📧 {result.email}
                        </div>
                      )}
                      {result.url && (
                        <div className="text-sm text-muted-foreground">
                          🌐 {result.url}
                        </div>
                      )}
                      {result.logoFetched !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          Logo: {result.logoFetched ? '✓ Fetched' : '✗ Failed/Fallback'}
                        </div>
                      )}
                      {result.error && (
                        <div className="text-sm text-red-600">
                          ❌ {result.error}
                        </div>
                      )}
                      {result.contact_info && result.status === 'no_email_found' && (
                        <div className="text-xs text-muted-foreground truncate">
                          Contact: {result.contact_info}
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm space-y-1">
                <div>✅ Success: {results.filter(r => r.status === 'success').length}</div>
                <div>📧 No Email: {results.filter(r => r.status === 'no_email_found').length}</div>
                <div>❌ Errors: {results.filter(r => ['error', 'update_error', 'invalid_email'].includes(r.status)).length}</div>
                <div>🖼️ Logos Fetched: {results.filter(r => r.logoFetched === true).length}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};