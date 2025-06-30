const { chromium, devices: playwrightDevices } = require('playwright');

class ProviderSelectionDetector {
  constructor() {
    this.attemptNumber = 1;
    this.successfulTests = [];
    this.failedTests = [];
  }

  async detectProviderSelection() {
    console.log(`\n🎯 PROVIDER SELECTION DETECTOR - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    console.log('MISSION: Detect Mercuryo vs MoonPay selection and green borders');
    console.log('SUCCESS: Mercuryo selected with green border at 3s and 5s marks');
    
    const testConfigs = [
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Australia',
        flag: '🇦🇺'
      },
      { 
        name: 'Galaxy S23', 
        device: playwrightDevices['Galaxy S23'],
        region: 'USA', 
        flag: '🇺🇸'
      },
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Europe', 
        flag: '🇪🇺'
      }
    ];

    const browser = await chromium.launch({ 
      headless: false,
      args: [
        '--enable-features=TouchEvents',
        '--disable-web-security', 
        '--enable-touch-events',
        '--no-sandbox'
      ]
    });

    for (const config of testConfigs) {
      try {
        const success = await this.testProviderSelection(browser, config);
        if (success) {
          console.log(`\n🏆 PROVIDER SELECTION SUCCESS!`);
          await browser.close();
          return true;
        }
      } catch (error) {
        console.error(`❌ ${config.name} ${config.region}:`, error.message);
        this.failedTests.push({
          config,
          error: error.message,
          attempt: this.attemptNumber
        });
      }
    }

    await browser.close();
    
    this.attemptNumber++;
    
    if (this.attemptNumber <= 20) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return this.detectProviderSelection();
    }
    
    return false;
  }

  async testProviderSelection(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - PROVIDER SELECTION TEST`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // STEP 1: Navigate to SimpleSwap and reach provider page
      console.log(`  🚀 Step 1: Loading SimpleSwap and navigating to provider selection...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      // Fill wallet address if possible
      await this.tryFillWalletAddress(page);
      
      // Click exchange button
      await this.clickExchangeButton(page);
      
      await page.waitForTimeout(5000);
      
      // STEP 2: Initial provider detection (Time 0)
      console.log(`  📊 Step 2: Initial provider detection...`);
      const initialDetection = await this.analyzeProviders(page);
      
      console.log(`     Initial state:`);
      console.log(`       Mercuryo elements: ${initialDetection.mercuryo.length}`);
      console.log(`       MoonPay elements: ${initialDetection.moonpay.length}`);
      console.log(`       🎯 Mercuryo green border: ${initialDetection.mercuryoGreenBorder}`);
      console.log(`       🔴 MoonPay green border: ${initialDetection.moonpayGreenBorder}`);
      console.log(`       💳 Wallet address field: ${initialDetection.hasWalletField}`);
      
      // STEP 3: Test at 3-second mark
      console.log(`  ⏱️  Step 3: Testing at 3-second mark...`);
      await page.waitForTimeout(3000);
      
      const detection3s = await this.analyzeProviders(page);
      
      console.log(`     3-second results:`);
      console.log(`       🎯 Mercuryo green border: ${detection3s.mercuryoGreenBorder}`);
      console.log(`       🔴 MoonPay green border: ${detection3s.moonpayGreenBorder}`);
      console.log(`       💳 Wallet address field: ${detection3s.hasWalletField}`);
      
      // Log detailed Mercuryo analysis
      if (detection3s.mercuryo.length > 0) {
        console.log(`     Mercuryo elements at 3s:`);
        detection3s.mercuryo.forEach((el, i) => {
          console.log(`        ${i+1}. ${el.tag} "${el.text.substring(0, 50)}..."`);
          console.log(`           Green: ${el.hasGreen}, Border: ${el.borderInfo}`);
        });
      }
      
      // STEP 4: Test at 5-second mark
      console.log(`  ⏱️  Step 4: Testing at 5-second mark...`);
      await page.waitForTimeout(2000); // Additional 2s = 5s total
      
      const detection5s = await this.analyzeProviders(page);
      
      console.log(`     5-second results:`);
      console.log(`       🎯 Mercuryo green border: ${detection5s.mercuryoGreenBorder}`);
      console.log(`       🔴 MoonPay green border: ${detection5s.moonpayGreenBorder}`);
      console.log(`       💳 Wallet address field: ${detection5s.hasWalletField}`);
      
      // STEP 5: Final analysis and success determination
      console.log(`  🔬 Step 5: Final analysis...`);
      
      const success3s = detection3s.mercuryoGreenBorder && detection3s.hasWalletField && !detection3s.moonpayGreenBorder;
      const success5s = detection5s.mercuryoGreenBorder && detection5s.hasWalletField && !detection5s.moonpayGreenBorder;
      
      if (success3s && success5s) {
        console.log(`\n  🏆 ALL OBJECTIVES ACHIEVED!`);
        console.log(`     ✅ Mercuryo has green border at 3s mark`);
        console.log(`     ✅ Mercuryo has green border at 5s mark`);
        console.log(`     ✅ Wallet address field visible`);
        console.log(`     ✅ MoonPay does not have green border`);
        console.log(`     ✅ Selection persists over time`);
        
        this.successfulTests.push({
          config,
          detection3s,
          detection5s,
          attempt: this.attemptNumber
        });
        
        await page.screenshot({ 
          path: `PROVIDER_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
          fullPage: true 
        });
        
        await context.close();
        return true;
      } else {
        console.log(`\n  ❌ Objectives not fully met:`);
        console.log(`     3s success: ${success3s} (Mercuryo green: ${detection3s.mercuryoGreenBorder}, Wallet: ${detection3s.hasWalletField}, No MoonPay green: ${!detection3s.moonpayGreenBorder})`);
        console.log(`     5s success: ${success5s} (Mercuryo green: ${detection5s.mercuryoGreenBorder}, Wallet: ${detection5s.hasWalletField}, No MoonPay green: ${!detection5s.moonpayGreenBorder})`);
      }
      
