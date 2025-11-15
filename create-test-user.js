// Test user creation script
const fetch = require('node-fetch').default;

async function createTestUser() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('👤 Creating test user...\n');
  
  try {
    // Create test user with realistic email format
    const userData = {
      email: 'testuser1234@testmail.com',
      password: 'TestPassword123!'
    };
    
    console.log('📧 Email:', userData.email);
    console.log('🔑 Password:', userData.password);
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Registration failed:', response.status, errorText);
      
      // Try to parse error details
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          console.log('Error details:', errorData.error);
        }
        if (errorData.details) {
          console.log('Additional details:', errorData.details);
        }
      } catch (parseError) {
        console.log('Raw error response:', errorText);
      }
      
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Test user created successfully!');
    console.log('📋 User ID:', data.user?.id || 'Not provided');
    console.log('📧 Email:', data.user?.email || userData.email);
    console.log('📅 Created at:', data.user?.created_at || 'Not provided');
    
    if (data.message) {
      console.log('💬 Message:', data.message);
    }
    
    console.log('\n🎯 Test User Credentials:');
    console.log('Email: testuser1234@testmail.com');
    console.log('Password: TestPassword123!');
    console.log('\n🔒 Note: This user may need email confirmation depending on your Supabase settings.');
    
  } catch (error) {
    console.log('❌ User creation failed:', error.message);
  }
}

createTestUser();