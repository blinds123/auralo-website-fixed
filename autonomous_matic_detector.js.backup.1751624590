const { chromium, devices } = require('playwright');

class AutonomousMaticDetector {
  constructor() {
    this.attemptNumber = 1;
    this.strategies = [
      'direct_matic',
      'matic_with_delays', 
      'multiple_page_loads',
      'user_agent_rotation',
      'timing_variations',
      'network_throttling',
      'cache_clearing',
      'different_amounts',
      'viewport_changes',
      'interaction_patterns'
    ];
  }

  async autonomousDetection() {
    console.log(`\n🤖 AUTONOMOUS MATIC DETECTION - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    
    const strategy = this.strategies[(this.attemptNumber - 1) % this.strategies.length];
    console.log(`🧠 Strategy: ${strategy.replace('_', ' ').toUpperCase()}`);
    
    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled'
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
        const success = await this.testAutonomousStrategy(browser, config, strategy);
        if (success) {
          console.log(`\n🏆 AUTONOMOUS SUCCESS ACHIEVED!`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
      }
    }

    await browser.close();
    
    this.attemptNumber++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.autonomousDetection();
  }

  async testAutonomousStrategy(browser, config, strategy) {
    console.log(`${config.flag} ${config.name} ${config.region} - ${strategy}`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      await this.executeStrategy(page, strategy, config);
      
      // Enhanced provider detection
      const analysis = await this.detectProviders(page);
      
      console.log(`  📊 M:${analysis.mercuryoElements.length} MP:${analysis.moonpayElements.length} G:${analysis.greenElements.length} MG:${analysis.mercuryoGreenDetected}`);
      
      if (analysis.mercuryoElements.length > 0) {
        analysis.mercuryoElements.forEach((el, i) => {
          if (el.hasGreen) {
            console.log(`  🎯 MERCURYO GREEN FOUND: ${el.tag} "${el.text.substring(0, 40)}..."`);
          }
        });
      }
      
      if (analysis.mercuryoGreenDetected) {
        console.log(`  🎉 SUCCESS! Testing persistence...`);
        await page.waitForTimeout(5000);
        
        const persistCheck = await this.detectProviders(page);
        if (persistCheck.mercuryoGreenDetected && !persistCheck.moonpayGreenDetected) {
          console.log(`  🏆 PERSISTENCE CONFIRMED!`);
          await page.screenshot({ 
            path: `AUTONOMOUS_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          await context.close();
          return true;
        }
      }
      
      await page.screenshot({ 
        path: `autonomous_${strategy}_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async executeStrategy(page, strategy, config) {
    const baseUrl = 'https://simpleswap.io/?from=eur&to=matic&amount=15&partner=auralo';
    
    switch (strategy) {
      case 'direct_matic':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'matic_with_delays':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        await this.standardFlow(page);
        await page.waitForTimeout(5000);
        break;
        
      case 'multiple_page_loads':
        for (let i = 0; i < 3; i++) {
          await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(2000);
        }
        await this.standardFlow(page);
        break;
        
      case 'user_agent_rotation':
        const userAgents = [
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
          'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        ];
        await page.setUserAgent(userAgents[this.attemptNumber % userAgents.length]);
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'timing_variations':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        const delays = [1000, 3000, 7000, 10000];
        const delay = delays[this.attemptNumber % delays.length];
        await page.waitForTimeout(delay);
        await this.standardFlow(page);
        break;
        
      case 'network_throttling':
        await page.emulateNetworkConditions({
          offline: false,
          downloadThroughput: 1000000, // 1Mbps
          uploadThroughput: 500000,
          latency: 100
        });
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'cache_clearing':
        await page.goto('about:blank');
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'different_amounts':
        const amounts = ['14', '15', '16', '20', '25'];
        const amount = amounts[this.attemptNumber % amounts.length];
        const amountUrl = `https://simpleswap.io/?from=eur&to=matic&amount=${amount}&partner=auralo`;
        await page.goto(amountUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'viewport_changes':
        const viewports = [
          { width: 375, height: 667 },  // iPhone SE
          { width: 393, height: 852 },  // iPhone 14 Pro
          { width: 412, height: 915 },  // Pixel 7
          { width: 390, height: 844 }   // iPhone 12
        ];
        const viewport = viewports[this.attemptNumber % viewports.length];
        await page.setViewportSize(viewport);
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
        break;
        
      case 'interaction_patterns':
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        // Simulate human-like interactions
        await page.mouse.move(100, 100);
        await page.waitForTimeout(500);
        await page.mouse.move(200, 200);
        await page.waitForTimeout(500);
        await this.standardFlow(page);
        break;
        
      default:
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await this.standardFlow(page);
    }
  }

  async standardFlow(page) {
    await page.waitForTimeout(3000);
    
    // Fill wallet address
    const walletSelectors = [
      'input[placeholder*="address"]',
      'input[placeholder*="recipient"]',
      'input[type="text"]:not([value*="15"]):not([value*="14"]):not([value*="16"])'
    ];
    
    for (const selector of walletSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {}
    }
    
    // Click exchange
    const exchangeSelectors = [
      'button:has-text("Exchange"):not([disabled])',
      'button:has-text("Continue"):not([disabled])',
      'button[type="submit"]:not([disabled])'
    ];
    
    for (const selector of exchangeSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          await page.waitForTimeout(5000);
          break;
        }
      } catch (e) {}
    }
    