      // Take debug screenshot
      await page.screenshot({ 
        path: `provider_debug_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async tryFillWalletAddress(page) {
    const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
    
    try {
      const addressInput = await page.$('input[placeholder*="address" i]');
      if (addressInput) {
        await addressInput.click();
        await addressInput.fill(walletAddress);
        await page.waitForTimeout(1000);
        console.log(`    ✅ Wallet address filled`);
        return true;
      }
    } catch (e) {}
    
    console.log(`    ⚠️ Wallet address not filled`);
    return false;
  }

  async clickExchangeButton(page) {
    try {
      const buttons = await page.$$('button');
      
      for (const button of buttons) {
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        
        if (text && isVisible && isEnabled && 
            (text.toLowerCase().includes('exchange') || 
             text.toLowerCase().includes('create'))) {
          
          await button.click();
          await page.waitForTimeout(3000);
          console.log(`    🔘 Clicked: "${text.trim()}"`);
          return true;
        }
      }
    } catch (e) {}
    
    console.log(`    ❌ Exchange button not clicked`);
    return false;
  }

  async analyzeProviders(page) {
    return await page.evaluate(() => {
      const analysis = {
        mercuryo: [],
        moonpay: [],
        mercuryoGreenBorder: false,
        moonpayGreenBorder: false,
        hasWalletField: false,
        walletFields: [],
        allGreenElements: []
      };
      
      // Check for wallet address fields
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        
        if (placeholder.includes('address') || placeholder.includes('wallet') || 
            name.includes('address') || name.includes('wallet') ||
            placeholder.includes('recipient')) {
          
          const isVisible = input.offsetWidth > 0 && input.offsetHeight > 0;
          
          analysis.walletFields.push({
            placeholder,
            name,
            type: input.type,
            visible: isVisible
          });
          
          if (isVisible) {
            analysis.hasWalletField = true;
          }
        }
      });
      
      // Analyze all visible elements for provider information
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        // Comprehensive border and color detection
        const borderProps = [
          style.border, style.borderColor, style.borderTopColor,
          style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
          style.borderTop, style.borderRight, style.borderBottom, style.borderLeft,
          style.outline, style.outlineColor, style.boxShadow, 
          style.backgroundColor, style.color
        ];
        
        const allStyles = borderProps.join(' ').toLowerCase();
        
        // Enhanced green detection patterns
        const greenPatterns = [
          'rgb(34, 197, 94)',    // Tailwind green-500
          'rgba(34, 197, 94',    // With alpha
          '#22c55e', '22c55e',   // Hex
          'rgb(0, 128, 0)',      // Standard green
          'green', 'lightgreen', // CSS green
          'rgb(46, 160, 67)',    // Material green
          'rgb(76, 175, 80)',    // Material light green  
          'rgb(40, 167, 69)',    // Bootstrap success
          'rgb(25, 135, 84)',    // Bootstrap success dark
          'rgb(16, 185, 129)',   // Tailwind green variants
          'rgb(5, 150, 105)',
          'rgb(4, 120, 87)',
          'rgb(34, 197, 94)',
          'solid green',         // CSS border
          '1px solid green',
          '2px solid green',
          'border: 1px solid',
          'border: 2px solid'
        ];
        
        const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
        
        // Selection indicators
        const className = el.className ? 
          (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
        
        const appearsSelected = className.includes('selected') || 
                               className.includes('active') ||
                               className.includes('chosen') ||
                               el.getAttribute('aria-selected') === 'true' ||
                               hasGreen;
        
        // Mercuryo detection
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            hasGreen,
            appearsSelected,
            borderInfo: allStyles.substring(0, 150)
          };
          
          analysis.mercuryo.push(elementData);
          
          if (hasGreen) {
            analysis.mercuryoGreenBorder = true;
          }
        }
        
        // MoonPay detection
        if (text.includes('moonpay') || text.includes('moon pay')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            hasGreen,
            appearsSelected
          };
          
          analysis.moonpay.push(elementData);
          
          if (hasGreen) {
            analysis.moonpayGreenBorder = true;
          }
        }
        
        // Collect all green elements for debugging
        if (hasGreen) {
          analysis.allGreenElements.push({
            text: el.textContent ? el.textContent.substring(0, 50) : '',
            tag: el.tagName || '',
            hasMercuryo: text.includes('mercuryo'),
            hasMoonpay: text.includes('moonpay'),
            borderInfo: allStyles.substring(0, 100)
          });
        }
      });
      
      return analysis;
    });
  }
}

// Start the provider selection detector
const detector = new ProviderSelectionDetector();
detector.detectProviderSelection().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 PROVIDER SELECTION SUCCESS! 🎉🎉🎉');
    console.log('✅ Mercuryo selected with green border');
    console.log('✅ Wallet address field visible');
    console.log('✅ Selection persists at 3s and 5s marks');
    console.log('✅ MoonPay does not have green border');
  } else {
    console.log('\n❌ Provider selection detection failed after 20 attempts');
    console.log('📊 Summary:');
    console.log(`   Successful tests: ${detector.successfulTests.length}`);
    console.log(`   Failed tests: ${detector.failedTests.length}`);
  }
}).catch(error => {
  console.error('Critical error:', error);
});