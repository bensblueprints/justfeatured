import { seedPublications } from '@/scripts/seed-publications';

// This utility can be called from the browser console to seed the database
export const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    const result = await seedPublications();
    console.log('✅ Database seeding completed!', result);
    // Reload the page to see the results
    window.location.reload();
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  }
};

// Make it available globally for easy access
(window as any).runSeed = runSeed;