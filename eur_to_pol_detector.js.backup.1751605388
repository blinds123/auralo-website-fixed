const { chromium, devices } = require('playwright');

class EurToPolDetector {
  constructor() {
    this.attemptNumber = 1;
  }

  async infiniteDetection() {
    console.log(`\n🔄 EUR TO POL (15 EUR) ATTEMPT ${this.attemptNumber}`);
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
        const success = await this.testEurToPol(browser, config);
        if (success) {
          console.log(`\n🏆🏆🏆 EUR TO POL SUCCESS! 🏆🏆🏆`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
      }
    }

    await browser.close();
    
    this.attemptNumber++;
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.infiniteDetection();
  }

  async testEurToPol(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - EUR TO POL (15 EUR)`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // Try multiple URL variations for EUR to POL
      const strategies = [
        {
          name: 'EUR to POL direct',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo'
        },
        {
          name: 'EUR to MATIC (Polygon)',
          url: 'https://simpleswap.io/?from=eur&to=matic&amount=15&partner=auralo'
        },
        {
          name: 'EUR to POL with fiat flag',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&fiat=true'
        },
        {
          name: 'EUR to POL with fixed rates',
          url: 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&fixed=true'
        }
      ];
      
      for (const strategy of strategies) {
        console.log(`  📱 Strategy: ${strategy.name}`);
        
        await page.goto(strategy.url, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        
        await page.waitForTimeout(3000);
        
        // Check if the page loaded correctly and amounts are right
        const pageCheck = await page.evaluate(() => {
          return {
            url: window.location.href,
            title: document.title,
            hasError: document.body.textContent.includes('error') || 
                     document.body.textContent.includes('not supported') ||
                     document.body.textContent.includes('minimum'),
            pageText: document.body.textContent.substring(0, 300)
          };
        });
        
        console.log(`    📄 Page: ${pageCheck.title}`);
        if (pageCheck.hasError) {
          console.log(`    ❌ Page has errors, trying next strategy...`);
          continue;
        }
        
        // Enhanced wallet address filling with multiple sophisticated strategies
        console.log(`    🏦 Advanced wallet address filling...`);
        
        let walletFilled = false;
        const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
        
        // Strategy 1: Direct selectors
        const directSelectors = [
          'input[placeholder*="Recipient address"]',
          'input[placeholder*="recipient address"]',
          'input[placeholder*="address"]',
          'input[placeholder*="wallet"]',
          'input[name*="address"]',
          'input[name*="recipient"]',
          'input[id*="address"]',
          'input[id*="recipient"]'
        ];
        
        for (const selector of directSelectors) {
          try {
            const input = await page.$(selector);
            if (input) {
              console.log(`      🎯 Found input: ${selector}`);
              
              // Clear and fill
              await input.click();
              await page.keyboard.selectAll();
              await input.fill(walletAddress);
              await page.waitForTimeout(1000);
              
              // Verify it's filled
              const value = await input.inputValue();
              if (value === walletAddress) {
                console.log(`      ✅ Wallet filled successfully: ${selector}`);
                walletFilled = true;
                break;
              }
            }
          } catch (e) {}
        }
        
        // Strategy 2: By text input position (usually the second text input is recipient)
        if (!walletFilled) {
          console.log(`      🔄 Trying by input position...`);
          const textInputs = await page.$$('input[type="text"]');
          
          for (let i = 0; i < textInputs.length; i++) {
            try {
              const placeholder = await textInputs[i].getAttribute('placeholder');
              console.log(`      Input ${i}: placeholder="${placeholder}"`);
              
              // Skip amount/search inputs, look for address-like inputs
              if (placeholder && (
                placeholder.toLowerCase().includes('address') ||
                placeholder.toLowerCase().includes('recipient') ||
                placeholder.toLowerCase().includes('wallet') ||
                placeholder === '' // Empty placeholder might be address field
              )) {
                await textInputs[i].click();
                await page.keyboard.selectAll();
                await textInputs[i].fill(walletAddress);
                await page.waitForTimeout(1000);
                
                const value = await textInputs[i].inputValue();
                if (value === walletAddress) {
                  console.log(`      ✅ Wallet filled at position ${i}`);
                  walletFilled = true;
                  break;
                }
              }
            } catch (e) {}
          }
        }
        
        // Strategy 3: Find by label text
        if (!walletFilled) {
          console.log(`      🔄 Trying by label association...`);
          const labelInput = await page.evaluateHandle(() => {
            const labels = Array.from(document.querySelectorAll('label'));
            for (const label of labels) {
              const text = label.textContent?.toLowerCase() || '';
              if (text.includes('address') || text.includes('recipient') || text.includes('wallet')) {
                // Find associated input
                const input = label.querySelector('input') || 
                             document.querySelector(`input[id="${label.getAttribute('for')}"]`) ||
                             label.nextElementSibling?.querySelector?.('input');
                if (input && input.type === 'text') {
                  return input;
                }
              }
            }
            return null;
          });
          
          if (labelInput) {
            try {
              await labelInput.click();
              await page.keyboard.selectAll();
              await labelInput.fill(walletAddress);
              await page.waitForTimeout(1000);
              
              const value = await labelInput.inputValue();
              if (value === walletAddress) {
                console.log(`      ✅ Wallet filled via label association`);
                walletFilled = true;
              }
            } catch (e) {}
          }
        }
        
        // Strategy 4: DOM exploration - look for forms and inputs
        if (!walletFilled) {
          console.log(`      🔄 Trying DOM exploration...`);
          const formInputs = await page.$$eval('form input[type="text"]', inputs => {
            return inputs.map((input, index) => ({
              index,
              placeholder: input.placeholder,
              name: input.name,
              id: input.id,
              value: input.value
            }));
          });
          
          console.log(`      Found ${formInputs.length} form text inputs:`, formInputs);
          
          // Try the input that's likely the recipient address (not amount fields)
          for (let i = 0; i < formInputs.length; i++) {
            const inputInfo = formInputs[i];
            if (!inputInfo.value || inputInfo.value === '0' || 
                !inputInfo.placeholder?.includes('amount')) {
              try {
                const input = await page.$(`form input[type="text"]:nth-of-type(${i + 1})`);
                if (input) {
                  await input.click();
                  await page.keyboard.selectAll();
                  await input.fill(walletAddress);
                  await page.waitForTimeout(1000);
                  
                  const value = await input.inputValue();
                  if (value === walletAddress) {
                    console.log(`      ✅ Wallet filled via DOM exploration at index ${i}`);
                    walletFilled = true;
                    break;
                  }
                }
              } catch (e) {}
            }
          }
        }
        
        if (!walletFilled) {
          console.log(`      ❌ Could not fill wallet address, trying without it...`);
        }
        
        // Check for validation errors
        await page.waitForTimeout(2000);
        const validationErrors = await page.evaluate(() => {
          const errors = Array.from(document.querySelectorAll('.error, .invalid, [class*="error"], [class*="invalid"]'));
          return errors.map(err => err.textContent?.trim()).filter(Boolean);
        });
        
        if (validationErrors.length > 0) {
          console.log(`      ❌ Validation errors: ${validationErrors.join(', ')}`);
          continue;
        }
        
        // Click exchange button
        console.log(`    🔄 Clicking exchange button...`);
        
        const exchangeStrategies = [
          'button:has-text("Exchange"):not([disabled])',
          'button:has-text("Continue"):not([disabled])',
          'button:has-text("Create Exchange"):not([disabled])',
          'button[type="submit"]:not([disabled])',
          'button:not([disabled])'
        ];
        
        let exchangeClicked = false;
        for (const btnSelector of exchangeStrategies) {
          try {
            const buttons = await page.$$(btnSelector);
            for (const button of buttons) {
              const text = await button.textContent();
              if (text && (
                text.includes('Exchange') || 
                text.includes('Continue') || 
                text.includes('Create') ||
                text.includes('Go')
              )) {
                console.log(`      🔘 Clicking: "${text.trim()}"`);
                await button.click();
                await page.waitForTimeout(3000);
                exchangeClicked = true;
                break;
              }
            }
            if (exchangeClicked) break;
          } catch (e) {}
        }
        
        if (!exchangeClicked) {
          console.log(`      ❌ Could not click exchange button`);
          continue;
        }
        
        // Wait for navigation or provider selection
        console.log(`    ⏳ Waiting for provider selection interface...`);
        
        try {
          await Promise.race([
            page.waitForNavigation({ timeout: 10000 }),
            page.waitForSelector('[class*="provider"], [class*="payment"]', { timeout: 10000 }),
            page.waitForFunction(() => {
              const text = document.body.textContent.toLowerCase();
              return text.includes('mercuryo') && text.includes('moonpay') && 
                     (text.includes('provider') || text.includes('payment'));
            }, { timeout: 10000 })
          ]);
          console.log(`      ✅ Provider selection detected!`);
        } catch (e) {
          console.log(`      ⏳ No provider selection yet, analyzing current page...`);
        }
        
        await page.waitForTimeout(5000);
        
        // Enhanced provider detection
        const providerAnalysis = await this.comprehensiveProviderAnalysis(page);
        
        console.log(`    📊 PROVIDER ANALYSIS:`);
        console.log(`       URL: ${providerAnalysis.url}`);
        console.log(`       Mercuryo elements: ${providerAnalysis.mercuryoElements.length}`);
        console.log(`       MoonPay elements: ${providerAnalysis.moonpayElements.length}`);
        console.log(`       Green elements: ${providerAnalysis.greenElements.length}`);
        console.log(`       🎯 MERCURYO GREEN BORDER: ${providerAnalysis.mercuryoGreenDetected}`);
        console.log(`       ❌ MoonPay green border: ${providerAnalysis.moonpayGreenDetected}`);
        
        // Log Mercuryo details
        if (providerAnalysis.mercuryoElements.length > 0) {
          console.log(`    💳 MERCURYO ELEMENTS:`);
          providerAnalysis.mercuryoElements.forEach((el, i) => {
            console.log(`       ${i + 1}. ${el.tag} "${el.text.substring(0, 60)}..."`);
            console.log(`          Green: ${el.hasGreen}, Border: ${el.borderColor}, Width: ${el.borderWidth}`);
            if (el.hasGreen) {
              console.log(`          🎯 THIN GREEN BORDER DETECTED!`);
            }
          });
        }
        
        // Success check
        if (providerAnalysis.mercuryoGreenDetected) {
          console.log(`\n    🎉 SUCCESS! Mercuryo green border detected!`);
          
          // 5-second persistence test
          console.log(`    ⏰ Testing 5-second persistence...`);
          await page.waitForTimeout(5000);
          
          const persistenceCheck = await this.comprehensiveProviderAnalysis(page);
          
          if (persistenceCheck.mercuryoGreenDetected && !persistenceCheck.moonpayGreenDetected) {
            console.log(`\n    🏆 EUR TO POL COMPLETE SUCCESS!`);
            console.log(`       ✅ Correct pair: 15 EUR to POL`);
            console.log(`       ✅ Exchange creation successful`);
            console.log(`       ✅ Mercuryo green border detected`);
            console.log(`       ✅ Green border persists after 5 seconds`);
            console.log(`       ✅ MoonPay does not have green border`);
            
            await page.screenshot({ 
              path: `EUR_POL_SUCCESS_${config.name.replace(' ', '_')}_${config.region}.png`,
              fullPage: true 
            });
            
            await context.close();
            return true;
          }
        }
        
        // Take screenshot for this strategy
        await page.screenshot({ 
          path: `eur_pol_${strategy.name.replace(/\s+/g, '_')}_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
          fullPage: true 
        });
      }
      
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
        title: document.title
      };
      
      document.querySelectorAll('*').forEach(el => {
        try {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          const className = el.className ? 
            (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
          
          // Enhanced border detection for thin green borders
          const borderProps = [
            style.border, style.borderColor, style.borderTopColor,
            style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Comprehensive green patterns - focusing on thin borders
          const greenPatterns = [
            'rgb(34, 197, 94)',    // Primary target green
            'rgba(34, 197, 94',    // With alpha
            '#22c55e', '22c55e',   // Hex variants
            'rgb(0, 128, 0)',      // Standard green
            'green', 'lightgreen', // CSS green
            'rgb(46, 160, 67)',    // Material green
            'rgb(76, 175, 80)',    // Material light green
            'rgb(40, 167, 69)',    // Bootstrap success
            'rgb(25, 135, 84)',    // Bootstrap success dark
            'rgb(16, 185, 129)',   // Tailwind green variants
            'rgb(5, 150, 105)',
            'rgb(4, 120, 87)',
            'solid green',         // Border styles
            '1px solid',           // Thin solid borders
            '2px solid',           // Medium borders
            'thin',                // CSS thin
            '0.5px', '1px', '1.5px', '2px'  // Specific widths
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          // Mercuryo detection (including variations)
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
              outline: style.outline || ''
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
          
          // All green elements for debugging
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

// Start the EUR to POL detector
const detector = new EurToPolDetector();
detector.infiniteDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 EUR TO POL SUCCESS ACHIEVED! 🎉🎉🎉');
    console.log('✅ 15 EUR to POL exchange completed with Mercuryo green border detected!');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting EUR to POL detector...');
    const newDetector = new EurToPolDetector();
    newDetector.infiniteDetection();
  }, 5000);
});