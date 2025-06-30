const { chromium, devices: playwrightDevices } = require('playwright');

class DeepSimpleSwapInspection {
  constructor() {
    this.findings = [];
  }

  async performDeepInspection() {
    console.log(`\n🔬 DEEP SIMPLESWAP INSPECTION`);
    console.log('='.repeat(60));
    console.log('🎯 PURPOSE: Understand exactly how provider selection works');
    console.log('🔍 APPROACH: Comprehensive reverse engineering');
    console.log('');
    
    const browser = await chromium.launch({ 
      headless: false,
      args: ['--disable-web-security', '--no-sandbox']
    });

    const context = await browser.newContext({
      ...playwrightDevices['iPhone 14 Pro'],
      locale: 'en-US'
    });

    const page = await context.newPage();
    
    // Capture all network requests
    const networkLogs = [];
    page.on('request', request => {
      networkLogs.push({
        type: 'REQUEST',
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
    });
    
    page.on('response', response => {
      networkLogs.push({
        type: 'RESPONSE',
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });

    try {
      console.log(`🌐 Navigating to SimpleSwap...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      await page.waitForTimeout(5000);
      
      // Phase 1: Initial page analysis
      console.log(`\n📊 PHASE 1: INITIAL PAGE ANALYSIS`);
      const initialAnalysis = await this.analyzeCurrentPage(page, 'INITIAL');
      this.findings.push(initialAnalysis);
      
      // Phase 2: Navigate to second page and capture the transition
      console.log(`\n🚀 PHASE 2: NAVIGATING TO PROVIDER SELECTION`);
      
      // Fill wallet address
      try {
        const addressInput = await page.$('input[placeholder*="address" i]');
        if (addressInput) {
          await addressInput.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
          console.log(`   ✅ Wallet address filled`);
        }
      } catch (e) {}
      
      // Click exchange button and monitor changes
      const buttons = await page.$$('button');
      for (const button of buttons) {
        const text = await button.textContent();
        if (text && text.toLowerCase().includes('exchange')) {
          console.log(`   🔘 Clicking exchange button...`);
          await button.click();
          break;
        }
      }
      
      // Wait and analyze provider selection page
      await page.waitForTimeout(8000);
      
      console.log(`\n📊 PHASE 3: PROVIDER SELECTION PAGE ANALYSIS`);
      const providerAnalysis = await this.analyzeCurrentPage(page, 'PROVIDER_SELECTION');
      this.findings.push(providerAnalysis);
      
      // Phase 4: Deep DOM inspection for provider elements
      console.log(`\n🔍 PHASE 4: DEEP PROVIDER ELEMENT INSPECTION`);
      const deepInspection = await this.performDeepProviderInspection(page);
      this.findings.push(deepInspection);
      
      // Phase 5: Monitor changes over time
      console.log(`\n⏱️ PHASE 5: TIME-BASED MONITORING`);
      await this.monitorChangesOverTime(page);
      
      // Phase 6: Network traffic analysis
      console.log(`\n🌐 PHASE 6: NETWORK TRAFFIC ANALYSIS`);
      this.analyzeNetworkTraffic(networkLogs);
      
      // Phase 7: JavaScript environment analysis
      console.log(`\n💻 PHASE 7: JAVASCRIPT ENVIRONMENT ANALYSIS`);
      const jsAnalysis = await this.analyzeJavaScriptEnvironment(page);
      this.findings.push(jsAnalysis);
      
      // Generate comprehensive report
      this.generateComprehensiveReport();
      
    } catch (error) {
      console.error(`❌ Inspection failed: ${error.message}`);
    }
    
    await browser.close();
  }

  async analyzeCurrentPage(page, phase) {
    const analysis = await page.evaluate((phaseName) => {
      const result = {
        phase: phaseName,
        timestamp: Date.now(),
        url: window.location.href,
        title: document.title,
        providers: {
          mercuryo: [],
          moonpay: [],
          others: []
        },
        walletFields: [],
        buttons: [],
        forms: [],
        amounts: [],
        scripts: [],
        globalVariables: [],
        reactComponents: [],
        apiEndpoints: []
      };
      
      // Analyze all elements
      document.querySelectorAll('*').forEach((el, index) => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const tagName = el.tagName?.toLowerCase();
        const className = el.className ? el.className.toString() : '';
        const id = el.id || '';
        const style = window.getComputedStyle(el);
        
        // Provider analysis
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          result.providers.mercuryo.push({
            index,
            tag: tagName,
            text: el.textContent?.substring(0, 100),
            className,
            id,
            selected: className.includes('selected') || el.getAttribute('aria-selected') === 'true',
            visible: true,
            clickable: el.onclick !== null || tagName === 'button' || tagName === 'a',
            border: style.border,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor,
            position: {
              top: el.offsetTop,
              left: el.offsetLeft,
              width: el.offsetWidth,
              height: el.offsetHeight
            }
          });
        }
        
        if (text.includes('moonpay') || text.includes('moon pay')) {
          result.providers.moonpay.push({
            index,
            tag: tagName,
            text: el.textContent?.substring(0, 100),
            className,
            id,
            selected: className.includes('selected') || el.getAttribute('aria-selected') === 'true',
            visible: true,
            clickable: el.onclick !== null || tagName === 'button' || tagName === 'a',
            border: style.border,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor
          });
        }
        
        // Button analysis
        if (tagName === 'button') {
          result.buttons.push({
            text: el.textContent?.trim(),
            className,
            id,
            disabled: el.disabled,
            type: el.type
          });
        }
        
        // Input field analysis
        if (tagName === 'input') {
          const placeholder = el.placeholder?.toLowerCase() || '';
          const name = el.name?.toLowerCase() || '';
          
          if (placeholder.includes('address') || placeholder.includes('wallet') || 
              name.includes('address') || name.includes('wallet')) {
            result.walletFields.push({
              placeholder: el.placeholder,
              name: el.name,
              type: el.type,
              value: el.value,
              required: el.required,
              visible: true
            });
          }
        }
        
        // Form analysis
        if (tagName === 'form') {
          result.forms.push({
            action: el.action,
            method: el.method,
            inputs: Array.from(el.querySelectorAll('input')).length,
            className
          });
        }
        
        // Amount detection
        const eurMatch = text.match(/€\s*(\d+(?:\.\d+)?)/);
        if (eurMatch) {
          result.amounts.push({
            element: tagName,
            text: el.textContent?.trim(),
            amount: eurMatch[1],
            className
          });
        }
      });
      
      // Analyze scripts
      document.querySelectorAll('script').forEach(script => {
        if (script.src) {
          result.scripts.push({
            type: 'external',
            src: script.src
          });
        } else if (script.textContent) {
          const content = script.textContent;
          if (content.includes('provider') || content.includes('mercuryo') || content.includes('moonpay')) {
            result.scripts.push({
              type: 'inline',
              content: content.substring(0, 200),
              hasProviderLogic: true
            });
          }
        }
      });
      
      // Analyze global variables
      Object.keys(window).forEach(key => {
        if (key.includes('provider') || key.includes('mercuryo') || key.includes('moonpay') ||
            key.includes('react') || key.includes('vue') || key.includes('angular')) {
          try {
            const value = window[key];
            result.globalVariables.push({
              name: key,
              type: typeof value,
              value: typeof value === 'object' ? '[object]' : String(value).substring(0, 100)
            });
          } catch (e) {}
        }
      });
      
      return result;
    }, phase);
    
    console.log(`   📊 ${phase} Analysis Complete:`);
    console.log(`      Mercuryo elements: ${analysis.providers.mercuryo.length}`);
    console.log(`      MoonPay elements: ${analysis.providers.moonpay.length}`);
    console.log(`      Wallet fields: ${analysis.walletFields.length}`);
    console.log(`      Buttons: ${analysis.buttons.length}`);
    console.log(`      Amount elements: ${analysis.amounts.length}`);
    console.log(`      Scripts with provider logic: ${analysis.scripts.filter(s => s.hasProviderLogic).length}`);
    
    return analysis;
  }

  async performDeepProviderInspection(page) {
    const inspection = await page.evaluate(() => {
      const result = {
        timestamp: Date.now(),
        providerDetails: {
          mercuryo: [],
          moonpay: []
        },
        selectionMechanism: {
          clickHandlers: [],
          eventListeners: [],
          stateManagement: [],
          apiCalls: []
        },
        cssAnalysis: {
          selectionClasses: [],
          borderStyles: [],
          visibilityRules: []
        }
      };
      
      // Deep provider element analysis
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          // Get all event listeners (if possible)
          const listeners = [];
          try {
            const events = ['click', 'mousedown', 'touchstart', 'change'];
            events.forEach(eventType => {
              if (el[`on${eventType}`]) {
                listeners.push({
                  type: eventType,
                  handler: el[`on${eventType}`].toString().substring(0, 200)
                });
              }
            });
          } catch (e) {}
          
          result.providerDetails.mercuryo.push({
            outerHTML: el.outerHTML.substring(0, 300),
            computedStyles: {
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              border: style.border,
              borderWidth: style.borderWidth,
              borderStyle: style.borderStyle,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor,
              color: style.color,
              cursor: style.cursor,
              pointerEvents: style.pointerEvents
            },
            attributes: {
              className: el.className.toString(),
              id: el.id,
              dataAttributes: Array.from(el.attributes)
                .filter(attr => attr.name.startsWith('data-'))
                .map(attr => ({ name: attr.name, value: attr.value })),
              ariaAttributes: Array.from(el.attributes)
                .filter(attr => attr.name.startsWith('aria-'))
                .map(attr => ({ name: attr.name, value: attr.value }))
            },
            eventListeners: listeners,
            parentChain: this.getParentChain(el)
          });
        }
        
        if (text.includes('moonpay') || text.includes('moon pay')) {
          result.providerDetails.moonpay.push({
            outerHTML: el.outerHTML.substring(0, 300),
            computedStyles: {
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              border: style.border,
              borderWidth: style.borderWidth,
              borderStyle: style.borderStyle,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor
            },
            attributes: {
              className: el.className.toString(),
              id: el.id
            }
          });
        }
      });
      
      // Analyze CSS for selection patterns
      try {
        Array.from(document.styleSheets).forEach(sheet => {
          try {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.selectorText) {
                const selector = rule.selectorText.toLowerCase();
                if (selector.includes('selected') || selector.includes('active') || 
                    selector.includes('mercuryo') || selector.includes('moonpay')) {
                  result.cssAnalysis.selectionClasses.push({
                    selector: rule.selectorText,
                    cssText: rule.cssText.substring(0, 200)
                  });
                }
              }
            });
          } catch (e) {}
        });
      } catch (e) {}
      
      return result;
    });
    
    console.log(`   🔍 Deep Inspection Complete:`);
    console.log(`      Mercuryo detailed elements: ${inspection.providerDetails.mercuryo.length}`);
    console.log(`      MoonPay detailed elements: ${inspection.providerDetails.moonpay.length}`);
    console.log(`      CSS selection rules: ${inspection.cssAnalysis.selectionClasses.length}`);
    
    return inspection;
  }

  async monitorChangesOverTime(page) {
    const changes = [];
    
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000);
      
      const snapshot = await page.evaluate((time) => {
        const mercuryoStates = [];
        const moonpayStates = [];
        
        document.querySelectorAll('*').forEach(el => {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          const style = window.getComputedStyle(el);
          
          if (text.includes('mercuryo')) {
            mercuryoStates.push({
              selected: el.getAttribute('aria-selected') === 'true' || 
                       el.className.includes('selected'),
              border: style.border,
              backgroundColor: style.backgroundColor,
              display: style.display
            });
          }
          
          if (text.includes('moonpay')) {
            moonpayStates.push({
              selected: el.getAttribute('aria-selected') === 'true' || 
                       el.className.includes('selected'),
              border: style.border,
              backgroundColor: style.backgroundColor,
              display: style.display
            });
          }
        });
        
        return {
          time,
          mercuryoStates,
          moonpayStates,
          walletFieldsVisible: document.querySelectorAll('input[placeholder*="address" i]').length
        };
      }, i + 1);
      
      changes.push(snapshot);
      console.log(`   ⏱️ ${i + 1}s: M:${snapshot.mercuryoStates.length} MP:${snapshot.moonpayStates.length} W:${snapshot.walletFieldsVisible}`);
    }
    
    this.findings.push({ type: 'TIME_MONITORING', changes });
  }

  analyzeNetworkTraffic(networkLogs) {
    const relevantRequests = networkLogs.filter(log => 
      log.url.includes('provider') || 
      log.url.includes('mercuryo') || 
      log.url.includes('moonpay') ||
      log.url.includes('api')
    );
    
    console.log(`   🌐 Network Analysis:`);
    console.log(`      Total requests: ${networkLogs.length}`);
    console.log(`      Provider-related requests: ${relevantRequests.length}`);
    
    relevantRequests.forEach(req => {
      console.log(`      ${req.type}: ${req.method || ''} ${req.url.substring(0, 80)}...`);
    });
    
    this.findings.push({ type: 'NETWORK_ANALYSIS', relevantRequests });
  }

  async analyzeJavaScriptEnvironment(page) {
    const jsAnalysis = await page.evaluate(() => {
      const analysis = {
        frameworks: {
          react: typeof window.React !== 'undefined',
          vue: typeof window.Vue !== 'undefined',
          angular: typeof window.ng !== 'undefined',
          jquery: typeof window.$ !== 'undefined'
        },
        globalObjects: [],
        providerFunctions: [],
        eventHandlers: []
      };
      
      // Look for provider-related global objects
      Object.keys(window).forEach(key => {
        if (key.toLowerCase().includes('provider') || 
            key.toLowerCase().includes('mercuryo') || 
            key.toLowerCase().includes('moonpay')) {
          analysis.globalObjects.push({
            name: key,
            type: typeof window[key]
          });
        }
      });
      
      // Look for functions that might control provider selection
      Object.keys(window).forEach(key => {
        try {
          if (typeof window[key] === 'function') {
            const funcStr = window[key].toString();
            if (funcStr.includes('provider') || funcStr.includes('select')) {
              analysis.providerFunctions.push({
                name: key,
                signature: funcStr.substring(0, 100)
              });
            }
          }
        } catch (e) {}
      });
      
      return analysis;
    });
    
    console.log(`   💻 JavaScript Environment:`);
    console.log(`      React: ${jsAnalysis.frameworks.react}`);
    console.log(`      Vue: ${jsAnalysis.frameworks.vue}`);
    console.log(`      jQuery: ${jsAnalysis.frameworks.jquery}`);
    console.log(`      Provider objects: ${jsAnalysis.globalObjects.length}`);
    console.log(`      Provider functions: ${jsAnalysis.providerFunctions.length}`);
    
    return jsAnalysis;
  }

  generateComprehensiveReport() {
    console.log(`\n📋 COMPREHENSIVE INSPECTION REPORT`);
    console.log('='.repeat(60));
    
    // Summary statistics
    const initialPage = this.findings.find(f => f.phase === 'INITIAL');
    const providerPage = this.findings.find(f => f.phase === 'PROVIDER_SELECTION');
    
    console.log(`📊 SUMMARY STATISTICS:`);
    if (initialPage && providerPage) {
      console.log(`   Initial page Mercuryo elements: ${initialPage.providers.mercuryo.length}`);
      console.log(`   Provider page Mercuryo elements: ${providerPage.providers.mercuryo.length}`);
      console.log(`   Initial page MoonPay elements: ${initialPage.providers.moonpay.length}`);
      console.log(`   Provider page MoonPay elements: ${providerPage.providers.moonpay.length}`);
      console.log(`   Wallet fields on provider page: ${providerPage.walletFields.length}`);
    }
    
    // Key insights
    console.log(`\n🔍 KEY INSIGHTS:`);
    if (providerPage) {
      const mercuryoSelected = providerPage.providers.mercuryo.some(p => p.selected);
      const moonpaySelected = providerPage.providers.moonpay.some(p => p.selected);
      const walletFieldsVisible = providerPage.walletFields.length > 0;
      
      console.log(`   Mercuryo appears selected: ${mercuryoSelected}`);
      console.log(`   MoonPay appears selected: ${moonpaySelected}`);
      console.log(`   Wallet fields visible: ${walletFieldsVisible}`);
      
      if (mercuryoSelected && walletFieldsVisible) {
        console.log(`   ✅ GOOD NEWS: Mercuryo selection appears to be working!`);
      } else {
        console.log(`   ❌ ISSUE CONFIRMED: Auto-switching or visibility problems detected`);
      }
    }
    
    // Potential solutions
    console.log(`\n💡 POTENTIAL SOLUTIONS BASED ON FINDINGS:`);
    console.log(`   1. Target specific CSS classes for forced selection`);
    console.log(`   2. Intercept and modify API responses`);
    console.log(`   3. Manipulate React/Vue component state directly`);
    console.log(`   4. Override JavaScript functions controlling selection`);
    console.log(`   5. Use network interception to modify provider data`);
    
    // Save detailed findings
    require('fs').writeFileSync(
      '/Users/nelsonchan/auralo-fix/DETAILED_INSPECTION_FINDINGS.json',
      JSON.stringify(this.findings, null, 2)
    );
    
    console.log(`\n📁 Detailed findings saved to: DETAILED_INSPECTION_FINDINGS.json`);
    console.log(`🎯 Use these insights to develop targeted solutions`);
  }
}

// Run the deep inspection
const inspector = new DeepSimpleSwapInspection();
inspector.performDeepInspection().catch(error => {
  console.error('Inspection failed:', error);
});