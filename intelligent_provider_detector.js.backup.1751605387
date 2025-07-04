const { chromium, devices } = require('playwright');

class IntelligentProviderDetector {
  constructor() {
    this.attemptNumber = 1;
    this.maxAttempts = 20;
    this.strategies = [
      'direct_partner_link',
      'fiat_parameter',
      'different_currency_pair', 
      'create_exchange_route',
      'mobile_optimized',
      'iframe_detection',
      'network_monitoring',
      'dom_mutation_watching',
      'delayed_loading',
      'user_interaction_simulation',
      'regional_optimization',
      'cache_bypass',
      'slow_network_simulation',
      'touch_event_focus',
      'aggressive_waiting'
    ];
    this.discoveries = [];
  }

  async intelligentDetection() {
    console.log(`\n🔄 INTELLIGENT ATTEMPT ${this.attemptNumber}/${this.maxAttempts}`);
    console.log('='.repeat(70));
    
    const strategy = this.strategies[(this.attemptNumber - 1) % this.strategies.length];
    console.log(`📋 Strategy: ${strategy.replace('_', ' ').toUpperCase()}`);
    
    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list'
      ]
    });

    // Test configurations with enhanced mobile profiles
    const testConfigs = [
      { 
        name: 'iPhone 14 Pro', 
        device: devices['iPhone 14 Pro'],
        region: 'Australia',
        locale: 'en-AU',
        timezone: 'Australia/Sydney',
        flag: '🇦🇺',
        currency: 'AUD'
      },
      { 
        name: 'Galaxy S24', 
        device: devices['Galaxy S24'],
        region: 'USA', 
        locale: 'en-US',
        timezone: 'America/New_York',
        flag: '🇺🇸',
        currency: 'USD'
      },
      { 
        name: 'iPhone 14 Pro', 
        device: devices['iPhone 14 Pro'],
        region: 'Europe',
        locale: 'en-GB',
        timezone: 'Europe/London',
        flag: '🇪🇺',
        currency: 'EUR'
      }
    ];

    for (const config of testConfigs) {
      try {
        const success = await this.testDevice(browser, config, strategy);
        if (success) {
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ Device ${config.name} ${config.region} failed:`, error.message);
        this.discoveries.push({
          attempt: this.attemptNumber,
          strategy,
          device: config.name,
          region: config.region,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    await browser.close();
    
    // Adaptive strategy selection based on discoveries
    this.adaptStrategy();
    
    if (this.attemptNumber < this.maxAttempts) {
      this.attemptNumber++;
      return await this.intelligentDetection();
    }
    
    return false;
  }

  async testDevice(browser, config, strategy) {
    console.log(`\n${config.flag} Testing ${config.name} in ${config.region} with ${strategy}`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: config.locale,
      timezoneId: config.timezone,
      geolocation: this.getGeolocation(config.region),
      permissions: ['geolocation']
    });

    const page = await context.newPage();
    
    // Enhanced network and error handling
    let networkRequests = [];
    let errors = [];
    
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      });
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    try {
      const url = this.generateStrategyURL(strategy, config);
      console.log(`Navigating to: ${url}`);
      
      // Enhanced navigation with multiple fallbacks
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      
      // Strategy-specific actions
      await this.executeStrategy(page, strategy, config);
      
      // Enhanced provider detection
      const providerStatus = await this.comprehensiveProviderAnalysis(page, config);
      
      if (providerStatus.mercuryoGreenDetected) {
        console.log(`\n🎉 SUCCESS! Mercuryo green border detected!`);
        
        // Test 5-second persistence
        await page.waitForTimeout(5000);
        const persistenceStatus = await this.comprehensiveProviderAnalysis(page, config);
        
        if (persistenceStatus.mercuryoGreenDetected && !persistenceStatus.moonpayGreenDetected) {
          console.log(`\n🏆 MISSION ACCOMPLISHED! Persistence confirmed!`);
          await page.screenshot({ 
            path: `SUCCESS_${config.name}_${config.region}_${strategy}.png`,
            fullPage: true 
          });
          await context.close();
          return true;
        }
      }
      
      // Capture findings for analysis
      await page.screenshot({ 
        path: `attempt_${this.attemptNumber}_${config.name}_${config.region}_${strategy}.png`,
        fullPage: true 
      });
      
      this.discoveries.push({
        attempt: this.attemptNumber,
        strategy,
        device: config.name,
        region: config.region,
        url: page.url(),
        title: await page.title(),
        networkRequests: networkRequests.length,
        errors: errors.length,
        providerStatus,
        timestamp: new Date().toISOString()
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  generateStrategyURL(strategy, config) {
    const baseParams = {
      partner: 'auralo',
      amount: '15'
    };
    
    switch (strategy) {
      case 'direct_partner_link':
        return `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo`;
        
      case 'fiat_parameter':
        return `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&fiat=true`;
        
      case 'different_currency_pair':
        return `https://simpleswap.io/?from=${config.currency.toLowerCase()}&to=btc&amount=100&partner=auralo`;
        
      case 'create_exchange_route':
        return `https://simpleswap.io/create-exchange?from=eur&to=pol&amount=15&partner=auralo`;
        
      case 'mobile_optimized':
        return `https://simpleswap.io/m/?from=eur&to=pol&amount=15&partner=auralo`;
        
      case 'regional_optimization':
        const regionParam = config.region.toLowerCase();
        return `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&region=${regionParam}`;
        
      case 'cache_bypass':
        const timestamp = Date.now();
        return `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&_t=${timestamp}`;
        
      default:
        return `https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo`;
    }
  }

  async executeStrategy(page, strategy, config) {
    switch (strategy) {
      case 'iframe_detection':
        await this.detectIframes(page);
        break;
        
      case 'network_monitoring':
        await this.monitorNetworkActivity(page);
        break;
        
      case 'dom_mutation_watching':
        await this.watchDOMMutations(page);
        break;
        
      case 'delayed_loading':
        await page.waitForTimeout(10000);
        break;
        
      case 'user_interaction_simulation':
        await this.simulateUserInteraction(page);
        break;
        
      case 'slow_network_simulation':
        await page.emulateNetworkConditions({
          offline: false,
          downloadThroughput: 500000,
          uploadThroughput: 500000,
          latency: 200
        });
        break;
        
      case 'touch_event_focus':
        await this.focusWithTouchEvents(page);
        break;
        
      case 'aggressive_waiting':
        await this.aggressiveWait(page);
        break;
        
      default:
        await page.waitForTimeout(3000);
    }
  }

  async comprehensiveProviderAnalysis(page, config) {
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
      
      // Enhanced green detection with multiple CSS properties
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        // Comprehensive style checking
        const styleProps = [
          style.borderColor, style.borderTopColor, style.borderRightColor,
          style.borderBottomColor, style.borderLeftColor, style.backgroundColor,
          style.color, style.boxShadow, style.outline, style.outlineColor
        ];
        
        const allStyles = styleProps.join(' ').toLowerCase();
        
        // Multiple green detection patterns
        const greenPatterns = [
          'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
          'rgb(0, 128, 0)', 'rgb(0, 255, 0)', 'green', 'lightgreen',
          'rgb(46, 160, 67)', 'rgb(76, 175, 80)', 'rgb(102, 187, 106)'
        ];
        
        const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent.substring(0, 100),
            hasGreen,
            tag: el.tagName,
            className: el.className,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            borderWidth: style.borderWidth
          };
          
          analysis.mercuryoElements.push(elementData);
          
          if (hasGreen) {
            analysis.mercuryoGreenDetected = true;
          }
        }
        
        if (text.includes('moonpay')) {
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
        
        if (hasGreen) {
          analysis.greenElements.push({
            text: el.textContent.substring(0, 80),
            tag: el.tagName,
            className: el.className,
            hasMercuryo: text.includes('mercuryo'),
            hasMoonpay: text.includes('moonpay')
          });
        }
      });
      
      return analysis;
    });
  }

  async detectIframes(page) {
    const iframes = await page.$$('iframe');
    console.log(`  🖼️  Found ${iframes.length} iframes`);
    
    for (let i = 0; i < iframes.length; i++) {
      try {
        const frame = await iframes[i].contentFrame();
        if (frame) {
          const frameUrl = await frame.url();
          console.log(`    Frame ${i}: ${frameUrl}`);
          
          // Check for provider content in iframe
          const frameAnalysis = await frame.evaluate(() => {
            const text = document.body ? document.body.textContent.toLowerCase() : '';
            return {
              hasMercuryo: text.includes('mercuryo'),
              hasMoonpay: text.includes('moonpay'),
              textLength: text.length
            };
          });
          
          if (frameAnalysis.hasMercuryo || frameAnalysis.hasMoonpay) {
            console.log(`    🎯 Provider content found in iframe!`);
          }
        }
      } catch (e) {
        // Frame access denied
      }
    }
  }

  async simulateUserInteraction(page) {
    // Simulate mobile user behavior
    console.log(`  👆 Simulating mobile user interaction...`);
    
    // Try tapping on various elements
    const tappableSelectors = [
      'button', 'a', '[role="button"]', '.btn', '.button',
      'input[type="submit"]', '[onclick]', '.clickable'
    ];
    
    for (const selector of tappableSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          const randomElement = elements[Math.floor(Math.random() * elements.length)];
          await randomElement.tap();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // Continue with next selector
      }
    }
  }

  async aggressiveWait(page) {
    console.log(`  ⏳ Aggressive waiting strategy...`);
    
    // Wait for multiple conditions
    const conditions = [
      () => page.waitForSelector('*[class*="provider"]', { timeout: 5000 }).catch(() => null),
      () => page.waitForSelector('*[class*="payment"]', { timeout: 5000 }).catch(() => null),
      () => page.waitForSelector('*[class*="mercuryo"]', { timeout: 5000 }).catch(() => null),
      () => page.waitForSelector('*[class*="moonpay"]', { timeout: 5000 }).catch(() => null),
      () => page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 }).catch(() => null)
    ];
    
    await Promise.allSettled(conditions);
    await page.waitForTimeout(5000);
  }

  adaptStrategy() {
    // Analyze discoveries to adapt strategy
    const recentErrors = this.discoveries.slice(-3);
    const commonIssues = {};
    
    recentErrors.forEach(discovery => {
      if (discovery.error) {
        commonIssues[discovery.error] = (commonIssues[discovery.error] || 0) + 1;
      }
    });
    
    console.log(`\n🧠 Strategy adaptation based on discoveries:`);
    console.log(`   Recent errors:`, Object.keys(commonIssues));
    
    // If timeout errors, prioritize faster strategies
    if (commonIssues['Timeout'] || Object.keys(commonIssues).some(err => err.includes('timeout'))) {
      console.log(`   🚀 Prioritizing faster loading strategies`);
      // Move faster strategies to front
      const fasterStrategies = ['mobile_optimized', 'dom_mutation_watching', 'delayed_loading'];
      this.strategies = [...fasterStrategies, ...this.strategies.filter(s => !fasterStrategies.includes(s))];
    }
  }

  getGeolocation(region) {
    const locations = {
      'Australia': { latitude: -33.8688, longitude: 151.2093 },
      'USA': { latitude: 40.7128, longitude: -74.0060 },
      'Europe': { latitude: 51.5074, longitude: -0.1278 },
      'Canada': { latitude: 45.4215, longitude: -75.6972 }
    };
    return locations[region] || locations['USA'];
  }
}

// Execute intelligent detection
const detector = new IntelligentProviderDetector();
detector.intelligentDetection().then(success => {
  if (success) {
    console.log('\n🎉 FINAL SUCCESS: Mercuryo green border detected and persists!');
  } else {
    console.log('\n🔄 CONTINUING INFINITE LOOP: Adapting strategies...');
    console.log('\n📊 Discovery Summary:');
    detector.discoveries.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d.strategy} on ${d.device} ${d.region}: ${d.error || 'No errors'}`);
    });
    
    // Restart with adapted strategies
    setTimeout(() => {
      detector.attemptNumber = 1;
      detector.intelligentDetection();
    }, 2000);
  }
}).catch(error => {
  console.error('Critical error:', error);
  
  // Auto-restart on critical errors
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting after critical error...');
    const newDetector = new IntelligentProviderDetector();
    newDetector.intelligentDetection();
  }, 5000);
});