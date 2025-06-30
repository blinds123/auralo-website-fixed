const { chromium, devices } = require('playwright');

(async () => {
  console.log('🚀 Starting TRUE mobile emulation test...\n');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents']
  });
  
  // Test 1: Australia - Samsung Galaxy
  console.log('📱 TEST 1: AUSTRALIA - Samsung Galaxy S24');
  const galaxyDevice = devices['Galaxy S24'];
  const australiaContext = await browser.newContext({
    ...galaxyDevice,
    locale: 'en-AU',
    timezoneId: 'Australia/Sydney'
  });
  
  const page1 = await australiaContext.newPage();
  
  // Go directly to SimpleSwap
  console.log('Navigating directly to SimpleSwap...');
  await page1.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
  
  // Wait for page to load
  await page1.waitForTimeout(5000);
  
  // Check at 5 seconds
  console.log('\n🔍 Checking at 5 seconds...');
  const result1 = await page1.evaluate(() => {
    const results = {
      deviceCheck: {
        userAgent: navigator.userAgent,
        isMobile: /Mobile|Android/.test(navigator.userAgent),
        touchPoints: navigator.maxTouchPoints,
        screenWidth: screen.width
      },
      providers: {
        mercuryoFound: false,
        moonpayFound: false,
        greenBorderElements: []
      }
    };
    
    // Check all elements
    document.querySelectorAll('*').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const style = window.getComputedStyle(el);
      
      if (text.includes('mercuryo')) results.providers.mercuryoFound = true;
      if (text.includes('moonpay')) results.providers.moonpayFound = true;
      
      // Check for green borders (rgb(34, 197, 94))
      if (style.borderColor.includes('34, 197, 94') || 
          style.backgroundColor.includes('34, 197, 94')) {
        results.providers.greenBorderElements.push({
          text: el.textContent.substring(0, 30),
          hasMercuryo: text.includes('mercuryo'),
          hasMoonpay: text.includes('moonpay')
        });
      }
    });
    
    return results;
  });
  
  console.log('Device Detection:', result1.deviceCheck);
  console.log('Provider Results:', result1.providers);
  
  // Take screenshot
  await page1.screenshot({ path: 'australia_mobile_5s.png' });
  console.log('📸 Screenshot saved: australia_mobile_5s.png');
  
  // Test 2: USA - iPhone
  console.log('\n\n📱 TEST 2: USA - iPhone 14 Pro');
  const iPhone = devices['iPhone 14 Pro'];
  const usaContext = await browser.newContext({
    ...iPhone,
    locale: 'en-US',
    timezoneId: 'America/New_York'
  });
  
  const page2 = await usaContext.newPage();
  await page2.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
  await page2.waitForTimeout(5000);
  
  const result2 = await page2.evaluate(() => {
    const results = {
      deviceCheck: {
        userAgent: navigator.userAgent,
        isMobile: /iPhone|iPad/.test(navigator.userAgent),
        platform: navigator.platform,
        screenWidth: screen.width
      },
      providers: {
        mercuryoFound: false,
        moonpayFound: false,
        greenBorderElements: []
      }
    };
    
    document.querySelectorAll('*').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const style = window.getComputedStyle(el);
      
      if (text.includes('mercuryo')) results.providers.mercuryoFound = true;
      if (text.includes('moonpay')) results.providers.moonpayFound = true;
      
      if (style.borderColor.includes('34, 197, 94') || 
          style.backgroundColor.includes('34, 197, 94')) {
        results.providers.greenBorderElements.push({
          text: el.textContent.substring(0, 30),
          hasMercuryo: text.includes('mercuryo'),
          hasMoonpay: text.includes('moonpay')
        });
      }
    });
    
    return results;
  });
  
  console.log('Device Detection:', result2.deviceCheck);
  console.log('Provider Results:', result2.providers);
  await page2.screenshot({ path: 'usa_iphone_5s.png' });
  console.log('📸 Screenshot saved: usa_iphone_5s.png');
  
  // Test 3: Europe - Samsung
  console.log('\n\n📱 TEST 3: EUROPE - Samsung Galaxy');
  const europeContext = await browser.newContext({
    ...galaxyDevice,
    locale: 'en-GB',
    timezoneId: 'Europe/London'
  });
  
  const page3 = await europeContext.newPage();
  await page3.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
  await page3.waitForTimeout(5000);
  
  const result3 = await page3.evaluate(() => {
    const results = {
      deviceCheck: {
        userAgent: navigator.userAgent,
        isMobile: /Mobile|Android/.test(navigator.userAgent),
        language: navigator.language,
        screenWidth: screen.width
      },
      providers: {
        mercuryoFound: false,
        moonpayFound: false,
        greenBorderElements: []
      }
    };
    
    document.querySelectorAll('*').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const style = window.getComputedStyle(el);
      
      if (text.includes('mercuryo')) results.providers.mercuryoFound = true;
      if (text.includes('moonpay')) results.providers.moonpayFound = true;
      
      if (style.borderColor.includes('34, 197, 94') || 
          style.backgroundColor.includes('34, 197, 94')) {
        results.providers.greenBorderElements.push({
          text: el.textContent.substring(0, 30),
          hasMercuryo: text.includes('mercuryo'),
          hasMoonpay: text.includes('moonpay')
        });
      }
    });
    
    return results;
  });
  
  console.log('Device Detection:', result3.deviceCheck);
  console.log('Provider Results:', result3.providers);
  await page3.screenshot({ path: 'europe_mobile_5s.png' });
  console.log('📸 Screenshot saved: europe_mobile_5s.png');
  
  console.log('\n\n✅ ALL TESTS COMPLETE');
  console.log('Check the screenshots to visually verify the green border selection.');
  
  await browser.close();
})();
