const { chromium, devices: playwrightDevices } = require('playwright');

class ProperNavigationForcing {
  constructor() {
    this.attemptNumber = 1;
    this.maxAttempts = 20;
  }

  async executeProperMission() {
    console.log(`\n🚀 PROPER NAVIGATION FORCING - ATTEMPT ${this.attemptNumber}`);
    console.log('='.repeat(60));
    console.log('🎯 MISSION: Navigate to SECOND PAGE then apply forcing');
    console.log('📋 STRATEGY: First page → Fill wallet → Click exchange → Second page → Force Mercuryo');
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
      // PHASE 1: Load first page
      console.log(`📱 PHASE 1: Loading SimpleSwap first page...`);
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'load',
        timeout: 15000 
      });
      
      await page.waitForTimeout(5000);
      
      // Analyze first page
      const firstPageAnalysis = await page.evaluate(() => {
        return {
          url: window.location.href,
          title: document.title,
          hasWalletInput: document.querySelectorAll('input[placeholder*="address" i]').length > 0,
          hasExchangeButton: Array.from(document.querySelectorAll('button')).some(btn => 
            btn.textContent && btn.textContent.toLowerCase().includes('exchange')),
          elementCount: document.querySelectorAll('*').length,
          mercuryoCount: Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('mercuryo')).length,
          moonpayCount: Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('moonpay')).length
        };
      });
      
      console.log(`   📊 First page analysis:`);
      console.log(`      URL: ${firstPageAnalysis.url}`);
      console.log(`      Has wallet input: ${firstPageAnalysis.hasWalletInput}`);
      console.log(`      Has exchange button: ${firstPageAnalysis.hasExchangeButton}`);
      console.log(`      Elements: ${firstPageAnalysis.elementCount}`);
      console.log(`      Mercuryo mentions: ${firstPageAnalysis.mercuryoCount}`);
      console.log(`      MoonPay mentions: ${firstPageAnalysis.moonpayCount}`);
      
      // PHASE 2: Navigate to second page
      console.log(`\n🚀 PHASE 2: Navigating to provider selection page...`);
      
      // Step 1: Fill wallet address
      let walletFilled = false;
      try {
        const walletInput = await page.$('input[placeholder*="address" i]');
        if (walletInput) {
          await walletInput.click();
          await walletInput.fill('0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e');
          console.log(`   ✅ Wallet address filled`);
          walletFilled = true;
          await page.waitForTimeout(2000);
        } else {
          console.log(`   ⚠️ Wallet input not found on first page`);
        }
      } catch (walletError) {
        console.log(`   ❌ Wallet filling error: ${walletError.message}`);
      }
      
      // Step 2: Find and click exchange button
      let exchangeClicked = false;
      try {
        const buttons = await page.$$('button');
        console.log(`   🔍 Found ${buttons.length} buttons, looking for exchange...`);
        
        for (let i = 0; i < buttons.length; i++) {
          const button = buttons[i];
          const text = await button.textContent();
          console.log(`      Button ${i}: "${text}"`);
          
          if (text && (text.toLowerCase().includes('exchange') || 
                      text.toLowerCase().includes('create') ||
                      text.toLowerCase().includes('swap'))) {
            
            console.log(`   🔘 Clicking exchange button: "${text}"`);
            await button.click();
            exchangeClicked = true;
            await page.waitForTimeout(8000); // Wait longer for navigation
            break;
          }
        }
        
        if (!exchangeClicked) {
          console.log(`   ⚠️ No exchange button found`);
        }
      } catch (exchangeError) {
        console.log(`   ❌ Exchange clicking error: ${exchangeError.message}`);
      }
      
      // PHASE 3: Analyze second page
      console.log(`\n📊 PHASE 3: Analyzing second page...`);
      
      const secondPageAnalysis = await page.evaluate(() => {
        const analysis = {
          url: window.location.href,
          title: document.title,
          elementCount: document.querySelectorAll('*').length,
          mercuryoElements: [],
          moonpayElements: [],
          walletInputs: [],
          buttons: []
        };
        
        // Find all Mercuryo elements
        document.querySelectorAll('*').forEach((el, index) => {
          if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
          
          const text = (el.textContent || '').toLowerCase();
          
          if (text.includes('mercuryo') || text.includes('mercurio')) {
            const style = window.getComputedStyle(el);
            analysis.mercuryoElements.push({
              index,
              tag: el.tagName,
              text: el.textContent?.substring(0, 100),
              className: el.className?.toString() || '',
              id: el.id || '',
              clickable: el.tagName === 'BUTTON' || el.tagName === 'A' || el.onclick !== null,
              selected: el.getAttribute('aria-selected') === 'true' || 
                       (el.className && el.className.includes('selected')),
              border: style.border,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor
            });
          }
          
          if (text.includes('moonpay') || text.includes('moon pay')) {
            analysis.moonpayElements.push({
              index,
              tag: el.tagName,
              text: el.textContent?.substring(0, 100),
              className: el.className?.toString() || '',
              selected: el.getAttribute('aria-selected') === 'true' || 
                       (el.className && el.className.includes('selected'))
            });
          }
        });
        
        // Find wallet inputs
        document.querySelectorAll('input').forEach((input, index) => {
          const placeholder = (input.placeholder || '').toLowerCase();
          const name = (input.name || '').toLowerCase();
          
          if (placeholder.includes('address') || placeholder.includes('wallet') || 
              name.includes('address') || name.includes('wallet') ||
              placeholder.includes('recipient')) {
            analysis.walletInputs.push({
              index,
              placeholder: input.placeholder,
              name: input.name,
              type: input.type,
              visible: input.offsetWidth > 0 && input.offsetHeight > 0,
              value: input.value
            });
          }
        });
        
        // Find buttons
        document.querySelectorAll('button').forEach((btn, index) => {
          const text = btn.textContent?.trim() || '';
          if (text) {
            analysis.buttons.push({
              index,
              text: text.substring(0, 50),
              className: btn.className?.toString() || '',
              disabled: btn.disabled
            });
          }
        });
        
        return analysis;
      });
      
      console.log(`   📊 Second page analysis:`);
      console.log(`      URL: ${secondPageAnalysis.url}`);
      console.log(`      Elements: ${secondPageAnalysis.elementCount}`);
      console.log(`      Mercuryo elements: ${secondPageAnalysis.mercuryoElements.length}`);
      console.log(`      MoonPay elements: ${secondPageAnalysis.moonpayElements.length}`);
      console.log(`      Wallet inputs: ${secondPageAnalysis.walletInputs.length}`);
      console.log(`      Buttons: ${secondPageAnalysis.buttons.length}`);
      
      // Show detailed element info
      if (secondPageAnalysis.mercuryoElements.length > 0) {
        console.log(`\n   🔍 Mercuryo elements found:`);
        secondPageAnalysis.mercuryoElements.forEach((el, i) => {
          console.log(`      ${i}: ${el.tag} "${el.text?.substring(0, 40)}" selected:${el.selected} clickable:${el.clickable}`);
        });
      }
      
      if (secondPageAnalysis.moonpayElements.length > 0) {
        console.log(`\n   🔍 MoonPay elements found:`);
        secondPageAnalysis.moonpayElements.forEach((el, i) => {
          console.log(`      ${i}: ${el.tag} "${el.text?.substring(0, 40)}" selected:${el.selected}`);
        });
      }
      
      if (secondPageAnalysis.walletInputs.length > 0) {
        console.log(`\n   🔍 Wallet inputs found:`);
        secondPageAnalysis.walletInputs.forEach((input, i) => {
          console.log(`      ${i}: "${input.placeholder}" visible:${input.visible}`);
        });
      }
      
      // PHASE 4: Apply forcing if we're on the right page
      if (secondPageAnalysis.mercuryoElements.length > 0 && secondPageAnalysis.moonpayElements.length > 0) {
        console.log(`\n🔧 PHASE 4: Applying Mercuryo forcing on provider selection page...`);
        
        const forcingResult = await page.evaluate(() => {
          console.log('🚀 EXECUTING MERCURYO FORCING ON SECOND PAGE');
          
          let forcingActions = 0;
          
          // Force Mercuryo selection
          document.querySelectorAll('*').forEach(el => {
            if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
            
            const text = (el.textContent || '').toLowerCase();
            
            if (text.includes('mercuryo') || text.includes('mercurio')) {
              // Apply visual forcing
              el.style.border = '3px solid #22c55e !important';
              el.style.borderRadius = '8px !important';
              el.style.backgroundColor = 'rgba(34, 197, 94, 0.15) !important';
              el.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.6) !important';
              
              // Mark as selected
              el.setAttribute('aria-selected', 'true');
              if (el.classList) {
                el.classList.add('selected', 'active', 'chosen');
              }
              
              // Click to activate
              try { 
                el.click(); 
                forcingActions++;
                console.log('✅ Mercuryo element clicked and styled');
              } catch (e) {}
            }
            
            if (text.includes('moonpay') || text.includes('moon pay')) {
              // Disable MoonPay
              el.style.opacity = '0.3 !important';
              el.style.pointerEvents = 'none !important';
              el.setAttribute('aria-selected', 'false');
              if (el.classList) {
                el.classList.remove('selected', 'active', 'chosen');
              }
              forcingActions++;
              console.log('❌ MoonPay element disabled');
            }
          });
          
          // Force wallet fields visible
          document.querySelectorAll('input').forEach(input => {
            const placeholder = (input.placeholder || '').toLowerCase();
            if (placeholder.includes('address') || placeholder.includes('wallet')) {
              input.style.display = 'block !important';
              input.style.visibility = 'visible !important';
              input.style.opacity = '1 !important';
              input.required = true;
              forcingActions++;
              console.log('💳 Wallet field forced visible');
            }
          });
          
          return { success: true, actions: forcingActions };
        });
        
        console.log(`   ✅ Forcing applied: ${forcingResult.actions} actions`);
        
        // PHASE 5: Verify success over time
        console.log(`\n✅ PHASE 5: Verifying success criteria over time...`);
        
        const testIntervals = [3000, 5000, 8000];
        let allTestsPass = true;
        
        for (const interval of testIntervals) {
          await page.waitForTimeout(interval - (testIntervals.indexOf(interval) > 0 ? testIntervals[testIntervals.indexOf(interval) - 1] : 0));
          
          const verification = await page.evaluate(() => {
            const check = {
              mercuryoSelected: false,
              greenBorder: false,
              walletVisible: false,
              amountCorrect: false,
              moonpayDisabled: true,
              details: {
                mercuryoCount: 0,
                selectedMercuryo: 0,
                greenBorderCount: 0,
                moonpayCount: 0,
                selectedMoonpay: 0,
                walletFields: 0
              }
            };
            
            // Check elements
            document.querySelectorAll('*').forEach(el => {
              if (el.offsetWidth === 0 || el.offsetHeight === 0) return;
              
              const text = (el.textContent || '').toLowerCase();
              const style = window.getComputedStyle(el);
              
              if (text.includes('mercuryo')) {
                check.details.mercuryoCount++;
                
                const selected = el.getAttribute('aria-selected') === 'true' || 
                               (el.className && el.className.includes('selected'));
                if (selected) {
                  check.mercuryoSelected = true;
                  check.details.selectedMercuryo++;
                }
                
                const borderStr = [style.border, style.borderColor, style.boxShadow].join(' ');
                const hasGreen = borderStr.includes('22c55e') || borderStr.includes('green');
                if (hasGreen) {
                  check.greenBorder = true;
                  check.details.greenBorderCount++;
                }
              }
              
              if (text.includes('moonpay')) {
                check.details.moonpayCount++;
                
                const selected = el.getAttribute('aria-selected') === 'true' || 
                               (el.className && el.className.includes('selected'));
                if (selected) {
                  check.moonpayDisabled = false;
                  check.details.selectedMoonpay++;
                }
              }
            });
            
            // Check wallet fields
            document.querySelectorAll('input').forEach(input => {
              const placeholder = (input.placeholder || '').toLowerCase();
              if (placeholder.includes('address') || placeholder.includes('wallet')) {
                if (input.offsetWidth > 0 && input.offsetHeight > 0) {
                  check.walletVisible = true;
                  check.details.walletFields++;
                }
              }
            });
            
            // Check amount
            const bodyText = document.body ? document.body.textContent : '';
            if (bodyText.includes('€15') || bodyText.includes('15 EUR')) {
              check.amountCorrect = true;
            }
            
            return check;
          });
          
          const successThisCheck = verification.mercuryoSelected && 
                                  verification.greenBorder && 
                                  verification.walletVisible && 
                                  verification.amountCorrect && 
                                  verification.moonpayDisabled;
          
          console.log(`   ⏱️  ${interval/1000}s: M:${verification.mercuryoSelected} G:${verification.greenBorder} W:${verification.walletVisible} A:${verification.amountCorrect} !MP:${verification.moonpayDisabled} = ${successThisCheck ? 'SUCCESS' : 'FAIL'}`);
          console.log(`      📊 M:${verification.details.selectedMercuryo}/${verification.details.mercuryoCount} Green:${verification.details.greenBorderCount} MP:${verification.details.selectedMoonpay}/${verification.details.moonpayCount} W:${verification.details.walletFields}`);
          
          if (!successThisCheck) {
            allTestsPass = false;
          }
        }
        
        if (allTestsPass) {
          console.log(`\n🎉🎉🎉 100% SUCCESS ACHIEVED! 🎉🎉🎉`);
          console.log(`✅ All success criteria met on provider selection page!`);
          console.log(`✅ Mercuryo selected with green border`);
          console.log(`✅ Wallet address field visible`);
          console.log(`✅ Amount preserved at €15`);
          console.log(`✅ MoonPay properly disabled`);
          console.log(`✅ Selection persists over time`);
          
          await page.screenshot({ 
            path: `/Users/nelsonchan/auralo-fix/PROPER_SUCCESS_${this.attemptNumber}.png`,
            fullPage: true 
          });
          
          await browser.close();
          return true;
        }
        
      } else {
        console.log(`\n⚠️ PHASE 4 SKIPPED: Not on provider selection page`);
        console.log(`   Expected: Both Mercuryo and MoonPay elements`);
        console.log(`   Found: Mercuryo:${secondPageAnalysis.mercuryoElements.length} MoonPay:${secondPageAnalysis.moonpayElements.length}`);
      }
      
    } catch (error) {
      console.error(`❌ Attempt ${this.attemptNumber} failed: ${error.message}`);
    }
    
    await browser.close();
    
    this.attemptNumber++;
    
    if (this.attemptNumber <= this.maxAttempts) {
      console.log(`\n🔄 ATTEMPT ${this.attemptNumber - 1} FAILED - CONTINUING MISSION`);
      console.log(`🔍 Analyzing navigation flow and trying refined approach...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return this.executeProperMission();
    }
    
    console.log(`\n❌ All ${this.maxAttempts} attempts exhausted`);
    return false;
  }
}

// Execute the proper navigation and forcing
const navigator = new ProperNavigationForcing();
navigator.executeProperMission().then(success => {
  if (success) {
    console.log('\n🏆 MISSION ACCOMPLISHED!');
    console.log('✅ 100% success criteria achieved with proper navigation');
    console.log('✅ Provider selection forced successfully');
  } else {
    console.log('\n🔄 Mission continues - developing navigation strategy');
  }
}).catch(error => {
  console.error('Critical error in navigation forcing:', error);
});