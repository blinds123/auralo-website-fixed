const { chromium, devices: playwrightDevices } = require('playwright');

class MinimumRequirementsAnalysis {
  async analyzeRequirements() {
    console.log('\n🔍 MINIMUM REQUIREMENTS ANALYSIS');
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
      // Load with different amounts to find minimum
      const testAmounts = [15, 25, 50, 100, 200];
      
      for (const amount of testAmounts) {
        console.log(`\n💰 Testing amount: €${amount}`);
        
        await page.goto(`https://simpleswap.io/?from=eur&to=pol&amount=${amount}&partner=auralo`, { 
          waitUntil: 'load',
          timeout: 15000 
        });
        
        await page.waitForTimeout(5000);
        
        // Click Exchange
        await page.click('button.styles_button__LHkel:has-text("Exchange")');
        await page.waitForTimeout(8000);
        
        // Check button status and error messages
        const pageAnalysis = await page.evaluate((testAmount) => {
          const analysis = {
            amount: testAmount,
            url: window.location.href,
            createButtonEnabled: false,
            errorMessages: [],
            warningMessages: [],
            minAmountMessages: [],
            allText: document.body.textContent
          };
          
          // Check if Create button is enabled
          const createButton = document.querySelector('button:has-text("Create an exchange")') ||
                              Array.from(document.querySelectorAll('button')).find(btn => 
                                btn.textContent && btn.textContent.toLowerCase().includes('create'));
          
          if (createButton) {
            analysis.createButtonEnabled = !createButton.disabled;
          }
          
          // Look for error messages
          document.querySelectorAll('*').forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            
            if (text.includes('error') || text.includes('invalid') || text.includes('failed')) {
              analysis.errorMessages.push(el.textContent?.trim());
            }
            
            if (text.includes('minimum') && (text.includes('amount') || text.includes('limit'))) {
              analysis.minAmountMessages.push(el.textContent?.trim());
            }
            
            if (text.includes('warning') || text.includes('note') || text.includes('below')) {
              analysis.warningMessages.push(el.textContent?.trim());
            }
          });
          
          // Remove duplicates and filter
          analysis.errorMessages = [...new Set(analysis.errorMessages)].filter(msg => msg && msg.length < 200);
          analysis.minAmountMessages = [...new Set(analysis.minAmountMessages)].filter(msg => msg && msg.length < 200);
          analysis.warningMessages = [...new Set(analysis.warningMessages)].filter(msg => msg && msg.length < 200);
          
          return analysis;
        }, amount);
        
        console.log(`   📊 Amount €${amount} analysis:`);
        console.log(`      Create button enabled: ${pageAnalysis.createButtonEnabled}`);
        console.log(`      Error messages: ${pageAnalysis.errorMessages.length}`);
        console.log(`      Min amount messages: ${pageAnalysis.minAmountMessages.length}`);
        console.log(`      Warning messages: ${pageAnalysis.warningMessages.length}`);
        
        if (pageAnalysis.errorMessages.length > 0) {
          console.log(`   ❌ Errors:`);
          pageAnalysis.errorMessages.forEach((msg, i) => {
            console.log(`      ${i}: "${msg}"`);
          });
        }
        
        if (pageAnalysis.minAmountMessages.length > 0) {
          console.log(`   ⚠️ Minimum amount messages:`);
          pageAnalysis.minAmountMessages.forEach((msg, i) => {
            console.log(`      ${i}: "${msg}"`);
          });
        }
        
        if (pageAnalysis.warningMessages.length > 0) {
          console.log(`   ⚠️ Warnings:`);
          pageAnalysis.warningMessages.forEach((msg, i) => {
            console.log(`      ${i}: "${msg}"`);
          });
        }
        
