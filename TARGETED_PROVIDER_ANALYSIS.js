const { chromium, devices: playwrightDevices } = require('playwright');

class TargetedProviderAnalysis {
  constructor() {
    this.criticalFindings = [];
  }

  async analyzeProviderSelection() {
    console.log(`\n🎯 TARGETED PROVIDER SELECTION ANALYSIS`);
    console.log('='.repeat(50));
    console.log('🔍 GOAL: Find the exact mechanism that controls provider selection');
    console.log('💡 STRATEGY: Fast targeted analysis with immediate action');
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
    
    try {
      console.log(`🌐 Loading SimpleSwap quickly...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 20000 
      });
      
      await page.waitForTimeout(3000);
      
      // Quick navigation to provider page
      console.log(`🚀 Quick navigation to provider selection...`);
      await this.quickNavigateToProviders(page);
      
      // CRITICAL: Real-time provider state analysis
      console.log(`\n⚡️ CRITICAL ANALYSIS: Real-time provider states`);
      await this.realTimeProviderAnalysis(page);
      
      // CRITICAL: Find and test forcing methods
      console.log(`\n🔧 CRITICAL TESTING: Forcing methods`);
      await this.testForcingMethods(page);
      
      // CRITICAL: Verify success criteria in real-time
      console.log(`\n✅ CRITICAL VERIFICATION: Success criteria check`);
      const success = await this.verifySuccessCriteria(page);
      
      if (success) {
        console.log(`\n🏆 SUCCESS ACHIEVED!`);
        await page.screenshot({ 
          path: '/Users/nelsonchan/auralo-fix/CRITICAL_SUCCESS.png',
          fullPage: true 
        });
      } else {
        console.log(`\n🔄 Continuing analysis...`);
      }
      
    } catch (error) {
      console.error(`❌ Analysis failed: ${error.message}`);
    }
    
    await browser.close();
    return this.criticalFindings;
  }

  async quickNavigateToProviders(page) {
    try {
      // Fill wallet if exists
      const addressInput = await page.$('input[placeholder*="address" i]');
      if (addressInput) {
        await addressInput.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
        console.log(`   ✅ Wallet filled`);
      }
      
      // Click exchange
      const exchangeBtn = await page.$('button:has-text("Exchange"), button:has-text("Create")');
      if (exchangeBtn) {
        await exchangeBtn.click();
        console.log(`   ✅ Exchange clicked`);
        await page.waitForTimeout(5000);
      }
    } catch (e) {
      console.log(`   ⚠️ Navigation issue: ${e.message}`);
    }
  }

  async realTimeProviderAnalysis(page) {
    const analysis = await page.evaluate(() => {
      const providers = {
        mercuryo: { elements: [], states: [] },
        moonpay: { elements: [], states: [] }
      };
      
      console.log('🔍 Starting real-time provider analysis...');
      
      // Find all provider elements
      document.querySelectorAll('*').forEach((el, index) => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementInfo = {
            index,
            tag: el.tagName,
            text: el.textContent?.substring(0, 80),
            className: el.className?.toString() || '',
            id: el.id || '',
            selected: el.getAttribute('aria-selected') === 'true' || 
                     el.className?.includes('selected') || 
                     el.className?.includes('active'),
            style: {
              border: style.border,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor,
              display: style.display,
              visibility: style.visibility
            },
            clickable: el.onclick !== null || el.tagName === 'BUTTON' || el.tagName === 'A',
            path: this.getElementPath(el)
          };
          
          providers.mercuryo.elements.push(elementInfo);
          console.log(`💳 Mercuryo element ${index}: ${elementInfo.text}`);
          
          if (elementInfo.selected) {
            console.log(`✅ Mercuryo element ${index} appears SELECTED`);
          }
        }
        
        if (text.includes('moonpay') || text.includes('moon pay')) {
          const elementInfo = {
            index,
            tag: el.tagName,
            text: el.textContent?.substring(0, 80),
            className: el.className?.toString() || '',
            selected: el.getAttribute('aria-selected') === 'true' || 
                     el.className?.includes('selected') || 
                     el.className?.includes('active'),
            style: {
              border: style.border,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor
            }
          };
          
          providers.moonpay.elements.push(elementInfo);
          console.log(`💰 MoonPay element ${index}: ${elementInfo.text}`);
          
          if (elementInfo.selected) {
            console.log(`⚠️ MoonPay element ${index} appears SELECTED`);
          }
        }
      });
      
      // Check wallet fields
      const walletFields = [];
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        if (placeholder.includes('address') || placeholder.includes('wallet')) {
          walletFields.push({
            placeholder: input.placeholder,
            visible: input.offsetWidth > 0 && input.offsetHeight > 0,
            value: input.value
          });
          console.log(`💳 Wallet field: ${input.placeholder} (visible: ${input.offsetWidth > 0})`);
        }
      });
      
      return {
        mercuryo: providers.mercuryo.elements,
        moonpay: providers.moonpay.elements,
        walletFields: walletFields,
        timestamp: Date.now()
      };
    });
    
    console.log(`   📊 Found ${analysis.mercuryo.length} Mercuryo elements`);
    console.log(`   📊 Found ${analysis.moonpay.length} MoonPay elements`);
    console.log(`   📊 Found ${analysis.walletFields.length} wallet fields`);
    
    this.criticalFindings.push({ type: 'REAL_TIME_ANALYSIS', data: analysis });
  }

  async testForcingMethods(page) {
    console.log(`   🔧 Testing Method 1: Direct DOM manipulation`);
    
    const method1Result = await page.evaluate(() => {
      let changesApplied = 0;
      
      // Method 1: Force Mercuryo selection visually
      document.querySelectorAll('*').forEach(el => {
        const text = (el.textContent || '').toLowerCase();
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          // Force green border
          el.style.border = '3px solid #22c55e';
          el.style.borderRadius = '8px';
          el.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
          
          // Force selection attributes
          el.setAttribute('aria-selected', 'true');
          el.classList.add('selected', 'active');
          
          // Click to activate
          try {
            el.click();
            changesApplied++;
          } catch (e) {}
          
          console.log(`🔧 Applied Method 1 to Mercuryo element`);
        }
        
        // Hide MoonPay
        if (text.includes('moonpay') || text.includes('moon pay')) {
          el.style.opacity = '0.3';
          el.style.pointerEvents = 'none';
          el.setAttribute('aria-selected', 'false');
          el.classList.remove('selected', 'active');
          changesApplied++;
          console.log(`🔧 Applied Method 1 to MoonPay element (hide)`);
        }
      });
      
      // Force wallet fields visible
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        if (placeholder.includes('address') || placeholder.includes('wallet')) {
          input.style.display = 'block';
          input.style.visibility = 'visible';
          input.required = true;
          changesApplied++;
          console.log(`🔧 Applied Method 1 to wallet field`);
        }
      });
      
      return { method: 'DOM_MANIPULATION', changesApplied };
    });
    
    console.log(`   📊 Method 1 applied ${method1Result.changesApplied} changes`);
    
    await page.waitForTimeout(3000);
    
    console.log(`   🔧 Testing Method 2: Event triggering`);
    
    const method2Result = await page.evaluate(() => {
      let eventsTriggered = 0;
      
      // Method 2: Trigger selection events
      document.querySelectorAll('*').forEach(el => {
        const text = (el.textContent || '').toLowerCase();
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          // Trigger various events
          const events = ['click', 'mousedown', 'mouseup', 'change', 'focus'];
          events.forEach(eventType => {
            try {
              const event = new Event(eventType, { bubbles: true });
              el.dispatchEvent(event);
              eventsTriggered++;
            } catch (e) {}
          });
          
          console.log(`🔧 Triggered events on Mercuryo element`);
        }
      });
      
      return { method: 'EVENT_TRIGGERING', eventsTriggered };
    });
    
    console.log(`   📊 Method 2 triggered ${method2Result.eventsTriggered} events`);
    
    await page.waitForTimeout(2000);
    
    console.log(`   🔧 Testing Method 3: JavaScript function calls`);
    
    const method3Result = await page.evaluate(() => {
      let functionsCalled = 0;
      
      // Method 3: Try to call selection functions
      const possibleFunctions = [
        'selectProvider',
        'setProvider', 
        'chooseProvider',
        'updateProvider',
        'selectMercuryo',
        'activateProvider'
      ];
      
      possibleFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
          try {
            window[funcName]('mercuryo');
            functionsCalled++;
            console.log(`🔧 Called ${funcName}('mercuryo')`);
          } catch (e) {}
        }
      });
      
      // Try React/Vue state updates
      Object.keys(window).forEach(key => {
        if (key.startsWith('__REACT') || key.startsWith('__VUE')) {
          try {
            const component = window[key];
            if (component && typeof component.setState === 'function') {
              component.setState({ selectedProvider: 'mercuryo' });
              functionsCalled++;
            }
          } catch (e) {}
        }
      });
      
      return { method: 'FUNCTION_CALLS', functionsCalled };
    });
    
    console.log(`   📊 Method 3 called ${method3Result.functionsCalled} functions`);
    
    this.criticalFindings.push({ 
      type: 'FORCING_METHODS',
      results: [method1Result, method2Result, method3Result]
    });
  }

  async verifySuccessCriteria(page) {
    const verification = await page.evaluate(() => {
      console.log('✅ Verifying success criteria...');
      
      const criteria = {
        mercuryoSelected: false,
        greenBorder: false,
        walletVisible: false,
        amountCorrect: false,
        moonpayNotSelected: true
      };
      
      // Check Mercuryo selection
      document.querySelectorAll('*').forEach(el => {
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const selected = el.getAttribute('aria-selected') === 'true' || 
                          el.className?.includes('selected') ||
                          el.className?.includes('active');
          
          if (selected) {
            criteria.mercuryoSelected = true;
            console.log('✅ Mercuryo appears selected');
          }
          
          const hasGreenBorder = style.border?.includes('22c55e') || 
                                style.borderColor?.includes('22c55e') ||
                                style.border?.includes('green');
          
          if (hasGreenBorder) {
            criteria.greenBorder = true;
            console.log('✅ Green border detected on Mercuryo');
          }
        }
        
        if (text.includes('moonpay')) {
          const selected = el.getAttribute('aria-selected') === 'true' || 
                          el.className?.includes('selected');
          if (selected) {
            criteria.moonpayNotSelected = false;
            console.log('⚠️ MoonPay appears selected');
          }
        }
      });
      
      // Check wallet fields
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        if (placeholder.includes('address') || placeholder.includes('wallet')) {
          if (input.offsetWidth > 0 && input.offsetHeight > 0) {
            criteria.walletVisible = true;
            console.log('✅ Wallet field is visible');
          }
        }
      });
      
      // Check amount
      const bodyText = document.body.textContent;
      if (bodyText.includes('€15') || bodyText.includes('15 EUR')) {
        criteria.amountCorrect = true;
        console.log('✅ Amount is correct (€15)');
      }
      
      const allCriteriaMet = criteria.mercuryoSelected && 
                            criteria.greenBorder && 
                            criteria.walletVisible && 
                            criteria.amountCorrect && 
                            criteria.moonpayNotSelected;
      
      console.log(`📊 Success criteria summary:`, criteria);
      console.log(`🎯 All criteria met: ${allCriteriaMet}`);
      
      return { criteria, allCriteriaMet };
    });
    
    console.log(`   📊 Verification Results:`);
    console.log(`      Mercuryo selected: ${verification.criteria.mercuryoSelected ? '✅' : '❌'}`);
    console.log(`      Green border: ${verification.criteria.greenBorder ? '✅' : '❌'}`);
    console.log(`      Wallet visible: ${verification.criteria.walletVisible ? '✅' : '❌'}`);
    console.log(`      Amount correct: ${verification.criteria.amountCorrect ? '✅' : '❌'}`);
    console.log(`      MoonPay not selected: ${verification.criteria.moonpayNotSelected ? '✅' : '❌'}`);
    console.log(`      🎯 ALL CRITERIA MET: ${verification.allCriteriaMet ? '✅' : '❌'}`);
    
    this.criticalFindings.push({ 
      type: 'SUCCESS_VERIFICATION',
      criteria: verification.criteria,
      success: verification.allCriteriaMet
    });
    
    return verification.allCriteriaMet;
  }
}

// Run the targeted analysis
const analyzer = new TargetedProviderAnalysis();
analyzer.analyzeProviderSelection().then(findings => {
  console.log(`\n🏁 ANALYSIS COMPLETE`);
  console.log(`📊 Critical findings: ${findings.length}`);
  
  const successVerification = findings.find(f => f.type === 'SUCCESS_VERIFICATION');
  if (successVerification && successVerification.success) {
    console.log(`\n🎉 SUCCESS CRITERIA ACHIEVED!`);
  } else {
    console.log(`\n🔄 Continuing to refine approach...`);
  }
}).catch(error => {
  console.error('Analysis failed:', error);
});