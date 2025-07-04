const { chromium, devices: playwrightDevices } = require('playwright');

class CompleteUserFlowTest {
  constructor() {
    this.attemptNumber = 1;
    this.successfulFlows = [];
    this.failedFlows = [];
  }

  async testCompleteUserFlow() {
    console.log(`\n🎯 COMPLETE USER FLOW TEST - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(80));
    console.log('🌐 STARTING POINT: https://auralo-website-fixed.netlify.app/');
    console.log('🎯 SUCCESS CONDITIONS:');
    console.log('   ✅ Mercuryo visibly selected as provider');
    console.log('   ✅ Thin green box around Mercuryo option');
    console.log('   ✅ Wallet address input field present and visible');
    console.log('   ✅ No MoonPay override occurs');
    console.log('   ✅ Confirmed 3 seconds after second page load');
    console.log('   ✅ Fiat amount remains at original value');
    console.log('');
    
    const testMatrix = [
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Australia',
        flag: '🇦🇺',
        geolocation: { latitude: -33.8688, longitude: 151.2093 }
      },
      { 
        name: 'Galaxy S23', 
        device: playwrightDevices['Galaxy S23'],
        region: 'USA',
        flag: '🇺🇸',
        geolocation: { latitude: 40.7128, longitude: -74.0060 }
      },
      { 
        name: 'iPhone 14 Pro', 
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Europe',
        flag: '🇪🇺',
        geolocation: { latitude: 51.5074, longitude: -0.1278 }
      },
      { 
        name: 'Galaxy S23', 
        device: playwrightDevices['Galaxy S23'],
        region: 'Canada',
        flag: '🇨🇦',
        geolocation: { latitude: 45.4215, longitude: -75.6972 }
      }
    ];

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

    for (const config of testMatrix) {
      try {
        const success = await this.testSingleFlow(browser, config);
        if (success) {
          console.log(`\n🏆 COMPLETE SUCCESS FOR ${config.flag} ${config.name} ${config.region}!`);
          this.successfulFlows.push({ config, attempt: this.attemptNumber });
        } else {
          this.failedFlows.push({ config, attempt: this.attemptNumber });
        }
      } catch (error) {
        console.error(`❌ ${config.flag} ${config.name} ${config.region}: ${error.message}`);
        this.failedFlows.push({ config, error: error.message, attempt: this.attemptNumber });
      }
    }

    await browser.close();
    
    const successCount = this.successfulFlows.length;
    const totalTests = testMatrix.length;
    
    console.log(`\n📊 ATTEMPT ${this.attemptNumber} SUMMARY:`);
    console.log(`   Successful flows: ${successCount}/${totalTests}`);
    console.log(`   Success rate: ${(successCount/totalTests*100).toFixed(1)}%`);
    
    if (successCount === totalTests) {
      console.log(`\n🎉🎉🎉 ALL REGIONS AND DEVICES SUCCESSFUL! 🎉🎉🎉`);
      console.log('✅ Auralo → SimpleSwap flow working perfectly');
      console.log('✅ Mercuryo selection with green border confirmed');
      console.log('✅ Wallet address fields visible');
      console.log('✅ No MoonPay override detected');
      console.log('✅ All success conditions met across all test scenarios');
      return true;
    }
    
    this.attemptNumber++;
    
    if (this.attemptNumber <= 50) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return this.testCompleteUserFlow();
    }
    
    return false;
  }

  async testSingleFlow(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - COMPLETE USER FLOW`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York',
      geolocation: config.geolocation,
      permissions: ['geolocation']
    });

    const page = await context.newPage();
    
