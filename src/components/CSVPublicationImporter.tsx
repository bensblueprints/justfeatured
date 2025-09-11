import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Check, X, Edit, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ParsedPublication {
  name: string;
  price: number;
  da_score: number;
  dr_score: number;
  category: string;
  tat_days: string;
  sponsored: boolean;
  indexed: boolean;
  dofollow_link: boolean;
  location: string;
  erotic: boolean;
  health: boolean;
  cbd: boolean;
  crypto: boolean;
  gambling: boolean;
}

interface PublicationEditData extends ParsedPublication {
  id?: string;
  external_id?: string;
  is_active?: boolean;
}

export const CSVPublicationImporter = () => {
  const [csvData, setCsvData] = useState<ParsedPublication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPublication, setEditingPublication] = useState<PublicationEditData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const parseCsvData = (csvText: string): ParsedPublication[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const publications: ParsedPublication[] = [];
    
    // Skip header lines (first 3 lines are headers/info)
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const columns = line.split(',').map(col => col.trim());
      
      // Skip if not enough columns or empty publication name
      if (columns.length < 16 || !columns[1]) continue;
      
      const publication: ParsedPublication = {
        name: columns[1],
        price: parseFloat(columns[3]) || 0,
        da_score: parseInt(columns[4]) || 0,
        dr_score: parseInt(columns[5]) || 0,
        category: columns[6] || 'News',
        tat_days: columns[7] || '1-3 Days',
        sponsored: columns[8] === 'Y',
        indexed: columns[9] === 'Y', 
        dofollow_link: columns[10] === 'Y',
        location: columns[11] || 'GLOBAL',
        erotic: columns[12] === 'Y',
        health: columns[13] === 'Y',
        cbd: columns[14] === 'Y',
        crypto: columns[15] === 'Y',
        gambling: columns[16] === 'Y'
      };
      
      // Double the price as requested
      publication.price = publication.price * 2;
      
      publications.push(publication);
    }
    
    return publications;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseCsvData(csvText);
      setCsvData(parsed);
      toast.success(`Parsed ${parsed.length} publications from CSV`);
    };
    reader.readAsText(file);
  };

  const handleImportToDatabase = async () => {
    if (csvData.length === 0) {
      toast.error('No data to import');
      return;
    }

    setIsLoading(true);
    try {
      for (const pub of csvData) {
        const publicationData = {
          name: pub.name,
          category: pub.category,
          price: pub.price,
          contact_info: `contact@${pub.name.toLowerCase().replace(/\s+/g, '')}.com`, // Generate contact info
          monthly_readers: Math.floor(Math.random() * 1000000) + 10000, // Random monthly readers
          logo_url: null,
          status: 'active' as const,
          // Extended fields from our migration
          type: 'standard',
          tier: 'standard',
          tat_days: pub.tat_days,
          description: null,
          features: [],
          website_url: null,
          popularity: Math.floor(Math.random() * 100),
          is_active: true,
          da_score: pub.da_score,
          dr_score: pub.dr_score,
          location: pub.location,
          dofollow_link: pub.dofollow_link,
          sponsored: pub.sponsored,
          indexed: pub.indexed,
          erotic: pub.erotic,
          health: pub.health,
          cbd: pub.cbd,
          crypto: pub.crypto,
          gambling: pub.gambling,
          external_id: `csv_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const { error } = await supabase
          .from('publications')
          .insert(publicationData);

        if (error) {
          console.error('Error inserting publication:', error);
          toast.error(`Failed to import ${pub.name}: ${error.message}`);
        }
      }
      
      toast.success(`Successfully imported ${csvData.length} publications!`);
      setCsvData([]);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (publication: ParsedPublication, index: number) => {
    setEditingPublication({
      ...publication,
      external_id: `csv_temp_${index}`
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingPublication) return;
    
    const index = csvData.findIndex((_, i) => `csv_temp_${i}` === editingPublication.external_id);
    if (index !== -1) {
      const updatedData = [...csvData];
      updatedData[index] = editingPublication;
      setCsvData(updatedData);
      toast.success('Publication updated');
    }
    
    setIsEditDialogOpen(false);
    setEditingPublication(null);
  };

  const downloadTemplate = () => {
    const template = `Update,PUBLICATION,,$PRICE,DA,DR,GENRE,TAT,SPONSORED,INDEXED,DOFOLLOW,REGION / LOCATION,EROTIC,HEALTH,CBD,CRYPTO,GAMBLING
WRITING COST IS INCLUDED,,,,,,,,,,,,,,,,
,Sample Publication,,$100,50,60,News,1-3 Days,N,Y,Y,UNITED STATES,N,N,N,N,N`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'publications_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            CSV Publication Importer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
          
          {csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {csvData.length} publications parsed from CSV
                </p>
                <Button 
                  onClick={handleImportToDatabase}
                  disabled={isLoading}
                  className="bg-gradient-hero text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import to Database
                    </>
                  )}
                </Button>
              </div>
              
              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>DA/DR</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((pub, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{pub.name}</TableCell>
                        <TableCell>${pub.price}</TableCell>
                        <TableCell>{pub.da_score}/{pub.dr_score}</TableCell>
                        <TableCell>{pub.category}</TableCell>
                        <TableCell>{pub.location}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pub.sponsored && <Badge variant="secondary" className="text-xs">Sponsored</Badge>}
                            {pub.indexed && <Badge variant="default" className="text-xs">Indexed</Badge>}
                            {pub.dofollow_link && <Badge variant="outline" className="text-xs">DoFollow</Badge>}
                            {pub.erotic && <Badge variant="destructive" className="text-xs">Adult</Badge>}
                            {pub.health && <Badge variant="default" className="text-xs">Health</Badge>}
                            {pub.cbd && <Badge variant="outline" className="text-xs">CBD</Badge>}
                            {pub.crypto && <Badge variant="default" className="text-xs">Crypto</Badge>}
                            {pub.gambling && <Badge variant="destructive" className="text-xs">Gambling</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pub, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Publication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          {editingPublication && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingPublication.name}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={editingPublication.price}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    price: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">DA Score</label>
                <Input
                  type="number"
                  value={editingPublication.da_score}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    da_score: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">DR Score</label>
                <Input
                  type="number"
                  value={editingPublication.dr_score}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    dr_score: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={editingPublication.category}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    category: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editingPublication.location}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    location: e.target.value
                  })}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">TAT Days</label>
                <Input
                  value={editingPublication.tat_days}
                  onChange={(e) => setEditingPublication({
                    ...editingPublication,
                    tat_days: e.target.value
                  })}
                />
              </div>
              <div className="col-span-2 flex gap-4">
                <Button onClick={handleSaveEdit}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};