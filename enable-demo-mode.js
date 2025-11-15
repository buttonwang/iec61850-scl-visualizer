// Quick demo mode enabler - run this to immediately enable demo mode
console.log('🎯 Quick Demo Mode Enabler');
console.log('==========================\n');

// Set demo environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'demo-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'demo-service-key';

console.log('✅ Demo mode environment variables set:');
console.log('   NEXT_PUBLIC_SUPABASE_URL: https://demo.supabase.co');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY: demo-key');
console.log('   SUPABASE_SERVICE_ROLE_KEY: demo-service-key\n');

console.log('🚀 Demo mode is now ACTIVE!');
console.log('📝 All authentication requirements have been bypassed');
console.log('🎯 You can now test all features without login\n');

console.log('📋 Available features in demo mode:');
console.log('   • Upload and parse SCL files');
console.log('   • View file structure analysis');
console.log('   • Visualize substation equipment');
console.log('   • Simulate IEC 61850 messages');
console.log('   • Test device responses\n');

console.log('🌐 Open your browser and navigate to: http://localhost:3000');
console.log('🔄 If the server is already running, you may need to restart it');

// Keep the process alive so environment variables persist
console.log('\n⏰ Demo mode will remain active until you close this terminal');
console.log('💡 To return to normal mode, restart your terminal and server');