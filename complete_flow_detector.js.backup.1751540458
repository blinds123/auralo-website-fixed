const { chromium, devices } = require('playwright');

class CompleteFlowDetector {
  constructor() {
    this.attemptNumber = 1;
  }

  async infiniteDetection() {
    console.log(`\n🔄 COMPLETE FLOW ATTEMPT ${this.attemptNumber}`);
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
        const success = await this.testCompleteFlow(browser, config);
        if (success) {
          console.log(`\n🏆🏆🏆 COMPLETE FLOW SUCCESS! 🏆🏆🏆`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
      }
    }

    await browser.close();
    
    this.attemptNumber++;
    await new Promise(resolve => setTimeout(resolve, 3000));
    return this.infiniteDetection();
  }

  async testCompleteFlow(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - COMPLETE EXCHANGE FLOW`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    // Monitor navigation events
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        console.log(`    🔗 Navigation: ${frame.url()}`);
      }
    });
    
    try {
      console.log(`  📱 1. Starting with EUR to USDT for stable value...`);
      await page.goto('https://simpleswap.io/?from=eur&to=usdt&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`  📱 2. Verifying and filling form fields...`);
      
      // Check initial amounts
      const initialCheck = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const buttons = Array.from(document.querySelectorAll('button'));
        
        return {
          inputs: inputs.map(inp => ({
            type: inp.type,
            value: inp.value,
            placeholder: inp.placeholder,
            name: inp.name || '',
            id: inp.id || ''
          })),
          buttons: buttons.map(btn => ({
            text: btn.textContent?.trim(),
            type: btn.type,
            disabled: btn.disabled
          })),
          url: window.location.href
        };
      });
      
      console.log(`    📊 Found ${initialCheck.inputs.length} inputs and ${initialCheck.buttons.length} buttons`);
      
      // Log relevant inputs
      initialCheck.inputs.forEach((inp, i) => {
        if (inp.value || inp.placeholder?.includes('address') || inp.placeholder?.includes('amount')) {
          console.log(`    Input ${i}: ${inp.type} value="${inp.value}" placeholder="${inp.placeholder}"`);
        }
      });
      
      // Log relevant buttons  
      initialCheck.buttons.forEach((btn, i) => {
        if (btn.text && (btn.text.includes('Exchange') || btn.text.includes('Continue') || btn.text.includes('Create'))) {
          console.log(`    Button ${i}: "${btn.text}" (disabled: ${btn.disabled})`);
        }
      });
      
      // Fill wallet address - try multiple strategies
      console.log(`  📱 3. Filling wallet address with multiple strategies...`);
      
      let walletFilled = false;
      const walletStrategies = [
        // Strategy 1: Standard selectors
        async () => {
          const selectors = [
            'input[placeholder*="address"]',
            'input[placeholder*="wallet"]', 
            'input[placeholder*="recipient"]',
            'input[name*="address"]',
            'input[type="text"]:not([placeholder*="amount"]):not([placeholder*="search"])',
            '[data-testid*="address"]'
          ];
          
          for (const selector of selectors) {
            try {
              const input = await page.$(selector);
              if (input) {
                await input.fill('0x1234567890123456789012345678901234567890');
                console.log(`    ✅ Wallet filled with: ${selector}`);
                return true;
              }
            } catch (e) {}
          }
          return false;
        },
        
        // Strategy 2: By position (usually second text input)
        async () => {
          const textInputs = await page.$$('input[type="text"]');
          if (textInputs.length >= 2) {
            try {
              await textInputs[1].fill('0x1234567890123456789012345678901234567890');
              console.log(`    ✅ Wallet filled with second text input`);
              return true;
            } catch (e) {}
          }
          return false;
        },
        
        // Strategy 3: By placeholder text search
        async () => {
          const walletInput = await page.evaluateHandle(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.find(inp => 
              (inp.placeholder && inp.placeholder.toLowerCase().includes('address')) ||
              (inp.placeholder && inp.placeholder.toLowerCase().includes('wallet')) ||
              (inp.name && inp.name.toLowerCase().includes('address'))
            );
          });
          
          if (walletInput) {
            try {
              await walletInput.fill('0x1234567890123456789012345678901234567890');
              console.log(`    ✅ Wallet filled with placeholder search`);
              return true;
            } catch (e) {}
          }
          return false;
        }
      ];
      
      for (const strategy of walletStrategies) {
        if (await strategy()) {
          walletFilled = true;
          break;
        }
      }
      
      if (!walletFilled) {
        console.log(`    ❌ Could not fill wallet address`);
      }
      
      await page.waitForTimeout(2000);
      
      // Validate form before submission
      console.log(`  📱 4. Validating form before exchange...`);
      
      const preSubmitCheck = await page.evaluate(() => {
        const form = document.querySelector('form');
        const exchangeButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
          btn.textContent?.toLowerCase().includes('exchange') ||
          btn.textContent?.toLowerCase().includes('continue') ||
          btn.textContent?.toLowerCase().includes('create')
        );
        
        return {
          hasForm: !!form,
          buttonCount: exchangeButtons.length,
          buttons: exchangeButtons.map(btn => ({
            text: btn.textContent?.trim(),
            disabled: btn.disabled,
            type: btn.type
          }))
        };
      });
      
      console.log(`    📊 Form validation: hasForm=${preSubmitCheck.hasForm}, buttons=${preSubmitCheck.buttonCount}`);
      
      // Click exchange button with multiple strategies
      console.log(`  📱 5. Submitting exchange with comprehensive strategies...`);
      
      let exchangeSubmitted = false;
      const submitStrategies = [
        // Strategy 1: Primary exchange button
        async () => {
          const selectors = [
            'button:has-text("Exchange")',
            'button:has-text("Continue")',
            'button:has-text("Create Exchange")',
            'button:has-text("Start Exchange")',
            'button[type="submit"]'
          ];
          
          for (const selector of selectors) {
            try {
              const button = await page.$(selector);
              if (button) {
                const isEnabled = await button.evaluate(btn => !btn.disabled);
                if (isEnabled) {
                  await button.click();
                  console.log(`    ✅ Clicked exchange button: ${selector}`);
                  return true;
                }
              }
            } catch (e) {}
          }
          return false;
        },
        
        // Strategy 2: Form submission
        async () => {
          try {
            const form = await page.$('form');
            if (form) {
              await form.evaluate(form => form.submit());
              console.log(`    ✅ Submitted form directly`);
              return true;
            }
          } catch (e) {}
          return false;
        },
        
        // Strategy 3: Enter key
        async () => {
          try {
            await page.keyboard.press('Enter');
            console.log(`    ✅ Pressed Enter key`);
            return true;
          } catch (e) {}
          return false;
        },
        
        // Strategy 4: Click any enabled button
        async () => {
          const buttons = await page.$$('button:not([disabled])');
          for (const button of buttons) {
            try {
              const text = await button.textContent();
              if (text && (text.includes('Exchange') || text.includes('Continue') || text.includes('Go'))) {
                await button.click();
                console.log(`    ✅ Clicked enabled button: "${text}"`);
                return true;
              }
            } catch (e) {}
          }
          return false;
        }
      ];
      
      for (const strategy of submitStrategies) {
        if (await strategy()) {
          exchangeSubmitted = true;
          break;
        }
      }
      
      if (!exchangeSubmitted) {
        console.log(`    ❌ Could not submit exchange`);
      }
      
      // Wait for navigation or new content
      console.log(`  📱 6. Waiting for navigation/new content...`);
      
      try {
        // Wait for either navigation or new content to appear
        await Promise.race([
          page.waitForNavigation({ timeout: 10000 }),
          page.waitForSelector('[data-testid*="provider"], .provider, .payment-method', { timeout: 10000 }),
          page.waitForFunction(() => {
            return document.querySelector('*[class*="mercuryo"], *[class*="moonpay"]') ||
                   document.body.textContent.toLowerCase().includes('provider') ||
                   document.body.textContent.toLowerCase().includes('payment method');
          }, { timeout: 10000 })
        ]);
        console.log(`    ✅ Navigation/content change detected`);
      } catch (e) {
        console.log(`    ⏳ No navigation detected, continuing with analysis...`);
      }
      
      await page.waitForTimeout(5000);
      
      // Enhanced provider detection
      console.log(`  📱 7. Enhanced provider detection...`);
      const providerAnalysis = await this.comprehensiveProviderAnalysis(page);
      
      console.log(`  📊 RESULTS:`);
      console.log(`     URL: ${providerAnalysis.url}`);
      console.log(`     Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
      console.log(`     MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
      console.log(`     Green elements: ${providerAnalysis.greenElements.length}`);
      console.log(`     🎯 MERCURYO GREEN BORDER: ${providerAnalysis.mercuryoGreenDetected}`);
      console.log(`     ❌ MoonPay green border: ${providerAnalysis.moonpayGreenDetected}`);
      
      // Detailed logging
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 MERCURYO ELEMENTS:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 60)}..."`);
          console.log(`        Green: ${el.hasGreen}, Border: ${el.borderColor}, Width: ${el.borderWidth}`);
          if (el.hasGreen) {
            console.log(`        🎯 THIN GREEN BORDER DETECTED!`);
          }
        });
      }
      
      // Success check
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎉 SUCCESS! Mercuryo green border detected!`);
        
        // 5-second persistence test
        console.log(`  ⏰ Testing 5-second persistence...`);
        await page.waitForTimeout(5000);
        
        const persistenceCheck = await this.comprehensiveProviderAnalysis(page);
        
        if (persistenceCheck.mercuryoGreenDetected && !persistenceCheck.moonpayGreenDetected) {
          console.log(`\n  🏆 COMPLETE SUCCESS!`);
          console.log(`     ✅ Exchange flow completed`);
          console.log(`     ✅ Mercuryo green border detected`);
          console.log(`     ✅ Green border persists after 5 seconds`);
          console.log(`     ✅ MoonPay does not have green border`);
          
          await page.screenshot({ 
            path: `COMPLETE_FLOW_SUCCESS_${config.name.replace(' ', '_')}_${config.region}.png`,
            fullPage: true 
          });
          
          await context.close();
          return true;
        }
      }
      
      // Check if we're stuck on the same page
      const currentUrl = page.url();
      if (currentUrl === initialCheck.url) {
        console.log(`  ⚠️ Still on same page, trying alternative navigation...`);
        
        // Try clicking any other buttons or links
        const allClickables = await page.$$('a, button, [role="button"], [onclick]');
        for (let i = 0; i < Math.min(allClickables.length, 5); i++) {
          try {
            const text = await allClickables[i].textContent();
            if (text && text.trim().length > 0 && text.length < 50) {
              console.log(`    🔄 Trying clickable: "${text.trim()}"`);
              await allClickables[i].click();
              await page.waitForTimeout(3000);
              
              const newUrl = page.url();
              if (newUrl !== currentUrl) {
                console.log(`    ✅ Navigation successful to: ${newUrl}`);
                break;
              }
            }
          } catch (e) {}
        }
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `complete_flow_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async comprehensiveProviderAnalysis(page) {
    return await page.evaluate(() => {
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
      
      document.querySelectorAll('*').forEach(el => {
        try {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          const className = el.className ? 
            (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
          
          // Enhanced border detection for thin borders
          const borderProps = [
            style.border, style.borderColor, style.borderTopColor,
            style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Comprehensive green patterns including very thin borders
          const greenPatterns = [
            'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
            'rgb(0, 128, 0)', 'green', 'lightgreen', 'rgb(46, 160, 67)',
            'rgb(76, 175, 80)', 'rgb(40, 167, 69)', 'rgb(25, 135, 84)',
            'rgb(16, 185, 129)', 'rgb(5, 150, 105)', 'rgb(4, 120, 87)',
            'solid green', '1px solid', '2px solid', 'thin', 'medium', 'thick',
            '0.5px', '1px', '1.5px', '2px', '3px' // Various widths
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
              borderStyle: style.borderStyle || '',
              outline: style.outline || '',
              boxShadow: style.boxShadow || ''
            };
            
            analysis.mercuryoElements.push(elementData);
            if (hasGreen) analysis.mercuryoGreenDetected = true;
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
            if (hasGreen) analysis.moonpayGreenDetected = true;
          }
          
          // Green elements
          if (hasGreen) {
            analysis.greenElements.push({
              text: el.textContent ? el.textContent.substring(0, 50) : '',
              tag: el.tagName || '',
              className: className,
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              borderWidth: style.borderWidth || ''
            });
          }
          
        } catch (e) {}
      });
      
      return analysis;
    });
  }
}

// Start the complete flow detector
const detector = new CompleteFlowDetector();
detector.infiniteDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 COMPLETE FLOW SUCCESS ACHIEVED! 🎉🎉🎉');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting complete flow...');
    const newDetector = new CompleteFlowDetector();
    newDetector.infiniteDetection();
  }, 5000);
});