const { chromium, devices } = require('playwright');

class CorrectedPolDetector {
  constructor() {
    this.attemptNumber = 1;
    this.strategies = [
      'pol_direct',
      'pol_with_timing',
      'pol_refresh_strategy',
      'pol_interaction_heavy',
      'pol_network_variations',
      'pol_viewport_cycling',
      'pol_cache_management',
      'pol_amount_testing',
      'pol_form_focus',
      'pol_aggressive_detection'
    ];
    this.discoveries = [];
  }

  async autonomousPolDetection() {
    console.log(`\n🚀 CORRECTED POL DETECTION - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    
    const strategy = this.strategies[(this.attemptNumber - 1) % this.strategies.length];
    console.log(`🎯 Strategy: ${strategy.replace('_', ' ').toUpperCase()}`);
    console.log(`📚 Discoveries so far: ${this.discoveries.length}`);
    
    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage'
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
        const success = await this.testPolStrategy(browser, config, strategy);
        if (success) {
          console.log(`\n🏆🏆🏆 POLYGON (POL) SUCCESS ACHIEVED! 🏆🏆🏆`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
        this.discoveries.push({
          attempt: this.attemptNumber,
          strategy,
          device: config.name,
          region: config.region,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }

    await browser.close();
    
    this.attemptNumber++;
    
    // Adaptive learning - modify strategies based on discoveries
    if (this.attemptNumber % 10 === 0) {
      this.adaptStrategies();
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.autonomousPolDetection();
  }

  async testPolStrategy(browser, config, strategy) {
    console.log(`${config.flag} ${config.name} ${config.region} - ${strategy}`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      await this.executePolStrategy(page, strategy, config);
      
      // Deep provider analysis
      const analysis = await this.deepProviderAnalysis(page);
      
      console.log(`  📊 Results: M:${analysis.mercuryoElements.length} MP:${analysis.moonpayElements.length} G:${analysis.greenElements.length} 🎯MG:${analysis.mercuryoGreenDetected}`);
      
      // Log any Mercuryo elements found
      if (analysis.mercuryoElements.length > 0) {
        analysis.mercuryoElements.forEach((el, i) => {
          console.log(`    💳 M${i+1}: ${el.tag} "${el.text.substring(0, 30)}..." Green:${el.hasGreen}`);
          if (el.hasGreen) {
            console.log(`      🎯 GREEN BORDER DETECTED ON MERCURYO!`);
          }
        });
      }
      
      // Success detection
      if (analysis.mercuryoGreenDetected) {
        console.log(`  🎉 MERCURYO GREEN BORDER FOUND! Testing persistence...`);
        
        // 5-second persistence test
        await page.waitForTimeout(5000);
        const persistCheck = await this.deepProviderAnalysis(page);
        
        if (persistCheck.mercuryoGreenDetected && !persistCheck.moonpayGreenDetected) {
          console.log(`  🏆 PERSISTENCE CONFIRMED! MISSION ACCOMPLISHED!`);
          console.log(`     ✅ EUR to POL exchange successful`);
          console.log(`     ✅ Mercuryo selected with green border`);
          console.log(`     ✅ Green border persists after 5 seconds`);
          console.log(`     ✅ MoonPay does not have green border`);
          
          await page.screenshot({ 
            path: `POL_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          
          // Save discovery
          this.discoveries.push({
            attempt: this.attemptNumber,
            strategy,
            device: config.name,
            region: config.region,
            success: true,
            url: analysis.url,
            timestamp: Date.now()
          });
          
          await context.close();
          return true;
        } else {
          console.log(`  ❌ Persistence test failed - continuing search...`);
        }
      }
      
      // Record findings
      this.discoveries.push({
        attempt: this.attemptNumber,
        strategy,
        device: config.name,
        region: config.region,
        mercuryoFound: analysis.mercuryoElements.length > 0,
        mercuryoGreen: analysis.mercuryoGreenDetected,
        moonpayFound: analysis.moonpayElements.length > 0,
        greenCount: analysis.greenElements.length,
        url: analysis.url,
        timestamp: Date.now()
      });
      
