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
  'Website URL'?: string;
  Description?: string;
  Type?: string;
  Tier?: string;
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
  const lines = csvContent.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim().length > 0)

  // Find the header row (prefer a line that contains a PUBLICATION-like column)
  let headerIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    if (cols.some((c) => c.toLowerCase().includes('publication'))) {
      headerIndex = i
      break
    }
  }
  // Fallback to the first non-empty line if none matched
  if (headerIndex === -1) {
    console.warn('CSV header row with PUBLICATION not found. Falling back to first line as header.')
    headerIndex = 0
  }

  const rawHeaders = parseCsvLine(lines[headerIndex])

  // Normalize headers to canonical keys
  const normalize = (h: string) => {
    const s = h.trim().toLowerCase()
      .replace(/\$/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\//g, ' / ')
    if (s.includes('publication')) return 'PUBLICATION'
    if (s === 'price' || s.includes('price')) return 'PRICE'
    if (s === 'da') return 'DA'
    if (s === 'dr') return 'DR'
    if (s.includes('genre') || s.includes('category')) return 'GENRE'
    if (s === 'tat' || s.includes('tat')) return 'TAT'
    if (s.includes('sponsored')) return 'SPONSORED'
    if (s.includes('indexed')) return 'INDEXED'
    if (s.includes('dofollow')) return 'DOFOLLOW'
    if (s.includes('region') || s.includes('location')) return 'REGION / LOCATION'
    if (s.includes('erotic') || s.includes('adult')) return 'EROTIC'
    if (s.includes('health')) return 'HEALTH'
    if (s === 'cbd') return 'CBD'
    if (s.includes('crypto')) return 'CRYPTO'
    if (s.includes('gambling')) return 'GAMBLING'
    if (s.includes('website')) return 'Website URL'
    if (s.includes('description')) return 'Description'
    if (s === 'type') return 'Type'
    if (s === 'tier') return 'Tier'
    return h.trim()
  }

  let headers = rawHeaders.map(normalize)

  // If PUBLICATION header still missing, assume default column order as fallback
  if (!headers.includes('PUBLICATION')) {
    const defaults = [
      'Update','PUBLICATION','PRICE','DA','DR','GENRE','TAT','SPONSORED','INDEXED','DOFOLLOW','REGION / LOCATION','EROTIC','HEALTH','CBD','CRYPTO','GAMBLING','Website URL','Description','Type','Tier'
    ] as const
    headers = rawHeaders.map((_, idx) => defaults[idx] ?? `col_${idx}`)
  }

  const rows: CSVRowData[] = []
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const rowObj: any = {}
    headers.forEach((h, idx) => {
      rowObj[h] = (values[idx] ?? '').trim()
    })

    const name = (rowObj['PUBLICATION'] as string) || ''
    const price = (rowObj['PRICE'] as string) || ''

    // Skip rows without essential fields
    if (!name && !price) continue

    rows.push({
      PUBLICATION: name,
      PRICE: price,
      DA: rowObj['DA'] || '0',
      DR: rowObj['DR'] || '0',
      GENRE: rowObj['GENRE'] || 'News',
      TAT: rowObj['TAT'] || '1-3 Days',
      SPONSORED: rowObj['SPONSORED'] || 'N',
      INDEXED: rowObj['INDEXED'] || 'Y',
      DOFOLLOW: rowObj['DOFOLLOW'] || 'N',
      'REGION / LOCATION': rowObj['REGION / LOCATION'] || 'GLOBAL',
      EROTIC: rowObj['EROTIC'] || '',
      HEALTH: rowObj['HEALTH'] || '',
      CBD: rowObj['CBD'] || '',
      CRYPTO: rowObj['CRYPTO'] || '',
      GAMBLING: rowObj['GAMBLING'] || '',
      'Website URL': rowObj['Website URL'] || '',
      Description: rowObj['Description'] || '',
      Type: rowObj['Type'] || 'standard',
      Tier: rowObj['Tier'] || 'standard',
    })
  }

  return rows
}

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
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required. Please log in to continue.');
    }

    // Check if user has admin privileges
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!roleData || !['admin', 'super_admin'].includes(roleData.role)) {
      throw new Error('Admin access required. You do not have permission to import publications.');
    }

    // Import in batches to avoid hitting limits
    const batchSize = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < publications.length; i += batchSize) {
      const batch = publications.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('publications')
        .insert(batch);

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