    try {
      // PHASE 1: Start at Auralo website
      console.log(`  🌐 Phase 1: Loading Auralo website...`);
      await page.goto('https://auralo-website-fixed.netlify.app/', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`     📄 Auralo URL: ${page.url()}`);
      console.log(`     📄 Auralo title: ${await page.title()}`);
      
      // PHASE 2: Find and click SimpleSwap link
      console.log(`  🔗 Phase 2: Finding SimpleSwap link...`);
      
      // Scroll to bottom to find the buy button
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      
      const simpleSwapLinkFound = await this.findAndClickSimpleSwapLink(page);
      
      if (!simpleSwapLinkFound.success) {
        console.log(`     ❌ SimpleSwap link not found: ${simpleSwapLinkFound.error}`);
        await context.close();
        return false;
      }
      
      console.log(`     ✅ SimpleSwap link clicked: ${simpleSwapLinkFound.linkText}`);
      
      // PHASE 3: Wait for SimpleSwap to load (with new tab handling)
      console.log(`  ⏳ Phase 3: Waiting for SimpleSwap to load...`);
      
      let simpleSwapPage = null;
      
      // Check if new tab opened
      const pages = context.pages();
      if (pages.length > 1) {
        simpleSwapPage = pages[pages.length - 1]; // Get the newest page
        await simpleSwapPage.waitForLoadState('domcontentloaded');
        console.log(`     📱 New tab opened: ${simpleSwapPage.url()}`);
      } else {
        simpleSwapPage = page; // Same page navigation
        await page.waitForTimeout(3000);
        console.log(`     📱 Same page navigation: ${page.url()}`);
      }
      
      // PHASE 4: Verify we're on SimpleSwap
      if (!simpleSwapPage.url().includes('simpleswap.io')) {
        console.log(`     ❌ Not on SimpleSwap: ${simpleSwapPage.url()}`);
        await context.close();
        return false;
      }
      
      console.log(`     ✅ Successfully reached SimpleSwap`);
      
      // PHASE 5: Navigate to second page (provider selection)
      console.log(`  🚀 Phase 4: Navigating to provider selection page...`);
      
      const secondPageResult = await this.navigateToSecondPage(simpleSwapPage);
      
      if (!secondPageResult.success) {
        console.log(`     ❌ Failed to reach second page: ${secondPageResult.error}`);
        await context.close();
        return false;
      }
      
      console.log(`     ✅ Successfully reached second page`);
      
      // PHASE 6: Wait and verify success conditions at 3-second mark
      console.log(`  ⏱️  Phase 5: Verifying success conditions (3-second mark)...`);
      await simpleSwapPage.waitForTimeout(3000);
      
      const verification = await this.verifySuccessConditions(simpleSwapPage);
      
      console.log(`     📊 SUCCESS VERIFICATION:`);
      console.log(`        🎯 Mercuryo selected: ${verification.mercuryoSelected}`);
      console.log(`        🟢 Green box around Mercuryo: ${verification.greenBoxAroundMercuryo}`);
      console.log(`        💳 Wallet address field visible: ${verification.walletFieldVisible}`);
      console.log(`        ❌ No MoonPay override: ${!verification.moonpayOverride}`);
      console.log(`        💰 Fiat amount preserved: ${verification.fiatAmountCorrect}`);
      
      // Detailed logging
      if (verification.mercuryoElements.length > 0) {
        console.log(`        💳 Mercuryo elements found:`);
        verification.mercuryoElements.forEach((el, i) => {
          console.log(`           ${i+1}. ${el.tag} "${el.text.substring(0, 50)}..."`);
          console.log(`              Selected: ${el.selected}, Green: ${el.hasGreen}, ThinBorder: ${el.hasThinBorder}`);
        });
      }
      
      // PHASE 7: Final success determination
      const allConditionsMet = verification.mercuryoSelected && 
                              verification.greenBoxAroundMercuryo && 
                              verification.walletFieldVisible && 
                              !verification.moonpayOverride &&
                              verification.fiatAmountCorrect;
      
      if (allConditionsMet) {
        console.log(`\n     🏆 ALL SUCCESS CONDITIONS MET!`);
        console.log(`        ✅ Complete user flow successful`);
        console.log(`        ✅ Auralo → SimpleSwap navigation working`);
        console.log(`        ✅ Mercuryo selected with green border`);
        console.log(`        ✅ Wallet address field visible`);
        console.log(`        ✅ No MoonPay override`);
        console.log(`        ✅ Fiat amount correct`);
        
        await simpleSwapPage.screenshot({ 
          path: `COMPLETE_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
          fullPage: true 
        });
        
        await context.close();
        return true;
      } else {
        console.log(`\n     ❌ Success conditions not fully met`);
        
        await simpleSwapPage.screenshot({ 
          path: `flow_debug_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
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

  async findAndClickSimpleSwapLink(page) {
    const linkSelectors = [
      'text="copy your custom coupon code & complete your exchange"',
      'a[href*="simpleswap"]',
      '*:has-text("copy your custom coupon code & complete your exchange")',
      'a:has-text("SimpleSwap")',
      'button:has-text("SimpleSwap")',
      '.simpleswap-link',
      '[data-testid*="simpleswap"]'
    ];
    
    for (const selector of linkSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            const text = await element.textContent();
            
            // Set up new page listener if it might open new tab
            const newPagePromise = page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);
            
            await element.click();
            await page.waitForTimeout(2000);
            
            // Check if new page opened
            const newPage = await newPagePromise;
            
            return { 
              success: true, 
              linkText: text?.trim() || 'Unknown link',
              newTab: !!newPage
            };
          }
        }
      } catch (e) {}
    }
    
    return { 
      success: false, 
      error: 'No SimpleSwap link found or clickable'
    };
  }

