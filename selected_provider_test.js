// SELECTED PROVIDER TEST - Determines which provider is actually selected/default
const { chromium } = require('playwright');

async function selectedProviderTest() {
    console.log('🎯 SELECTED PROVIDER TEST: Which provider is DEFAULT selected?');
    console.log('Analyzing which provider is pre-selected on mobile');
    console.log('='.repeat(70));
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const tests = [
        {
            name: 'USD Test',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            currency: 'USD'
        },
        {
            name: 'EUR Test', 
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            currency: 'EUR'
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n🧪 TESTING: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        
        const result = await analyzeSelectedProvider(context, test);
        results.push(result);
        
        console.log(`   SELECTED PROVIDER: ${result.selectedProvider}`);
        console.log(`   STATUS: ${result.status}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Final analysis
    console.log('\n' + '='.repeat(70));
    console.log('📊 DEFAULT PROVIDER SELECTION ANALYSIS');
    console.log('='.repeat(70));
    
    const usdResult = results.find(r => r.currency === 'USD');
    const eurResult = results.find(r => r.currency === 'EUR');
    
    console.log(`\nMobile Default Provider Selection:`);
    console.log(`   USD ($19.50) → ${usdResult.selectedProvider}`);
    console.log(`   EUR (€18.00) → ${eurResult.selectedProvider}`);
    
    console.log('\n🎯 FINAL DETERMINATION:');
    
    if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'MoonPay') {
        console.log('🎉 EUREKA! EUR CURRENCY SOLVES THE MOBILE ISSUE!');
        console.log('   ✅ EUR defaults to Mercuryo on mobile');
        console.log('   ❌ USD defaults to MoonPay on mobile');
        console.log('\n🚀 SOLUTION CONFIRMED:');
        console.log('   1. Change mobile currency from USD to EUR');
        console.log('   2. Update amount from $19.50 to €18');
        console.log('   3. Deploy EUR solution to production');
        console.log('   4. Keep desktop spoofing as backup');
        
    } else if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'Mercuryo') {
        console.log('✅ BOTH WORK: Issue may have been fixed by SimpleSwap');
        console.log('   → Both currencies now default to Mercuryo');
        console.log('   → Verify on real devices to confirm');
        
    } else if (eurResult.selectedProvider === 'MoonPay' && usdResult.selectedProvider === 'MoonPay') {
        console.log('❌ CURRENCY SWITCH DOES NOT SOLVE');
        console.log('   → Both EUR and USD default to MoonPay on mobile');
        console.log('   → Continue with desktop user agent spoofing solution');
        
    } else {
        console.log('❓ UNCLEAR RESULTS:');
        console.log(`   → USD defaults to: ${usdResult.selectedProvider}`);
        console.log(`   → EUR defaults to: ${eurResult.selectedProvider}`);
        console.log('   → Manual verification needed');
    }
    
    console.log('\n📋 IMPLEMENTATION DECISION:');
    if (eurResult.selectedProvider === 'Mercuryo') {
        console.log('   🎯 IMPLEMENT EUR CURRENCY SOLUTION');
        console.log('   → Update openSimpleSwapWithMercuryoTrigger to use EUR on mobile');
        console.log('   → Change from $19.50 to €18 for mobile users');
        console.log('   → Test on real devices');
    } else {
        console.log('   🎯 IMPLEMENT DESKTOP USER AGENT SPOOFING');
        console.log('   → Keep current implementation with desktop spoofing');
        console.log('   → EUR currency does not provide benefit');
    }
    
    // Keep browser open for manual verification
    console.log('\n⏳ Browser tabs open for manual verification of selection...');
    console.log('Check which provider is visually selected/highlighted in each tab');
    console.log('Press Ctrl+C when verification complete\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            console.log('Verification complete. Closing browser...');
            resolve();
        });
    });
    
    await browser.close();
    return results;
}

async function analyzeSelectedProvider(context, test) {
    const page = await context.newPage();
    
    try {
        // Load page
        await page.goto(test.url, { timeout: 30000, waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);
        
        // Click exchange button
        const exchangeButton = page.locator('button:has-text("Exchange")').first();
        if (await exchangeButton.isVisible({ timeout: 10000 })) {
            await exchangeButton.click();
            await page.waitForTimeout(8000); // Wait for provider selection logic
        }
        
        // Analyze the page for selected provider
        const analysis = await page.evaluate(() => {
            const content = document.body.innerHTML.toLowerCase();
            const text = document.body.innerText.toLowerCase();
            
            // Look for selection indicators
            const mercuryoSelectors = [
                '.selected:has-text("mercuryo")',
                '.active:has-text("mercuryo")', 
                '.checked:has-text("mercuryo")',
                'input[checked]:has-text("mercuryo")',
                'input[selected]:has-text("mercuryo")',
                '.highlight:has-text("mercuryo")',
                '.default:has-text("mercuryo")'
            ];
            
            const moonpaySelectors = [
                '.selected:has-text("moonpay")',
                '.active:has-text("moonpay")',
                '.checked:has-text("moonpay")',
                'input[checked]:has-text("moonpay")',
                'input[selected]:has-text("moonpay")',
                '.highlight:has-text("moonpay")',
                '.default:has-text("moonpay")'
            ];
            
            // Check for visual selection indicators
            let mercuryoSelected = false;
            let moonpaySelected = false;
            
            // Method 1: Look for selected/active classes
            mercuryoSelectors.forEach(selector => {
                try {
                    if (document.querySelector(selector)) {
                        mercuryoSelected = true;
                    }
                } catch (e) {}
            });
            
            moonpaySelectors.forEach(selector => {
                try {
                    if (document.querySelector(selector)) {
                        moonpaySelected = true;
                    }
                } catch (e) {}
            });
            
            // Method 2: Look for checked radio buttons or form elements
            const radioButtons = document.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                if (radio.checked) {
                    const label = radio.nextElementSibling || radio.previousElementSibling;
                    const labelText = label ? label.innerText.toLowerCase() : '';
                    const radioValue = radio.value.toLowerCase();
                    
                    if (labelText.includes('mercuryo') || radioValue.includes('mercuryo')) {
                        mercuryoSelected = true;
                    }
                    if (labelText.includes('moonpay') || radioValue.includes('moonpay')) {
                        moonpaySelected = true;
                    }
                }
            });
            
            // Method 3: Look for prominent positioning or default appearance
            const mercuryoElements = document.querySelectorAll('*');
            const moonpayElements = document.querySelectorAll('*');
            
            let mercuryoProminent = false;
            let moonpayProminent = false;
            
            Array.from(mercuryoElements).forEach(el => {
                if (el.innerText && el.innerText.toLowerCase().includes('mercuryo')) {
                    const styles = window.getComputedStyle(el);
                    if (styles.fontWeight === 'bold' || 
                        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                        el.classList.contains('selected') ||
                        el.classList.contains('active') ||
                        el.classList.contains('default')) {
                        mercuryoProminent = true;
                    }
                }
            });
            
            Array.from(moonpayElements).forEach(el => {
                if (el.innerText && el.innerText.toLowerCase().includes('moonpay')) {
                    const styles = window.getComputedStyle(el);
                    if (styles.fontWeight === 'bold' || 
                        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                        el.classList.contains('selected') ||
                        el.classList.contains('active') ||
                        el.classList.contains('default')) {
                        moonpayProminent = true;
                    }
                }
            });
            
            // Method 4: Look for order/positioning clues
            const bodyText = document.body.innerText.toLowerCase();
            const mercuryoIndex = bodyText.indexOf('mercuryo');
            const moonpayIndex = bodyText.indexOf('moonpay');
            
            return {
                hasMercuryo: content.includes('mercuryo'),
                hasMoonPay: content.includes('moonpay'),
                mercuryoSelected: mercuryoSelected,
                moonpaySelected: moonpaySelected,
                mercuryoProminent: mercuryoProminent,
                moonpayProminent: moonpayProminent,
                mercuryoFirst: mercuryoIndex !== -1 && (moonpayIndex === -1 || mercuryoIndex < moonpayIndex),
                pageUrl: window.location.href,
                pageTitle: document.title
            };
        });
        
        // Determine selected provider
        let selectedProvider = 'Unknown';
        let status = '❓ UNCLEAR';
        
        if (analysis.mercuryoSelected && !analysis.moonpaySelected) {
            selectedProvider = 'Mercuryo';
            status = '✅ MERCURYO SELECTED';
        } else if (analysis.moonpaySelected && !analysis.mercuryoSelected) {
            selectedProvider = 'MoonPay';
            status = '❌ MOONPAY SELECTED';
        } else if (analysis.mercuryoProminent && !analysis.moonpayProminent) {
            selectedProvider = 'Mercuryo (Prominent)';
            status = '✅ MERCURYO PROMINENT';
        } else if (analysis.moonpayProminent && !analysis.mercuryoProminent) {
            selectedProvider = 'MoonPay (Prominent)';
            status = '❌ MOONPAY PROMINENT';
        } else if (analysis.mercuryoFirst && analysis.hasMercuryo) {
            selectedProvider = 'Mercuryo (First)';
            status = '⚠️ MERCURYO FIRST';
        } else if (!analysis.mercuryoFirst && analysis.hasMoonPay) {
            selectedProvider = 'MoonPay (First)';
            status = '⚠️ MOONPAY FIRST';
        } else if (analysis.hasMercuryo && analysis.hasMoonPay) {
            selectedProvider = 'Both Available';
            status = '⚠️ BOTH AVAILABLE';
        } else if (analysis.hasMercuryo) {
            selectedProvider = 'Mercuryo Only';
            status = '✅ MERCURYO ONLY';
        } else if (analysis.hasMoonPay) {
            selectedProvider = 'MoonPay Only';
            status = '❌ MOONPAY ONLY';
        }
        
        console.log(`   → Analysis: Mercuryo ${analysis.hasMercuryo ? '✓' : '✗'}, MoonPay ${analysis.hasMoonPay ? '✓' : '✗'}`);
        console.log(`   → Selected: Mercuryo ${analysis.mercuryoSelected ? '✓' : '✗'}, MoonPay ${analysis.moonpaySelected ? '✓' : '✗'}`);
        console.log(`   → Prominent: Mercuryo ${analysis.mercuryoProminent ? '✓' : '✗'}, MoonPay ${analysis.moonpayProminent ? '✓' : '✗'}`);
        
        return {
            currency: test.currency,
            url: test.url,
            selectedProvider: selectedProvider,
            status: status,
            analysis: analysis
        };
        
    } catch (error) {
        console.log(`   → Error: ${error.message}`);
        return {
            currency: test.currency,
            url: test.url,
            selectedProvider: 'Error',
            status: '❌ ERROR',
            error: error.message
        };
    }
    
    // Keep page open for manual inspection
}

// Run the selected provider test
selectedProviderTest().catch(console.error);