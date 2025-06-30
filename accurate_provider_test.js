const { chromium, devices } = require('playwright');

(async () => {
  console.log('🎯 ACCURATE Provider Selection Test with Mobile Emulation...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents']
  });
  
  // Test Australia - Samsung Galaxy S24 (Android)
  console.log('📱 AUSTRALIA - Samsung Galaxy S24 (Android)');
  const galaxyDevice = devices['Galaxy S24'];
  
  const context = await browser.newContext({
    ...galaxyDevice,
    locale: 'en-AU',
    timezoneId: 'Australia/Sydney'
  });
  
  const page = await context.newPage();
  
  // Navigate to SimpleSwap
  await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
  console.log('✅ Navigated to SimpleSwap');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Fill wallet address
  console.log('🔍 Looking for wallet address field...');
  const walletSelector = 'input[placeholder*="address"], input[placeholder*="wallet"], input[placeholder*="Enter"], input[type="text"]';
  await page.waitForSelector(walletSelector, { timeout: 10000 });
  
  const walletInput = await page.$(walletSelector);
  if (walletInput) {
    await walletInput.fill('0x1234567890123456789012345678901234567890');
    console.log('✅ Filled wallet address');
  }
  
  // Click Exchange button to proceed to provider selection
  console.log('🔍 Looking for Exchange button...');
  await page.waitForTimeout(1000);
  
  // Find and click the Exchange button
  const exchangeButton = await page.$('button:has-text("Exchange"), button:has-text("Create"), button[type="submit"]');
  if (exchangeButton) {
    console.log('✅ Found Exchange button, clicking...');
    await exchangeButton.click();
    
    // Wait for provider selection page to load
    await page.waitForTimeout(5000);
    console.log('✅ Proceeding to provider selection...');
  } else {
    console.log('❌ Exchange button not found, trying alternative approach...');
    // Try pressing Enter or clicking any prominent button
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
  }
  
  // Now we should be on the provider selection page
  // Check for providers at different intervals
  console.log('\n⏱️  Checking provider selection...\n');
  
  // Wait for providers to load
  await page.waitForTimeout(2000);
  
  // Check at 3 seconds
  console.log('🕐 3-Second Provider Check:');
  const check3s = await page.evaluate(() => {
    const results = {
      pageUrl: window.location.href,
      mercuryoElements: [],
      moonpayElements: [],
      greenBorderedElements: [],
      allProviderElements: []
    };
    
    // Look for provider elements more broadly
    document.querySelectorAll('*').forEach((el, index) => {
      const text = (el.textContent || '').toLowerCase();
      const style = window.getComputedStyle(el);
      
      // Check for green borders with multiple methods
      const borderColors = [
        style.borderColor,
        style.borderTopColor,
        style.borderBottomColor,
        style.borderLeftColor,
        style.borderRightColor
      ];
      
      const hasGreenBorder = borderColors.some(color => 
        color.includes('34, 197, 94') ||
        color.includes('rgb(34, 197, 94)') ||
        color.includes('#22c55e') ||
        color.includes('22, 197, 94')
      ) || style.boxShadow.includes('34, 197, 94') ||
          style.outline.includes('34, 197, 94');
      
      // Check for provider text
      if (text.includes('mercuryo') && el.children.length <= 5) {
        results.mercuryoElements.push({
          index,
          text: el.textContent.substring(0, 100),
          hasGreenBorder,
          borderColor: style.borderColor,
          borderWidth: style.borderTopWidth,
          backgroundColor: style.backgroundColor,
          className: el.className,
          tagName: el.tagName
        });
      }
      
      if (text.includes('moonpay') && el.children.length <= 5) {
        results.moonpayElements.push({
          index,
          text: el.textContent.substring(0, 100),
          hasGreenBorder,
          borderColor: style.borderColor,
          borderWidth: style.borderTopWidth,
          backgroundColor: style.backgroundColor,
          className: el.className,
          tagName: el.tagName
        });
      }
      
      // Collect elements that might be provider options
      if ((text.includes('provider') || text.includes('option') || 
           text.includes('pay') || text.includes('method')) &&
          el.offsetWidth > 50 && el.offsetHeight > 20) {
        results.allProviderElements.push({
          text: el.textContent.substring(0, 80),
          hasGreenBorder,
          className: el.className
        });
      }
      
      if (hasGreenBorder) {
        results.greenBorderedElements.push({
          text: el.textContent.substring(0, 60),
          hasMercuryo: text.includes('mercuryo'),
          hasMoonpay: text.includes('moonpay'),
          borderColor: style.borderColor,
          borderWidth: style.borderTopWidth,
          className: el.className
        });
      }
    });
    
    return results;
  });
  
  console.log('Page URL:', check3s.pageUrl);
  console.log('Mercuryo elements found:', check3s.mercuryoElements.length);
  if (check3s.mercuryoElements.length > 0) {
    check3s.mercuryoElements.forEach(el => {
      console.log(`  - "${el.text}" - Green border: ${el.hasGreenBorder}`);
      if (el.hasGreenBorder) {
        console.log(`    Border: ${el.borderWidth} ${el.borderColor}`);
      }
    });
  }
  
  console.log('MoonPay elements found:', check3s.moonpayElements.length);
  if (check3s.moonpayElements.length > 0) {
    check3s.moonpayElements.forEach(el => {
      console.log(`  - "${el.text}" - Green border: ${el.hasGreenBorder}`);
      if (el.hasGreenBorder) {
        console.log(`    Border: ${el.borderWidth} ${el.borderColor}`);
      }
    });
  }
  
  console.log('Green bordered elements:', check3s.greenBorderedElements.length);
  if (check3s.greenBorderedElements.length > 0) {
    check3s.greenBorderedElements.forEach(el => {
      console.log(`  - "${el.text}" (Mercuryo: ${el.hasMercuryo}, MoonPay: ${el.hasMoonpay})`);
    });
  }
  
  // Wait 2 more seconds for 5-second check
  await page.waitForTimeout(2000);
  
  console.log('\n🕔 5-Second Provider Check:');
  const check5s = await page.evaluate(() => {
    const results = {
      mercuryoHasGreenBorder: false,
      moonpayHasGreenBorder: false,
      fiatAmount: null,
      mercuryoDetails: null,
      moonpayDetails: null
    };
    
    // Check fiat amount in page
    const bodyText = document.body.textContent;
    if (bodyText.includes('€15')) results.fiatAmount = '€15';
    if (bodyText.includes('€21')) results.fiatAmount = '€21';
    if (bodyText.includes('15 EUR')) results.fiatAmount = '€15';
    if (bodyText.includes('21 EUR')) results.fiatAmount = '€21';
    
    // Look for Mercuryo and MoonPay with green borders
    document.querySelectorAll('*').forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      const style = window.getComputedStyle(el);
      
      const borderColors = [
        style.borderColor,
        style.borderTopColor,
        style.borderBottomColor,
        style.borderLeftColor,
        style.borderRightColor
      ];
      
      const hasGreenBorder = borderColors.some(color => 
        color.includes('34, 197, 94') ||
        color.includes('rgb(34, 197, 94)') ||
        color.includes('#22c55e') ||
        color.includes('22, 197, 94')
      ) || style.boxShadow.includes('34, 197, 94');
      
      if (text.includes('mercuryo') && el.children.length <= 5) {
        if (hasGreenBorder) {
          results.mercuryoHasGreenBorder = true;
          results.mercuryoDetails = {
            text: el.textContent.substring(0, 100),
            borderColor: style.borderColor,
            borderWidth: style.borderTopWidth
          };
        }
      }
      
      if (text.includes('moonpay') && el.children.length <= 5) {
        if (hasGreenBorder) {
          results.moonpayHasGreenBorder = true;
          results.moonpayDetails = {
            text: el.textContent.substring(0, 100),
            borderColor: style.borderColor,
            borderWidth: style.borderTopWidth
          };
        }
      }
    });
    
    return results;
  });
  
  console.log(`Mercuryo has green border: ${check5s.mercuryoHasGreenBorder}`);
  if (check5s.mercuryoDetails) {
    console.log(`  Details: "${check5s.mercuryoDetails.text}"`);
    console.log(`  Border: ${check5s.mercuryoDetails.borderWidth} ${check5s.mercuryoDetails.borderColor}`);
  }
  
  console.log(`MoonPay has green border: ${check5s.moonpayHasGreenBorder}`);
  if (check5s.moonpayDetails) {
    console.log(`  Details: "${check5s.moonpayDetails.text}"`);
    console.log(`  Border: ${check5s.moonpayDetails.borderWidth} ${check5s.moonpayDetails.borderColor}`);
  }
  
  console.log(`Fiat amount detected: ${check5s.fiatAmount || 'Not found'}`);
  
  // Take final screenshot
  await page.screenshot({ path: 'accurate_provider_australia_5s.png', fullPage: true });
  console.log('\n📸 Screenshot saved: accurate_provider_australia_5s.png');
  
  // Final assessment
  console.log('\n📊 FINAL ASSESSMENT for Australia:');
  const success = check5s.mercuryoHasGreenBorder && !check5s.moonpayHasGreenBorder;
  const amountOK = check5s.fiatAmount === '€15' || check5s.fiatAmount === null;
  
  console.log(`✅ Mercuryo selected (green border): ${check5s.mercuryoHasGreenBorder}`);
  console.log(`❌ MoonPay incorrectly selected: ${check5s.moonpayHasGreenBorder}`);
  console.log(`💰 Amount preserved (€15): ${amountOK}`);
  console.log(`🎯 Overall Success: ${success && amountOK}`);
  
  await browser.close();
})();