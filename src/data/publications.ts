import { Publication } from '../types';

export const PUBLICATIONS: Publication[] = [
  // Exclusive ($1000+)
  {
    id: '1',
    name: 'Bloomberg',
    type: 'exclusive',
    category: 'News & Media',
    price: 20000000, // $200,000
    tat_days: 30,
    description: 'Premier global financial news and information platform',
    features: ['Premium placement', 'Global reach', 'Financial authority', 'High circulation'],
    website_url: 'https://bloomberg.com',
    tier: 'exclusive',
    popularity: 94,
    is_active: true
  },
  {
    id: '2', 
    name: 'Wall Street Journal (500,000 Impressions)',
    type: 'exclusive',
    category: 'Business & Finance',
    price: 17000000, // $170,000
    tat_days: 25,
    description: 'Leading business and financial publication with guaranteed impressions',
    features: ['Massive reach', 'Business authority', 'Premium editorial', '500k impressions'],
    website_url: 'https://wsj.com',
    tier: 'exclusive',
    popularity: 93,
    is_active: true
  },
  {
    id: '3',
    name: 'Tech Crunch (Includes Social Post)',
    type: 'exclusive', 
    category: 'Technology',
    price: 6000000, // $60,000
    tat_days: 18,
    description: 'Premier technology and startup publication with social media amplification',
    features: ['Tech authority', 'Startup focus', 'Social media post', 'Global reach'],
    website_url: 'https://techcrunch.com',
    tier: 'exclusive',
    popularity: 93,
    is_active: true
  },
  {
    id: '4',
    name: 'Billboard.com',
    type: 'exclusive',
    category: 'Music & Entertainment', 
    price: 5000000, // $50,000
    tat_days: 10,
    description: 'Music industry authority and chart publisher',
    features: ['Music industry leader', 'Chart authority', 'Entertainment focus', 'Global reach'],
    website_url: 'https://billboard.com',
    tier: 'exclusive',
    popularity: 92,
    is_active: true
  },
  {
    id: '5',
    name: 'Rolling Stone + (400,000 Guaranteed Impressions)',
    type: 'exclusive',
    category: 'Music & Entertainment',
    price: 2500000, // $25,000
    tat_days: 10,
    description: 'Iconic music and culture magazine with guaranteed reach',
    features: ['Music authority', 'Cultural influence', '400k impressions', 'Premium brand'],
    website_url: 'https://rollingstone.com',
    tier: 'exclusive',
    popularity: 92,
    is_active: true
  },
  {
    id: '6',
    name: 'Coindesk',
    type: 'exclusive',
    category: 'Technology',
    price: 2000000, // $20,000
    tat_days: 10,
    description: 'Leading cryptocurrency and blockchain news platform',
    features: ['Crypto authority', 'Blockchain focus', 'Financial tech', 'Industry leader'],
    website_url: 'https://coindesk.com',
    tier: 'exclusive',
    popularity: 91,
    is_active: true
  },
  {
    id: '7',
    name: 'Variety + (400,000 Guaranteed Impressions)',
    type: 'exclusive',
    category: 'Music & Entertainment',
    price: 2000000, // $20,000
    tat_days: 10,
    description: 'Entertainment industry trade publication with guaranteed impressions',
    features: ['Entertainment authority', 'Industry insider', '400k impressions', 'Global reach'],
    website_url: 'https://variety.com',
    tier: 'exclusive',
    popularity: 93,
    is_active: true
  },
  {
    id: '8',
    name: 'Chicago Tribune',
    type: 'exclusive',
    category: 'News & Media',
    price: 150000, // $1,500
    tat_days: 4,
    description: 'Major metropolitan newspaper serving Chicago and Midwest',
    features: ['Major market', 'News authority', 'Regional leader', 'High circulation'],
    website_url: 'https://chicagotribune.com',
    tier: 'exclusive',
    popularity: 92,
    is_active: true
  },
  {
    id: '9',
    name: 'NY Daily News',
    type: 'exclusive',
    category: 'News & Media',
    price: 150000, // $1,500
    tat_days: 4,
    description: 'New York\'s hometown newspaper with massive metro reach',
    features: ['NYC authority', 'Metro coverage', 'High readership', 'News leader'],
    website_url: 'https://nydailynews.com',
    tier: 'exclusive',
    popularity: 93,
    is_active: true
  },
  {
    id: '10',
    name: 'Orlando Sentinel',
    type: 'exclusive',
    category: 'News & Media',
    price: 150000, // $1,500
    tat_days: 4,
    description: 'Florida\'s leading newspaper serving Central Florida',
    features: ['Florida authority', 'Regional leader', 'Tourism market', 'News coverage'],
    website_url: 'https://orlandosentinel.com',
    tier: 'exclusive',
    popularity: 87,
    is_active: true
  },

  // Tier 1 Premium ($4000-$9000)
  {
    id: '11',
    name: 'USA Today (250,000 Impressions)',
    type: 'tier1',
    category: 'News & Media',
    price: 1200000, // $12,000
    tat_days: 21,
    description: 'National newspaper with guaranteed 250k impressions',
    features: ['National reach', 'News authority', '250k impressions', 'Broad audience'],
    website_url: 'https://usatoday.com',
    tier: 'tier1',
    popularity: 94,
    is_active: true
  },
  {
    id: '12',
    name: 'OK Magazine (Homepage 4 Weeks)',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 900000, // $9,000
    tat_days: 7,
    description: 'Celebrity and entertainment magazine with homepage placement',
    features: ['Celebrity focus', 'Homepage featured', '4 weeks placement', 'Entertainment authority'],
    website_url: 'https://okmagazine.com',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '13',
    name: 'Radar Online (Homepage 4 Weeks)',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 900000, // $9,000
    tat_days: 2,
    description: 'Celebrity news and gossip with premium homepage placement',
    features: ['Celebrity news', 'Homepage featured', '4 weeks placement', 'Entertainment focus'],
    website_url: 'https://radaronline.com',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '14',
    name: 'The Hollywood Reporter',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 700000, // $7,000
    tat_days: 10,
    description: 'Premier entertainment industry trade publication',
    features: ['Industry authority', 'Entertainment trade', 'Hollywood insider', 'Premium placement'],
    website_url: 'https://hollywoodreporter.com',
    tier: 'tier1',
    popularity: 93,
    is_active: true
  },
  {
    id: '15',
    name: 'US Weekly',
    type: 'tier1',
    category: 'Lifestyle & Culture',
    price: 700000, // $7,000
    tat_days: 7,
    description: 'Leading celebrity and lifestyle magazine',
    features: ['Celebrity coverage', 'Lifestyle focus', 'Weekly publication', 'Entertainment authority'],
    website_url: 'https://usweekly.com',
    tier: 'tier1',
    popularity: 91,
    is_active: true
  },
  {
    id: '16',
    name: 'The Hill',
    type: 'tier1',
    category: 'News & Media',
    price: 600000, // $6,000
    tat_days: 10,
    description: 'Leading political news and policy publication',
    features: ['Political authority', 'Policy focus', 'Washington insider', 'Government coverage'],
    website_url: 'https://thehill.com',
    tier: 'tier1',
    popularity: 92,
    is_active: true
  },
  {
    id: '17',
    name: 'GamesBeat',
    type: 'tier1',
    category: 'Technology',
    price: 500000, // $5,000
    tat_days: 10,
    description: 'Premier gaming industry news and analysis',
    features: ['Gaming authority', 'Industry analysis', 'Tech focus', 'Gaming community'],
    website_url: 'https://venturebeat.com/games',
    tier: 'tier1',
    popularity: 92,
    is_active: true
  },
  {
    id: '18',
    name: 'VentureBeat',
    type: 'tier1',
    category: 'Technology',
    price: 500000, // $5,000
    tat_days: 7,
    description: 'Technology news focused on innovation and startups',
    features: ['Tech innovation', 'Startup coverage', 'Business tech', 'Industry insights'],
    website_url: 'https://venturebeat.com',
    tier: 'tier1',
    popularity: 92,
    is_active: true
  },

  // Premium ($2000-$3500)
  {
    id: '19',
    name: 'USA Today',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 10,
    description: 'America\'s national newspaper with broad reach',
    features: ['National coverage', 'News authority', 'Broad audience', 'Daily publication'],
    website_url: 'https://usatoday.com',
    tier: 'premium',
    popularity: 94,
    is_active: true
  },
  {
    id: '20',
    name: 'Digital Trends',
    type: 'premium',
    category: 'Technology',
    price: 350000, // $3,500
    tat_days: 7,
    description: 'Technology news and product reviews',
    features: ['Tech reviews', 'Product coverage', 'Consumer tech', 'Innovation focus'],
    website_url: 'https://digitaltrends.com',
    tier: 'premium',
    popularity: 92,
    is_active: true
  },
  {
    id: '21',
    name: 'Mens Journal',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 350000, // $3,500
    tat_days: 10,
    description: 'Men\'s lifestyle, fitness, and adventure magazine',
    features: ['Men\'s lifestyle', 'Fitness focus', 'Adventure content', 'Health coverage'],
    website_url: 'https://mensjournal.com',
    tier: 'premium',
    popularity: 86,
    is_active: true
  },
  {
    id: '22',
    name: 'LA Weekly (DO-FOLLOW)',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 350000, // $3,500
    tat_days: 1,
    description: 'Los Angeles weekly arts and culture publication',
    features: ['LA culture', 'Arts coverage', 'Entertainment focus', 'Do-follow links'],
    website_url: 'https://laweekly.com',
    tier: 'premium',
    popularity: 76,
    is_active: true
  },
  {
    id: '23',
    name: 'Arabian Business',
    type: 'premium',
    category: 'Business & Finance',
    price: 300000, // $3,000
    tat_days: 10,
    description: 'Leading Middle East business publication',
    features: ['Middle East business', 'Regional authority', 'Financial coverage', 'UAE focus'],
    website_url: 'https://arabianbusiness.com',
    tier: 'premium',
    popularity: 85,
    is_active: true
  },
  {
    id: '24',
    name: 'Detroit Free Press',
    type: 'premium',
    category: 'News & Media',
    price: 300000, // $3,000
    tat_days: 10,
    description: 'Michigan\'s leading newspaper serving Detroit metro',
    features: ['Detroit coverage', 'Michigan news', 'Metro authority', 'Regional leader'],
    website_url: 'https://freep.com',
    tier: 'premium',
    popularity: 91,
    is_active: true
  },

  // Tier 2 Standard ($1500-$2500)
  {
    id: '25',
    name: 'Elite Daily',
    type: 'tier2',
    category: 'Lifestyle & Culture',
    price: 250000, // $2,500
    tat_days: 10,
    description: 'Millennial-focused lifestyle and culture publication',
    features: ['Millennial audience', 'Lifestyle content', 'Culture focus', 'Social media friendly'],
    website_url: 'https://elitedaily.com',
    tier: 'standard',
    popularity: 89,
    is_active: true
  },
  {
    id: '26',
    name: 'Bustle',
    type: 'tier2',
    category: 'Lifestyle & Culture',
    price: 250000, // $2,500
    tat_days: 10,
    description: 'Women\'s lifestyle and culture publication',
    features: ['Women\'s content', 'Lifestyle focus', 'Culture coverage', 'Female audience'],
    website_url: 'https://bustle.com',
    tier: 'standard',
    popularity: 92,
    is_active: true
  },
  {
    id: '27',
    name: 'Investing.com',
    type: 'tier2',
    category: 'Business & Finance',
    price: 300000, // $3,000
    tat_days: 10,
    description: 'Global financial markets and investing platform',
    features: ['Financial markets', 'Investment focus', 'Global reach', 'Market analysis'],
    website_url: 'https://investing.com',
    tier: 'standard',
    popularity: 90,
    is_active: true
  },
  {
    id: '28',
    name: 'The Independent',
    type: 'tier2',
    category: 'News & Media',
    price: 300000, // $3,000
    tat_days: 10,
    description: 'British online newspaper with global reach',
    features: ['UK authority', 'Independent journalism', 'Global news', 'Quality reporting'],
    website_url: 'https://independent.co.uk',
    tier: 'standard',
    popularity: 94,
    is_active: true
  },
  {
    id: '29',
    name: 'Sports Illustrated (Contributor)',
    type: 'tier2',
    category: 'Sports',
    price: 300000, // $3,000
    tat_days: 10,
    description: 'Iconic sports magazine with contributor content',
    features: ['Sports authority', 'Athletic coverage', 'Contributor article', 'Sports culture'],
    website_url: 'https://si.com',
    tier: 'standard',
    popularity: 92,
    is_active: true
  },
  {
    id: '30',
    name: 'Newsweek (Contributor)', 
    type: 'tier2',
    category: 'News & Media',
    price: 300000, // $3,000
    tat_days: 14,
    description: 'Prestigious news magazine with contributor platform',
    features: ['News authority', 'Magazine format', 'Contributor content', 'Global reach'],
    website_url: 'https://newsweek.com',
    tier: 'standard',
    popularity: 93,
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