    // Wait for provider selection
    await page.waitForTimeout(8000);
  }

  async detectProviders(page) {
    return await page.evaluate(() => {
      const analysis = {
        mercuryoGreenDetected: false,
        moonpayGreenDetected: false,
        mercuryoElements: [],
        moonpayElements: [],
        greenElements: [],
        url: window.location.href
      };
      
      document.querySelectorAll('*').forEach(el => {
        try {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          const className = el.className ? 
            (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
          
          const borderProps = [
            style.border, style.borderColor, style.borderTopColor,
            style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
            style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
          ];
          
          const allStyles = borderProps.join(' ').toLowerCase();
          
          const greenPatterns = [
            'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
            'rgb(0, 128, 0)', 'green', 'lightgreen', 'rgb(46, 160, 67)',
            'rgb(76, 175, 80)', 'rgb(40, 167, 69)', 'rgb(25, 135, 84)',
            'rgb(16, 185, 129)', 'solid green', '1px solid', '2px solid'
          ];
          
          const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
          
          if (text.includes('mercuryo') || text.includes('mercurio')) {
            const elementData = {
              text: el.textContent ? el.textContent.substring(0, 100) : '',
              hasGreen,
              tag: el.tagName || '',
              className: className,
              borderColor: style.borderColor || '',
              borderWidth: style.borderWidth || ''
            };
            
            analysis.mercuryoElements.push(elementData);
            if (hasGreen) analysis.mercuryoGreenDetected = true;
          }
          
          if (text.includes('moonpay')) {
            const elementData = {
              text: el.textContent ? el.textContent.substring(0, 100) : '',
              hasGreen,
              tag: el.tagName || '',
              className: className
            };
            
            analysis.moonpayElements.push(elementData);
            if (hasGreen) analysis.moonpayGreenDetected = true;
          }
          
          if (hasGreen) {
            analysis.greenElements.push({
              text: el.textContent ? el.textContent.substring(0, 50) : '',
              tag: el.tagName || '',
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay')
            });
          }
          
        } catch (e) {}
      });
      
      return analysis;
    });
  }
}

// Start autonomous detection
const detector = new AutonomousMaticDetector();
detector.autonomousDetection().then(success => {
  if (success) {
    console.log('\n🎉 AUTONOMOUS DETECTION COMPLETE - MERCURYO GREEN BORDER FOUND!');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting autonomous detection...');
    const newDetector = new AutonomousMaticDetector();
    newDetector.autonomousDetection();
  }, 3000);
});