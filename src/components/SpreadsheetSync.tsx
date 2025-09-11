import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { addPublication, updatePublication, fetchPublications } from "@/lib/publications";

interface CSVRow {
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
  "Website URL"?: string;
  Description?: string;
  Type?: string;
  Tier?: string;
  [key: string]: string | undefined;
}

interface SyncStatus {
  total: number;
  processed: number;
  added: number;
  updated: number;
  errors: number;
  currentItem?: string;
}

export const SpreadsheetSync = ({ onSyncComplete }: { onSyncComplete?: () => void }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: CSVRow = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        return row;
      });
  };

  const convertToPublication = (row: CSVRow, index: number) => {
    try {
      const publication = {
        external_id: `csv_${Date.now()}_${index}`,
        name: row.PUBLICATION || `Publication ${index}`,
        type: row.Type?.toLowerCase() || 'standard',
        tier: row.Tier?.toLowerCase() || 'standard', 
        category: row.GENRE || 'News',
        price: parseFloat(row.Price || '0') || 0,
        tat_days: row.TAT || '1-2 Weeks',
        description: row.Description || '',
        features: ['Press Release', 'SEO Backlink'],
        website_url: row["Website URL"] || '',
        da_score: parseInt(row.DA || '0') || 0,
        dr_score: parseInt(row.DR || '0') || 0,
        location: row["REGION / LOCATION"] || '',
        dofollow_link: (row.DOFOLLOW?.toUpperCase() === 'Y') || false,
        sponsored: (row.SPONSORED?.toUpperCase() === 'Y') || false,
        indexed: (row.INDEXED?.toUpperCase() === 'Y') || true,
        erotic: (row.EROTIC?.toUpperCase() === 'Y') || false,
        health: (row.HEALTH?.toUpperCase() === 'Y') || false,
        cbd: (row.CBD?.toUpperCase() === 'Y') || false,
        crypto: (row.CRYPTO?.toUpperCase() === 'Y') || false,
        gambling: (row.GAMBLING?.toUpperCase() === 'Y') || false,
        popularity: Math.floor(Math.random() * 100) + 1,
        is_active: true
      };

      return publication;
    } catch (error) {
      throw new Error(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data format'}`);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setErrors([]);
      setSyncStatus(null);
    }
  }, [toast]);

  const processSpreadsheet = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    setSyncStatus({ total: 0, processed: 0, added: 0, updated: 0, errors: 0 });

    try {
      const csvText = await file.text();
      const rows = parseCSV(csvText);
      
      // Get existing publications for comparison
      const existingPublications = await fetchPublications();
      const existingNames = new Set(existingPublications.map(p => p.name.toLowerCase()));

      setSyncStatus(prev => prev ? { ...prev, total: rows.length } : null);

      const errorList: string[] = [];
      let added = 0;
      let updated = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        setSyncStatus(prev => prev ? { 
          ...prev, 
          processed: i + 1,
          currentItem: row.PUBLICATION || `Row ${i + 1}`
        } : null);

        try {
          const publicationData = convertToPublication(row, i);
          
          // Check if publication already exists
          const existsAlready = existingNames.has(publicationData.name.toLowerCase());
          
          if (existsAlready) {
            // Update existing publication
            const existingPub = existingPublications.find(p => 
              p.name.toLowerCase() === publicationData.name.toLowerCase()
            );
            if (existingPub?.external_id) {
              await updatePublication(existingPub.external_id, publicationData);
              updated++;
            }
          } else {
            // Add new publication
            await addPublication(publicationData);
            added++;
            existingNames.add(publicationData.name.toLowerCase());
          }

          // Small delay to prevent overwhelming the database
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Error processing row ${i + 1}:`, error);
          errorList.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setSyncStatus(prev => prev ? { 
        ...prev, 
        added, 
        updated, 
        errors: errorList.length,
        currentItem: undefined
      } : null);
      
      setErrors(errorList);

      toast({
        title: "Sync Complete",
        description: `Added ${added} new publications, updated ${updated} existing ones. ${errorList.length} errors.`,
        variant: errorList.length > 0 ? "destructive" : "default",
      });

      if (onSyncComplete) {
        onSyncComplete();
      }

    } catch (error) {
      console.error('Error processing spreadsheet:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to process spreadsheet",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, toast, onSyncComplete]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Spreadsheet Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={processSpreadsheet}
              disabled={!file || isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Sync Data
                </>
              )}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload a CSV file with columns: PUBLICATION, Price, DA, DR, GENRE, TAT, SPONSORED, INDEXED, DOFOLLOW, etc.
              The system will automatically add new publications and update existing ones.
            </AlertDescription>
          </Alert>
        </div>

        {/* Progress */}
        {syncStatus && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{syncStatus.processed} / {syncStatus.total}</span>
              </div>
              <Progress 
                value={(syncStatus.processed / syncStatus.total) * 100} 
                className="w-full" 
              />
              {syncStatus.currentItem && (
                <p className="text-sm text-muted-foreground">
                  Processing: {syncStatus.currentItem}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncStatus.added}</div>
                <div className="text-sm text-muted-foreground">Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{syncStatus.updated}</div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{syncStatus.processed}</div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{syncStatus.errors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Errors encountered during sync:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-xs">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {syncStatus && syncStatus.processed === syncStatus.total && !isProcessing && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Sync completed successfully! {syncStatus.added} publications added, {syncStatus.updated} updated.
            </AlertDescription>
          </Alert>
        )}

        {/* File Info */}
        {file && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Badge variant="outline">CSV</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};