// Demo mode configuration for local testing without authentication
// This file temporarily overrides Supabase configuration to enable demo mode

// Force demo mode by setting demo URLs
const DEMO_MODE = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://demo.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'demo-key',
  SUPABASE_SERVICE_ROLE_KEY: 'demo-service-key'
};

// Export a function to check if we're in demo mode
export function isDemoMode() {
  // Check if Supabase is configured with real credentials
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If URL is demo URL or not properly configured, we're in demo mode
  return !url || url === 'https://demo.supabase.co' || !key || key.includes('demo');
}

// Export function to get demo user info
export function getDemoUser() {
  return {
    id: 'demo-user',
    email: 'demo@example.com',
    created_at: new Date().toISOString()
  };
}