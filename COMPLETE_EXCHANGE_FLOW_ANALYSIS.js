const { chromium, devices: playwrightDevices } = require('playwright');

class CompleteExchangeFlowAnalysis {
  async analyzeCompleteFlow() {
    console.log('\n🔍 COMPLETE EXCHANGE FLOW ANALYSIS');
    console.log('='.repeat(50));
    
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
      // STEP 1: Load initial page
      console.log('📱 STEP 1: Loading initial page...');
      await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', { 
        waitUntil: 'load',
        timeout: 15000 
      });
      
      await page.waitForTimeout(5000);
      console.log(`   ✅ Initial URL: ${await page.url()}`);
      
      // STEP 2: Click Exchange to go to exchange page
      console.log('\n🔘 STEP 2: Clicking Exchange button...');
      await page.click('button.styles_button__LHkel:has-text("Exchange")');
      await page.waitForTimeout(8000);
      
      const exchangeUrl = await page.url();
      console.log(`   ✅ Exchange URL: ${exchangeUrl}`);
      
      // STEP 3: Comprehensive analysis of exchange page
      console.log('\n📊 STEP 3: Analyzing exchange page structure...');
      
      const exchangePageAnalysis = await page.evaluate(() => {
        const analysis = {
          url: window.location.href,
          title: document.title,
          inputs: [],
          buttons: [],
          forms: [],
          walletFields: [],
          stepIndicators: [],
          providerMentions: [],
          nextStepHints: []
        };
        
        // Analyze all inputs
        document.querySelectorAll('input').forEach((input, index) => {
          analysis.inputs.push({
            index,
            type: input.type,
            placeholder: input.placeholder,
            name: input.name,
            id: input.id,
            value: input.value,
            className: input.className,
            visible: input.offsetWidth > 0 && input.offsetHeight > 0,
            required: input.required
          });
          
          // Check for wallet-related fields
          const placeholder = (input.placeholder || '').toLowerCase();
          const name = (input.name || '').toLowerCase();
          
          if (placeholder.includes('address') || placeholder.includes('wallet') || 
              name.includes('address') || name.includes('wallet') ||
              placeholder.includes('recipient') || placeholder.includes('destination') ||
              placeholder.includes('receive') || placeholder.includes('send')) {
            analysis.walletFields.push({
              index,
              placeholder: input.placeholder,
              name: input.name,
              type: input.type,
              visible: input.offsetWidth > 0 && input.offsetHeight > 0
            });
          }
        });
        
        // Analyze all buttons
        document.querySelectorAll('button').forEach((button, index) => {
          const text = button.textContent?.trim() || '';
          if (text && button.offsetWidth > 0 && button.offsetHeight > 0) {
            analysis.buttons.push({
              index,
              text: text,
              type: button.type,
              className: button.className,
              id: button.id,
              disabled: button.disabled,
              visible: true
            });
          }
        });
        
        // Look for forms
        document.querySelectorAll('form').forEach((form, index) => {
          analysis.forms.push({
            index,
            action: form.action,
            method: form.method,
            className: form.className,
            inputCount: form.querySelectorAll('input').length,
            buttonCount: form.querySelectorAll('button').length
          });
        });
        
        // Look for step indicators or progress elements
        document.querySelectorAll('*').forEach(el => {
          const text = (el.textContent || '').toLowerCase();
          
          if ((text.includes('step') || text.includes('stage') || text.includes('phase')) && 
              text.length < 100 && el.offsetWidth > 0) {
            analysis.stepIndicators.push({
              tag: el.tagName,
              text: el.textContent?.trim(),
              className: el.className
            });
          }
          
          // Look for provider mentions
          if ((text.includes('provider') || text.includes('payment') || text.includes('method')) && 
              text.length < 200 && el.offsetWidth > 0) {
            analysis.providerMentions.push({
              tag: el.tagName,
              text: el.textContent?.trim().substring(0, 100),
              className: el.className
            });
          }
          
          // Look for next step hints
          if ((text.includes('next') || text.includes('continue') || text.includes('proceed') || 
               text.includes('confirm') || text.includes('submit')) && 
              text.length < 100 && el.offsetWidth > 0) {
            analysis.nextStepHints.push({
              tag: el.tagName,
              text: el.textContent?.trim(),
              className: el.className,
              clickable: el.tagName === 'BUTTON' || el.tagName === 'A' || 
                        el.onclick !== null || el.style.cursor === 'pointer'
            });
          }
        });
        
        return analysis;
      });
      
      console.log(`   📊 Exchange page analysis:`);
      console.log(`      Title: ${exchangePageAnalysis.title}`);
      console.log(`      Inputs: ${exchangePageAnalysis.inputs.length}`);
      console.log(`      Buttons: ${exchangePageAnalysis.buttons.length}`);
      console.log(`      Forms: ${exchangePageAnalysis.forms.length}`);
      console.log(`      Wallet fields: ${exchangePageAnalysis.walletFields.length}`);
      console.log(`      Step indicators: ${exchangePageAnalysis.stepIndicators.length}`);
      console.log(`      Provider mentions: ${exchangePageAnalysis.providerMentions.length}`);
      console.log(`      Next step hints: ${exchangePageAnalysis.nextStepHints.length}`);
      
      // Show wallet fields
      if (exchangePageAnalysis.walletFields.length > 0) {
        console.log(`\n   💳 Wallet fields found:`);
        exchangePageAnalysis.walletFields.forEach((field, i) => {
          console.log(`      ${i}: "${field.placeholder}" name="${field.name}" visible:${field.visible}`);
        });
      }
      
      // Show relevant buttons
      if (exchangePageAnalysis.buttons.length > 0) {
        console.log(`\n   🔘 Important buttons:`);
        exchangePageAnalysis.buttons.slice(0, 10).forEach((button, i) => {
          console.log(`      ${i}: "${button.text}" disabled:${button.disabled}`);
        });
      }
      
      // Show next step hints
      if (exchangePageAnalysis.nextStepHints.length > 0) {
        console.log(`\n   ➡️ Next step hints:`);
        exchangePageAnalysis.nextStepHints.forEach((hint, i) => {
          console.log(`      ${i}: ${hint.tag} "${hint.text}" clickable:${hint.clickable}`);
        });
      }
      
      // Show provider mentions
      if (exchangePageAnalysis.providerMentions.length > 0) {
        console.log(`\n   🏢 Provider mentions:`);
        exchangePageAnalysis.providerMentions.forEach((mention, i) => {
          console.log(`      ${i}: "${mention.text}"`);
        });
      }
      
      // STEP 4: Try to fill wallet address if field exists
      if (exchangePageAnalysis.walletFields.length > 0) {
        console.log(`\n💳 STEP 4: Attempting to fill wallet address...`);
        
        const walletAddress = '0x742e4758d8eabc346e9bc2a7ae37d8e5e0e5f75e';
        
        for (const field of exchangePageAnalysis.walletFields) {
          if (field.visible) {
            try {
              console.log(`   🎯 Filling field: "${field.placeholder}"`);
              
              // Try multiple selectors
              const selectors = [
                `input[placeholder*="${field.placeholder.substring(0, 10)}" i]`,
                `input[name="${field.name}"]`,
                `input >> nth=${field.index}`
              ].filter(s => s);
              
              for (const selector of selectors) {
                try {
                  const input = await page.$(selector);
                  if (input) {
                    await input.click();
                    await input.fill(walletAddress);
                    console.log(`   ✅ Successfully filled: ${selector}`);
                    break;
                  }
                } catch (selectorError) {
                  continue;
                }
              }
              
              await page.waitForTimeout(3000);
              break; // Only fill first visible field
              
            } catch (fillError) {
              console.log(`   ❌ Error filling ${field.placeholder}: ${fillError.message}`);
            }
          }
        }
        
        // STEP 5: Look for continue/next button after filling
        console.log(`\n🔘 STEP 5: Looking for next step after filling wallet...`);
        
        // Check if page changed or new elements appeared
        const afterFillingAnalysis = await page.evaluate(() => {
          return {
            mercuryoVisible: Array.from(document.querySelectorAll('*')).some(el => 
              el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
              el.offsetWidth > 0 && el.offsetHeight > 0 && 
              !el.textContent.includes('schema.org')),
            moonpayVisible: Array.from(document.querySelectorAll('*')).some(el => 
              el.textContent && el.textContent.toLowerCase().includes('moonpay') && 
              el.offsetWidth > 0 && el.offsetHeight > 0 && 
              !el.textContent.includes('schema.org')),
            newButtons: Array.from(document.querySelectorAll('button')).filter(btn => 
              btn.textContent && btn.offsetWidth > 0 && 
              (btn.textContent.toLowerCase().includes('continue') ||
               btn.textContent.toLowerCase().includes('next') ||
               btn.textContent.toLowerCase().includes('proceed') ||
               btn.textContent.toLowerCase().includes('confirm') ||
               btn.textContent.toLowerCase().includes('create') ||
               btn.textContent.toLowerCase().includes('start'))).map(btn => btn.textContent.trim())
          };
        });
        
        console.log(`   📊 After filling analysis:`);
        console.log(`      Mercuryo visible: ${afterFillingAnalysis.mercuryoVisible}`);
        console.log(`      MoonPay visible: ${afterFillingAnalysis.moonpayVisible}`);
        console.log(`      New action buttons: ${afterFillingAnalysis.newButtons.length}`);
        
        if (afterFillingAnalysis.newButtons.length > 0) {
          console.log(`   🔘 New buttons found:`);
          afterFillingAnalysis.newButtons.forEach((buttonText, i) => {
            console.log(`      ${i}: "${buttonText}"`);
          });
        }
        
        // Try clicking action buttons
        if (afterFillingAnalysis.newButtons.length > 0) {
          console.log(`\n🎯 STEP 6: Trying to proceed to provider selection...`);
          
          for (let i = 0; i < Math.min(afterFillingAnalysis.newButtons.length, 3); i++) {
            const buttonText = afterFillingAnalysis.newButtons[i];
            
            try {
              console.log(`   🔘 Clicking: "${buttonText}"`);
              
              const urlBefore = await page.url();
              await page.click(`button:has-text("${buttonText}")`);
              await page.waitForTimeout(8000);
              
              const urlAfter = await page.url();
              
              const finalCheck = await page.evaluate(() => {
                return {
                  url: window.location.href,
                  urlChanged: true,
                  mercuryoElements: Array.from(document.querySelectorAll('*')).filter(el => 
                    el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                    el.offsetWidth > 0 && el.offsetHeight > 0 && 
                    !el.textContent.includes('schema.org')).length,
                  moonpayElements: Array.from(document.querySelectorAll('*')).filter(el => 
                    el.textContent && el.textContent.toLowerCase().includes('moonpay') && 
                    el.offsetWidth > 0 && el.offsetHeight > 0 && 
                    !el.textContent.includes('schema.org')).length,
                  hasProviderSelection: document.body.textContent.toLowerCase().includes('provider') ||
                                      document.body.textContent.toLowerCase().includes('payment method')
                };
              });
              
              console.log(`   📊 Final check results:`);
              console.log(`      URL changed: ${urlBefore !== urlAfter} (${urlBefore} → ${urlAfter})`);
              console.log(`      Mercuryo elements: ${finalCheck.mercuryoElements}`);
              console.log(`      MoonPay elements: ${finalCheck.moonpayElements}`);
              console.log(`      Has provider selection: ${finalCheck.hasProviderSelection}`);
              
              if (finalCheck.mercuryoElements > 0 && finalCheck.moonpayElements > 0) {
                console.log(`\n🎉🎉 BREAKTHROUGH ACHIEVED! 🎉🎉`);
                console.log(`✅ Successfully reached provider selection page!`);
                console.log(`✅ Found ${finalCheck.mercuryoElements} Mercuryo elements`);
                console.log(`✅ Found ${finalCheck.moonpayElements} MoonPay elements`);
                
                await page.screenshot({ 
                  path: '/Users/nelsonchan/auralo-fix/PROVIDER_SELECTION_REACHED.png',
                  fullPage: true 
                });
                
                console.log(`📸 Screenshot saved: PROVIDER_SELECTION_REACHED.png`);
                
                // Quick test of Mercuryo forcing
                console.log(`\n🔧 QUICK TEST: Applying Mercuryo forcing...`);
                
                const quickForcing = await page.evaluate(() => {
                  let actions = 0;
                  
                  document.querySelectorAll('*').forEach(el => {
                    if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                    
                    const text = (el.textContent || '').toLowerCase();
                    
                    if (text.includes('mercuryo') && !text.includes('schema.org')) {
                      el.style.border = '3px solid #22c55e !important';
                      el.style.backgroundColor = 'rgba(34, 197, 94, 0.15) !important';
                      el.setAttribute('aria-selected', 'true');
                      if (el.classList) {
                        el.classList.add('selected', 'active');
                      }
                      try { el.click(); } catch (e) {}
                      actions++;
                    }
                  });
                  
                  return actions;
                });
                
                console.log(`   ✅ Applied ${quickForcing} forcing actions`);
                
                await page.waitForTimeout(3000);
                
                const verification = await page.evaluate(() => {
                  const selectedMercuryo = Array.from(document.querySelectorAll('*')).filter(el => 
                    el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                    el.offsetWidth > 0 && 
                    (el.getAttribute('aria-selected') === 'true' || 
                     (el.className && el.className.includes('selected')))).length;
                  
                  return { selectedMercuryo };
                });
                
                console.log(`   📊 Quick verification: ${verification.selectedMercuryo} Mercuryo elements selected`);
                
                break;
              } else {
                console.log(`   ⚠️ Button "${buttonText}" didn't lead to provider page`);
              }
              
            } catch (buttonError) {
              console.log(`   ❌ Error clicking "${buttonText}": ${buttonError.message}`);
            }
          }
        }
        
      } else {
        console.log(`\n⚠️ STEP 4 SKIPPED: No wallet fields found on exchange page`);
      }
      
    } catch (error) {
      console.error(`❌ Complete flow analysis failed: ${error.message}`);
    }
    
    await browser.close();
  }
}

// Run the complete flow analysis
const analyzer = new CompleteExchangeFlowAnalysis();
analyzer.analyzeCompleteFlow().catch(error => {
  console.error('Flow analysis error:', error);
});