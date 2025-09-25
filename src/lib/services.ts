import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'website-basic',
    name: 'Basic Local Lead Generation Website',
    price: 1500,
    category: 'Website Development',
    description: 'Perfect for local businesses looking to generate leads and establish an online presence with essential features.',
    features: [
      'Responsive mobile design',
      'Contact forms & lead capture',
      'SEO optimization',
      'Basic analytics setup'
    ],
    type: 'one-time'
  },
  {
    id: 'website-ecommerce',
    name: 'E-commerce Website',
    price: 10000,
    category: 'Website Development',
    description: 'Complete e-commerce solution with payment processing, inventory management, and advanced features for online stores.',
    features: [
      'Full e-commerce functionality',
      'Payment gateway integration',
      'Inventory management system',
      'Custom admin dashboard',
      'Advanced analytics & reporting'
    ],
    type: 'one-time'
  },
  {
    id: 'seo-monthly',
    name: 'Monthly SEO Services',
    price: 1500,
    category: 'SEO',
    description: 'Comprehensive SEO strategy and implementation to boost your search rankings and drive organic traffic growth consistently.',
    features: [
      'Complete on-page & off-page optimization',
      'Monthly comprehensive SEO audit',
      'Keyword research & competitor analysis',
      'High-quality backlink building',
      'Monthly performance reporting',
      'Ongoing optimization & support'
    ],
    type: 'recurring',
    interval: 'month'
  },
  {
    id: 'facebook-ads',
    name: 'Professional Facebook Ads Management',
    price: 1500,
    category: 'Facebook Advertising',
    description: 'Expert Facebook advertising management to maximize your ROI and drive qualified leads.',
    features: [
      'Campaign strategy & setup',
      'Advanced audience targeting',
      'Creative testing & optimization',
      'Daily monitoring & optimization',
      'Comprehensive monthly reporting',
      'ROI tracking & analysis'
    ],
    type: 'recurring',
    interval: 'month'
  },
  {
    id: 'article-writing',
    name: 'Article Writing',
    price: 99,
    category: 'Content',
    description: 'High-quality, SEO-optimized articles written by professional writers to boost your online presence and authority.',
    features: [
      'SEO-optimized content',
      '1000+ words per article',
      'Professional research & writing',
      'Fast 24-48 hour turnaround',
      'Unlimited revisions',
      'Plagiarism-free guarantee'
    ],
    type: 'one-time'
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const getServicesByCategory = (category: string): Service[] => {
  return services.filter(service => service.category === category);
};