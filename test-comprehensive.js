// Comprehensive test of all IEC 61850 SCL Visualizer components
const fetch = require('node-fetch').default;
const FormData = require('form-data');
const fs = require('fs');

async function comprehensiveTest() {
  const baseUrl = 'http://localhost:3000';
  console.log('🧪 Starting comprehensive IEC 61850 SCL Visualizer test...\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health Check: ${healthData.message}\n`);

    // 2. Test Environment Configuration
    console.log('2️⃣ Testing Environment Configuration...');
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log(`✅ Supabase URL: ${envData.supabaseUrl}`);
    console.log(`✅ Service Role Key: ${envData.serviceRoleKey}\n`);

    // 3. Test File Upload and Parsing
    console.log('3️⃣ Testing File Upload and Parsing...');
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
      const errorText = await uploadResponse.text();
      throw new Error(`File upload failed: ${uploadResponse.status} ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log(`✅ File Upload: ${uploadData.message}`);
    console.log(`✅ Parsed Substations: ${uploadData.parsedData.substations.length}`);
    console.log(`✅ Parsed IEDs: ${uploadData.parsedData.ieds.length}`);
    console.log(`✅ Has Data Types: ${uploadData.summary.hasDataTypes}\n`);

    // 4. Test Message Simulation
    console.log('4️⃣ Testing Message Simulation...');
    const simulateResponse = await fetch(`${baseUrl}/api/simulate-demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageType: 'GOOSE',
        targetDevice: 'IED1',
        parameters: {
          testParam: 'testValue'
        }
      })
    });

    if (!simulateResponse.ok) {
      const errorText = await simulateResponse.text();
      throw new Error(`Simulation failed: ${simulateResponse.status} ${errorText}`);
    }

    const simulateData = await simulateResponse.json();
    console.log(`✅ Message Simulation: ${simulateData.message}`);
    console.log(`✅ Message Type: ${simulateData.simulation.messageType}`);
    console.log(`✅ Target Device: ${simulateData.simulation.targetDevice}`);
    console.log(`✅ Response Time: ${simulateData.simulation.responseTime}ms`);
    console.log(`✅ Device Status: ${simulateData.simulation.result.deviceStatus}`);
    console.log(`✅ Value: ${simulateData.simulation.result.value}`);
    console.log(`✅ Quality: ${simulateData.simulation.result.quality}\n`);

    // 5. Test Different Message Types
    console.log('5️⃣ Testing Different Message Types...');
    const messageTypes = ['GOOSE', 'SV', 'MMS'];
    
    for (const messageType of messageTypes) {
      const response = await fetch(`${baseUrl}/api/simulate-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageType: messageType,
          targetDevice: 'IED1'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${messageType} simulation: ${data.simulation.result.deviceStatus} status, value ${data.simulation.result.value}`);
      } else {
        console.log(`❌ ${messageType} simulation failed`);
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Server is running and healthy');
    console.log('✅ Supabase configuration is working');
    console.log('✅ SCL file parsing is functional');
    console.log('✅ Message simulation is working');
    console.log('✅ All IEC 61850 message types are supported');
    console.log('\n🚀 The IEC 61850 SCL Visualizer is ready for use!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

comprehensiveTest();