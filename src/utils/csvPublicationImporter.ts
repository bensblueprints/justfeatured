import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CSVRowData {
  PUBLICATION: string;
  PRICE: string;
  DA: string;
  DR: string;
  GENRE: string;
  TAT: string;
  SPONSORED: string;
  INDEXED: string;
  DOFOLLOW: string;
  'REGION / LOCATION': string;
  EROTIC: string;
  HEALTH: string;
  CBD: string;
  CRYPTO: string;
  GAMBLING: string;
}

export const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
};

export const parseCSVContent = (csvContent: string): CSVRowData[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCsvLine(lines[0]);
  
  const publications: CSVRowData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    
    // Skip rows that don't have a publication name or price
    if (!values[1] || !values[3] || values[1].trim() === '' || values[3].trim() === '') {
      continue;
    }
    
    const row: CSVRowData = {
      PUBLICATION: values[1]?.trim() || '',
      PRICE: values[3]?.trim() || '0',
      DA: values[4]?.trim() || '0',
      DR: values[5]?.trim() || '0',
      GENRE: values[6]?.trim() || 'News',
      TAT: values[7]?.trim() || '1-3 Days',
      SPONSORED: values[8]?.trim() || 'N',
      INDEXED: values[9]?.trim() || 'Y',
      DOFOLLOW: values[10]?.trim() || 'N',
      'REGION / LOCATION': values[11]?.trim() || 'GLOBAL',
      EROTIC: values[12]?.trim() || '',
      HEALTH: values[13]?.trim() || '',
      CBD: values[14]?.trim() || '',
      CRYPTO: values[15]?.trim() || '',
      GAMBLING: values[16]?.trim() || ''
    };
    
    publications.push(row);
  }
  
  return publications;
};

export const convertToSupabaseFormat = (csvData: CSVRowData[]) => {
  return csvData.map((row, index) => {
    // Parse price - handle cases like "$75", "75", etc.
    let price = 0;
    const priceStr = row.PRICE.replace(/[$,]/g, '').trim();
    if (priceStr && !isNaN(Number(priceStr))) {
      price = Number(priceStr);
    }

    // Parse DA and DR scores
    const daScore = parseInt(row.DA) || 0;
    const drScore = parseInt(row.DR) || 0;

    // Convert Y/N to boolean
    const sponsored = row.SPONSORED.toUpperCase() === 'Y' || row.SPONSORED.toLowerCase() === 'discreet' || row.SPONSORED.toLowerCase() === 'discrete';
    const indexed = row.INDEXED.toUpperCase() === 'Y';
    const dofollow = row.DOFOLLOW.toUpperCase() === 'Y';

    // Handle special restrictions
    const erotic = row.EROTIC?.includes('Cost') || row.EROTIC?.toUpperCase() === 'Y';
    const health = row.HEALTH?.includes('Cost') || row.HEALTH?.toUpperCase() === 'Y';
    const cbd = row.CBD?.includes('Cost') || row.CBD?.toUpperCase() === 'Y';
    const crypto = row.CRYPTO?.includes('Cost') || row.CRYPTO?.toUpperCase() === 'Y';
    const gambling = row.GAMBLING?.includes('Cost') || row.GAMBLING?.toUpperCase() === 'Y';

    return {
      name: row.PUBLICATION,
      price: price,
      da_score: daScore,
      dr_score: drScore,
      category: row.GENRE || 'News',
      tat_days: row.TAT || '1-3 Days',
      sponsored: sponsored,
      indexed: indexed,
      dofollow_link: dofollow,
      location: row['REGION / LOCATION'] || 'GLOBAL',
      erotic: erotic,
      health: health,
      cbd: cbd,
      crypto: crypto,
      gambling: gambling,
      status: 'active' as const,
      monthly_readers: Math.floor(Math.random() * 100000) + 10000, // Placeholder
      description: `${row.GENRE} publication with DA ${daScore} and DR ${drScore}`,
      contact_info: 'Contact via platform',
      is_active: true,
      external_id: `csv-import-${index + 1}`
    };
  });
};

export const importPublicationsToSupabase = async (publications: any[]) => {
  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!roleData || !['admin', 'super_admin'].includes(roleData.role)) {
      throw new Error('Insufficient permissions');
    }

    // Import in batches to avoid hitting limits
    const batchSize = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < publications.length; i += batchSize) {
      const batch = publications.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('publications')
        .upsert(batch, { 
          onConflict: 'name',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Batch import error:', error);
        errors += batch.length;
      } else {
        imported += batch.length;
      }
    }

    return { imported, errors, total: publications.length };
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

export const processAndImportCSV = async (csvContent: string) => {
  try {
    toast({
      title: "Processing CSV",
      description: "Parsing publication data..."
    });

    const csvData = parseCSVContent(csvContent);
    const supabaseData = convertToSupabaseFormat(csvData);
    
    toast({
      title: "Importing to Database",
      description: `Importing ${supabaseData.length} publications...`
    });

    const result = await importPublicationsToSupabase(supabaseData);
    
    toast({
      title: "Import Complete",
      description: `Successfully imported ${result.imported} publications. ${result.errors} errors.`
    });

    return result;
  } catch (error: any) {
    toast({
      title: "Import Failed",
      description: error.message || "Failed to import CSV data",
      variant: "destructive"
    });
    throw error;
  }
};