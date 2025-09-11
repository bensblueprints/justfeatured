import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { processAndImportCSV } from "@/utils/csvPublicationImporter";
import { Link } from "react-router-dom";
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react";

const AdminManualImport = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading } = useAdminCheck();
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Manual CSV Import • Admin";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Admin manual CSV import for publications");
  }, []);

  const runImport = async () => {
    setIsImporting(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch('/Just Featured PR Sheet - All Publications.csv');
      if (!response.ok) throw new Error('CSV file not found');
      const csvContent = await response.text();
      const res = await processAndImportCSV(csvContent);
      setResult(res);
    } catch (e: any) {
      const msg = e?.message || 'Failed to import CSV';
      setError(msg);
      toast({ title: 'Import failed', description: msg, variant: 'destructive' });
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isLoading && !isImporting && !result && !error) {
      // Auto-run once for convenience
      runImport();
    }
  }, [isAdmin, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Checking admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You must be an admin to run the manual import.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 grid place-items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Manual Publications Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            This tool imports the bundled CSV from the repository and writes publications in batches.
          </p>

          {isImporting && (
            <div className="space-y-2">
              <Progress value={undefined} />
              <div className="text-sm text-muted-foreground">Importing… please wait</div>
            </div>
          )}

          {result && (
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" /> Import complete
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div><div className="text-muted-foreground">Total</div><div className="font-medium">{result.total}</div></div>
                <div><div className="text-muted-foreground">Imported</div><div className="font-medium text-green-700">{result.imported}</div></div>
                <div><div className="text-muted-foreground">Errors</div><div className="font-medium text-destructive">{result.errors}</div></div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border p-4 bg-destructive/5">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> {error}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={runImport} disabled={isImporting} className="min-w-[160px]">
              {isImporting ? 'Importing…' : 'Run Import Now'}
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin">Go to Admin Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminManualImport;
