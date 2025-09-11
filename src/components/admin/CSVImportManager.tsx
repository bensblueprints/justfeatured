import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processAndImportCSV } from "@/utils/csvPublicationImporter";

export const CSVImportManager = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: number;
    total: number;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const csvContent = await file.text();
      const result = await processAndImportCSV(csvContent);
      setImportResult(result);
    } catch (error: any) {
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleImportExistingCSV = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      // Fetch the existing CSV file from public folder
      const response = await fetch('/Just Featured PR Sheet - All Publications.csv');
      if (!response.ok) {
        throw new Error('Failed to fetch CSV file');
      }
      
      const csvContent = await response.text();
      const result = await processAndImportCSV(csvContent);
      setImportResult(result);
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import existing CSV",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Publications CSV Import
          </CardTitle>
          <CardDescription>
            Import publication data from CSV files into the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import Existing CSV */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Import Existing Publications CSV
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Import the publications from the existing CSV file in the project
            </p>
            <Button 
              onClick={handleImportExistingCSV}
              disabled={isImporting}
              className="w-full"
            >
              {isImporting ? "Importing..." : "Import Existing CSV"}
            </Button>
          </div>

          {/* Upload New CSV */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload New CSV File
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Upload a new CSV file with publication data
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Processing and importing publications...
              </p>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-800">Import Complete</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Badge variant="outline" className="block mb-1">
                      Total
                    </Badge>
                    <span className="font-medium">{importResult.total}</span>
                  </div>
                  <div className="text-center">
                    <Badge className="block mb-1 bg-green-100 text-green-800 border-green-200">
                      Imported
                    </Badge>
                    <span className="font-medium text-green-600">{importResult.imported}</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="destructive" className="block mb-1">
                      Errors
                    </Badge>
                    <span className="font-medium text-red-600">{importResult.errors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CSV Format Info */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              CSV Format Requirements
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Columns: PUBLICATION, PRICE, DA, DR, GENRE, TAT, SPONSORED, INDEXED, DOFOLLOW, REGION/LOCATION</li>
              <li>• Publication name is required</li>
              <li>• Price should be numeric (with or without $ symbol)</li>
              <li>• Boolean fields should use Y/N format</li>
              <li>• Special restriction fields (EROTIC, HEALTH, CBD, CRYPTO, GAMBLING) can contain cost multipliers</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};