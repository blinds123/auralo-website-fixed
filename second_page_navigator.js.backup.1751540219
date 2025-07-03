const { chromium, devices: playwrightDevices } = require('playwright');

class SecondPageNavigator {
  constructor() {
    this.attemptNumber = 1;
  }

  async navigateToSecondPage() {
    console.log(`\n🎯 SECOND PAGE NAVIGATION - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(70));
    console.log('MISSION: Navigate to 2nd page and detect provider selection');
    console.log('SUCCESS: Mercuryo selected with wallet address field OR MoonPay without wallet field');
    
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
        device: playwrightDevices['iPhone 14 Pro'],
        region: 'Australia',
        flag: '🇦🇺'
      },
      { 
        name: 'Galaxy S23', 
        device: playwrightDevices['Galaxy S23'],
        region: 'USA', 
        flag: '🇺🇸'
      }
    ];

    for (const config of testConfigs) {
      try {
        const success = await this.testSecondPageNavigation(browser, config);
        if (success) {
          console.log(`\n🏆 SECOND PAGE SUCCESS ACHIEVED!`);
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
    return this.navigateToSecondPage();
  }

  async testSecondPageNavigation(browser, config) {
    console.log(`\n${config.flag} ${config.name} ${config.region} - SECOND PAGE TEST`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    const page = await context.newPage();
    
    try {
      // STEP 1: Navigate to EUR to POL exchange (15 EUR)
      console.log(`  🚀 Step 1: Loading EUR → POL (15 EUR) exchange...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await page.waitForTimeout(3000);
      
      console.log(`  📄 Current URL: ${page.url()}`);
      
      // STEP 2: Check if this is the first page with exchange form
      const firstPageCheck = await page.evaluate(() => {
        const bodyText = document.body.textContent.toLowerCase();
        return {
          hasExchangeButton: !!document.querySelector('button:has-text("Exchange"), button:has-text("Create Exchange"), button[type="submit"]'),
          hasAmountField: bodyText.includes('amount') || bodyText.includes('15'),
          hasCurrencyPairs: bodyText.includes('eur') && (bodyText.includes('pol') || bodyText.includes('polygon')),
          pageTitle: document.title,
          exchangeButtonText: Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(t => t && (t.includes('Exchange') || t.includes('Create') || t.includes('Continue')))
        };
      });
      
      console.log(`  📊 First page analysis:`);
      console.log(`     Has exchange button: ${firstPageCheck.hasExchangeButton}`);
      console.log(`     Has amount field: ${firstPageCheck.hasAmountField}`);
      console.log(`     Has currency pairs: ${firstPageCheck.hasCurrencyPairs}`);
      console.log(`     Exchange buttons: ${firstPageCheck.exchangeButtonText.join(', ')}`);
      
      if (!firstPageCheck.hasExchangeButton) {
        console.log(`  ❌ No exchange button found - checking page content...`);
        
        // Take screenshot for debugging
        await page.screenshot({ 
          path: `first_page_debug_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
          fullPage: true 
        });
        
        await context.close();
        return false;
      }
      
      // STEP 3: Fill wallet address (if field exists)
      console.log(`  🏦 Step 2: Attempting to fill wallet address...`);
      
      const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
      const walletFilled = await this.fillWalletAddress(page, walletAddress);
      
      if (walletFilled) {
        console.log(`    ✅ Wallet address filled successfully`);
      } else {
        console.log(`    ⚠️ Wallet address not filled - proceeding anyway`);
      }
      
      // STEP 4: Click the blue exchange button to get to 2nd page
      console.log(`  🔵 Step 3: Clicking blue exchange button to reach 2nd page...`);
      
      const navigationResult = await this.clickExchangeButton(page);
      
      if (!navigationResult.success) {
        console.log(`  ❌ Failed to click exchange button: ${navigationResult.error}`);
        await context.close();
        return false;
      }
      
      console.log(`  ✅ Exchange button clicked: ${navigationResult.buttonText}`);
      
      // STEP 5: Wait for and detect second page
      console.log(`  📱 Step 4: Waiting for second page with provider selection...`);
      
      await page.waitForTimeout(8000); // Wait longer for page transition
      
      console.log(`  📄 New URL: ${page.url()}`);
      
      // STEP 6: Analyze second page for provider selection
      const secondPageAnalysis = await this.analyzeSecondPage(page);
      
      console.log(`  📊 SECOND PAGE ANALYSIS:`);
      console.log(`     Has wallet address field: ${secondPageAnalysis.hasWalletField}`);
      console.log(`     Mercuryo elements: ${secondPageAnalysis.mercuryoElements.length}`);
      console.log(`     MoonPay elements: ${secondPageAnalysis.moonpayElements.length}`);
      console.log(`     Provider selection interface: ${secondPageAnalysis.hasProviderSelection}`);
      console.log(`     🎯 Mercuryo selected: ${secondPageAnalysis.mercuryoSelected}`);
      console.log(`     🔴 MoonPay selected: ${secondPageAnalysis.moonpaySelected}`);
      
      // Log provider details
      if (secondPageAnalysis.mercuryoElements.length > 0) {
        console.log(`     💳 Mercuryo details:`);
        secondPageAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`        ${i+1}. ${el.tag} "${el.text.substring(0, 40)}..."`);
          console.log(`           Selected: ${el.selected}, Green: ${el.hasGreen}, Visible: ${el.visible}`);
        });
      }
      
      if (secondPageAnalysis.moonpayElements.length > 0) {
        console.log(`     💰 MoonPay details:`);
        secondPageAnalysis.moonpayElements.forEach((el, i) => {
          console.log(`        ${i+1}. ${el.tag} "${el.text.substring(0, 40)}..."`);
          console.log(`           Selected: ${el.selected}, Green: ${el.hasGreen}`);
        });
      }
      
      // STEP 7: Test for 3-second and 5-second persistence
      if (secondPageAnalysis.hasProviderSelection) {
        console.log(`  ⏱️  Step 5: Testing 3-second persistence...`);
        await page.waitForTimeout(3000);
        
        const persistence3s = await this.analyzeSecondPage(page);
        console.log(`     3s check - Mercuryo: ${persistence3s.mercuryoSelected}, MoonPay: ${persistence3s.moonpaySelected}, Wallet: ${persistence3s.hasWalletField}`);
        
        console.log(`  ⏱️  Step 6: Testing 5-second persistence...`);
        await page.waitForTimeout(2000); // Additional 2s = 5s total
        
        const persistence5s = await this.analyzeSecondPage(page);
        console.log(`     5s check - Mercuryo: ${persistence5s.mercuryoSelected}, MoonPay: ${persistence5s.moonpaySelected}, Wallet: ${persistence5s.hasWalletField}`);
        
        // SUCCESS CRITERIA
        const success = persistence3s.mercuryoSelected && persistence5s.mercuryoSelected && 
                        persistence5s.hasWalletField && !persistence5s.moonpaySelected;
        
        if (success) {
          console.log(`\n  🏆 ALL OBJECTIVES MET!`);
          console.log(`     ✅ Successfully navigated to second page`);
          console.log(`     ✅ Mercuryo selected and persistent`);
          console.log(`     ✅ Wallet address field visible`);
          console.log(`     ✅ MoonPay not selected`);
          console.log(`     ✅ Selection persists at 3s and 5s marks`);
          
          await page.screenshot({ 
            path: `SECOND_PAGE_SUCCESS_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
            fullPage: true 
          });
          
          await context.close();
          return true;
        } else {
          console.log(`  ❌ Objectives not fully met - continuing search...`);
        }
      } else {
        console.log(`  ❌ Provider selection interface not detected`);
      }
      
      // Take screenshot for analysis
      await page.screenshot({ 
        path: `second_page_attempt_${config.name.replace(' ', '_')}_${config.region}_${this.attemptNumber}.png`,
        fullPage: true 
      });
      
      await context.close();
      return false;
      
    } catch (error) {
      await context.close();
      throw error;
    }
  }

  async fillWalletAddress(page, walletAddress) {
    const walletSelectors = [
      'input[placeholder*="address" i]',
      'input[placeholder*="recipient" i]',
      'input[placeholder*="wallet" i]',
      'input[name*="address" i]',
      'input[name*="recipient" i]',
      'input[id*="address" i]',
      'input[type="text"]:not([value*="15"]):not([value*="eur"]):not([value*="pol"])'
    ];
    
    for (const selector of walletSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          await input.click();
          await page.keyboard.selectAll();
          await input.fill(walletAddress);
          await page.waitForTimeout(1000);
          
          const value = await input.inputValue();
          if (value === walletAddress) {
            return true;
          }
        }
      } catch (e) {}
    }
    
    return false;
  }

  async clickExchangeButton(page) {
    const buttonSelectors = [
      'button:has-text("Exchange")',
      'button:has-text("Create Exchange")',
      'button:has-text("Continue")',
      'button[type="submit"]',
      'button:has-text("Go")',
      'button:has-text("Next")'
    ];
    
    for (const selector of buttonSelectors) {
      try {
        const buttons = await page.$$(selector);
        for (const button of buttons) {
          const isVisible = await button.isVisible();
          const isEnabled = await button.isEnabled();
          
          if (isVisible && isEnabled) {
            const text = await button.textContent();
            await button.click();
            await page.waitForTimeout(3000);
            
            return { 
              success: true, 
              buttonText: text?.trim() || 'Unknown button'
            };
          }
        }
      } catch (e) {}
    }
    
    return { 
      success: false, 
      error: 'No clickable exchange button found'
    };
  }

  async analyzeSecondPage(page) {
    return await page.evaluate(() => {
      const analysis = {
        hasWalletField: false,
        hasProviderSelection: false,
        mercuryoSelected: false,
        moonpaySelected: false,
        mercuryoElements: [],
        moonpayElements: [],
        walletFields: []
      };
      
      // Check for wallet address input fields
      document.querySelectorAll('input').forEach(input => {
        const placeholder = (input.placeholder || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const type = input.type || '';
        
        if (placeholder.includes('address') || placeholder.includes('wallet') || 
            name.includes('address') || name.includes('wallet') ||
            placeholder.includes('recipient')) {
          
          const isVisible = input.offsetWidth > 0 && input.offsetHeight > 0;
          
          analysis.walletFields.push({
            placeholder,
            name,
            type,
            visible: isVisible
          });
          
          if (isVisible) {
            analysis.hasWalletField = true;
          }
        }
      });
      
      // Analyze all elements for provider information
      document.querySelectorAll('*').forEach(el => {
        if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
        
        const text = (el.textContent || '').toLowerCase();
        const style = window.getComputedStyle(el);
        const className = el.className ? 
          (typeof el.className === 'string' ? el.className : el.className.toString()) : '';
        
        // Check for selection indicators
        const borderProps = [
          style.border, style.borderColor, style.borderTopColor,
          style.borderRightColor, style.borderBottomColor, style.borderLeftColor,
          style.outline, style.outlineColor, style.boxShadow, style.backgroundColor
        ];
        
        const allStyles = borderProps.join(' ').toLowerCase();
        
        const greenPatterns = [
          'rgb(34, 197, 94)', 'rgba(34, 197, 94', '#22c55e', '22c55e',
          'rgb(0, 128, 0)', 'green', 'lightgreen', 'rgb(46, 160, 67)',
          'rgb(76, 175, 80)', 'rgb(40, 167, 69)', 'solid green'
        ];
        
        const hasGreen = greenPatterns.some(pattern => allStyles.includes(pattern));
        
        const appearsSelected = className.includes('selected') || 
                               className.includes('active') ||
                               el.getAttribute('aria-selected') === 'true' ||
                               hasGreen;
        
        // Mercuryo detection
        if (text.includes('mercuryo') || text.includes('mercurio')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            selected: appearsSelected,
            hasGreen,
            visible: true
          };
          
          analysis.mercuryoElements.push(elementData);
          
          if (appearsSelected) {
            analysis.mercuryoSelected = true;
          }
        }
        
        // MoonPay detection
        if (text.includes('moonpay') || text.includes('moon pay')) {
          const elementData = {
            text: el.textContent ? el.textContent.substring(0, 100) : '',
            tag: el.tagName || '',
            className,
            selected: appearsSelected,
            hasGreen
          };
          
          analysis.moonpayElements.push(elementData);
          
          if (appearsSelected) {
            analysis.moonpaySelected = true;
          }
        }
      });
      
      // Determine if this looks like a provider selection page
      analysis.hasProviderSelection = (analysis.mercuryoElements.length > 0 && analysis.moonpayElements.length > 0) ||
                                     analysis.hasWalletField ||
                                     document.body.textContent.toLowerCase().includes('payment method');
      
      return analysis;
    });
  }
}

// Start the second page navigator
const navigator = new SecondPageNavigator();
navigator.navigateToSecondPage().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 SECOND PAGE NAVIGATION SUCCESS! 🎉🎉🎉');
    console.log('✅ Successfully reached second page with provider selection');
    console.log('✅ Mercuryo selected with wallet address field visible');
    console.log('✅ Selection persists at 3-second and 5-second marks');
  }
}).catch(error => {
  console.error('Critical error:', error);
  setTimeout(() => {
    console.log('\n🔄 Auto-restarting second page navigation...');
    const newNavigator = new SecondPageNavigator();
    newNavigator.navigateToSecondPage();
  }, 3000);
});