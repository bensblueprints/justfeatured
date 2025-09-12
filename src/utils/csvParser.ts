/**
 * Utility functions for parsing CSV files and converting publication data
 */

export interface CSVRow {
  Update?: string;
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

export interface PublicationData {
  external_id: string;
  name: string;
  type: string;
  tier: string;
  category: string;
  price: number;
  tat_days: string;
  description: string;
  features: string[];
  website_url: string | null;
  da_score: number;
  dr_score: number;
  location: string | null;
  dofollow_link: boolean;
  sponsored: boolean;
  indexed: boolean;
  erotic: boolean;
  health: boolean;
  cbd: boolean;
  crypto: boolean;
  gambling: boolean;
  popularity: number;
  is_active: boolean;
}

/**
 * Parse CSV text into structured rows
 */
export const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      // Handle quoted CSV values properly
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ''));
      
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
};

/**
 * Convert CSV row to publication data structure
 */
export const convertToPublication = (row: CSVRow, index: number): PublicationData => {
  // Convert boolean values
  const convertBoolean = (value: string): boolean => {
    if (!value) return false;
    const val = value.toUpperCase();
    return val === 'Y' || val === 'YES' || val === 'TRUE' || val === 'DISCREET';
  };

  // Parse price - remove $ symbol and convert to number
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[$,]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Convert TAT to standardized format
  const convertTAT = (tatStr: string): string => {
    if (!tatStr) return '1-2 Weeks';
    return tatStr.trim();
  };

  // Generate unique external ID
  const external_id = `csv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${index}`;

  const publication: PublicationData = {
    external_id,
    name: row.PUBLICATION?.trim() || `Publication ${index + 1}`,
    type: (row.Type?.toLowerCase().trim()) || 'standard',
    tier: (row.Tier?.toLowerCase().trim()) || 'standard', 
    category: row.GENRE?.trim() || 'News',
    price: parsePrice(row["SELL PRICE"] || row.Price || '0'),
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
};

/**
 * Validate publication data before import
 */
export const validatePublication = (publication: PublicationData): string[] => {
  const errors: string[] = [];

  if (!publication.name || publication.name.trim() === '') {
    errors.push('Publication name is required');
  }

  if (publication.price < 0) {
    errors.push('Price cannot be negative');
  }

  if (!publication.category || publication.category.trim() === '') {
    errors.push('Category is required');
  }

  if (!publication.tat_days || publication.tat_days.trim() === '') {
    errors.push('TAT (turnaround time) is required');
  }

  return errors;
};