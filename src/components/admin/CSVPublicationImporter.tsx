import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileSpreadsheet, RefreshCw, AlertCircle, CheckCircle, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CSVRow {
  Update?: string;
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

interface ImportStatus {
  total: number;
  processed: number;
  added: number;
  errors: number;
  currentItem?: string;
}

export const CSVPublicationImporter = ({ onImportComplete }: { onImportComplete?: () => void }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
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
      const external_id = `csv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${index}`;
      
      // Convert boolean values
      const convertBoolean = (value: string) => {
        if (!value) return false;
        const val = value.toUpperCase();
        return val === 'Y' || val === 'YES' || val === 'TRUE' || val === 'DISCREET';
      };

      // Parse price - remove $ symbol and convert to number
      const parsePrice = (priceStr: string) => {
        if (!priceStr) return 0;
        const cleaned = priceStr.replace(/[$,]/g, '');
        return parseFloat(cleaned) || 0;
      };

      // Convert TAT to standardized format
      const convertTAT = (tatStr: string) => {
        if (!tatStr) return '1-2 Weeks';
        return tatStr.trim();
      };

      const publication = {
        external_id,
        name: row.PUBLICATION?.trim() || `Publication ${index + 1}`,
        type: (row.Type?.toLowerCase().trim()) || 'standard',
        tier: (row.Tier?.toLowerCase().trim()) || 'standard', 
        category: row.GENRE?.trim() || 'News',
        price: parsePrice(row.Price || '0'),
        tat_days: convertTAT(row.TAT || '1-2 Weeks'),
        description: row.Description?.trim() || '',
        features: ['Press Release', 'SEO Backlink'],
        website_url: row["Website URL"]?.trim() || null,
        da_score: Math.max(0, parseInt(row.DA?.replace(/[^0-9]/g, '') || '0') || 0),
        dr_score: Math.max(0, parseInt(row.DR?.replace(/[^0-9]/g, '') || '0') || 0),
        location: row["REGION / LOCATION"]?.trim() || null,
        dofollow_link: convertBoolean(row.DOFOLLOW || ''),
        sponsored: convertBoolean(row.SPONSORED || ''),
        indexed: convertBoolean(row.INDEXED || 'Y'), // Default to true unless explicitly 'N'
        erotic: convertBoolean(row.EROTIC || ''),
        health: convertBoolean(row.HEALTH || ''),
        cbd: convertBoolean(row.CBD || ''),
        crypto: convertBoolean(row.CRYPTO || ''),
        gambling: convertBoolean(row.GAMBLING || ''),
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

      return publication;
    } catch (error) {
      throw new Error(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data format'}`);
    }
  };

  const clearAllPublications = async () => {
    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;

      toast({
        title: "Publications Cleared",
        description: "All existing publications have been removed from the database.",
      });
    } catch (error) {
      console.error('Error clearing publications:', error);
      toast({
        title: "Error",
        description: "Failed to clear existing publications",
        variant: "destructive",
      });
      throw error;
    }
  };

  const importFromRepositoryCSV = async () => {
    setIsProcessing(true);
    setErrors([]);
    setImportStatus({ total: 0, processed: 0, added: 0, errors: 0 });

    try {
      // First, clear all existing publications
      await clearAllPublications();

      // Fetch the CSV file from the repository
      const response = await fetch('/Just Featured PR Sheet - All Publications.csv');
      if (!response.ok) {
        throw new Error('CSV file not found in repository');
      }
      
      const text = await response.text();
      const lines = text.split('\n');
      
      // Skip the first two lines (header and "WRITING COST IS INCLUDED")
      const dataLines = lines.slice(2).filter(line => line.trim());
      
      console.log(`Found ${dataLines.length} data lines to process`);
      
      const publications = [];
      const errorList: string[] = [];

      // Parse each line
      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;
        
        try {
          // Parse CSV with proper comma handling for quoted values
          const values = [];
          let current = '';
          let inQuotes = false;
          
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          
          // Map values to expected structure
          const row: CSVRow = {
            Update: values[0]?.replace(/"/g, '') || '',
            PUBLICATION: values[1]?.replace(/"/g, '') || '',
            Price: values[2]?.replace(/"/g, '') || '',
            DA: values[3]?.replace(/"/g, '') || '',
            DR: values[4]?.replace(/"/g, '') || '',
            GENRE: values[5]?.replace(/"/g, '') || '',
            TAT: values[6]?.replace(/"/g, '') || '',
            SPONSORED: values[7]?.replace(/"/g, '') || '',
            INDEXED: values[8]?.replace(/"/g, '') || '',
            DOFOLLOW: values[9]?.replace(/"/g, '') || '',
            "REGION / LOCATION": values[10]?.replace(/"/g, '') || '',
            EROTIC: values[11]?.replace(/"/g, '') || '',
            HEALTH: values[12]?.replace(/"/g, '') || '',
            CBD: values[13]?.replace(/"/g, '') || '',
            CRYPTO: values[14]?.replace(/"/g, '') || '',
            GAMBLING: values[15]?.replace(/"/g, '') || '',
            "Website URL": values[16]?.replace(/"/g, '') || '',
            Description: values[17]?.replace(/"/g, '') || '',
            Type: values[18]?.replace(/"/g, '') || '',
            Tier: values[19]?.replace(/"/g, '') || ''
          };
          
          // Only process rows with actual publication data
          if (row.PUBLICATION && row.PUBLICATION !== '' && row.Price) {
            // Clean up the publication name
            row.PUBLICATION = row.PUBLICATION.replace(/^,+|,+$/g, '').trim();
            
            if (row.PUBLICATION !== '' && row.PUBLICATION !== 'PUBLICATION') {
              const publication = convertToPublication(row, i);
              publications.push(publication);
            }
          }
        } catch (error) {
          console.error(`Error parsing line ${i + 1}:`, error);
          errorList.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
        }
      }

      console.log(`Successfully parsed ${publications.length} publications`);
      
      if (publications.length === 0) {
        throw new Error('No valid publications found in CSV file');
      }

      setImportStatus(prev => prev ? { ...prev, total: publications.length } : null);
      
      // Import in batches to avoid overwhelming the database
      const batchSize = 50;
      let importedCount = 0;
      
      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        
        setImportStatus(prev => prev ? { 
          ...prev, 
          processed: Math.min(i + batchSize, publications.length),
          currentItem: `Batch ${Math.floor(i / batchSize) + 1}`
        } : null);
        
        try {
          const { error } = await supabase.from('publications').insert(batch);
          
          if (error) {
            console.error('Error importing batch:', error);
            errorList.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
          } else {
            importedCount += batch.length;
            console.log(`Imported batch ${Math.floor(i / batchSize) + 1}: ${batch.length} publications`);
          }
        } catch (error) {
          console.error('Error importing batch:', error);
          errorList.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error instanceof Error ? error.message : 'Import error'}`);
        }
        
        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setImportStatus(prev => prev ? { 
        ...prev, 
        added: importedCount,
        errors: errorList.length,
        currentItem: undefined
      } : null);
      
      setErrors(errorList);

      const isSuccess = importedCount > 0;

      toast({
        title: isSuccess ? "Import Complete" : "Import Failed",
        description: `Successfully imported ${importedCount} publications. ${errorList.length} errors encountered.`,
        variant: isSuccess ? "default" : "destructive",
      });

      if (onImportComplete && importedCount > 0) {
        onImportComplete();
      }

    } catch (error: any) {
      console.error('Error importing repository CSV:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import publications from repository CSV",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          CSV Publication Importer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Import */}
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will clear ALL existing publications and import fresh data from the repository CSV file.
              This action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-medium">Repository CSV Import</h3>
              <p className="text-sm text-muted-foreground">
                Import all publications from: /public/Just Featured PR Sheet - All Publications.csv
              </p>
            </div>
            <Button 
              onClick={importFromRepositoryCSV}
              disabled={isProcessing}
              variant="default"
              className="min-w-[140px]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Clear & Import All
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress */}
        {importStatus && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{importStatus.processed} / {importStatus.total}</span>
              </div>
              <Progress 
                value={importStatus.total > 0 ? (importStatus.processed / importStatus.total) * 100 : 0} 
                className="w-full" 
              />
              {importStatus.currentItem && (
                <p className="text-sm text-muted-foreground">
                  Processing: {importStatus.currentItem}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importStatus.added}</div>
                <div className="text-sm text-muted-foreground">Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{importStatus.processed}</div>
                <div className="text-sm text-muted-foreground">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importStatus.errors}</div>
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
                <p className="font-medium">Errors encountered during import:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-xs">
                      {error}
                    </div>
                  ))}
                  {errors.length > 10 && (
                    <div className="text-xs font-medium">
                      ... and {errors.length - 10} more errors
                    </div>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {importStatus && importStatus.processed === importStatus.total && !isProcessing && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Import completed! {importStatus.added} publications imported successfully.
              {importStatus.errors > 0 && ` ${importStatus.errors} errors encountered.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Warning */}
        <Alert variant="destructive">
          <Trash2 className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This operation will permanently delete all existing publications 
            and replace them with data from the CSV file. Make sure you have a backup if needed.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};