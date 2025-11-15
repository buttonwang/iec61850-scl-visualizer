// Simple test to verify deployment is working
console.log('Deployment test - checking if environment is properly configured');

// Check if we're in production
if (typeof window !== 'undefined') {
  console.log('Running in browser environment');
  
  // Test basic functionality
  const testDiv = document.createElement('div');
  testDiv.innerHTML = 'Deployment Test: Site is loading correctly';
  testDiv.style.position = 'fixed';
  testDiv.style.top = '10px';
  testDiv.style.right = '10px';
  testDiv.style.backgroundColor = 'green';
  testDiv.style.color = 'white';
  testDiv.style.padding = '10px';
  testDiv.style.zIndex = '9999';
  document.body.appendChild(testDiv);
  
  setTimeout(() => {
    testDiv.remove();
  }, 5000);
} else {
  console.log('Running in server environment');
}