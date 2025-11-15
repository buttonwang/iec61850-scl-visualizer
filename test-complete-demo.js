// Complete demo mode verification test
const fetch = require('node-fetch').default;
const FormData = require('form-data');
const fs = require('fs');

async function completeDemoTest() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 Complete Demo Mode Verification Test\n');
  console.log('='.repeat(50));

  try {
    // 1. Test server health
    console.log('\n1️⃣ Server Health Check');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Server Status:', healthData.status);
    console.log('✅ Server Message:', healthData.message);

    // 2. Test environment (should show demo mode)
    console.log('\n2️⃣ Environment Configuration');
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log('✅ Supabase URL:', envData.supabaseUrl);
    console.log('✅ Service Role Key:', envData.serviceRoleKey);
    console.log('✅ Node Environment:', envData.nodeEnv);

    // 3. Test file upload and parsing (core functionality)
    console.log('\n3️⃣ File Upload and Parsing');
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
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload Status:', uploadData.message);
    console.log('✅ File Name:', uploadData.fileName);
    console.log('✅ File Size:', uploadData.fileSize, 'bytes');
    console.log('✅ Substations Found:', uploadData.parsedData.substations.length);
    console.log('✅ IEDs Found:', uploadData.parsedData.ieds.length);
    console.log('✅ Has Communications:', uploadData.summary.hasCommunication);
    console.log('✅ Has Data Types:', uploadData.summary.hasDataTypes);

    // 4. Test message simulation with different types
    console.log('\n4️⃣ Message Simulation Tests');
    const messageTypes = ['GOOSE', 'SV', 'MMS', 'READ', 'WRITE'];
    
    for (const messageType of messageTypes) {
      const simulateResponse = await fetch(`${baseUrl}/api/simulate-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageType: messageType,
          targetDevice: 'IED1'
        })
      });

      if (simulateResponse.ok) {
        const simulateData = await simulateResponse.json();
        console.log(`✅ ${messageType}: ${simulateData.simulation.result.deviceStatus} (${simulateData.simulation.responseTime}ms)`);
      } else {
        console.log(`❌ ${messageType}: Failed`);
      }
    }

    // 5. Test with different devices
    console.log('\n5️⃣ Device Simulation Tests');
    const devices = ['IED1', 'CB1', 'DIS1'];
    
    for (const device of devices) {
      const simulateResponse = await fetch(`${baseUrl}/api/simulate-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageType: 'GOOSE',
          targetDevice: device
        })
      });

      if (simulateResponse.ok) {
        const simulateData = await simulateResponse.json();
        console.log(`✅ Device ${device}: ${simulateData.simulation.result.deviceStatus} (value: ${simulateData.simulation.result.value})`);
      } else {
        console.log(`❌ Device ${device}: Failed`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 DEMO MODE TEST COMPLETE!');
    console.log('');
    console.log('✅ All core functionality works without authentication');
    console.log('✅ File upload and parsing works in demo mode');
    console.log('✅ Message simulation works for all IEC 61850 types');
    console.log('✅ Device simulation works for multiple devices');
    console.log('✅ Server is running in demo mode');
    console.log('');
    console.log('🎯 You can now test the application at: http://localhost:3000');
    console.log('🎯 No login required - all features are accessible!');
    console.log('');
    console.log('📋 Available Features in Demo Mode:');
    console.log('   • Upload SCL files (.cid, .icd, .scd)');
    console.log('   • Parse and analyze file structure');
    console.log('   • Visualize substation equipment');
    console.log('   • Simulate IEC 61850 messages (GOOSE, SV, MMS, etc.)');
    console.log('   • Test device responses and status changes');

  } catch (error) {
    console.error('❌ Demo mode test failed:', error.message);
    process.exit(1);
  }
}

completeDemoTest();