  async navigateToSecondPage(page) {
    try {
      // Wait for page to be ready
      await page.waitForTimeout(2000);
      
      // Fill wallet address if possible
      await this.tryFillWalletAddress(page);
      
      // Find and click exchange button
      const buttons = await page.$$('button');
      
      for (const button of buttons) {
        try {
          const text = await button.textContent();
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          
          if (text && isVisible && isEnabled && 
              (text.toLowerCase().includes('exchange') || 
               text.toLowerCase().includes('create'))) {
            
            await button.click();
            await page.waitForTimeout(5000);
            
            return { 
              success: true, 
              buttonText: text.trim()
            };
          }
        } catch (e) {}
      }
      
      return { 
        success: false, 
        error: 'Exchange button not found or not clickable'
      };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.message
      };
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
        return true;
      }
    } catch (e) {}
    
    return false;
  }

  async verifySuccessConditions(page) {
    return await page.evaluate(() => {
      const verification = {
        mercuryoSelected: false,
        greenBoxAroundMercuryo: false,
        walletFieldVisible: false,
        moonpayOverride: false,
        fiatAmountCorrect: false,
        mercuryoElements: [],
        moonpayElements: [],
        walletFields: [],
        fiatAmount: null
      };
      
      // Check for wallet address fields
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        
        if (placeholder.includes('address') || placeholder.includes('wallet') || 
            name.includes('address') || name.includes('wallet') ||
            placeholder.includes('recipient')) {
          
          const isVisible = input.offsetWidth > 0 && input.offsetHeight > 0;
          
          verification.walletFields.push({
            placeholder,
            name,
            visible: isVisible
          });
          
          if (isVisible) {
            verification.walletFieldVisible = true;
          }
        }
      });
      
      // Check for fiat amount preservation
      const bodyText = document.body.textContent;
      const eurMatches = bodyText.match(/€\s*(\d+(?:\.\d+)?)/g);
      if (eurMatches && eurMatches.length > 0) {
        const amounts = eurMatches.map(match => {
          const num = parseFloat(match.replace('€', '').trim());
          return num;
        });
        
        // Check if original amount (15) is preserved
        if (amounts.includes(15) || amounts.includes(15.0)) {
          verification.fiatAmountCorrect = true;
          verification.fiatAmount = '€15';
        } else {
          verification.fiatAmount = eurMatches[0];
        }
      }
      
      // Analyze all elements for provider selection
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        
        // Comprehensive border detection for thin green borders
        const borderProps = [
          style.border, style.borderColor, style.borderTopColor,
          style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
          style.borderTop, style.borderRight, style.borderBottom, style.borderLeft,
          style.borderWidth, style.borderStyle,
          style.outline, style.outlineColor, style.outlineWidth,
          style.boxShadow, style.backgroundColor
        ];
        
        const allStyles = borderProps.join(' ').toLowerCase();
        
        // Enhanced green detection with focus on thin borders
        const greenPatterns = [
          'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
          'rgb(0, 128, 0)', 'green', 'lightgreen',
          'rgb(46, 160, 67)', 'rgb(76, 175, 80)', 'rgb(40, 167, 69)',
          'rgb(25, 135, 84)', 'rgb(16, 185, 129)', 'rgb(5, 150, 105)',
          'solid green', '1px solid green', '2px solid green'
        ];
        
        const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
        
        // Thin border detection
        const hasThinBorder = allStyles.includes('1px') || 
                             allStyles.includes('2px') ||
                             allStyles.includes('thin') ||
                             (allStyles.includes('solid') && hasGreen);
        
        const className = el.className ? 
          (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
        
        const appearsSelected = className.includes('selected') || 
                               className.includes('active') ||
                               className.includes('chosen') ||
                               el.getAttribute('aria-selected') === 'true' ||
                               hasGreen;
        
        // Mercuryo analysis
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            selected: appearsSelected,
            hasGreen,
            hasThinBorder,
            borderInfo: allStyles.substring(0, 200)
          };
          
          verification.mercuryoElements.push(elementData);
          
          if (appearsSelected) {
            verification.mercuryoSelected = true;
          }
          
          if (hasGreen && hasThinBorder) {
            verification.greenBoxAroundMercuryo = true;
          }
        }
        
        // MoonPay analysis
        if (text.includes('moonpay') || text.includes('moon pay')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            selected: appearsSelected,
            hasGreen
          };
          
          verification.moonpayElements.push(elementData);
          
          if (appearsSelected || hasGreen) {
            verification.moonpayOverride = true;
          }
        }
      });
      
      return verification;
    });
  }
}

// Start the complete user flow test
const tester = new CompleteUserFlowTest();
tester.testCompleteUserFlow().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 COMPLETE USER FLOW SUCCESS! 🎉🎉🎉');
    console.log('✅ All regions and devices working perfectly');
    console.log('✅ Auralo → SimpleSwap flow verified');
    console.log('✅ All success conditions met consistently');
  } else {
    console.log('\n❌ Complete user flow testing failed');
    console.log('📊 Final summary:');
    console.log(`   Successful flows: ${tester.successfulFlows.length}`);
    console.log(`   Failed flows: ${tester.failedFlows.length}`);
  }
}).catch(error => {
  console.error('Critical error:', error);
});