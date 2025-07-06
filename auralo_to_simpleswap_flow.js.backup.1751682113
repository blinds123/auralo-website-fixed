const { chromium, devices } = require('playwright');

class AuraloToSimpleSwapFlow {
  constructor() {
    this.attemptNumber = 1;
    this.maxAttempts = 50; // Infinite loop as requested
  }

  async executeFlow() {
    console.log(`\n🔄 AURALO→SIMPLESWAP ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    
    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox'
      ]
    });

    // Focus on iPhone and Android as requested
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
      try {
        const success = await this.testAuraloFlow(browser, testConfig);
        if (success) {
          console.log(`\n🏆 SUCCESS ACHIEVED ON ${testConfig.name} ${testConfig.region}!`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ Error on ${testConfig.name} ${testConfig.region}:`, error.message);
      }
    }

    await browser.close();
    
    // Continue infinite loop
    this.attemptNumber++;
    console.log(`\n🔄 Continuing to attempt ${this.attemptNumber}...`);
    
    // Add delay between attempts to prevent overwhelming
    await new Promise(resolve => setTimeout(resolve, 3000));
    return await this.executeFlow();
  }

  async testAuraloFlow(browser, config) {
    console.log(`\n${config.flag} Starting ${config.name} ${config.region} flow`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: config.locale,
      timezoneId: config.timezone
    });

    const page = await context.newPage();
    
    try {
      // Step 1: Navigate to Auralo website
      console.log(`  📱 1. Navigating to Auralo website...`);
      await page.goto('https://auralo-website-fixed.netlify.app', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      // Step 2: Scroll to bottom and find buy button
      console.log(`  📱 2. Scrolling to bottom for buy button...`);
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(2000);
      
      // Step 3: Look for the specific buy button text
      console.log(`  📱 3. Looking for 'copy your custom coupon code & complete your exchange' button...`);
      
      const buyButtonSelectors = [
        'text="copy your custom coupon code & complete your exchange"',
        '*:has-text("copy your custom coupon code & complete your exchange")',
        'button:has-text("copy your custom coupon code")',
        'a:has-text("copy your custom coupon code")',
        '[href*="simpleswap"]',
        'button:has-text("complete your exchange")',
        '.buy-button',
        '#buy-button',
        'button[onclick*="simpleswap"]'
      ];
      
      let buyButton = null;
      for (const selector of buyButtonSelectors) {
        try {
          buyButton = await page.$(selector);
          if (buyButton) {
            console.log(`  ✅ Found buy button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!buyButton) {
        // Try to find any button that might be the buy button
        console.log(`  🔍 Searching for any potential buy buttons...`);
        const allButtons = await page.$$('button, a, [role="button"]');
        
        for (const button of allButtons) {
          try {
            const text = await button.textContent();
            const href = await button.getAttribute('href');
            
            if ((text && (text.toLowerCase().includes('buy') || 
                         text.toLowerCase().includes('exchange') || 
                         text.toLowerCase().includes('coupon') ||
                         text.toLowerCase().includes('complete'))) ||
                (href && href.includes('simpleswap'))) {
              buyButton = button;
              console.log(`  ✅ Found potential buy button: "${text || href}"`);
              break;
            }
          } catch (e) {
            // Continue
          }
        }
      }
      
      if (!buyButton) {
        console.log(`  ❌ Could not find buy button. Taking screenshot for analysis...`);
        await page.screenshot({ 
          path: `auralo_nobuy_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
          fullPage: true 
        });
        await context.close();
        return false;
      }
      
      // Step 4: Click buy button and monitor for new tab
      console.log(`  📱 4. Clicking buy button...`);
      
      // Set up new page listener for SimpleSwap
      const newPagePromise = context.waitForEvent('page');
      
      await buyButton.click();
      
      // Wait for new tab
      console.log(`  📱 5. Waiting for SimpleSwap tab to open...`);
      let simpleSwapPage;
      
      try {
        simpleSwapPage = await newPagePromise;
        await simpleSwapPage.waitForLoadState('domcontentloaded');
        console.log(`  ✅ SimpleSwap tab opened: ${simpleSwapPage.url()}`);
      } catch (e) {
        console.log(`  ❌ No new tab opened. Checking current page...`);
        
        // Check if current page navigated to SimpleSwap
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        
        if (currentUrl.includes('simpleswap')) {
          simpleSwapPage = page;
          console.log(`  ✅ Current page navigated to SimpleSwap: ${currentUrl}`);
        } else {
          console.log(`  ❌ No SimpleSwap navigation detected. Current URL: ${currentUrl}`);
          await context.close();
          return false;
        }
      }
      
      // Step 6: Analyze SimpleSwap page for provider selection
      console.log(`  📱 6. Analyzing SimpleSwap for Mercuryo/MoonPay selection...`);
      
      await simpleSwapPage.waitForTimeout(5000); // Allow page to fully load
      
      // Enhanced provider detection
      const providerAnalysis = await this.analyzeProviders(simpleSwapPage, config);
      
      console.log(`  📊 Provider Analysis Results:`);
      console.log(`     Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
      console.log(`     MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
      console.log(`     Green elements: ${providerAnalysis.greenElements.length}`);
      console.log(`     Mercuryo with green border: ${providerAnalysis.mercuryoGreenDetected}`);
      console.log(`     MoonPay with green border: ${providerAnalysis.moonpayGreenDetected}`);
      
      // Log detailed findings
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 Mercuryo elements found:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 50)}..."`);
          console.log(`        Green: ${el.hasGreen}, Border: ${el.borderColor}`);
        });
      }
      
      if (providerAnalysis.greenElements.length > 0) {
        console.log(`  🟢 Green elements found:`);
        providerAnalysis.greenElements.slice(0, 5).forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 30)}..." (Mercuryo: ${el.hasMercuryo})`);
        });
      }
      
      // Check for success condition
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎯 SUCCESS! Mercuryo with green border detected!`);
        
        // Test 5-second persistence
        console.log(`  ⏰ Testing 5-second persistence...`);
        await simpleSwapPage.waitForTimeout(5000);
        
        const persistenceCheck = await this.analyzeProviders(simpleSwapPage, config);
        
        if (persistenceCheck.mercuryoGreenDetected && !persistenceCheck.moonpayGreenDetected) {
          console.log(`\n  🏆 MISSION ACCOMPLISHED! Green border persists after 5 seconds!`);
          console.log(`     ✅ Mercuryo still has green border`);
          console.log(`     ✅ MoonPay does not have green border`);
          
          await simpleSwapPage.screenshot({ 
            path: `SUCCESS_FINAL_${config.name}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          
          await context.close();
          return true;
        } else {
          console.log(`  ❌ Persistence test failed. Mercuryo: ${persistenceCheck.mercuryoGreenDetected}, MoonPay: ${persistenceCheck.moonpayGreenDetected}`);
        }
      } else {
        console.log(`  ❌ No Mercuryo green border detected`);
      }
      
      // Take screenshot for analysis
      await simpleSwapPage.screenshot({ 
        path: `analysis_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      console.error(`  ❌ Flow error: ${error.message}`);
      await context.close();
      return false;
    }
  }

  async analyzeProviders(page, config) {
    return await page.evaluate(() => {
      const analysis = {
        mercuryoGreenDetected: false,
        moonpayGreenDetected: false,
        mercuryoElements: [],
        moonpayElements: [],
        greenElements: [],
        url: window.location.href,
        title: document.title
      };
      
      // Enhanced detection for thin green borders
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        // Comprehensive border detection - focus on thin borders
        const borderStyles = [
          style.border,
          style.borderTop,
          style.borderRight,
          style.borderBottom,
          style.borderLeft,
          style.borderColor,
          style.borderTopColor,
          style.borderRightColor,
          style.borderBottomColor,
          style.borderLeftColor,
          style.outline,
          style.outlineColor,
          style.boxShadow,
          style.backgroundColor
        ];
        
        const allBorderStyles = borderStyles.join(' ').toLowerCase();
        
        // Detect various green patterns including thin borders
        const greenPatterns = [
          'rgb(34, 197, 94)',   // Primary green
          'rgba(34, 197, 94',   // With alpha
          '#22c55e',            // Hex
          '22c55e',             // Hex without #
          'rgb(0, 128, 0)',     // Standard green
          'rgb(46, 160, 67)',   // Material green
          'rgb(76, 175, 80)',   // Material light green
          'green',              // CSS green
          'lightgreen',         // CSS light green
          'rgb(40, 167, 69)',   // Bootstrap success
          'rgb(25, 135, 84)',   // Bootstrap success dark
          'rgb(16, 185, 129)',  // Tailwind green
          'rgb(5, 150, 105)',   // Tailwind green 600
          'rgb(4, 120, 87)'     // Tailwind green 700
        ];
        
        const hasGreen = greenPatterns.some(pattern => allBorderStyles.includes(pattern));
        
        // Check for Mercuryo
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent.substring(0, 100),
            hasGreen,
            tag: el.tagName,
            className: el.className,
            id: el.id,
            borderColor: style.borderColor,
            borderWidth: style.borderWidth,
            borderTopColor: style.borderTopColor,
            borderRightColor: style.borderRightColor,
            borderBottomColor: style.borderBottomColor,
            borderLeftColor: style.borderLeftColor,
            backgroundColor: style.backgroundColor,
            outline: style.outline,
            boxShadow: style.boxShadow
          };
          
          analysis.mercuryoElements.push(elementData);
          
          if (hasGreen) {
            analysis.mercuryoGreenDetected = true;
          }
        }
        
        // Check for MoonPay
        if (text.includes('moonpay')) {
          const elementData = {
            text: el.textContent.substring(0, 100),
            hasGreen,
            tag: el.tagName,
            className: el.className,
            id: el.id,
            borderColor: style.borderColor,
            borderWidth: style.borderWidth,
            backgroundColor: style.backgroundColor
          };
          
          analysis.moonpayElements.push(elementData);
          
          if (hasGreen) {
            analysis.moonpayGreenDetected = true;
          }
        }
        
        // Collect all green elements
        if (hasGreen) {
          analysis.greenElements.push({
            text: el.textContent.substring(0, 80),
            tag: el.tagName,
            className: el.className,
            id: el.id,
            hasMercuryo: text.includes('mercuryo'),
            hasMoonpay: text.includes('moonpay'),
            borderInfo: {
              color: style.borderColor,
              width: style.borderWidth,
              style: style.borderStyle
            }
          });
        }
      });
      
      return analysis;
    });
  }
}

// Start the infinite flow
const flow = new AuraloToSimpleSwapFlow();
flow.executeFlow().then(success => {
  if (success) {
    console.log('\n🎉 FINAL SUCCESS: Mission accomplished!');
    console.log('✅ Mercuryo green border detected and persists on mobile devices!');
  }
}).catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart on critical errors
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting after critical error...');
    const newFlow = new AuraloToSimpleSwapFlow();
    newFlow.executeFlow();
  }, 5000);
});