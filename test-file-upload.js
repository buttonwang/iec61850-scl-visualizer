const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch').default;

async function testFileUpload() {
  const form = new FormData();
  
  // Read the test file
  const fileContent = fs.readFileSync('test-sample.scd');
  
  // Append the file to form data
  form.append('file', fileContent, {
    filename: 'test-sample.scd',
    contentType: 'application/xml'
  });
  
  try {
    const response = await fetch('http://localhost:3000/api/upload-demo', {
      method: 'POST',
      body: form
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ File upload failed:', response.status, errorText);
    } else {
      const data = await response.json();
      console.log('✅ File upload successful:');
      console.log('Message:', data.message);
      console.log('File name:', data.fileName);
      console.log('Summary:', data.summary);
      console.log('Parsed data substations:', data.parsedData.substations.length);
      console.log('Parsed data IEDs:', data.parsedData.ieds.length);
    }
  } catch (error) {
    console.log('❌ File upload failed:', error.message);
  }
}

testFileUpload();