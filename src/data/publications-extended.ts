import { Publication } from '../types';

// Extended publications to be added to the main publications list
export const EXTENDED_PUBLICATIONS: Publication[] = [
  // Business Journals and more $4,500+ publications
  {
    id: '69',
    name: 'BizJournals.com (Chicago)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Chicago Business Journal - Leading Chicago business publication',
    features: ['Chicago business', 'Local authority', 'Business networking', 'Market analysis'],
    website_url: 'https://bizjournals.com/chicago',
    tier: 'tier1',
    popularity: 83,
    is_active: true
  },
  {
    id: '70',
    name: 'BizJournals.com (Dallas)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Dallas Business Journal - Leading Dallas business publication',
    features: ['Dallas business', 'Local authority', 'Business networking', 'Market analysis'],
    website_url: 'https://bizjournals.com/dallas',
    tier: 'tier1',
    popularity: 83,
    is_active: true
  },
  {
    id: '71',
    name: 'BizJournals.com (Los Angeles)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Los Angeles Business Journal - Leading LA business publication',
    features: ['LA business', 'Local authority', 'Business networking', 'Market analysis'],
    website_url: 'https://bizjournals.com/losangeles',
    tier: 'tier1',
    popularity: 85,
    is_active: true
  },
  {
    id: '72',
    name: 'BizJournals.com (Miami)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Miami Business Journal - Leading Miami business publication',
    features: ['Miami business', 'Local authority', 'Business networking', 'Market analysis'],
    website_url: 'https://bizjournals.com/miami',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '73',
    name: 'BizJournals.com (New York)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'New York Business Journal - Leading NYC business publication',
    features: ['NYC business', 'Local authority', 'Business networking', 'Market analysis'],
    website_url: 'https://bizjournals.com/newyork',
    tier: 'tier1',
    popularity: 87,
    is_active: true
  },
  {
    id: '74',
    name: 'Entrepreneur (Asia Pacific)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 10,
    description: 'Asian Pacific edition of Entrepreneur magazine with do-follow links',
    features: ['Entrepreneurship', 'Asia Pacific focus', 'Do-follow links', 'Business authority'],
    website_url: 'https://entrepreneur.com',
    tier: 'tier1',
    popularity: 88,
    is_active: true
  },
  {
    id: '75',
    name: 'Inman.com (Contributor)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Real estate industry publication with contributor content',
    features: ['Real estate focus', 'Contributor article', 'Industry authority', 'Property market'],
    website_url: 'https://inman.com',
    tier: 'tier1',
    popularity: 84,
    is_active: true
  },
  {
    id: '76',
    name: 'Thrive Global (Mention + Quote)',
    type: 'tier1',
    category: 'Lifestyle & Culture',
    price: 450000, // $4,500
    tat_days: 7,
    description: 'Wellness and productivity platform with mention and quote',
    features: ['Wellness focus', 'Productivity content', 'Mention + quote', 'Professional audience'],
    website_url: 'https://thriveglobal.com',
    tier: 'tier1',
    popularity: 86,
    is_active: true
  },

  // $4,000 tier publications
  {
    id: '77',
    name: 'Baycity Tribune',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Bay City regional newspaper',
    features: ['Regional news', 'Local authority', 'Community focus', 'Bay area coverage'],
    website_url: 'https://baycitytribune.com',
    tier: 'premium',
    popularity: 72,
    is_active: true
  },
  {
    id: '78',
    name: 'BaytownSun.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Baytown area news publication',
    features: ['Local news', 'Community coverage', 'Regional authority', 'Texas focus'],
    website_url: 'https://baytownsun.com',
    tier: 'premium',
    popularity: 68,
    is_active: true
  },
  {
    id: '79',
    name: 'CIO.com (Mention)',
    type: 'premium',
    category: 'Technology',
    price: 400000, // $4,000
    tat_days: 10,
    description: 'CIO magazine with mention coverage',
    features: ['IT leadership', 'CIO focus', 'Mention article', 'Technology authority'],
    website_url: 'https://cio.com',
    tier: 'premium',
    popularity: 89,
    is_active: true
  },
  {
    id: '80',
    name: 'DailySentinel.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Daily Sentinel regional newspaper',
    features: ['Regional news', 'Daily coverage', 'Local authority', 'Community focus'],
    website_url: 'https://dailysentinel.com',
    tier: 'premium',
    popularity: 71,
    is_active: true
  },
  {
    id: '81',
    name: 'DailyTimes.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Daily Times regional newspaper',
    features: ['Regional news', 'Daily coverage', 'Local authority', 'Community focus'],
    website_url: 'https://dailytimes.com',
    tier: 'premium',
    popularity: 73,
    is_active: true
  },
  {
    id: '82',
    name: 'Galvnews.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Galveston County Daily News',
    features: ['Galveston coverage', 'Regional news', 'Local authority', 'Texas coast'],
    website_url: 'https://galvnews.com',
    tier: 'premium',
    popularity: 69,
    is_active: true
  },
  {
    id: '83',
    name: 'Geekwire',
    type: 'premium',
    category: 'Technology',
    price: 400000, // $4,000
    tat_days: 7,
    description: 'Pacific Northwest technology news',
    features: ['Tech focus', 'Startup coverage', 'Seattle tech', 'Innovation news'],
    website_url: 'https://geekwire.com',
    tier: 'premium',
    popularity: 85,
    is_active: true
  },
  {
    id: '84',
    name: 'Herald-Zeitung.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Herald-Zeitung regional newspaper',
    features: ['Regional news', 'Local authority', 'Community coverage', 'Texas focus'],
    website_url: 'https://herald-zeitung.com',
    tier: 'premium',
    popularity: 67,
    is_active: true
  },
  {
    id: '85',
    name: 'Hollywood Life + IG Post',
    type: 'premium',
    category: 'Music & Entertainment',
    price: 400000, // $4,000
    tat_days: 7,
    description: 'Celebrity news with Instagram post amplification',
    features: ['Celebrity news', 'Instagram post', 'Entertainment focus', 'Social media reach'],
    website_url: 'https://hollywoodlife.com',
    tier: 'premium',
    popularity: 82,
    is_active: true
  },
  {
    id: '86',
    name: 'LA Times',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 10,
    description: 'Los Angeles Times - unsponsored content',
    features: ['Major newspaper', 'LA authority', 'Unsponsored content', 'News credibility'],
    website_url: 'https://latimes.com',
    tier: 'premium',
    popularity: 94,
    is_active: true
  },
  {
    id: '87',
    name: 'LufkinDailyNews.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Lufkin Daily News regional publication',
    features: ['Regional news', 'Local authority', 'East Texas', 'Community focus'],
    website_url: 'https://lufkindailynews.com',
    tier: 'premium',
    popularity: 68,
    is_active: true
  },
  {
    id: '88',
    name: 'Muscle & Fitness (Includes Social Post)',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 400000, // $4,000
    tat_days: 10,
    description: 'Fitness magazine with social media amplification',
    features: ['Fitness authority', 'Health content', 'Social media post', 'Wellness focus'],
    website_url: 'https://muscleandfitness.com',
    tier: 'premium',
    popularity: 84,
    is_active: true
  },
  {
    id: '89',
    name: 'Paper Mag',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 400000, // $4,000
    tat_days: 7,
    description: 'Fashion and culture magazine',
    features: ['Fashion authority', 'Culture content', 'Style trends', 'Arts coverage'],
    website_url: 'https://papermag.com',
    tier: 'premium',
    popularity: 81,
    is_active: true
  },
  {
    id: '90',
    name: 'SeguinGazette.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Seguin Gazette regional newspaper',
    features: ['Regional news', 'Local authority', 'Community coverage', 'Texas focus'],
    website_url: 'https://seguingazette.com',
    tier: 'premium',
    popularity: 66,
    is_active: true
  },
  {
    id: '91',
    name: 'SwokNews.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'Swok News regional publication',
    features: ['Regional news', 'Local authority', 'Community focus', 'News coverage'],
    website_url: 'https://swoknews.com',
    tier: 'premium',
    popularity: 65,
    is_active: true
  },
  {
    id: '92',
    name: 'TheFacts.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'The Facts regional newspaper',
    features: ['Regional news', 'Local authority', 'Community coverage', 'Fact-based reporting'],
    website_url: 'https://thefacts.com',
    tier: 'premium',
    popularity: 69,
    is_active: true
  },
  {
    id: '93',
    name: 'TheParisNews.com',
    type: 'premium',
    category: 'News & Media',
    price: 400000, // $4,000
    tat_days: 5,
    description: 'The Paris News regional publication',
    features: ['Regional news', 'Local authority', 'Community coverage', 'Texas focus'],
    website_url: 'https://theparisnews.com',
    tier: 'premium',
    popularity: 67,
    is_active: true
  },
  {
    id: '94',
    name: 'Organic Coverage (NY Post / The Sun / The Mirror / Daily Star / Daily Mirror / The Express / Daily Mail)',
    type: 'premium',
    category: 'News & Media',
    price: 360000, // $3,600
    tat_days: 7,
    description: 'Organic coverage across major UK tabloids and NY Post',
    features: ['Multi-publication', 'Organic coverage', 'UK tabloids', 'NY Post inclusion'],
    website_url: 'https://nypost.com',
    tier: 'premium',
    popularity: 91,
    is_active: true
  },

  // $3,500 tier publications
  {
    id: '95',
    name: 'Clash Music',
    type: 'premium',
    category: 'Music & Entertainment',
    price: 350000, // $3,500
    tat_days: 7,
    description: 'UK music and culture magazine',
    features: ['Music authority', 'UK focus', 'Culture content', 'Independent music'],
    website_url: 'https://clashmusic.com',
    tier: 'premium',
    popularity: 79,
    is_active: true
  },
  {
    id: '96',
    name: 'Galore Magazine + IG Post',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 350000, // $3,500
    tat_days: 7,
    description: 'Fashion and lifestyle magazine with Instagram amplification',
    features: ['Fashion focus', 'Lifestyle content', 'Instagram post', 'Young audience'],
    website_url: 'https://galoremag.com',
    tier: 'premium',
    popularity: 77,
    is_active: true
  },
  {
    id: '97',
    name: 'Readwrite.com',
    type: 'premium',
    category: 'Technology',
    price: 350000, // $3,500
    tat_days: 7,
    description: 'Technology news and analysis publication',
    features: ['Tech news', 'Analysis content', 'Innovation focus', 'Tech industry'],
    website_url: 'https://readwrite.com',
    tier: 'premium',
    popularity: 82,
    is_active: true
  },
  {
    id: '98',
    name: 'The Manuel',
    type: 'premium',
    category: 'Lifestyle & Culture',
    price: 350000, // $3,500
    tat_days: 7,
    description: 'Men\'s lifestyle and culture publication',
    features: ['Men\'s lifestyle', 'Culture content', 'Style focus', 'Modern masculinity'],
    website_url: 'https://themanuel.com',
    tier: 'premium',
    popularity: 74,
    is_active: true
  }
];