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
  "SELL PRICE"?: string;
  "BUY PRICE"?: string;
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
      // Generate a more unique external_id
      const external_id = `csv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${index}`;
      
      const publication = {
        external_id,
        name: row.PUBLICATION?.trim() || `Publication ${index + 1}`,
        type: (row.Type?.toLowerCase().trim()) || 'standard',
        tier: (row.Tier?.toLowerCase().trim()) || 'standard', 
        category: row.GENRE?.trim() || 'News',
        price: Math.max(0, parseFloat((row["SELL PRICE"] || row.Price)?.replace(/[^0-9.-]/g, '') || '0') || 0),
        tat_days: row.TAT?.trim() || '1-2 Weeks',
        description: row.Description?.trim() || '',
        features: ['Press Release', 'SEO Backlink'],
        website_url: row["Website URL"]?.trim() || '',
        da_score: Math.max(0, parseInt(row.DA?.replace(/[^0-9]/g, '') || '0') || 0),
        dr_score: Math.max(0, parseInt(row.DR?.replace(/[^0-9]/g, '') || '0') || 0),
        location: row["REGION / LOCATION"]?.trim() || '',
        dofollow_link: (row.DOFOLLOW?.toUpperCase().trim() === 'Y'),
        sponsored: (row.SPONSORED?.toUpperCase().trim() === 'Y'),
        indexed: (row.INDEXED?.toUpperCase().trim() !== 'N'), // Default to true unless explicitly 'N'
        erotic: (row.EROTIC?.toUpperCase().trim() === 'Y'),
        health: (row.HEALTH?.toUpperCase().trim() === 'Y'),
        cbd: (row.CBD?.toUpperCase().trim() === 'Y'),
        crypto: (row.CRYPTO?.toUpperCase().trim() === 'Y'),
        gambling: (row.GAMBLING?.toUpperCase().trim() === 'Y'),
        popularity: Math.floor(Math.random() * 100) + 1,
        is_active: true
      };

      // Validate required fields
      if (!publication.name || publication.name === `Publication ${index + 1}`) {
        throw new Error(`Publication name is required`);
      }

      if (publication.price < 0) {
        throw new Error(`Invalid price: ${row.Price}`);
      }

      console.log(`Converted row ${index + 1}:`, publication);
      return publication;
    } catch (error) {
      console.error(`Error converting row ${index + 1}:`, error);
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
      console.log('Starting spreadsheet processing...');
      const csvText = await file.text();
      console.log('CSV text length:', csvText.length);
      
      const rows = parseCSV(csvText);
      console.log('Parsed rows:', rows.length);
      console.log('First few rows:', rows.slice(0, 3));
      
      if (rows.length === 0) {
        throw new Error('No data rows found in CSV file');
      }

      // Get existing publications for comparison
      console.log('Fetching existing publications...');
      const existingPublications = await fetchPublications();
      console.log('Found existing publications:', existingPublications.length);
      
      const existingNames = new Set(existingPublications.map(p => p.name.toLowerCase().trim()));

      setSyncStatus(prev => prev ? { ...prev, total: rows.length } : null);

      const errorList: string[] = [];
      let added = 0;
      let updated = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        setSyncStatus(prev => prev ? { 
          ...prev, 
          processed: i + 1,
          currentItem: row.PUBLICATION?.trim() || `Row ${i + 1}`
        } : null);

        try {
          console.log(`Processing row ${i + 1}:`, row);
          const publicationData = convertToPublication(row, i);
          console.log(`Converted data for row ${i + 1}:`, publicationData);
          
          // Check if publication already exists by name
          const existsAlready = existingNames.has(publicationData.name.toLowerCase().trim());
          console.log(`Publication "${publicationData.name}" exists: ${existsAlready}`);
          
          if (existsAlready) {
            // Update existing publication
            const existingPub = existingPublications.find(p => 
              p.name.toLowerCase().trim() === publicationData.name.toLowerCase().trim()
            );
            if (existingPub?.external_id) {
              console.log(`Updating publication: ${publicationData.name}`);
              await updatePublication(existingPub.external_id, publicationData);
              updated++;
              console.log(`Successfully updated: ${publicationData.name}`);
            }
          } else {
            // Add new publication
            console.log(`Adding new publication: ${publicationData.name}`);
            const result = await addPublication(publicationData);
            console.log(`Successfully added: ${publicationData.name}`, result);
            added++;
            existingNames.add(publicationData.name.toLowerCase().trim());
          }

          // Small delay to prevent overwhelming the database
          if (i % 5 === 0 && i > 0) {
            console.log(`Processed ${i + 1} rows, taking a short break...`);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error(`Error processing row ${i + 1}:`, error);
          const errorMessage = `Row ${i + 1} (${row.PUBLICATION || 'Unknown'}): ${error instanceof Error ? error.message : 'Unknown error'}`;
          errorList.push(errorMessage);
        }
      }

      console.log(`Processing complete. Added: ${added}, Updated: ${updated}, Errors: ${errorList.length}`);

      setSyncStatus(prev => prev ? { 
        ...prev, 
        added, 
        updated, 
        errors: errorList.length,
        currentItem: undefined
      } : null);
      
      setErrors(errorList);

      const isSuccess = errorList.length < rows.length / 2; // Success if less than 50% errors

      toast({
        title: isSuccess ? "Sync Complete" : "Sync Completed with Errors",
        description: `Added ${added} new publications, updated ${updated} existing ones. ${errorList.length} errors.`,
        variant: isSuccess ? "default" : "destructive",
      });

      if (onSyncComplete && (added > 0 || updated > 0)) {
        console.log('Calling onSyncComplete callback...');
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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileSpreadsheet className="h-5 w-5" />
          Spreadsheet Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File</label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={processSpreadsheet}
            disabled={!file || isProcessing}
            className="w-full"
            size="sm"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing Data...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Sync Data
              </>
            )}
          </Button>

          <Alert className="text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs leading-relaxed">
              Upload a CSV file with columns: PUBLICATION, SELL PRICE (or Price), DA, DR, GENRE, TAT, SPONSORED, INDEXED, DOFOLLOW, etc. 
              The system will automatically add new publications and update existing ones.
            </AlertDescription>
          </Alert>
        </div>

        {/* Progress */}
        {syncStatus && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Progress</span>
                <span>{syncStatus.processed} / {syncStatus.total}</span>
              </div>
              <Progress 
                value={(syncStatus.processed / syncStatus.total) * 100} 
                className="w-full h-2" 
              />
              {syncStatus.currentItem && (
                <p className="text-xs text-muted-foreground truncate">
                  Processing: {syncStatus.currentItem}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span>Added:</span>
                <span className="font-medium text-green-600">{syncStatus.added}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span className="font-medium text-blue-600">{syncStatus.updated}</span>
              </div>
              <div className="flex justify-between">
                <span>Processed:</span>
                <span className="font-medium">{syncStatus.processed}</span>
              </div>
              <div className="flex justify-between">
                <span>Errors:</span>
                <span className="font-medium text-red-600">{syncStatus.errors}</span>
              </div>
            </div>
          </div>
        )}

        {/* File Info */}
        {file && (
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Badge variant="outline" className="text-xs">CSV</Badge>
            </div>
          </div>
        )}

        {/* Success Message */}
        {syncStatus && syncStatus.processed === syncStatus.total && !isProcessing && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 text-xs">
              Sync completed! {syncStatus.added} added, {syncStatus.updated} updated.
            </AlertDescription>
          </Alert>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-xs">Errors during sync:</p>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {errors.slice(0, 3).map((error, index) => (
                    <div key={index} className="text-xs leading-tight">
                      {error}
                    </div>
                  ))}
                  {errors.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      ... and {errors.length - 3} more errors
                    </div>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};