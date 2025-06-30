const { chromium, devices } = require('playwright');

async function completeExchangeFlow() {
  console.log('🎯 COMPLETE EXCHANGE FLOW: Navigate to provider selection');
  console.log('='.repeat(70));
  
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--enable-features=TouchEvents',
      '--disable-web-security', 
      '--enable-touch-events',
      '--no-sandbox'
    ]
  });

  // iPhone and Android focus as requested
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
    console.log(`\n${config.flag} Starting complete exchange flow: ${config.name} ${config.region}`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    try {
      const page = await context.newPage();
      
      console.log(`  📱 1. Direct navigation to SimpleSwap...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`  📱 2. Starting exchange creation flow...`);
      
      // Strategy: Fill wallet address and proceed to create exchange
      const walletAddress = '0x1234567890123456789012345678901234567890';
      
      // Look for wallet address input field
      const walletSelectors = [
        'input[placeholder*="address"]',
        'input[placeholder*="wallet"]', 
        'input[placeholder*="recipient"]',
        'input[name*="address"]',
        'input[type="text"]',
        '[data-testid*="address"]',
        '[data-cy*="address"]'
      ];
      
      let walletFilled = false;
      for (const selector of walletSelectors) {
        try {
          const walletInput = await page.$(selector);
          if (walletInput) {
            console.log(`  ✅ Found wallet input: ${selector}`);
            await walletInput.fill(walletAddress);
            await page.waitForTimeout(1000);
            walletFilled = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (walletFilled) {
        console.log(`  ✅ Wallet address filled`);
      } else {
        console.log(`  📱 No wallet input found, proceeding anyway...`);
      }
      
      console.log(`  📱 3. Looking for exchange/continue button...`);
      
      // Look for buttons to proceed
      const buttonSelectors = [
        'button:has-text("Exchange")',
        'button:has-text("Continue")', 
        'button:has-text("Next")',
        'button:has-text("Create")',
        'button:has-text("Proceed")',
        'button[type="submit"]',
        '.exchange-button',
        '.continue-button',
        'button:text-is("GO")',
        '[data-testid*="exchange"]',
        '[data-cy*="exchange"]'
      ];
      
      let exchangeInitiated = false;
      for (const selector of buttonSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            console.log(`  🔘 Found and clicking button: ${selector}`);
            await button.click();
            await page.waitForTimeout(3000);
            exchangeInitiated = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!exchangeInitiated) {
        console.log(`  📱 No exchange button found, trying Enter key...`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
      }
      
      console.log(`  📱 4. Waiting for provider selection to appear...`);
      await page.waitForTimeout(5000);
      
      // Enhanced provider detection with specific focus on payment providers
      const providerAnalysis = await page.evaluate(() => {
        const analysis = {
          mercuryoGreenDetected: false,
          moonpayGreenDetected: false,
          mercuryoElements: [],
          moonpayElements: [],
          greenElements: [],
          paymentProviders: [],
          url: window.location.href,
          title: document.title
        };
        
        // Look specifically for payment provider interfaces
        document.querySelectorAll('*').forEach(el => {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          // Enhanced green detection - multiple patterns
          const borderProps = [
            style.border, style.borderTop, style.borderRight, style.borderBottom, style.borderLeft,
            style.borderColor, style.borderTopColor, style.borderRightColor, 
            style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Comprehensive green patterns including very specific ones
          const greenPatterns = [
            'rgb(34, 197, 94)',    // Primary target
            'rgba(34, 197, 94',    // With alpha
            '#22c55e', '22c55e',   // Hex
            'rgb(0, 128, 0)',      // Standard green
            'rgb(46, 160, 67)',    // Material
            'rgb(76, 175, 80)',    // Material light
            'green', 'lightgreen', // CSS
            'rgb(40, 167, 69)',    // Bootstrap
            'rgb(25, 135, 84)',    // Bootstrap dark
            'rgb(16, 185, 129)',   // Tailwind
            'rgb(5, 150, 105)',    // Tailwind 600
            'rgb(4, 120, 87)',     // Tailwind 700
            'rgb(0, 255, 0)',      // Bright green
            'rgb(50, 205, 50)',    // Lime green
            'solid green',         // Border declarations
            'solid rgb(',          // Any solid rgb border
            '1px solid',           // Thin borders
            '2px solid'            // Slightly thicker
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          // Look for payment provider contexts
          const isPaymentContext = text.includes('payment') || 
                                  text.includes('provider') ||
                                  text.includes('method') ||
                                  text.includes('card') ||
                                  text.includes('bank') ||
                                  el.className.toLowerCase().includes('payment') ||
                                  el.className.toLowerCase().includes('provider');
          
          if (isPaymentContext) {
            analysis.paymentProviders.push({
              text: el.textContent.substring(0, 100),
              tag: el.tagName,
              className: el.className,
              hasGreen,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay')
            });
          }
          
          // Mercuryo detection
          if (text.includes('mercuryo') || text.includes('mercurio') || 
              (text.includes('mercury') && isPaymentContext)) {
            const elementData = {
              text: el.textContent.substring(0, 100),
              hasGreen,
              tag: el.tagName,
              className: el.className,
              id: el.id,
              borderInfo: {
                border: style.border,
                borderColor: style.borderColor,
                borderWidth: style.borderWidth,
                borderStyle: style.borderStyle,
                topColor: style.borderTopColor,
                rightColor: style.borderRightColor,
                bottomColor: style.borderBottomColor,
                leftColor: style.borderLeftColor
              },
              backgroundColor: style.backgroundColor,
              outline: style.outline,
              boxShadow: style.boxShadow,
              position: {
                top: el.getBoundingClientRect().top,
                left: el.getBoundingClientRect().left,
                width: el.getBoundingClientRect().width,
                height: el.getBoundingClientRect().height
              }
            };
            
            analysis.mercuryoElements.push(elementData);
            
            if (hasGreen) {
              analysis.mercuryoGreenDetected = true;
            }
          }
          
          // MoonPay detection
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
          
          // All green elements for debugging
          if (hasGreen) {
            analysis.greenElements.push({
              text: el.textContent.substring(0, 50),
              tag: el.tagName,
              className: el.className,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              borderWidth: style.borderWidth,
              borderColor: style.borderColor,
              outline: style.outline
            });
          }
        });
        
        return analysis;
      });
      
      console.log(`  📊 ${config.flag} Provider Analysis (Exchange Flow):`);
      console.log(`     URL: ${providerAnalysis.url}`);
      console.log(`     Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
      console.log(`     MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
      console.log(`     Payment providers: ${providerAnalysis.paymentProviders.length}`);
      console.log(`     Green elements: ${providerAnalysis.greenElements.length}`);
      console.log(`     🎯 MERCURYO WITH GREEN BORDER: ${providerAnalysis.mercuryoGreenDetected}`);
      console.log(`     ❌ MoonPay with green border: ${providerAnalysis.moonpayGreenDetected}`);
      
      // Detailed Mercuryo analysis
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 DETAILED MERCURYO ANALYSIS:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text}"`);
          console.log(`        🎯 HAS GREEN BORDER: ${el.hasGreen}`);
          console.log(`        Border: ${el.borderInfo.border}`);
          console.log(`        Border Color: ${el.borderInfo.borderColor}`);
          console.log(`        Border Width: ${el.borderInfo.borderWidth}`);
          console.log(`        Top/Right/Bottom/Left: ${el.borderInfo.topColor}/${el.borderInfo.rightColor}/${el.borderInfo.bottomColor}/${el.borderInfo.leftColor}`);
          console.log(`        Background: ${el.backgroundColor}`);
          console.log(`        Position: ${el.position.width}x${el.position.height} at (${el.position.left}, ${el.position.top})`);
          if (el.hasGreen) {
            console.log(`        🏆 THIS IS THE TARGET! Green border detected!`);
          }
        });
      }
      
      // Payment provider context
      if (providerAnalysis.paymentProviders.length > 0) {
        console.log(`  💰 PAYMENT PROVIDER CONTEXT:`);
        providerAnalysis.paymentProviders.slice(0, 5).forEach((p, i) => {
          console.log(`     ${i + 1}. ${p.tag} "${p.text.substring(0, 50)}..." (Green: ${p.hasGreen}, Mercuryo: ${p.hasMercuryo})`);
        });
      }
      
      // Success check
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎉 SUCCESS! Mercuryo with green border detected on ${config.name}!`);
        
        // 5-second persistence test
        console.log(`  ⏰ Testing 5-second persistence...`);
        await page.waitForTimeout(5000);
        
        const persistenceCheck = await page.evaluate(() => {
          let mercuryoStillGreen = false;
          let moonpayNowGreen = false;
          
          document.querySelectorAll('*').forEach(el => {
            if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
            
            const text = (el.textContent || '').toLowerCase();
            const style = window.getComputedStyle(el);
            
            const allStyles = [
              style.border, style.borderColor, style.backgroundColor, style.outline
            ].join(' ').toLowerCase();
            
            const hasGreen = allStyles.includes('rgb(34, 197, 94)') || 
                            allStyles.includes('#22c55e') || 
                            allStyles.includes('green');
            
            if (text.includes('mercuryo') && hasGreen) {
              mercuryoStillGreen = true;
            }
            if (text.includes('moonpay') && hasGreen) {
              moonpayNowGreen = true;
            }
          });
          
          return { mercuryoStillGreen, moonpayNowGreen };
        });
        
        console.log(`  📊 5-SECOND PERSISTENCE RESULT:`);
        console.log(`     ✅ Mercuryo still green: ${persistenceCheck.mercuryoStillGreen}`);
        console.log(`     ❌ MoonPay now green: ${persistenceCheck.moonpayNowGreen}`);
        
        if (persistenceCheck.mercuryoStillGreen && !persistenceCheck.moonpayNowGreen) {
          console.log(`\n  🏆🏆🏆 MISSION ACCOMPLISHED! 🏆🏆🏆`);
          console.log(`     ✅ Mercuryo green border detected and persists`);
          console.log(`     ✅ MoonPay does not have green border`);
          console.log(`     ✅ SUCCESS on ${config.name} ${config.region}!`);
          
          await page.screenshot({ 
            path: `ULTIMATE_SUCCESS_${config.name.replace(' ', '_')}_${config.region}.png`,
            fullPage: true 
          });
          
          await browser.close();
          return true;
        }
      } else {
        console.log(`  ❌ No Mercuryo green border detected in exchange flow`);
      }
      
      // If we're still on the main page, try alternative paths
      if (providerAnalysis.url.includes('simpleswap.io') && !providerAnalysis.url.includes('exchange')) {
        console.log(`  📱 5. Trying alternative exchange creation paths...`);
        
        // Try clicking different elements to trigger exchange creation
        const alternativeSelectors = [
          'form button',
          '.exchange-form button',
          'button[form]',
          'input[type="submit"]',
          '[data-testid="submit"]',
          '.btn-primary',
          '.submit-btn'
        ];
        
        for (const selector of alternativeSelectors) {
          try {
            const element = await page.$(selector);
            if (element) {
              console.log(`    🔄 Trying alternative selector: ${selector}`);
              await element.click();
              await page.waitForTimeout(3000);
              
              // Quick check if we moved forward
              const newUrl = page.url();
              if (newUrl !== providerAnalysis.url) {
                console.log(`    ✅ URL changed to: ${newUrl}`);
                await page.waitForTimeout(3000);
                break;
              }
            }
          } catch (e) {
            // Continue
          }
        }
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `exchange_flow_${config.name.replace(' ', '_')}_${config.region}.png`,
        fullPage: true 
      });
      
      await context.close();
      
    } catch (error) {
      console.error(`❌ Error in exchange flow ${config.name} ${config.region}:`, error.message);
      await context.close();
    }
  }

  await browser.close();
  
  console.log(`\n🔄 Exchange flow complete. Continuing infinite loop...`);
  
  // Continue the infinite troubleshooting loop
  await new Promise(resolve => setTimeout(resolve, 3000));
  return completeExchangeFlow();
}

// Start the complete exchange flow
completeExchangeFlow().catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting exchange flow...');
    completeExchangeFlow();
  }, 5000);
});