import { Publication } from '../types';

export const PUBLICATIONS: Publication[] = [
  // Tier 2 Standard ($150-160) - 40 publications
  {
    id: '1',
    name: '24 Hip Hop',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 15000,
    tat_days: 7,
    description: 'Leading hip hop and urban music publication',
    features: ['Online article', 'Social media promotion', 'SEO optimized'],
    website_url: 'https://24hiphop.com',
    tier: 'standard',
    popularity: 75,
    is_active: true
  },
  {
    id: '2',
    name: 'Artist Weekly',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 15000,
    tat_days: 5,
    description: 'Weekly publication featuring emerging artists',
    features: ['Featured article', 'Newsletter inclusion', 'Social sharing'],
    website_url: 'https://artistweekly.com',
    tier: 'standard',
    popularity: 68,
    is_active: true
  },
  {
    id: '3',
    name: 'Atlanta Wire',
    type: 'tier2',
    category: 'Business & Finance',
    price: 16000,
    tat_days: 3,
    description: 'Atlanta business and lifestyle news',
    features: ['News article', 'Local exposure', 'Business focus'],
    website_url: 'https://atlantawire.com',
    tier: 'standard',
    popularity: 82,
    is_active: true
  },
  {
    id: '4',
    name: 'BLK News',
    type: 'tier2',
    category: 'Lifestyle & Culture',
    price: 15500,
    tat_days: 7,
    description: 'Urban lifestyle and culture publication',
    features: ['Feature story', 'Cultural focus', 'Community reach'],
    website_url: 'https://blknews.com',
    tier: 'standard',
    popularity: 71,
    is_active: true
  },
  {
    id: '5',
    name: 'CEO Weekly',
    type: 'tier2',
    category: 'Business & Finance',
    price: 16000,
    tat_days: 5,
    description: 'Executive leadership and business strategy',
    features: ['Executive profile', 'Business insights', 'Leadership focus'],
    website_url: 'https://ceoweekly.com',
    tier: 'standard',
    popularity: 89,
    is_active: true
  },

  // Premium ($200-350) - Sample from 169 publications
  {
    id: '6',
    name: 'Boss Today',
    type: 'premium',
    category: 'Business & Finance',
    price: 25000,
    tat_days: 7,
    description: 'Modern business leadership publication',
    features: ['In-depth feature', 'Executive interviews', 'Industry insights', 'Social promotion'],
    website_url: 'https://bosstoday.com',
    tier: 'premium',
    popularity: 85,
    is_active: true
  },
  {
    id: '7',
    name: 'Tech Bullion',
    type: 'premium',
    category: 'Technology',
    price: 30000,
    tat_days: 5,
    description: 'Leading technology and innovation publication',
    features: ['Tech coverage', 'Innovation focus', 'Industry analysis', 'Expert quotes'],
    website_url: 'https://techbullion.com',
    tier: 'premium',
    popularity: 92,
    is_active: true
  },
  {
    id: '8',
    name: 'Luxury Miami Magazine',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 28000,
    tat_days: 10,
    description: 'High-end lifestyle and luxury publication',
    features: ['Luxury focus', 'High-net-worth audience', 'Premium placement', 'Photo feature'],
    website_url: 'https://luxurymiamimagazine.com',
    tier: 'premium',
    popularity: 78,
    is_active: true
  },

  // Tier 1 Premium ($400-900) - Sample from 85 publications
  {
    id: '9',
    name: 'AllHipHop',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 60000,
    tat_days: 7,
    description: 'Premier hip hop and urban culture publication',
    features: ['Major publication', 'Massive reach', 'Industry authority', 'Premium placement', 'Social amplification'],
    website_url: 'https://allhiphop.com',
    tier: 'tier1',
    popularity: 95,
    is_active: true
  },
  {
    id: '10',
    name: 'Digital Music News',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 55000,
    tat_days: 5,
    description: 'Leading digital music industry publication',
    features: ['Industry authority', 'Music business focus', 'Executive readership', 'SEO value'],
    website_url: 'https://digitalmusicnews.com',
    tier: 'tier1',
    popularity: 88,
    is_active: true
  },
  {
    id: '11',
    name: 'Good Men Project',
    type: 'tier1',
    category: 'Lifestyle & Culture',
    price: 45000,
    tat_days: 14,
    description: 'Men\'s lifestyle and culture authority',
    features: ['Thought leadership', 'Social impact', 'Community engagement', 'Editorial excellence'],
    website_url: 'https://goodmenproject.com',
    tier: 'tier1',
    popularity: 83,
    is_active: true
  },

  // Exclusive ($1000-1500+) - Sample from 61 publications
  {
    id: '12',
    name: 'Bitcoinist',
    type: 'exclusive',
    category: 'Technology',
    price: 120000,
    tat_days: 10,
    description: 'Premier cryptocurrency and blockchain publication',
    features: ['Crypto authority', 'Global reach', 'Investor audience', 'Premium editorial', 'Industry influence'],
    website_url: 'https://bitcoinist.com',
    tier: 'exclusive',
    popularity: 97,
    is_active: true
  },
  {
    id: '13',
    name: 'Dallas Observer',
    type: 'exclusive',
    category: 'News & Media',
    price: 150000,
    tat_days: 14,
    description: 'Major Dallas metropolitan publication',
    features: ['Major market reach', 'Editorial excellence', 'Local authority', 'High readership', 'Premium placement'],
    website_url: 'https://dallasobserver.com',
    tier: 'exclusive',
    popularity: 94,
    is_active: true
  },
  {
    id: '14',
    name: 'Fast Company Africa',
    type: 'exclusive',
    category: 'Business & Finance',
    price: 130000,
    tat_days: 21,
    description: 'African edition of prestigious business publication',
    features: ['International reach', 'Business authority', 'Innovation focus', 'Executive audience', 'Brand prestige'],
    website_url: 'https://fastcompanyafrica.com',
    tier: 'exclusive',
    popularity: 91,
    is_active: true
  },

  // Additional sample publications to reach 18 for first page
  {
    id: '15',
    name: 'Entertainment Monthly News',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 15000,
    tat_days: 7,
    description: 'Monthly entertainment industry coverage',
    features: ['Entertainment focus', 'Industry news', 'Celebrity coverage'],
    website_url: 'https://entertainmentmonthlynews.com',
    tier: 'standard',
    popularity: 72,
    is_active: true
  },
  {
    id: '16',
    name: 'Market Business News',
    type: 'premium',
    category: 'Business & Finance',
    price: 27000,
    tat_days: 5,
    description: 'Business and market analysis publication',
    features: ['Market analysis', 'Business insights', 'Financial news', 'Expert commentary'],
    website_url: 'https://marketbusinessnews.com',
    tier: 'premium',
    popularity: 86,
    is_active: true
  },
  {
    id: '17',
    name: 'Grit Daily',
    type: 'tier1',
    category: 'Business & Finance',
    price: 50000,
    tat_days: 7,
    description: 'Entrepreneurship and startup publication',
    features: ['Startup focus', 'Entrepreneur stories', 'Business growth', 'Innovation coverage'],
    website_url: 'https://gritdaily.com',
    tier: 'tier1',
    popularity: 87,
    is_active: true
  },
  {
    id: '18',
    name: 'Chicago Tribune',
    type: 'exclusive',
    category: 'News & Media',
    price: 180000,
    tat_days: 21,
    description: 'Major metropolitan newspaper',
    features: ['Major market', 'News authority', 'High circulation', 'Editorial prestige', 'SEO power'],
    website_url: 'https://chicagotribune.com',
    tier: 'exclusive',
    popularity: 98,
    is_active: true
  }
];

export const getPublicationsByType = (type?: string) => {
  if (!type) return PUBLICATIONS;
  return PUBLICATIONS.filter(pub => pub.type === type);
};

export const getPublicationById = (id: string) => {
  return PUBLICATIONS.find(pub => pub.id === id);
};