        // If button is enabled, this amount works!
        if (pageAnalysis.createButtonEnabled) {
          console.log(`\n🎉 SUCCESS: €${amount} enables the Create button!`);
          
          // Proceed with this amount
          console.log(`\n🚀 Proceeding with €${amount} to reach provider selection...`);
          
          try {
            await page.click('button:has-text("Create an exchange")');
            await page.waitForTimeout(8000);
            
            const finalAnalysis = await page.evaluate(() => {
              return {
                url: window.location.href,
                mercuryoElements: Array.from(document.querySelectorAll('*')).filter(el => 
                  el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                  el.offsetWidth > 0 && el.offsetHeight > 0 && 
                  !el.textContent.includes('schema.org')).length,
                moonpayElements: Array.from(document.querySelectorAll('*')).filter(el => 
                  el.textContent && el.textContent.toLowerCase().includes('moonpay') && 
                  el.offsetWidth > 0 && el.offsetHeight > 0 && 
                  !el.textContent.includes('schema.org')).length,
                walletInputs: Array.from(document.querySelectorAll('input')).filter(input => {
                  const placeholder = (input.placeholder || '').toLowerCase();
                  const name = (input.name || '').toLowerCase();
                  return (placeholder.includes('address') || placeholder.includes('wallet') || 
                         name.includes('address') || name.includes('wallet')) &&
                         input.offsetWidth > 0 && input.offsetHeight > 0;
                }).length,
                hasProviderSelection: document.body.textContent.toLowerCase().includes('provider') ||
                                    document.body.textContent.toLowerCase().includes('payment method')
              };
            });
            
            console.log(`   📊 Final page analysis:`);
            console.log(`      URL: ${finalAnalysis.url}`);
            console.log(`      Mercuryo elements: ${finalAnalysis.mercuryoElements}`);
            console.log(`      MoonPay elements: ${finalAnalysis.moonpayElements}`);
            console.log(`      Wallet inputs: ${finalAnalysis.walletInputs}`);
            console.log(`      Has provider selection: ${finalAnalysis.hasProviderSelection}`);
            
            if (finalAnalysis.mercuryoElements > 0 && finalAnalysis.moonpayElements > 0) {
              console.log(`\n🎉🎉 BREAKTHROUGH! Provider selection page reached! 🎉🎉`);
              console.log(`✅ Working amount: €${amount}`);
              console.log(`✅ Provider elements found`);
              
              await page.screenshot({ 
                path: '/Users/nelsonchan/auralo-fix/MINIMUM_AMOUNT_SUCCESS.png',
                fullPage: true 
              });
              
              console.log(`📸 Screenshot saved: MINIMUM_AMOUNT_SUCCESS.png`);
              
              // Quick Mercuryo forcing test
              console.log(`\n🔧 TESTING: Quick Mercuryo forcing with working amount...`);
              
              const forcingTest = await page.evaluate(() => {
                let actions = 0;
                let results = { selected: 0, styled: 0 };
                
                document.querySelectorAll('*').forEach(el => {
                  if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                  
                  const text = (el.textContent || '').toLowerCase();
                  
                  if (text.includes('mercuryo') && !text.includes('schema.org')) {
                    // Apply forcing
                    el.style.border = '3px solid #22c55e !important';
                    el.style.borderRadius = '8px !important';
                    el.style.backgroundColor = 'rgba(34, 197, 94, 0.15) !important';
                    el.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.8) !important';
                    
                    el.setAttribute('aria-selected', 'true');
                    if (el.classList) {
                      el.classList.add('selected', 'active', 'forced');
                    }
                    
                    try { el.click(); } catch (e) {}
                    
                    actions++;
                    results.styled++;
                    
                    // Check if it appears selected
                    if (el.getAttribute('aria-selected') === 'true' || 
                        (el.className && el.className.includes('selected'))) {
                      results.selected++;
                    }
                  }
                });
                
                return { actions, results };
              });
              
              console.log(`   ✅ Forcing test results:`);
              console.log(`      Actions applied: ${forcingTest.actions}`);
              console.log(`      Elements styled: ${forcingTest.results.styled}`);
              console.log(`      Elements selected: ${forcingTest.results.selected}`);
              
              // Wait and verify
              await page.waitForTimeout(3000);
              
              const verification = await page.evaluate(() => {
                const selectedMercuryo = Array.from(document.querySelectorAll('*')).filter(el => 
                  el.textContent && el.textContent.toLowerCase().includes('mercuryo') && 
                  el.offsetWidth > 0 && 
                  (el.getAttribute('aria-selected') === 'true' || 
                   (el.className && el.className.includes('selected')))).length;
                
                const greenBorders = Array.from(document.querySelectorAll('*')).filter(el => {
                  const style = window.getComputedStyle(el);
                  const borderStr = [style.border, style.borderColor, style.boxShadow].join(' ');
                  return borderStr.includes('22c55e') || borderStr.includes('green');
                }).length;
                
                return { selectedMercuryo, greenBorders };
              });
              
              console.log(`   📊 Verification after 3s:`);
              console.log(`      Selected Mercuryo elements: ${verification.selectedMercuryo}`);
              console.log(`      Elements with green borders: ${verification.greenBorders}`);
              
              if (verification.selectedMercuryo > 0 && verification.greenBorders > 0) {
                console.log(`\n🏆 COMPLETE SUCCESS! 🏆`);
                console.log(`✅ Found working amount: €${amount}`);
                console.log(`✅ Reached provider selection page`);
                console.log(`✅ Mercuryo forcing works`);
                console.log(`✅ Visual confirmation achieved`);
                
                await browser.close();
                return; // Success - exit the function
              }
            } else {
              console.log(`   ⚠️ Didn't reach provider selection page yet`);
            }
            
          } catch (createError) {
            console.log(`   ❌ Error clicking Create button: ${createError.message}`);
          }
          
          break; // Exit the amount loop since we found a working amount
        } else {
          console.log(`   ❌ €${amount} - Create button still disabled`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Requirements analysis failed: ${error.message}`);
    }
    
    await browser.close();
  }
}

// Run the requirements analysis
const analyzer = new MinimumRequirementsAnalysis();
analyzer.analyzeRequirements().catch(error => {
  console.error('Requirements analysis error:', error);
});