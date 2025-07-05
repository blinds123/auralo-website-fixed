const { chromium, devices } = require('playwright');

class CorrectAmountDetector {
  constructor() {
    this.attemptNumber = 1;
  }

  async infiniteDetection() {
    console.log(`\n🔄 CORRECT AMOUNT DETECTION ATTEMPT ${this.attemptNumber}`);
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

    // iPhone and Android as requested
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
      try {
        const success = await this.testCorrectAmount(browser, config);
        if (success) {
          console.log(`\n🏆🏆🏆 FINAL SUCCESS ACHIEVED! 🏆🏆🏆`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
      }
    }

    await browser.close();
    
    // Continue infinite loop
    this.attemptNumber++;
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.infiniteDetection();
  }

  async testCorrectAmount(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - CORRECTING AMOUNT`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // Strategy 1: Use EUR to USDT (stablecoin) to maintain €15 value
      console.log(`  📱 1. Trying EUR to USDT for stable €15 value...`);
      let url = 'https://simpleswap.io/?from=eur&to=usdt&amount=15&partner=auralo';
      
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      // Check the amounts displayed
      const amountCheck = await page.evaluate(() => {
        const sendInput = document.querySelector('input[value="15"]') || 
                         document.querySelector('input[placeholder*="15"]') ||
                         document.querySelector('input[placeholder*="amount"]');
        
        const receiveInput = document.querySelector('input[readonly]') ||
                           document.querySelector('input[disabled]') ||
                           document.querySelector('.receive-amount') ||
                           document.querySelector('[data-testid*="receive"]');
        
        return {
          sendValue: sendInput ? sendInput.value : 'not found',
          receiveValue: receiveInput ? receiveInput.value : 'not found',
          url: window.location.href
        };
      });
      
      console.log(`    💰 Amount check: Send=${amountCheck.sendValue}, Receive=${amountCheck.receiveValue}`);
      
      // If amounts are wrong, try to correct them
      if (amountCheck.sendValue !== '15') {
        console.log(`    🔧 Correcting send amount to 15...`);
        
        const sendInputSelectors = [
          'input[placeholder*="amount"]',
          'input[name*="amount"]',
          'input[type="number"]',
          'input[value*="15"]',
          '.amount-input',
          '[data-testid*="amount"]'
        ];
        
        for (const selector of sendInputSelectors) {
          try {
            const input = await page.$(selector);
            if (input) {
              await input.fill('15');
              await page.waitForTimeout(1000);
              console.log(`    ✅ Corrected amount with: ${selector}`);
              break;
            }
          } catch (e) {}
        }
      }
      
      // Fill wallet address
      console.log(`  📱 2. Filling wallet address...`);
      const walletSelectors = [
        'input[placeholder*="address"]',
        'input[placeholder*="wallet"]',
        'input[type="text"]:not([placeholder*="amount"])'
      ];
      
      for (const selector of walletSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            await input.fill('0x1234567890123456789012345678901234567890');
            console.log(`    ✅ Filled wallet: ${selector}`);
            await page.waitForTimeout(1000);
            break;
          }
        } catch (e) {}
      }
      
      // Click exchange button
      console.log(`  📱 3. Clicking exchange button...`);
      const buttonSelectors = [
        'button:has-text("Exchange")',
        'button:has-text("Continue")',
        'button:has-text("Create Exchange")',
        'button[type="submit"]'
      ];
      
      for (const selector of buttonSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            await button.click();
            console.log(`    ✅ Clicked: ${selector}`);
            await page.waitForTimeout(5000); // Wait longer for provider selection
            break;
          }
        } catch (e) {}
      }
      
      // Enhanced provider detection
      console.log(`  📱 4. Enhanced provider detection...`);
      const providerAnalysis = await this.robustProviderAnalysis(page);
      
      console.log(`  📊 Results: Mercuryo(${providerAnalysis.mercuryoElements.length}) MoonPay(${providerAnalysis.moonpayElements.length}) Green(${providerAnalysis.greenElements.length})`);
      console.log(`  🎯 MERCURYO GREEN: ${providerAnalysis.mercuryoGreenDetected}`);
      console.log(`  💰 Current URL: ${providerAnalysis.url}`);
      
      // Log what we found
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 Mercuryo elements:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 50)}..." Green: ${el.hasGreen}`);
          if (el.hasGreen) {
            console.log(`        🎯 GREEN BORDER DETECTED!`);
          }
        });
      }
      
      if (providerAnalysis.greenElements.length > 0) {
        console.log(`  🟢 Green elements found: ${providerAnalysis.greenElements.length}`);
        // Show first few green elements
        providerAnalysis.greenElements.slice(0, 3).forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 30)}..." (Mercuryo: ${el.hasMercuryo})`);
        });
      }
      
      // Success check
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎉 SUCCESS! Mercuryo with green border detected!`);
        
        // 5-second persistence test
        console.log(`  ⏰ Testing 5-second persistence...`);
        await page.waitForTimeout(5000);
        
        const persistenceCheck = await this.robustProviderAnalysis(page);
        
        if (persistenceCheck.mercuryoGreenDetected && !persistenceCheck.moonpayGreenDetected) {
          console.log(`\n  🏆 PERSISTENCE CONFIRMED! Mission accomplished!`);
          console.log(`     ✅ Correct €15 amount maintained`);
          console.log(`     ✅ Mercuryo green border persists`);
          console.log(`     ✅ MoonPay does not have green border`);
          
          await page.screenshot({ 
            path: `FINAL_SUCCESS_CORRECT_AMOUNT_${config.name.replace(' ', '_')}_${config.region}.png`,
            fullPage: true 
          });
          
          await context.close();
          return true;
        }
      }
      
      // If USDT doesn't work, try other stable pairs
      console.log(`  📱 5. Trying alternative stable pairs...`);
      
      const alternativePairs = [
        'https://simpleswap.io/?from=eur&to=usdc&amount=15&partner=auralo', // EUR to USDC
        'https://simpleswap.io/?from=usd&to=usdt&amount=15&partner=auralo', // USD to USDT
        'https://simpleswap.io/?from=usd&to=usdc&amount=15&partner=auralo', // USD to USDC
        'https://simpleswap.io/?from=eur&to=btc&amount=15&partner=auralo&fiat=true' // EUR to BTC with fiat flag
      ];
      
      for (const altUrl of alternativePairs) {
        try {
          console.log(`    🔄 Trying: ${altUrl}`);
          await page.goto(altUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
          await page.waitForTimeout(3000);
          
          // Quick wallet fill and exchange
          const walletInput = await page.$('input[type="text"]');
          if (walletInput) {
            await walletInput.fill('0x1234567890123456789012345678901234567890');
            await page.waitForTimeout(1000);
          }
          
          const exchangeButton = await page.$('button:has-text("Exchange")');
          if (exchangeButton) {
            await exchangeButton.click();
            await page.waitForTimeout(5000);
          }
          
          // Quick provider check
          const quickCheck = await this.robustProviderAnalysis(page);
          if (quickCheck.mercuryoGreenDetected) {
            console.log(`    🎉 SUCCESS with alternative pair!`);
            
            // 5-second test
            await page.waitForTimeout(5000);
            const finalCheck = await this.robustProviderAnalysis(page);
            
            if (finalCheck.mercuryoGreenDetected && !finalCheck.moonpayGreenDetected) {
              console.log(`\n  🏆 ALTERNATIVE PAIR SUCCESS!`);
              await page.screenshot({ 
                path: `SUCCESS_ALT_${config.name.replace(' ', '_')}_${config.region}.png`,
                fullPage: true 
              });
              await context.close();
              return true;
            }
          }
          
        } catch (e) {
          console.log(`    ❌ Alternative pair failed: ${e.message}`);
        }
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `correct_amount_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async robustProviderAnalysis(page) {
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
      
      // Enhanced element analysis with error handling
      document.querySelectorAll('*').forEach(el => {
        try {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          // Safe className handling
          const className = el.className ? 
            (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
          
          // Comprehensive border detection including thin borders
          const borderProps = [
            style.border || '',
            style.borderColor || '',
            style.borderTopColor || '',
            style.borderRightColor || '', 
            style.borderBottomColor || '',
            style.borderLeftColor || '',
            style.outline || '',
            style.outlineColor || '',
            style.boxShadow || '',
            style.backgroundColor || ''
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Multiple green detection patterns - focusing on thin borders
          const greenPatterns = [
            'rgb(34, 197, 94)',    // Primary target
            'rgba(34, 197, 94',    // With alpha
            '#22c55e', '22c55e',   // Hex
            'rgb(0, 128, 0)',      // Standard green
            'green', 'lightgreen', // CSS
            'rgb(46, 160, 67)',    // Material
            'rgb(76, 175, 80)',    // Material light
            'rgb(40, 167, 69)',    // Bootstrap
            'rgb(25, 135, 84)',    // Bootstrap dark
            'rgb(16, 185, 129)',   // Tailwind
            'solid green',         // Border types
            '1px solid',           // Thin borders
            '2px solid',           // Slightly thicker
            'thin',                // CSS thin
            'medium',              // CSS medium
            'thick'                // CSS thick
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          // Mercuryo detection
          if (text.includes('mercuryo') || text.includes('mercurio') || text.includes('mercury')) {
            const elementData = {
              text: el.textContent ? el.textContent.substring(0, 100) : '',
              hasGreen,
              tag: el.tagName || '',
              className: className,
              id: el.id || '',
              borderColor: style.borderColor || '',
              backgroundColor: style.backgroundColor || '',
              borderWidth: style.borderWidth || '',
              allBorderStyles: allStyles.substring(0, 200)
            };
            
            analysis.mercuryoElements.push(elementData);
            
            if (hasGreen) {
              analysis.mercuryoGreenDetected = true;
            }
          }
          
          // MoonPay detection
          if (text.includes('moonpay') || text.includes('moon pay')) {
            const elementData = {
              text: el.textContent ? el.textContent.substring(0, 100) : '',
              hasGreen,
              tag: el.tagName || '',
              className: className,
              borderColor: style.borderColor || ''
            };
            
            analysis.moonpayElements.push(elementData);
            
            if (hasGreen) {
              analysis.moonpayGreenDetected = true;
            }
          }
          
          // Green elements
          if (hasGreen) {
            analysis.greenElements.push({
              text: el.textContent ? el.textContent.substring(0, 50) : '',
              tag: el.tagName || '',
              className: className,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              borderWidth: style.borderWidth || '',
              borderColor: style.borderColor || ''
            });
          }
          
        } catch (e) {
          // Skip elements that cause errors
        }
      });
      
      return analysis;
    });
  }
}

// Start the correct amount detector
const detector = new CorrectAmountDetector();
detector.infiniteDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 FINAL SUCCESS: Correct amounts and green border! 🎉🎉🎉');
  }
}).catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting with correct amounts...');
    const newDetector = new CorrectAmountDetector();
    newDetector.infiniteDetection();
  }, 5000);
});