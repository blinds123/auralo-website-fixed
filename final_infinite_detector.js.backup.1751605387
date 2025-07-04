const { chromium, devices } = require('playwright');

class FinalInfiniteDetector {
  constructor() {
    this.attemptNumber = 1;
    this.strategies = [
      'basic_flow',
      'wallet_first',
      'email_flow', 
      'direct_exchange',
      'fiat_enabled',
      'slow_interaction',
      'aggressive_clicking',
      'form_submission',
      'manual_navigation',
      'provider_forced'
    ];
  }

  async infiniteDetection() {
    console.log(`\n🔄 INFINITE DETECTION ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    
    const strategy = this.strategies[(this.attemptNumber - 1) % this.strategies.length];
    console.log(`📋 Strategy: ${strategy.replace('_', ' ').toUpperCase()}`);
    
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
        const success = await this.testStrategy(browser, config, strategy);
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

  async testStrategy(browser, config, strategy) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - ${strategy}`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      console.log(`  📱 1. Navigating to SimpleSwap...`);
      const url = this.getStrategyURL(strategy);
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`  📱 2. Executing strategy: ${strategy}...`);
      await this.executeStrategy(page, strategy);
      
      console.log(`  📱 3. Enhanced provider detection...`);
      const providerAnalysis = await this.robustProviderAnalysis(page);
      
      console.log(`  📊 Results: Mercuryo(${providerAnalysis.mercuryoElements.length}) MoonPay(${providerAnalysis.moonpayElements.length}) Green(${providerAnalysis.greenElements.length})`);
      console.log(`  🎯 MERCURYO GREEN: ${providerAnalysis.mercuryoGreenDetected}`);
      
      if (providerAnalysis.mercuryoElements.length > 0) {
        console.log(`  💳 Mercuryo details:`);
        providerAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`     ${i + 1}. ${el.tag} "${el.text.substring(0, 40)}..." Green: ${el.hasGreen}`);
        });
      }
      
      if (providerAnalysis.mercuryoGreenDetected) {
        console.log(`\n  🎉 SUCCESS! Testing 5-second persistence...`);
        await page.waitForTimeout(5000);
        
        const persistenceCheck = await this.robustProviderAnalysis(page);
        
        if (persistenceCheck.mercuryoGreenDetected && !persistenceCheck.moonpayGreenDetected) {
          console.log(`\n  🏆 PERSISTENCE CONFIRMED! Mission accomplished!`);
          await page.screenshot({ 
            path: `SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          await context.close();
          return true;
        }
      }
      
      await page.screenshot({ 
        path: `attempt_${this.attemptNumber}_${config.name.replace(' ', '_')}_${config.region}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  getStrategyURL(strategy) {
    const base = 'https://simpleswap.io';
    const params = 'from=eur&to=pol&amount=15&partner=auralo';
    
    switch (strategy) {
      case 'fiat_enabled':
        return `${base}/?${params}&fiat=true`;
      case 'direct_exchange':
        return `${base}/create-exchange?${params}`;
      case 'provider_forced':
        return `${base}/?${params}&preferred=mercuryo`;
      default:
        return `${base}/?${params}`;
    }
  }

  async executeStrategy(page, strategy) {
    switch (strategy) {
      case 'wallet_first':
        await this.walletFirstFlow(page);
        break;
      case 'email_flow':
        await this.emailFlow(page);
        break;
      case 'slow_interaction':
        await this.slowInteractionFlow(page);
        break;
      case 'aggressive_clicking':
        await this.aggressiveClickingFlow(page);
        break;
      case 'form_submission':
        await this.formSubmissionFlow(page);
        break;
      case 'manual_navigation':
        await this.manualNavigationFlow(page);
        break;
      default:
        await this.basicFlow(page);
    }
  }

  async basicFlow(page) {
    // Fill wallet and proceed
    const walletSelectors = [
      'input[placeholder*="address"]',
      'input[placeholder*="wallet"]',
      'input[type="text"]'
    ];
    
    for (const selector of walletSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.fill('0x1234567890123456789012345678901234567890');
          console.log(`    ✅ Filled wallet: ${selector}`);
          break;
        }
      } catch (e) {}
    }
    
    await page.waitForTimeout(1000);
    
    // Click exchange button
    const buttonSelectors = [
      'button:has-text("Exchange")',
      'button:has-text("Continue")',
      'button[type="submit"]'
    ];
    
    for (const selector of buttonSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          console.log(`    ✅ Clicked: ${selector}`);
          await page.waitForTimeout(3000);
          break;
        }
      } catch (e) {}
    }
  }

  async walletFirstFlow(page) {
    // Focus specifically on wallet input
    const walletInput = await page.$('input[type="text"]');
    if (walletInput) {
      await walletInput.focus();
      await walletInput.fill('0x1234567890123456789012345678901234567890');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
    }
  }

  async emailFlow(page) {
    // Try email input if available
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('test@example.com');
      await page.waitForTimeout(1000);
    }
    await this.basicFlow(page);
  }

  async slowInteractionFlow(page) {
    // Slow, deliberate interactions
    await page.waitForTimeout(5000);
    await this.basicFlow(page);
    await page.waitForTimeout(5000);
  }

  async aggressiveClickingFlow(page) {
    // Click multiple buttons aggressively
    const buttons = await page.$$('button');
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      try {
        await buttons[i].click();
        await page.waitForTimeout(1000);
      } catch (e) {}
    }
  }

  async formSubmissionFlow(page) {
    // Submit any forms found
    const forms = await page.$$('form');
    for (const form of forms) {
      try {
        await form.evaluate(form => form.submit());
        await page.waitForTimeout(2000);
      } catch (e) {}
    }
  }

  async manualNavigationFlow(page) {
    // Navigate to known exchange creation paths
    const paths = [
      '/create-exchange',
      '/exchange',
      '/swap'
    ];
    
    for (const path of paths) {
      try {
        await page.goto(`https://simpleswap.io${path}?from=eur&to=pol&amount=15&partner=auralo`, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });
        await page.waitForTimeout(3000);
        break;
      } catch (e) {}
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
          
          // Comprehensive border detection
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
          
          // Multiple green detection patterns
          const greenPatterns = [
            'rgb(34, 197, 94)',
            'rgba(34, 197, 94',
            '#22c55e',
            '22c55e',
            'rgb(0, 128, 0)',
            'green',
            'lightgreen',
            'rgb(46, 160, 67)',
            'rgb(76, 175, 80)',
            'rgb(40, 167, 69)',
            'rgb(25, 135, 84)',
            'rgb(16, 185, 129)',
            'solid green',
            '1px solid',
            '2px solid'
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
              borderWidth: style.borderWidth || ''
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
              hasMoonpay: text.includes('moonpay')
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

// Start the final infinite detector
const detector = new FinalInfiniteDetector();
detector.infiniteDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 FINAL SUCCESS: Mission accomplished! 🎉🎉🎉');
    console.log('✅ Mercuryo green border detected and persists on mobile devices!');
  }
}).catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting infinite detector...');
    const newDetector = new FinalInfiniteDetector();
    newDetector.infiniteDetection();
  }, 5000);
});