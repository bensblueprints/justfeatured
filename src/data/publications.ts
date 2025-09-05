import { Publication } from '../types';
import { EXTENDED_PUBLICATIONS } from './publications-extended';

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
  },

  // Additional Exclusive Publications
  {
    id: '46',
    name: 'Billboard Magazine (Contributor)',
    type: 'exclusive',
    category: 'Music & Entertainment',
    price: 1500000, // $15,000
    tat_days: 10,
    description: 'Music industry authority with contributor content',
    features: ['Music industry leader', 'Contributor article', 'Chart authority', 'Global reach'],
    website_url: 'https://billboard.com',
    tier: 'exclusive',
    popularity: 92,
    is_active: true
  },
  {
    id: '47',
    name: 'Wall Street Journal (Contributor)',
    type: 'exclusive',
    category: 'Business & Finance',
    price: 1500000, // $15,000
    tat_days: 25,
    description: 'Leading business publication with contributor content',
    features: ['Business authority', 'Contributor article', 'Financial focus', 'Premium editorial'],
    website_url: 'https://wsj.com',
    tier: 'exclusive',
    popularity: 93,
    is_active: true
  },
  {
    id: '48',
    name: 'She Knows',
    type: 'exclusive',
    category: 'Lifestyle & Culture',
    price: 1300000, // $13,000
    tat_days: 7,
    description: 'Women\'s lifestyle and parenting publication',
    features: ['Women\'s content', 'Parenting focus', 'Lifestyle authority', 'Female audience'],
    website_url: 'https://sheknows.com',
    tier: 'exclusive',
    popularity: 89,
    is_active: true
  },
  {
    id: '49',
    name: 'Stylecaster',
    type: 'exclusive',
    category: 'Lifestyle & Culture',
    price: 1300000, // $13,000
    tat_days: 7,
    description: 'Fashion and beauty lifestyle publication',
    features: ['Fashion authority', 'Beauty content', 'Style trends', 'Lifestyle focus'],
    website_url: 'https://stylecaster.com',
    tier: 'exclusive',
    popularity: 87,
    is_active: true
  },
  {
    id: '50',
    name: 'The Real Deal',
    type: 'tier1',
    category: 'Business & Finance',
    price: 1000000, // $10,000
    tat_days: 10,
    description: 'Real estate industry publication',
    features: ['Real estate focus', 'Industry authority', 'Market analysis', 'Property coverage'],
    website_url: 'https://therealdeal.com',
    tier: 'tier1',
    popularity: 85,
    is_active: true
  },
  {
    id: '51',
    name: 'Vogue (Ukraine)',
    type: 'tier1',
    category: 'Lifestyle & Culture',
    price: 900000, // $9,000
    tat_days: 10,
    description: 'Ukrainian edition of prestigious fashion magazine',
    features: ['Fashion authority', 'International reach', 'Style content', 'Luxury brand'],
    website_url: 'https://vogue.ua',
    tier: 'tier1',
    popularity: 86,
    is_active: true
  },
  {
    id: '52',
    name: 'Foot Wear News',
    type: 'tier1',
    category: 'Business & Finance',
    price: 800000, // $8,000
    tat_days: 7,
    description: 'Footwear industry trade publication',
    features: ['Footwear industry', 'Fashion business', 'Trade authority', 'Industry insights'],
    website_url: 'https://footwearnews.com',
    tier: 'tier1',
    popularity: 82,
    is_active: true
  },
  {
    id: '53',
    name: 'Sourcing Journal',
    type: 'tier1',
    category: 'Business & Finance',
    price: 800000, // $8,000
    tat_days: 7,
    description: 'Fashion and retail supply chain publication',
    features: ['Supply chain focus', 'Fashion business', 'Retail industry', 'Trade content'],
    website_url: 'https://sourcingjournal.com',
    tier: 'tier1',
    popularity: 78,
    is_active: true
  },
  {
    id: '54',
    name: 'USA Today (100,000 Impressions)',
    type: 'tier1',
    category: 'News & Media',
    price: 800000, // $8,000
    tat_days: 15,
    description: 'National newspaper with guaranteed 100k impressions',
    features: ['National reach', 'News authority', '100k impressions', 'Broad audience'],
    website_url: 'https://usatoday.com',
    tier: 'tier1',
    popularity: 94,
    is_active: true
  },
  {
    id: '55',
    name: 'WWD',
    type: 'tier1',
    category: 'Business & Finance',
    price: 800000, // $8,000
    tat_days: 7,
    description: 'Women\'s Wear Daily - Fashion industry authority',
    features: ['Fashion business', 'Industry authority', 'Trade publication', 'Fashion trends'],
    website_url: 'https://wwd.com',
    tier: 'tier1',
    popularity: 89,
    is_active: true
  },
  {
    id: '56',
    name: 'Inc Magazine (Mention)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 700000, // $7,000
    tat_days: 14,
    description: 'Business magazine with mention coverage',
    features: ['Business authority', 'Entrepreneurship focus', 'Mention article', 'SMB coverage'],
    website_url: 'https://inc.com',
    tier: 'tier1',
    popularity: 91,
    is_active: true
  },
  {
    id: '57',
    name: 'Harvard Business Review (Contributor)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 600000, // $6,000
    tat_days: 21,
    description: 'Prestigious business publication with contributor content',
    features: ['Business authority', 'Academic prestige', 'Contributor article', 'Thought leadership'],
    website_url: 'https://hbr.org',
    tier: 'tier1',
    popularity: 95,
    is_active: true
  },
  {
    id: '58',
    name: 'IB Times (NA)',
    type: 'tier1',
    category: 'News & Media',
    price: 600000, // $6,000
    tat_days: 7,
    description: 'International Business Times North America',
    features: ['International news', 'Business focus', 'Global reach', 'News authority'],
    website_url: 'https://ibtimes.com',
    tier: 'tier1',
    popularity: 84,
    is_active: true
  },
  {
    id: '59',
    name: 'OK Magazine + Social Post',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 600000, // $6,000
    tat_days: 7,
    description: 'Celebrity magazine with social media amplification',
    features: ['Celebrity focus', 'Social media post', 'Entertainment authority', 'Digital reach'],
    website_url: 'https://okmagazine.com',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '60',
    name: 'Radar Magazine + Social Post',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 600000, // $6,000
    tat_days: 2,
    description: 'Celebrity news with social media amplification',
    features: ['Celebrity news', 'Social media post', 'Entertainment focus', 'Digital reach'],
    website_url: 'https://radarmagazine.com',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '61',
    name: 'Radar Online + Social Post',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 600000, // $6,000
    tat_days: 2,
    description: 'Celebrity gossip with social media amplification',
    features: ['Celebrity news', 'Social media post', 'Entertainment focus', 'Digital reach'],
    website_url: 'https://radaronline.com',
    tier: 'tier1',
    popularity: 81,
    is_active: true
  },
  {
    id: '62',
    name: 'Saudi Gazette',
    type: 'tier1',
    category: 'News & Media',
    price: 600000, // $6,000
    tat_days: 7,
    description: 'Leading Saudi Arabian news publication',
    features: ['Middle East coverage', 'Regional authority', 'News focus', 'Saudi market'],
    website_url: 'https://saudigazette.com.sa',
    tier: 'tier1',
    popularity: 79,
    is_active: true
  },
  {
    id: '63',
    name: 'The Epoch Times',
    type: 'tier1',
    category: 'News & Media',
    price: 600000, // $6,000
    tat_days: 7,
    description: 'International news publication',
    features: ['International news', 'Global reach', 'News authority', 'Multi-language'],
    website_url: 'https://epochtimes.com',
    tier: 'tier1',
    popularity: 83,
    is_active: true
  },
  {
    id: '64',
    name: 'USA Today (50,000 Impressions)',
    type: 'tier1',
    category: 'News & Media',
    price: 600000, // $6,000
    tat_days: 12,
    description: 'National newspaper with guaranteed 50k impressions',
    features: ['National reach', 'News authority', '50k impressions', 'Broad audience'],
    website_url: 'https://usatoday.com',
    tier: 'tier1',
    popularity: 94,
    is_active: true
  },
  {
    id: '65',
    name: 'Caller Times',
    type: 'tier1',
    category: 'News & Media',
    price: 550000, // $5,500
    tat_days: 5,
    description: 'South Texas regional newspaper',
    features: ['Regional coverage', 'Texas news', 'Local authority', 'Community focus'],
    website_url: 'https://caller.com',
    tier: 'tier1',
    popularity: 76,
    is_active: true
  },
  {
    id: '66',
    name: 'Bitcoin.com (Sponsored)',
    type: 'tier1',
    category: 'Technology',
    price: 500000, // $5,000
    tat_days: 5,
    description: 'Cryptocurrency news with sponsored content',
    features: ['Crypto authority', 'Sponsored content', 'Bitcoin focus', 'Tech audience'],
    website_url: 'https://bitcoin.com',
    tier: 'tier1',
    popularity: 88,
    is_active: true
  },
  {
    id: '67',
    name: 'Consequence.net (Staff)',
    type: 'tier1',
    category: 'Music & Entertainment',
    price: 500000, // $5,000
    tat_days: 7,
    description: 'Music and entertainment publication with staff content',
    features: ['Music authority', 'Staff article', 'Entertainment focus', 'Culture coverage'],
    website_url: 'https://consequence.net',
    tier: 'tier1',
    popularity: 85,
    is_active: true
  },
  {
    id: '68',
    name: 'Maxim Full Feature',
    type: 'tier1',
    category: 'Lifestyle & Culture',
    price: 500000, // $5,000
    tat_days: 10,
    description: 'Men\'s lifestyle magazine with full feature coverage',
    features: ['Men\'s lifestyle', 'Full feature', 'Entertainment content', 'Lifestyle authority'],
    website_url: 'https://maxim.com',
    tier: 'tier1',
    popularity: 87,
    is_active: true
  },

  // Additional Premium Publications
  {
    id: '31',
    name: 'AP News',
    type: 'premium',
    category: 'News & Media',
    price: 70000, // $700
    tat_days: 4,
    description: 'Associated Press - Global news wire service',
    features: ['Global reach', 'News authority', 'Wire service', 'Credible source'],
    website_url: 'https://apnews.com',
    tier: 'premium',
    popularity: 92,
    is_active: true
  },
  {
    id: '32',
    name: 'HackerNoon',
    type: 'premium',
    category: 'Technology',
    price: 80000, // $800
    tat_days: 7,
    description: 'Tech publication for hackers, entrepreneurs and tech enthusiasts',
    features: ['Tech community', 'Developer focus', 'Startup content', 'Programming insights'],
    website_url: 'https://hackernoon.com',
    tier: 'premium',
    popularity: 87,
    is_active: true
  },
  {
    id: '33',
    name: 'Business Insider and Yahoo (Press Release)',
    type: 'premium',
    category: 'Business & Finance',
    price: 70000, // $700
    tat_days: 4,
    description: 'Combined placement on Business Insider and Yahoo Finance',
    features: ['Dual placement', 'Business authority', 'Financial audience', 'Press release format'],
    website_url: 'https://businessinsider.com',
    tier: 'premium',
    popularity: 94,
    is_active: true
  },
  {
    id: '34',
    name: 'MSN',
    type: 'tier2',
    category: 'News & Media',
    price: 50000, // $500
    tat_days: 2,
    description: 'Microsoft Network news portal with massive reach',
    features: ['Massive audience', 'Microsoft network', 'News aggregation', 'High visibility'],
    website_url: 'https://msn.com',
    tier: 'standard',
    popularity: 94,
    is_active: true
  },
  {
    id: '35',
    name: 'Yahoo News/Finance (AccessWire)',
    type: 'tier1',
    category: 'Business & Finance',
    price: 60000, // $600
    tat_days: 4,
    description: 'Yahoo News and Finance through AccessWire distribution',
    features: ['Yahoo distribution', 'Financial audience', 'News reach', 'AccessWire network'],
    website_url: 'https://finance.yahoo.com',
    tier: 'tier1',
    popularity: 93,
    is_active: true
  },

  // Mid-tier Publications
  {
    id: '36',
    name: 'AllHipHop',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 40000, // $400
    tat_days: 3,
    description: 'Leading hip hop and urban culture publication',
    features: ['Hip hop authority', 'Urban culture', 'Music industry', 'Entertainment focus'],
    website_url: 'https://allhiphop.com',
    tier: 'standard',
    popularity: 73,
    is_active: true
  },
  {
    id: '37',
    name: 'Patch.com',
    type: 'tier2',
    category: 'News & Media',
    price: 40000, // $400
    tat_days: 4,
    description: 'Local news network covering communities nationwide',
    features: ['Local news', 'Community focus', 'Regional coverage', 'Neighborhood stories'],
    website_url: 'https://patch.com',
    tier: 'standard',
    popularity: 91,
    is_active: true
  },
  {
    id: '38',
    name: 'Magnetic Mag',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 40000, // $400
    tat_days: 3,
    description: 'Electronic dance music and DJ culture publication',
    features: ['EDM focus', 'DJ culture', 'Music industry', 'Electronic music'],
    website_url: 'https://magneticmag.com',
    tier: 'standard',
    popularity: 75,
    is_active: true
  },
  {
    id: '39',
    name: 'Tech Bullion',
    type: 'tier2',
    category: 'Technology',
    price: 20000, // $200
    tat_days: 7,
    description: 'Technology news and business insights',
    features: ['Tech news', 'Business technology', 'Innovation coverage', 'Industry analysis'],
    website_url: 'https://techbullion.com',
    tier: 'standard',
    popularity: 63,
    is_active: true
  },
  {
    id: '40',
    name: 'Market Business News',
    type: 'tier2',
    category: 'Business & Finance',
    price: 25000, // $250
    tat_days: 3,
    description: 'Business and market analysis publication',
    features: ['Market analysis', 'Business insights', 'Financial news', 'Market trends'],
    website_url: 'https://marketbusinessnews.com',
    tier: 'standard',
    popularity: 71,
    is_active: true
  },

  // Standard Tier Publications
  {
    id: '41',
    name: 'Self Growth',
    type: 'tier2',
    category: 'Lifestyle & Culture',
    price: 16000, // $160
    tat_days: 1,
    description: 'Personal development and self-improvement publication',
    features: ['Personal development', 'Self-improvement', 'Lifestyle content', 'Growth mindset'],
    website_url: 'https://selfgrowth.com',
    tier: 'standard',
    popularity: 63,
    is_active: true
  },
  {
    id: '42',
    name: 'Vents Magazine',
    type: 'tier2',
    category: 'Lifestyle & Culture',
    price: 16000, // $160
    tat_days: 2,
    description: 'Lifestyle and culture magazine',
    features: ['Lifestyle content', 'Culture coverage', 'Entertainment news', 'Fashion trends'],
    website_url: 'https://ventsmagazine.com',
    tier: 'standard',
    popularity: 64,
    is_active: true
  },
  {
    id: '43',
    name: 'Medium',
    type: 'tier2',
    category: 'News & Media',
    price: 15000, // $150
    tat_days: 1,
    description: 'Popular publishing platform for thought leadership',
    features: ['Publishing platform', 'Thought leadership', 'Professional content', 'Engaged audience'],
    website_url: 'https://medium.com',
    tier: 'standard',
    popularity: 95,
    is_active: true
  },
  {
    id: '44',
    name: 'Daily Scanner',
    type: 'tier2',
    category: 'News & Media',
    price: 15000, // $150
    tat_days: 1,
    description: 'Daily news and current events publication',
    features: ['Daily news', 'Current events', 'Breaking news', 'News analysis'],
    website_url: 'https://dailyscanner.com',
    tier: 'standard',
    popularity: 67,
    is_active: true
  },
  {
    id: '45',
    name: 'HipHopSince1987',
    type: 'tier2',
    category: 'Music & Entertainment',
    price: 15000, // $150
    tat_days: 3,
    description: 'Hip hop culture and music publication',
    features: ['Hip hop culture', 'Music coverage', 'Urban lifestyle', 'Artist features'],
    website_url: 'https://hiphopsince1987.com',
    tier: 'standard',
    popularity: 58,
    is_active: true
  },
  
  // Starter Package Publications ($97 each when part of starter package)
  {
    id: 'starter-1',
    name: 'USA News',
    type: 'starter',
    category: 'News & Media',
    price: 15000, // $150 regular price
    tat_days: 3,
    description: 'National news publication with broad coverage',
    features: ['National reach', 'News authority', 'Quick turnaround', 'Broad audience'],
    website_url: 'https://usanews.com',
    tier: 'starter',
    popularity: 75,
    is_active: true
  },
  {
    id: 'starter-2',
    name: 'New York Review',
    type: 'starter',
    category: 'News & Media',
    price: 15000, // $150 regular price
    tat_days: 3,
    description: 'New York-focused news and review publication',
    features: ['NYC coverage', 'Editorial content', 'Cultural focus', 'Metro reach'],
    website_url: 'https://newyorkreview.com',
    tier: 'starter',
    popularity: 72,
    is_active: true
  },
  {
    id: 'starter-3',
    name: 'CEO Times',
    type: 'starter',
    category: 'Business & Finance',
    price: 15000, // $150 regular price
    tat_days: 3,
    description: 'Executive and business leadership publication',
    features: ['Business leadership', 'Executive focus', 'Corporate news', 'Industry insights'],
    website_url: 'https://ceotimes.com',
    tier: 'starter',
    popularity: 78,
    is_active: true
  },
  {
    id: 'starter-4',
    name: 'Biz Weekly',
    type: 'starter',
    category: 'Business & Finance',
    price: 15000, // $150 regular price
    tat_days: 3,
    description: 'Weekly business news and analysis',
    features: ['Business news', 'Weekly format', 'Market analysis', 'SMB focus'],
    website_url: 'https://bizweekly.com',
    tier: 'starter',
    popularity: 73,
    is_active: true
  },
  {
    id: 'starter-5',
    name: "Women's Insider",
    type: 'starter',
    category: 'Lifestyle & Culture',
    price: 15000, // $150 regular price
    tat_days: 3,
    description: 'Women-focused news and lifestyle publication',
    features: ['Women\'s content', 'Lifestyle focus', 'Professional women', 'Empowerment stories'],
    website_url: 'https://womensinsider.com',
    tier: 'starter',
    popularity: 76,
    is_active: true
  },
  ...EXTENDED_PUBLICATIONS
];

export const getPublicationsByType = (type?: string) => {
  if (!type) return PUBLICATIONS;
  return PUBLICATIONS.filter(pub => pub.type === type);
};

export const getPublicationById = (id: string) => {
  return PUBLICATIONS.find(pub => pub.id === id);
};