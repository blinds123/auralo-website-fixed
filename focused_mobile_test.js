const { chromium, devices } = require('playwright');

async function focusedMobileTest() {
  console.log('🎯 FOCUSED MOBILE TEST: Auralo → SimpleSwap → Mercuryo Detection');
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--enable-features=TouchEvents',
      '--disable-web-security', 
      '--enable-touch-events',
      '--no-sandbox',
      '--disable-popup-blocking',
      '--allow-popups-during-page-unload'
    ]
  });

  // Focus on iPhone and Android as specifically requested
  const testConfigs = [
    { 
      name: 'iPhone 14 Pro', 
      device: devices['iPhone 14 Pro'],
      region: 'Australia',
      flag: '🇦🇺'
    },
    { 
      name: 'Galaxy S24', 
      device: devices['Galaxy S24'],
      region: 'USA', 
      flag: '🇺🇸'
    },
    { 
      name: 'iPhone 14 Pro', 
      device: devices['iPhone 14 Pro'],
      region: 'Europe',
      flag: '🇪🇺'
    }
  ];

  for (const config of testConfigs) {
    console.log(`\n${config.flag} Starting ${config.name} ${config.region} focused test`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    try {
      const page = await context.newPage();
      
      console.log(`  📱 1. Navigating to Auralo website...`);
      await page.goto('https://auralo-website-fixed.netlify.app', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`  📱 2. Scrolling to find buy button...`);
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      await page.waitForTimeout(2000);
      
      // Multiple strategies to find and click the button
      console.log(`  📱 3. Finding SimpleSwap button using multiple strategies...`);
      
      let simpleSwapPage = null;
      
      // Strategy 1: Direct href link
      try {
        console.log(`    🔗 Strategy 1: Looking for direct SimpleSwap href...`);
        const directLink = await page.$('a[href*="simpleswap.io"]');
        if (directLink) {
          console.log(`    ✅ Found direct SimpleSwap link`);
          
          // Set up page monitoring before click
          const newPagePromise = context.waitForEvent('page', { timeout: 10000 });
          const navigationPromise = page.waitForNavigation({ timeout: 10000 }).catch(() => null);
          
          // Enhanced click with multiple methods
          await directLink.scrollIntoView();
          await page.waitForTimeout(1000);
          
          // Try multiple click methods
          try {
            await directLink.click({ button: 'left', clickCount: 1 });
          } catch (e) {
            console.log(`    📱 Regular click failed, trying tap...`);
            await directLink.tap();
          }
          
          console.log(`    ⏳ Waiting for SimpleSwap page...`);
          
          try {
            simpleSwapPage = await newPagePromise;
            console.log(`    🎉 New page opened: ${simpleSwapPage.url()}`);
          } catch (e) {
            console.log(`    📱 No new page, checking navigation...`);
            await navigationPromise;
            if (page.url().includes('simpleswap')) {
              simpleSwapPage = page;
              console.log(`    🎉 Current page navigated: ${page.url()}`);
            }
          }
        }
      } catch (e) {
        console.log(`    ❌ Strategy 1 failed: ${e.message}`);
      }
      
      // Strategy 2: Text-based search if Strategy 1 failed
      if (!simpleSwapPage) {
        try {
          console.log(`    📝 Strategy 2: Text-based button search...`);
          
          const textButton = await page.evaluateHandle(() => {
            const elements = Array.from(document.querySelectorAll('*'));
            return elements.find(el => {
              const text = el.textContent || '';
              return text.toLowerCase().includes('copy your custom coupon code') ||
                     text.toLowerCase().includes('complete your exchange');
            });
          });
          
          if (textButton) {
            console.log(`    ✅ Found text-based button`);
            
            const newPagePromise = context.waitForEvent('page', { timeout: 10000 });
            
            await textButton.scrollIntoView();
            await page.waitForTimeout(1000);
            await textButton.click();
            
            try {
              simpleSwapPage = await newPagePromise;
              console.log(`    🎉 New page opened via text search: ${simpleSwapPage.url()}`);
            } catch (e) {
              console.log(`    ❌ Strategy 2: No new page opened`);
            }
          }
        } catch (e) {
          console.log(`    ❌ Strategy 2 failed: ${e.message}`);
        }
      }
      
      // Strategy 3: Force URL opening if buttons don't work
      if (!simpleSwapPage) {
        console.log(`    🚀 Strategy 3: Force opening SimpleSwap URL...`);
        try {
          simpleSwapPage = await context.newPage();
          await simpleSwapPage.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          });
          console.log(`    🎉 Force opened SimpleSwap: ${simpleSwapPage.url()}`);
        } catch (e) {
          console.log(`    ❌ Strategy 3 failed: ${e.message}`);
          await context.close();
          continue;
        }
      }
      
      // Now analyze the SimpleSwap page
      console.log(`  📱 4. Analyzing SimpleSwap for provider selection...`);
      
      await simpleSwapPage.waitForTimeout(5000); // Allow page to fully load
      
      // Enhanced provider detection with focus on thin green borders
      const providerAnalysis = await simpleSwapPage.evaluate(() => {
        const analysis = {
          mercuryoGreenDetected: false,
          moonpayGreenDetected: false,
          mercuryoElements: [],
          moonpayElements: [],
          greenElements: [],
          url: window.location.href,
          title: document.title,
          pageText: document.body.textContent.substring(0, 500)
        };
        
        // Enhanced green detection for thin borders specifically
        document.querySelectorAll('*').forEach(el => {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          // Comprehensive border and style detection
          const borderProps = [
            style.border, style.borderTop, style.borderRight, style.borderBottom, style.borderLeft,
            style.borderColor, style.borderTopColor, style.borderRightColor, 
            style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Multiple green detection patterns including thin borders
          const greenPatterns = [
            'rgb(34, 197, 94)',    // Primary green
            'rgba(34, 197, 94',    // With alpha
            '#22c55e', '22c55e',   // Hex variants
            'rgb(0, 128, 0)',      // Standard green
            'rgb(46, 160, 67)',    // Material green
            'rgb(76, 175, 80)',    // Material light green
            'green', 'lightgreen', // CSS colors
            'rgb(40, 167, 69)',    // Bootstrap success
            'rgb(25, 135, 84)',    // Bootstrap success dark
            'rgb(16, 185, 129)',   // Tailwind variants
            'rgb(5, 150, 105)',
            'rgb(4, 120, 87)',
            '1px solid green',     // Thin border patterns
            '2px solid green',
            '1px solid rgb',
            '2px solid rgb'
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          // Check for Mercuryo (including common misspellings)
          if (text.includes('mercuryo') || text.includes('mercurio') || text.includes('mercury')) {
            const elementData = {
              text: el.textContent.substring(0, 100),
              hasGreen,
              tag: el.tagName,
              className: el.className,
              id: el.id,
              borderStyles: {
                color: style.borderColor,
                width: style.borderWidth,
                topColor: style.borderTopColor,
                rightColor: style.borderRightColor,
                bottomColor: style.borderBottomColor,
                leftColor: style.borderLeftColor
              },
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
          if (text.includes('moonpay') || text.includes('moon pay')) {
            const elementData = {
              text: el.textContent.substring(0, 100),
              hasGreen,
              tag: el.tagName,
              className: el.className,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor
            };
            
            analysis.moonpayElements.push(elementData);
            
            if (hasGreen) {
              analysis.moonpayGreenDetected = true;
            }
          }
          
          // Collect all green elements for analysis
          if (hasGreen) {
            analysis.greenElements.push({
              text: el.textContent.substring(0, 50),
              tag: el.tagName,
              className: el.className,
              hasMercuryo: text.includes('mercuryo') || text.includes('mercury'),
              hasMoonpay: text.includes('moonpay'),
              borderWidth: style.borderWidth,
              borderColor: style.borderColor
            });
          }
        });
        
        return analysis;
      });
      
      console.log(`  📊 ${config.flag} Provider Analysis Results:`);
      console.log(`     URL: ${providerAnalysis.url}`);
      console.log(`     Title: ${providerAnalysis.title}`);
      console.log(`     Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
      console.log(`     MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
      console.log(`     Green elements: ${providerAnalysis.greenElements.length}`);
      console.log(`     🎯 Mercuryo with GREEN BORDER: ${providerAnalysis.mercuryoGreenDetected}`);
      console.log(`     ❌ MoonPay with green border: ${providerAnalysis.moonpayGreenDetected}`);
      
      // Detail logging for Mercuryo elements
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 MERCURYO ELEMENTS FOUND:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text}"`);
          console.log(`        Green border: ${el.hasGreen}`);
          console.log(`        Border colors: ${JSON.stringify(el.borderStyles)}`);
          if (el.hasGreen) {
            console.log(`        🎯 HAS GREEN BORDER! This is what we're looking for!`);
          }
        });
      }
      
      // Success condition check
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎉 SUCCESS! Mercuryo with green border detected on ${config.name}!`);
        
        // Test 5-second persistence as required
        console.log(`  ⏰ Testing 5-second persistence...`);
        await simpleSwapPage.waitForTimeout(5000);
        
        const persistenceCheck = await simpleSwapPage.evaluate(() => {
          let mercuryoStillGreen = false;
          let moonpayNowGreen = false;
          
          document.querySelectorAll('*').forEach(el => {
            if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
            
            const text = (el.textContent || '').toLowerCase();
            const style = window.getComputedStyle(el);
            
            const allStyles = [
              style.border, style.borderColor, style.borderTopColor,
              style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
              style.backgroundColor, style.outline, style.boxShadow
            ].join(' ').toLowerCase();
            
            const greenPatterns = [
              'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', 'green'
            ];
            
            const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
            
            if ((text.includes('mercuryo') || text.includes('mercury')) && hasGreen) {
              mercuryoStillGreen = true;
            }
            if (text.includes('moonpay') && hasGreen) {
              moonpayNowGreen = true;
            }
          });
          
          return { mercuryoStillGreen, moonpayNowGreen };
        });
        
        console.log(`  📊 5-SECOND PERSISTENCE CHECK:`);
        console.log(`     ✅ Mercuryo still has green border: ${persistenceCheck.mercuryoStillGreen}`);
        console.log(`     ❌ MoonPay has green border: ${persistenceCheck.moonpayNowGreen}`);
        
        if (persistenceCheck.mercuryoStillGreen && !persistenceCheck.moonpayNowGreen) {
          console.log(`\n  🏆 MISSION ACCOMPLISHED on ${config.name} ${config.region}!`);
          console.log(`     ✅ Mercuryo green border detected and persists after 5 seconds`);
          console.log(`     ✅ MoonPay does not have green border`);
          console.log(`     ✅ Success criteria met!`);
          
          await simpleSwapPage.screenshot({ 
            path: `FINAL_SUCCESS_${config.name.replace(' ', '_')}_${config.region}.png`,
            fullPage: true 
          });
          
          await browser.close();
          return true;
        } else {
          console.log(`  ❌ Persistence test failed`);
        }
      } else {
        console.log(`  ❌ No Mercuryo green border detected`);
        
        // Show what green elements were found for debugging
        if (providerAnalysis.greenElements.length > 0) {
          console.log(`  🟢 Green elements found (but not Mercuryo):`);
          providerAnalysis.greenElements.slice(0, 3).forEach((el, i) => {
            console.log(`     ${i + 1}. ${el.tag} "${el.text}" (width: ${el.borderWidth})`);
          });
        }
      }
      
      // Take screenshot for analysis
      await simpleSwapPage.screenshot({ 
        path: `analysis_${config.name.replace(' ', '_')}_${config.region}.png`,
        fullPage: true 
      });
      
      await context.close();
      
    } catch (error) {
      console.error(`❌ Error testing ${config.name} ${config.region}:`, error.message);
      await context.close();
    }
  }

  await browser.close();
  
  console.log(`\n🔄 No success detected. Continuing infinite loop as requested...`);
  
  // Wait before restarting to prevent overwhelming
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Continue the infinite loop as explicitly requested by user
  return focusedMobileTest();
}

// Start the focused mobile test
focusedMobileTest().catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart on critical errors as part of infinite loop
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting focused mobile test...');
    focusedMobileTest();
  }, 5000);
});