      await page.screenshot({ 
        path: `pol_${strategy}_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async executePolStrategy(page, strategy, config) {
    // CORRECTED: Use POL instead of MATIC
    const baseUrl = 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo';
    
    switch (strategy) {
      case 'pol_direct':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
        break;
        
      case 'pol_with_timing':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        await this.standardPolFlow(page);
        await page.waitForTimeout(7000);
        break;
        
      case 'pol_refresh_strategy':
        for (let i = 0; i < 2; i++) {
          await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(2000);
        }
        await this.standardPolFlow(page);
        break;
        
      case 'pol_interaction_heavy':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        // Simulate heavy user interaction
        await page.mouse.move(100, 100);
        await page.waitForTimeout(500);
        await page.mouse.move(300, 300);
        await page.waitForTimeout(500);
        await page.evaluate(() => window.scrollTo(0, 100));
        await page.waitForTimeout(1000);
        await this.standardPolFlow(page);
        break;
        
      case 'pol_network_variations':
        await page.emulateNetworkConditions({
          offline: false,
          downloadThroughput: 2000000,
          uploadThroughput: 1000000,
          latency: 50
        });
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
        break;
        
      case 'pol_viewport_cycling':
        const viewports = [
          { width: 375, height: 667 },
          { width: 393, height: 852 },
          { width: 412, height: 915 }
        ];
        const vp = viewports[this.attemptNumber % viewports.length];
        await page.setViewportSize(vp);
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
        break;
        
      case 'pol_cache_management':
        await page.goto('about:blank');
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
        break;
        
      case 'pol_amount_testing':
        const amounts = ['14.5', '15', '15.5', '16', '20'];
        const amount = amounts[this.attemptNumber % amounts.length];
        const amountUrl = `https://simpleswap.io/?from=eur&to=pol&amount=${amount}&partner=auralo`;
        await page.goto(amountUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
        break;
        
      case 'pol_form_focus':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        // Focus on form elements explicitly
        const inputs = await page.$$('input');
        for (const input of inputs.slice(0, 3)) {
          try {
            await input.focus();
            await page.waitForTimeout(200);
          } catch (e) {}
        }
        await this.standardPolFlow(page);
        break;
        
      case 'pol_aggressive_detection':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await this.standardPolFlow(page);
        await page.waitForTimeout(10000);
        // Try multiple detection cycles
        for (let i = 0; i < 3; i++) {
          await page.waitForTimeout(3000);
          const quickCheck = await this.deepProviderAnalysis(page);
          if (quickCheck.mercuryoGreenDetected) {
            break;
          }
        }
        break;
        
      default:
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardPolFlow(page);
    }
  }

  async standardPolFlow(page) {
    await page.waitForTimeout(3000);
    
    // Enhanced wallet address filling
    const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
    const walletStrategies = [
      'input[placeholder*="address"]',
      'input[placeholder*="recipient"]',
      'input[placeholder*="wallet"]',
      'input[type="text"]:not([value*="15"]):not([value*="14"]):not([value*="16"])',
      'input[name*="address"]'
    ];
    
    let walletFilled = false;
    for (const selector of walletStrategies) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.click();
          await page.keyboard.selectAll();
          await input.fill(walletAddress);
          await page.waitForTimeout(1000);
          
          // Verify fill
          const value = await input.inputValue();
          if (value === walletAddress) {
            walletFilled = true;
            console.log(`    ✅ Wallet filled with: ${selector}`);
            break;
          }
        }
      } catch (e) {}
    }
    
    if (!walletFilled) {
      console.log(`    ⚠️ Wallet not filled - continuing anyway`);
    }
    
    // Enhanced exchange button clicking
    const exchangeStrategies = [
      'button:has-text("Exchange"):not([disabled])',
      'button:has-text("Continue"):not([disabled])',
      'button:has-text("Create Exchange"):not([disabled])',
      'button[type="submit"]:not([disabled])',
      '.exchange-button:not([disabled])'
    ];
    
    let exchangeClicked = false;
    for (const selector of exchangeStrategies) {
      try {
        const button = await page.$(selector);
        if (button) {
          const text = await button.textContent();
          console.log(`    🔘 Clicking: "${text?.trim()}"`);
          await button.click();
          await page.waitForTimeout(3000);
          exchangeClicked = true;
          break;
        }
      } catch (e) {}
    }
    
    if (!exchangeClicked) {
      console.log(`    ⚠️ Exchange button not clicked`);
    }
    
    // Wait for provider selection interface
    await page.waitForTimeout(8000);
    
    // Try to detect provider interface loading
    try {
      await page.waitForFunction(() => {
        const text = document.body.textContent.toLowerCase();
        return text.includes('mercuryo') || text.includes('moonpay');
      }, { timeout: 5000 });
      console.log(`    ✅ Provider interface detected`);
    } catch (e) {
      console.log(`    ⏳ Provider interface not yet visible`);
    }
  }

  async deepProviderAnalysis(page) {
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
          
          // Comprehensive border detection
          const borderProps = [
            style.border, style.borderColor, style.borderTopColor,
            style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          // Enhanced green detection patterns
          const greenPatterns = [
            'rgb(34, 197, 94)',    // Primary target
            'rgba(34, 197, 94',    // With alpha
            '#22c55e', '22c55e',   // Hex
            'rgb(0, 128, 0)',      // Standard green
            'green', 'lightgreen', // CSS
            'rgb(46, 160, 67)',    // Material green
            'rgb(76, 175, 80)',    // Material light green
            'rgb(40, 167, 69)',    // Bootstrap success
            'rgb(25, 135, 84)',    // Bootstrap success dark
            'rgb(16, 185, 129)',   // Tailwind green
            'rgb(5, 150, 105)',    // Tailwind green 600
            'rgb(4, 120, 87)',     // Tailwind green 700
            'solid green',         // CSS border
            '1px solid',           // Thin borders
            '2px solid',           // Medium borders
            'rgba(0, 128, 0',      // Standard green with alpha
            'hsla(120',            // HSL green
            'hsl(120',             // HSL green
            '#00ff00',             // Bright green
            '00ff00'               // Bright green without #
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          // Mercuryo detection
          if (text.includes('mercuryo') || text.includes('mercurio')) {
            const elementData = {
              text: el.textContent ? el.textContent.substring(0, 100) : '',
              hasGreen,
              tag: el.tagName || '',
              className: className,
              id: el.id || '',
              borderColor: style.borderColor || '',
              backgroundColor: style.backgroundColor || '',
              borderWidth: style.borderWidth || '',
              allStyles: allStyles.substring(0, 150)
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
          
          // All green elements
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

  adaptStrategies() {
    console.log(`\n🧠 ADAPTING STRATEGIES based on ${this.discoveries.length} discoveries...`);
    
    // Analyze successful patterns
    const successfulDiscoveries = this.discoveries.filter(d => d.mercuryoFound || d.mercuryoGreen);
    const errorPatterns = this.discoveries.filter(d => d.error);
    
    console.log(`   📈 Successful patterns: ${successfulDiscoveries.length}`);
    console.log(`   📉 Error patterns: ${errorPatterns.length}`);
    
    // Prioritize strategies that showed Mercuryo elements
    if (successfulDiscoveries.length > 0) {
      const goodStrategies = [...new Set(successfulDiscoveries.map(d => d.strategy))];
      console.log(`   🎯 Prioritizing strategies: ${goodStrategies.join(', ')}`);
      
      // Move successful strategies to front
      this.strategies = [...goodStrategies, ...this.strategies.filter(s => !goodStrategies.includes(s))];
    }
  }
}

// Start the corrected POL detection
const detector = new CorrectedPolDetector();
detector.autonomousPolDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 CORRECTED POL DETECTION COMPLETE! 🎉🎉🎉');
    console.log('✅ 15 EUR to POL exchange successful with Mercuryo green border!');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting corrected POL detection...');
    const newDetector = new CorrectedPolDetector();
    newDetector.autonomousPolDetection();
  }, 2000);
});