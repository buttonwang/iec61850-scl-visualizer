// Simple API test script
async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing APIs...');
  
  // Test health check
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test environment check
  try {
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log('✅ Environment check:', envData);
  } catch (error) {
    console.log('❌ Environment check failed:', error.message);
  }
  
  // Test demo simulate
  try {
    const simulateResponse = await fetch(`${baseUrl}/api/simulate-demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageType: 'GOOSE',
        targetDevice: 'IED1'
      })
    });
    
    if (!simulateResponse.ok) {
      const errorText = await simulateResponse.text();
      console.log('❌ Simulate demo failed:', simulateResponse.status, errorText);
    } else {
      const simulateData = await simulateResponse.json();
      console.log('✅ Simulate demo:', simulateData);
    }
  } catch (error) {
    console.log('❌ Simulate demo failed:', error.message);
  }
}

testAPIs();