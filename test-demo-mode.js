// Test demo mode functionality
const fetch = require('node-fetch').default;
const FormData = require('form-data');
const fs = require('fs');

async function testDemoMode() {
  const baseUrl = 'http://localhost:3000';
  console.log('🎯 Testing Demo Mode (No Authentication Required)...\n');

  try {
    // Test file upload in demo mode
    console.log('1️⃣ Testing File Upload in Demo Mode...');
    const form = new FormData();
    const fileContent = fs.readFileSync('test-sample.scd');
    form.append('file', fileContent, {
      filename: 'test-sample.scd',
      contentType: 'application/xml'
    });

    const uploadResponse = await fetch(`${baseUrl}/api/upload-demo`, {
      method: 'POST',
      body: form
    });

    if (!uploadResponse.ok) {
      throw new Error(`Demo upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Demo file upload successful!');
    console.log(`   File: ${uploadData.fileName}`);
    console.log(`   Substations: ${uploadData.parsedData.substations.length}`);
    console.log(`   IEDs: ${uploadData.parsedData.ieds.length}`);

    // Test message simulation in demo mode
    console.log('\n2️⃣ Testing Message Simulation in Demo Mode...');
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
      throw new Error(`Demo simulation failed: ${simulateResponse.status}`);
    }

    const simulateData = await simulateResponse.json();
    console.log('✅ Demo message simulation successful!');
    console.log(`   Message Type: ${simulateData.simulation.messageType}`);
    console.log(`   Response Time: ${simulateData.simulation.responseTime}ms`);
    console.log(`   Status: ${simulateData.simulation.result.deviceStatus}`);

    console.log('\n🎉 Demo Mode Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ File upload works without authentication');
    console.log('✅ Message simulation works without authentication');
    console.log('✅ SCL parsing works in demo mode');
    console.log('\n🚀 The application is now ready for testing without login!');

  } catch (error) {
    console.error('❌ Demo mode test failed:', error.message);
    process.exit(1);
  }
}

testDemoMode();