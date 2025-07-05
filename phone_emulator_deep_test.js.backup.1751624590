const { chromium, devices } = require('playwright');

let attemptNumber = 1;

async function phoneEmulatorDeepTest() {
  console.log(`\n🔄 PHONE EMULATOR ATTEMPT ${attemptNumber}: Deep Provider Analysis`);
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--enable-features=TouchEvents', '--disable-web-security', '--enable-touch-events']
  });
  
  // Test with both iPhone and Android
  const devices_to_test = [
    { 
      name: 'iPhone 14 Pro', 
      device: devices['iPhone 14 Pro'],
      region: 'Australia',
      locale: 'en-AU',
      timezone: 'Australia/Sydney',
      flag: '🇦🇺'
    },
    { 
      name: 'Galaxy S24', 
      device: devices['Galaxy S24'],
      region: 'USA', 
      locale: 'en-US',
      timezone: 'America/New_York',
      flag: '🇺🇸'
    },
    { 
      name: 'iPhone 14 Pro', 
      device: devices['iPhone 14 Pro'],
      region: 'Europe',
      locale: 'en-GB',
      timezone: 'Europe/London',
      flag: '🇪🇺'
    }
  ];
  
  for (const testConfig of devices_to_test) {
    console.log(`\n${testConfig.flag} Testing ${testConfig.name} in ${testConfig.region}`);
    console.log(`Device specs:`, {
      userAgent: testConfig.device.userAgent,
      viewport: testConfig.device.viewport,
      isMobile: testConfig.device.isMobile,
      hasTouch: testConfig.device.hasTouch
    });
    
    const context = await browser.newContext({
      ...testConfig.device,
      locale: testConfig.locale,
      timezoneId: testConfig.timezone
    });
    
    const page = await context.newPage();
    
    try {
      // Strategy: Different approaches per attempt
      let url = 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo';
      
      if (attemptNumber === 2) {
        // Try with fiat=true parameter
        url = 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&fiat=true';
      } else if (attemptNumber === 3) {
        // Try with different currency pair that might show providers
        url = 'https://simpleswap.io/?from=usd&to=btc&amount=100&partner=auralo';
      } else if (attemptNumber === 4) {
        // Try direct exchange creation
        url = 'https://simpleswap.io/create-exchange?from=eur&to=pol&amount=15';
      }
      
      console.log(`Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for page to fully load
      await page.waitForTimeout(3000);
      
      // Enhanced exchange completion flow
      console.log('📋 Completing exchange setup...');
      
      // Fill wallet address if available
      const walletSelectors = [
        'input[placeholder*="address"]',
        'input[placeholder*="wallet"]', 
        'input[placeholder*="recipient"]',
        'input[name*="address"]',
        'input[type="text"]:not([type="email"]):not([type="password"])'
      ];
      
      for (const selector of walletSelectors) {
        try {
          const walletInput = await page.$(selector);
          if (walletInput) {
            await walletInput.fill('0x1234567890123456789012345678901234567890');
            console.log(`✅ Filled wallet with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      await page.waitForTimeout(1000);
      
      // Try to proceed to next step - multiple button strategies
      const buttonSelectors = [
        'button:has-text("Exchange")',
        'button:has-text("Continue")', 
        'button:has-text("Next")',
        'button:has-text("Create")',
        'button[type="submit"]',
        '.exchange-button',
        '.continue-button',
        'button:contains("Exchange")'
      ];
      
      let exchangeInitiated = false;
      for (const selector of buttonSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            console.log(`🔘 Clicking button: ${selector}`);
            await button.click();
            await page.waitForTimeout(2000);
            exchangeInitiated = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!exchangeInitiated) {
        // Try Enter key or form submission
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
      }
      
      // Wait for provider selection to appear
      await page.waitForTimeout(5000);
      
      console.log(`\n🔍 ${testConfig.flag} Analyzing for provider selection...`);
      
      // Deep provider analysis
      const providerAnalysis = await page.evaluate(() => {
        const results = {
          url: window.location.href,
          title: document.title,
          mercuryoElements: [],
          moonpayElements: [],
          greenElements: [],
          providerCards: [],
          paymentMethods: [],
          selectionElements: []
        };
        
        // Find all elements
        document.querySelectorAll('*').forEach((el, index) => {
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          // Enhanced green detection - check all CSS properties
          const allStyles = [
            style.borderColor,
            style.borderTopColor,
            style.borderRightColor, 
            style.borderBottomColor,
            style.borderLeftColor,
            style.backgroundColor,
            style.color,
            style.boxShadow,
            style.outline,
            style.textShadow
          ].join(' ').toLowerCase();
          
          const hasGreen = allStyles.includes('34, 197, 94') ||
                          allStyles.includes('rgb(34, 197, 94)') ||
                          allStyles.includes('#22c55e') ||
                          allStyles.includes('22c55e') ||
                          allStyles.includes('green') ||
                          allStyles.includes('rgba(34, 197, 94') ||
                          allStyles.includes('34,197,94');
          
          // Check for Mercuryo mentions
          if (text.includes('mercuryo') && el.offsetWidth > 0 && el.offsetHeight > 0) {
            results.mercuryoElements.push({
              index,
              text: el.textContent.substring(0, 120),
              hasGreen,
              tag: el.tagName,
              className: el.className,
              id: el.id,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor,
              borderWidth: style.borderTopWidth,
              isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
            });
          }
          
          // Check for MoonPay mentions
          if (text.includes('moonpay') && el.offsetWidth > 0 && el.offsetHeight > 0) {
            results.moonpayElements.push({
              index,
              text: el.textContent.substring(0, 120),
              hasGreen,
              tag: el.tagName,
              className: el.className,
              id: el.id,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor,
              borderWidth: style.borderTopWidth,
              isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
            });
          }
          
          // Look for payment provider cards/options
          const isProviderCard = text.includes('provider') || 
                                text.includes('payment') ||
                                text.includes('method') ||
                                (text.includes('card') && text.includes('pay')) ||
                                el.className.toLowerCase().includes('provider') ||
                                el.className.toLowerCase().includes('payment') ||
                                el.className.toLowerCase().includes('method');
          
          if (isProviderCard && el.offsetWidth > 50 && el.offsetHeight > 20) {
            results.providerCards.push({
              text: el.textContent.substring(0, 100),
              hasGreen,
              className: el.className,
              borderColor: style.borderColor
            });
          }
          
          // Collect green elements
          if (hasGreen && el.offsetWidth > 0 && el.offsetHeight > 0) {
            results.greenElements.push({
              text: el.textContent.substring(0, 80),
              tag: el.tagName,
              className: el.className,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              styles: allStyles.substring(0, 200)
            });
          }
          
          // Look for selection indicators (checkmarks, selected states)
          const isSelected = el.className.toLowerCase().includes('selected') ||
                            el.className.toLowerCase().includes('active') ||
                            el.className.toLowerCase().includes('checked') ||
                            text.includes('✓') ||
                            text.includes('selected') ||
                            hasGreen;
          
          if (isSelected && el.offsetWidth > 0 && el.offsetHeight > 0) {
            results.selectionElements.push({
              text: el.textContent.substring(0, 60),
              className: el.className,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              hasGreen
            });
          }
        });
        
        return results;
      });
      
      console.log(`${testConfig.flag} Results:`);
      console.log(`  📄 Page: ${providerAnalysis.title}`);
      console.log(`  🔗 URL: ${providerAnalysis.url}`);
      console.log(`  💳 Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
      console.log(`  🌙 MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
      console.log(`  🟢 Green elements: ${providerAnalysis.greenElements.length}`);
      console.log(`  📋 Provider cards: ${providerAnalysis.providerCards.length}`);
      console.log(`  ✅ Selection elements: ${providerAnalysis.selectionElements.length}`);
      
      // Detailed Mercuryo analysis
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`\n  💳 MERCURYO DETAILS:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`    ${i + 1}. ${el.tag} "${el.text}"`);
          console.log(`       Green: ${el.hasGreen}, Border: ${el.borderColor}, BG: ${el.backgroundColor}`);
          if (el.hasGreen) {
            console.log(`       🎯 HAS GREEN! Width: ${el.borderWidth}`);
          }
        });
      }
      
      // Detailed MoonPay analysis  
      if (providerAnalysis.moonpayElements.length > 0) {
        console.log(`\n  🌙 MOONPAY DETAILS:`);
        providerAnalysis.moonpayElements.forEach((el, i) => {
          console.log(`    ${i + 1}. ${el.tag} "${el.text}"`);
          console.log(`       Green: ${el.hasGreen}, Border: ${el.borderColor}, BG: ${el.backgroundColor}`);
          if (el.hasGreen) {
            console.log(`       🎯 HAS GREEN! Width: ${el.borderWidth}`);
          }
        });
      }
      
      // Green elements analysis
      if (providerAnalysis.greenElements.length > 0) {
        console.log(`\n  🟢 GREEN ELEMENTS:`);
        providerAnalysis.greenElements.forEach((el, i) => {
          console.log(`    ${i + 1}. ${el.tag}.${el.className} "${el.text}"`);
          console.log(`       Mercuryo: ${el.hasMercuryo}, MoonPay: ${el.hasMoonpay}`);
        });
      }
      
      // Check for success
      const mercuryoWithGreen = providerAnalysis.mercuryoElements.some(el => el.hasGreen && el.isVisible);
      const moonpayWithGreen = providerAnalysis.moonpayElements.some(el => el.hasGreen && el.isVisible);
      
      console.log(`\n  🎯 ${testConfig.flag} SUCCESS CHECK:`);
      console.log(`     ✅ Mercuryo with green: ${mercuryoWithGreen}`);
      console.log(`     ❌ MoonPay with green: ${moonpayWithGreen}`);
      
      if (mercuryoWithGreen) {
        console.log(`\n  🎉 SUCCESS! Found Mercuryo with green border on ${testConfig.name}!`);
        console.log(`     Testing 5-second persistence...`);
        
        await page.waitForTimeout(2000);
        
        // Check persistence at 5 seconds
        const persistenceCheck = await page.evaluate(() => {
          let mercuryoStillGreen = false;
          let moonpayNowGreen = false;
          
          document.querySelectorAll('*').forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            const style = window.getComputedStyle(el);
            
            const allStyles = [
              style.borderColor,
              style.borderTopColor,
              style.borderRightColor, 
              style.borderBottomColor,
              style.borderLeftColor,
              style.backgroundColor,
              style.boxShadow
            ].join(' ').toLowerCase();
            
            const hasGreen = allStyles.includes('34, 197, 94') ||
                            allStyles.includes('rgb(34, 197, 94)') ||
                            allStyles.includes('#22c55e') ||
                            allStyles.includes('green');
            
            if (text.includes('mercuryo') && hasGreen && el.offsetWidth > 0) {
              mercuryoStillGreen = true;
            }
            if (text.includes('moonpay') && hasGreen && el.offsetWidth > 0) {
              moonpayNowGreen = true;
            }
          });
          
          return { mercuryoStillGreen, moonpayNowGreen };
        });
        
        console.log(`\n  ⏰ 5-SECOND PERSISTENCE CHECK:`);
        console.log(`     ✅ Mercuryo still green: ${persistenceCheck.mercuryoStillGreen}`);
        console.log(`     ❌ MoonPay now green: ${persistenceCheck.moonpayNowGreen}`);
        
        if (persistenceCheck.mercuryoStillGreen && !persistenceCheck.moonpayNowGreen) {
          console.log(`\n  🏆 MISSION ACCOMPLISHED on ${testConfig.name} ${testConfig.region}!`);
          console.log(`     ✅ Mercuryo green border persists after 5 seconds`);
          console.log(`     ✅ MoonPay does not have green border`);
          
          await page.screenshot({ path: `success_${testConfig.name.replace(' ', '_')}_${testConfig.region}.png` });
          console.log(`     📸 Success screenshot saved`);
          
          await browser.close();
          return true;
        }
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `attempt_${attemptNumber}_${testConfig.name.replace(' ', '_')}_${testConfig.region}.png`,
        fullPage: true 
      });
      
      await context.close();
      
    } catch (error) {
      console.error(`❌ Error testing ${testConfig.name} ${testConfig.region}:`, error.message);
      await context.close();
    }
  }
  
  await browser.close();
  
  // Continue with next attempt if not successful
  if (attemptNumber < 5) {
    attemptNumber++;
    console.log(`\n🔄 Moving to attempt ${attemptNumber}...`);
    return await phoneEmulatorDeepTest();
  }
  
  return false;
}

// Start the deep phone emulator test
phoneEmulatorDeepTest().then(success => {
  if (success) {
    console.log('\n🎉 FINAL SUCCESS: Mercuryo green border detected and persists on mobile!');
  } else {
    console.log('\n❌ FINAL: Could not detect provider selection interface after all attempts');
    console.log('This suggests the provider selection may happen at a different stage or require different triggers');
  }
});