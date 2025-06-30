const { devices } = require('playwright');

console.log('Available Playwright devices:');
Object.keys(devices).forEach(device => {
  if (device.toLowerCase().includes('galaxy') || device.toLowerCase().includes('pixel')) {
    console.log(`- ${device}`);
  }
});

// Let's use Pixel 5 which is a common Android device
console.log('\nUsing Pixel 5 configuration:');
console.log(devices['Pixel 5']);