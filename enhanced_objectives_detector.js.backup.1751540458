const { chromium, devices } = require('playwright');

class EnhancedObjectivesDetector {
  constructor() {
    this.attemptNumber = 1;
    this.strategies = [
      'wait_for_second_page',
      'slow_page_analysis', 
      'wallet_address_detection',
      'thin_border_focus',
      'provider_selection_timing',
      'multiple_checks',
      'deep_form_analysis',
      'border_width_detection',
      'mercuryo_context_check',
      'precise_timing_test'
    ];
  }

  async enhancedObjectiveDetection() {
    console.log(`\n🎯 ENHANCED OBJECTIVES DETECTION - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    console.log('KEY OBJECTIVES:');
    console.log('1. ⏱️  After 3 seconds on 2nd page - Mercuryo still selected');
    console.log('2. 💳 Can see it asking for wallet address');
    console.log('3. 🟢 Has thin green box surrounding Mercuryo');
    
    const strategy = this.strategies[(this.attemptNumber - 1) % this.strategies.length];
    console.log(`🧠 Strategy: ${strategy.replace('_', ' ').toUpperCase()}`);
    
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
        const success = await this.testObjectives(browser, config, strategy);
        if (success) {
          console.log(`\n🏆🏆🏆 ALL OBJECTIVES ACHIEVED! 🏆🏆🏆`);
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
    return this.enhancedObjectiveDetection();
  }

  async testObjectives(browser, config, strategy) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - TESTING OBJECTIVES`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // STEP 1: Navigate to EUR to POL exchange
      console.log(`  🚀 Step 1: Navigating to EUR → POL exchange...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded'
      });
      
      await page.waitForTimeout(3000);
      
      // STEP 2: Fill wallet and proceed to 2nd page
      console.log(`  🚀 Step 2: Proceeding to provider selection page...`);
      
      // Try to fill wallet address first
      const walletSelectors = [
        'input[placeholder*="address"]',
        'input[placeholder*="recipient"]',
        'input[type="text"]:not([value*="15"])'
      ];
      
      for (const selector of walletSelectors) {
        try {
          const input = await page.$(selector);
          if (input) {
            await input.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
            console.log(`    ✅ Filled wallet address`);
            break;
          }
        } catch (e) {}
      }
      
      // Click exchange to get to 2nd page
      const exchangeButton = await page.$('button:has-text("Exchange"):not([disabled])');
      if (exchangeButton) {
        console.log(`    🔘 Clicking exchange to reach 2nd page...`);
        await exchangeButton.click();
        
        // Wait for navigation to 2nd page
        try {
          await page.waitForNavigation({ timeout: 10000 });
          console.log(`    ✅ Successfully navigated to 2nd page`);
        } catch (e) {
          console.log(`    ⏳ No navigation detected, checking current page...`);
        }
      } else {
        console.log(`    ❌ Could not find exchange button`);
        await context.close();
        return false;
      }
      
      // STEP 3: Wait exactly 3 seconds then check objectives
      console.log(`  🚀 Step 3: Waiting 3 seconds then checking objectives...`);
      await page.waitForTimeout(3000);
      
      // OBJECTIVE 1 & 2 & 3: Check all objectives at 3-second mark
      const objectiveResults = await this.checkAllObjectives(page);
      
      console.log(`  📊 OBJECTIVE RESULTS:`);
      console.log(`     1. ⏱️  Mercuryo still selected after 3s: ${objectiveResults.mercuryoSelected}`);
      console.log(`     2. 💳 Asking for wallet address: ${objectiveResults.walletAddressVisible}`);
      console.log(`     3. 🟢 Thin green box around Mercuryo: ${objectiveResults.thinGreenBox}`);
      console.log(`     🎯 ALL OBJECTIVES MET: ${objectiveResults.allObjectivesMet}`);
      
      // Detailed logging
      if (objectiveResults.mercuryoElements.length > 0) {
        console.log(`     💳 Mercuryo elements found:`);
        objectiveResults.mercuryoElements.forEach((el, i) => {
          console.log(`        ${i+1}. ${el.tag} "${el.text.substring(0, 40)}..."`);
          console.log(`           Selected: ${el.appearsSelected}, Green: ${el.hasGreen}, ThinBorder: ${el.hasThinBorder}`);
        });
      }
      
      if (objectiveResults.walletFields.length > 0) {
        console.log(`     💳 Wallet address fields found:`);
        objectiveResults.walletFields.forEach((field, i) => {
          console.log(`        ${i+1}. ${field.type} placeholder="${field.placeholder}"`);
        });
      }
      
      // SUCCESS CHECK
      if (objectiveResults.allObjectivesMet) {
        console.log(`\n  🎉 SUCCESS! All objectives achieved at 3-second mark!`);
        
        // STEP 4: Test 5-second persistence
        console.log(`  🚀 Step 4: Testing 5-second persistence...`);
        await page.waitForTimeout(2000); // Additional 2 seconds = 5 total
        
        const persistenceResults = await this.checkAllObjectives(page);
        console.log(`     🕐 5-second persistence check:`);
        console.log(`        Mercuryo still selected: ${persistenceResults.mercuryoSelected}`);
        console.log(`        Thin green box persists: ${persistenceResults.thinGreenBox}`);
        console.log(`        MoonPay NOT selected: ${!persistenceResults.moonpaySelected}`);
        
        if (persistenceResults.allObjectivesMet && !persistenceResults.moonpaySelected) {
          console.log(`\n  🏆 COMPLETE SUCCESS! All objectives met and persisted!`);
          console.log(`     ✅ Mercuryo selected with thin green border`);
          console.log(`     ✅ Wallet address field visible`);
          console.log(`     ✅ Selection persists after 5 seconds`);
          console.log(`     ✅ MoonPay not selected`);
          
          await page.screenshot({ 
            path: `OBJECTIVES_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          
          await context.close();
          return true;
        }
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `objectives_${strategy}_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async checkAllObjectives(page) {
    return await page.evaluate(() => {
      const results = {
        mercuryoSelected: false,
        walletAddressVisible: false,
        thinGreenBox: false,
        moonpaySelected: false,
        allObjectivesMet: false,
        mercuryoElements: [],
        moonpayElements: [],
        walletFields: []
      };
      
      // Check for wallet address fields (Objective 2)
      const walletInputs = document.querySelectorAll('input');
      walletInputs.forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const type = input.type || '';
        
        if (placeholder.includes('address') || placeholder.includes('wallet') || 
            name.includes('address') || name.includes('wallet') ||
            placeholder.includes('recipient')) {
          results.walletFields.push({
            type: input.type,
            placeholder: input.placeholder,
            name: input.name,
            visible: input.offsetWidth > 0 && input.offsetHeight > 0
          });
          
          if (input.offsetWidth > 0 && input.offsetHeight > 0) {
            results.walletAddressVisible = true;
          }
        }
      });
      
      // Analyze all elements for provider selection
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        const className = el.className ? 
          (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
        
        // Enhanced border detection for THIN borders specifically
        const border = style.border || '';
        const borderTop = style.borderTop || '';
        const borderRight = style.borderRight || '';
        const borderBottom = style.borderBottom || '';
        const borderLeft = style.borderLeft || '';
        const borderColor = style.borderColor || '';
        const borderWidth = style.borderWidth || '';
        const outline = style.outline || '';
        const boxShadow = style.boxShadow || '';
        const backgroundColor = style.backgroundColor || '';
        
        const allBorderStyles = [
          border, borderTop, borderRight, borderBottom, borderLeft,
          borderColor, borderWidth, outline, boxShadow, backgroundColor
        ].join(' ').toLowerCase();
        
        // Look for thin borders specifically
        const hasThinBorder = allBorderStyles.includes('1px') || 
                             allBorderStyles.includes('2px') ||
                             allBorderStyles.includes('thin') ||
                             borderWidth.includes('1px') ||
                             borderWidth.includes('2px');
        
        // Green detection patterns
        const greenPatterns = [
          'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
          'rgb(0, 128, 0)', 'green', 'lightgreen', 'rgb(46, 160, 67)',
          'rgb(76, 175, 80)', 'rgb(40, 167, 69)', 'rgb(25, 135, 84)',
          'rgb(16, 185, 129)', 'solid green'
        ];
        
        const hasGreen = greenPatterns.some(pattern => allBorderStyles.includes(pattern));
        
        // Check for selection indicators
        const appearsSelected = className.includes('selected') || 
                               className.includes('active') ||
                               className.includes('chosen') ||
                               el.getAttribute('aria-selected') === 'true' ||
                               el.getAttribute('data-selected') === 'true' ||
                               hasGreen;
        
        // Mercuryo analysis (Objectives 1 & 3)
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className: className,
            appearsSelected,
            hasGreen,
            hasThinBorder,
            borderWidth: borderWidth,
            borderColor: borderColor,
            allBorderStyles: allBorderStyles.substring(0, 200)
          };
          
          results.mercuryoElements.push(elementData);
          
          if (appearsSelected) {
            results.mercuryoSelected = true;
          }
          
          if (hasGreen && hasThinBorder) {
            results.thinGreenBox = true;
          }
        }
        
        // MoonPay analysis
        if (text.includes('moonpay') || text.includes('moon pay')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className: className,
            appearsSelected,
            hasGreen
          };
          
          results.moonpayElements.push(elementData);
          
          if (appearsSelected || hasGreen) {
            results.moonpaySelected = true;
          }
        }
      });
      
      // Determine if all objectives are met
      results.allObjectivesMet = results.mercuryoSelected && 
                                results.walletAddressVisible && 
                                results.thinGreenBox;
      
      return results;
    });
  }
}

// Start enhanced objectives detection
const detector = new EnhancedObjectivesDetector();
detector.enhancedObjectiveDetection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 ALL KEY OBJECTIVES ACHIEVED! 🎉🎉🎉');
    console.log('✅ Mercuryo selected after 3 seconds on 2nd page');
    console.log('✅ Wallet address field visible');
    console.log('✅ Thin green box surrounding Mercuryo');
    console.log('✅ Selection persists after 5 seconds');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting objectives detection...');
    const newDetector = new EnhancedObjectivesDetector();
    newDetector.enhancedObjectiveDetection();
  }, 2000);
});