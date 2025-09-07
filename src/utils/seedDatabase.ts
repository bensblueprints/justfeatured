// Seed database functionality removed - now managed through admin interface

// This utility can be called from the browser console to seed the database
export const runSeed = async () => {
  console.log('🌱 Database seeding is now handled through the admin interface at /admin-dashboard');
  console.log('✅ Use the Publication Management section to upload publications via CSV or manually add them');
};

// Make it available globally for easy access
(window as any).runSeed = runSeed;