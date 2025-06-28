// CORRECT PROVIDER TEST - Goes to actual provider selection page
const { chromium } = require('playwright');

async function correctProviderTest() {
    console.log('🎯 CORRECT PROVIDER TEST: EUR vs USD on Mobile');
    console.log('Testing AFTER clicking Exchange button to reach provider selection page');
    console.log('='.repeat(70));
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Test mobile simulation
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const tests = [
        {
            name: 'USD → POL ($19.50)',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            currency: 'USD',
            expected: 'Should show MoonPay on mobile (the problem)'
        },
        {
            name: 'EUR → POL (€18)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            currency: 'EUR',
            expected: 'Testing if shows Mercuryo on mobile (potential solution)'
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n📱 TESTING: ${test.name}`);
        console.log(`   Currency: ${test.currency}`);
        console.log(`   Expected: ${test.expected}`);
        
        const result = await testFullProviderFlow(context, test);
        results.push(result);
        
        console.log(`   FINAL RESULT: ${result.finalStatus} - ${result.selectedProvider}`);
        
        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Analysis
    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL PROVIDER SELECTION RESULTS');
    console.log('='.repeat(70));
    
    results.forEach(result => {
        console.log(`\n${result.currency} Test:`);
        console.log(`   URL: ${result.url}`);
        console.log(`   Exchange Button: ${result.exchangeButtonFound ? '✅ Found' : '❌ Not Found'}`);
        console.log(`   Provider Page: ${result.reachedProviderPage ? '✅ Reached' : '❌ Not Reached'}`);
        console.log(`   Selected Provider: ${result.selectedProvider}`);
        console.log(`   Status: ${result.finalStatus}`);
    });
    
    // Determine solution
    console.log('\n🎯 SOLUTION ANALYSIS:');
    
    const usdResult = results.find(r => r.currency === 'USD');
    const eurResult = results.find(r => r.currency === 'EUR');
    
    if (usdResult && eurResult && 
        usdResult.reachedProviderPage && eurResult.reachedProviderPage) {
        
        console.log(`\nMobile Provider Selection Results:`);
        console.log(`   USD → ${usdResult.selectedProvider}`);
        console.log(`   EUR → ${eurResult.selectedProvider}`);
        
        if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'MoonPay') {
            console.log('\n✅ SOLUTION CONFIRMED: EUR CURRENCY FIXES THE ISSUE');
            console.log('   → EUR selects Mercuryo on mobile ✅');
            console.log('   → USD selects MoonPay on mobile ❌');
            console.log('   → IMPLEMENT: Switch to EUR currency for mobile users');
        } else if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'Mercuryo') {
            console.log('\n⚠️ BOTH WORK: Both EUR and USD select Mercuryo');
            console.log('   → Issue may have been resolved by SimpleSwap');
            console.log('   → Verify on real devices to confirm');
        } else if (eurResult.selectedProvider === 'MoonPay' && usdResult.selectedProvider === 'MoonPay') {
            console.log('\n❌ EUR DOES NOT SOLVE: Both select MoonPay on mobile');
            console.log('   → EUR currency does not fix the mobile issue');
            console.log('   → IMPLEMENT: Desktop user agent spoofing solution');
        } else {
            console.log('\n❓ MIXED RESULTS: Need further investigation');
            console.log(`   → USD: ${usdResult.selectedProvider}`);
            console.log(`   → EUR: ${eurResult.selectedProvider}`);
        }
    } else {
        console.log('\n❌ TESTS INCOMPLETE: Could not reach provider selection page');
        console.log('   → Manual testing required on real devices');
    }
    
    console.log('\n📋 NEXT STEPS:');
    if (eurResult && eurResult.selectedProvider === 'Mercuryo') {
        console.log('   1. ✅ Update production to use EUR currency on mobile');
        console.log('   2. ✅ Set amount to €18 for mobile users');
        console.log('   3. ✅ Keep desktop spoofing as fallback');
        console.log('   4. ✅ Test on real iOS and Android devices');
    } else {
        console.log('   1. ❌ EUR approach did not work');
        console.log('   2. ✅ Continue with desktop user agent spoofing');
        console.log('   3. ✅ Verify spoofing works on real devices');
        console.log('   4. ✅ Monitor for SimpleSwap algorithm changes');
    }
    
    // Keep browser open for manual inspection
    console.log('\n⏳ Browser kept open for manual verification...');
    console.log('Check the open tabs to see the actual provider selection pages');
    console.log('Press Ctrl+C when done inspecting\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            console.log('Test completed. Closing browser...');
            resolve();
        });
    });
    
    await browser.close();
    return results;
}

async function testFullProviderFlow(context, test) {
    const page = await context.newPage();
    
    try {
        console.log(`   → Step 1: Opening SimpleSwap URL...`);
        await page.goto(test.url, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 20000 });
        
        console.log(`   → Step 2: Looking for Exchange button...`);
        
        let exchangeButtonFound = false;
        let reachedProviderPage = false;
        let selectedProvider = 'Unknown';
        
        // Multiple strategies to find exchange button
        const exchangeSelectors = [
            'button:has-text("Exchange")',
            'input[type="submit"][value*="Exchange"]',
            'button[class*="exchange"]',
            '.exchange-btn',
            '.exchange-button',
            'button:has-text("Continue")',
            'button:has-text("Proceed")',
            'button:has-text("Start")',
            '[data-testid*="exchange"]',
            'button[type="submit"]'
        ];
        
        for (const selector of exchangeSelectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`   → Step 3: Found Exchange button with selector: ${selector}`);
                    await element.click();
                    exchangeButtonFound = true;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!exchangeButtonFound) {
            // Try finding by text content
            const buttons = await page.locator('button, input[type="submit"]').all();
            for (const button of buttons) {
                try {
                    const text = await button.textContent();
                    if (text && /exchange|continue|proceed|start|next/i.test(text)) {
                        console.log(`   → Step 3: Found button by text: "${text}"`);
                        await button.click();
                        exchangeButtonFound = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (exchangeButtonFound) {
            console.log(`   → Step 4: Exchange clicked! Waiting for provider selection page...`);
            
            // Wait for navigation to provider selection page
            await page.waitForLoadState('networkidle', { timeout: 20000 });
            await page.waitForTimeout(5000); // Extra time for provider selection logic
            
            console.log(`   → Step 5: Analyzing provider selection page...`);
            
            // Check current URL to see if we reached provider page
            const currentUrl = page.url();
            console.log(`   → Current URL: ${currentUrl}`);
            
            // Get page content and analyze for providers
            const pageContent = await page.content();
            const visibleText = await page.textContent('body');
            
            // Look for provider selection indicators
            const hasMercuryo = /mercuryo/i.test(pageContent) || /mercuryo/i.test(visibleText);
            const hasMoonPay = /moonpay/i.test(pageContent) || /moonpay/i.test(visibleText);
            
            // Look for more specific provider selection indicators
            const hasProviderSelection = /provider|payment|checkout|fiat/i.test(pageContent) || 
                                       /provider|payment|checkout|fiat/i.test(visibleText);
            
            if (hasProviderSelection || hasMercuryo || hasMoonPay) {
                reachedProviderPage = true;
                console.log(`   → Step 6: ✅ Reached provider selection page`);
                
                // Determine selected provider
                if (hasMercuryo && !hasMoonPay) {
                    selectedProvider = 'Mercuryo';
                    console.log(`   → Provider: ✅ Mercuryo selected`);
                } else if (!hasMercuryo && hasMoonPay) {
                    selectedProvider = 'MoonPay';
                    console.log(`   → Provider: ❌ MoonPay selected`);
                } else if (hasMercuryo && hasMoonPay) {
                    selectedProvider = 'Both Available';
                    console.log(`   → Provider: ⚠️ Both providers available`);
                } else {
                    selectedProvider = 'Provider Page Reached';
                    console.log(`   → Provider: ❓ Provider page reached but unclear selection`);
                }
            } else {
                console.log(`   → Step 6: ❌ Did not reach provider selection page`);
                selectedProvider = 'Page Not Reached';
            }
            
        } else {
            console.log(`   → Step 3: ❌ Exchange button not found`);
        }
        
        const finalStatus = reachedProviderPage ? 
            (selectedProvider === 'Mercuryo' ? '✅ SUCCESS - Mercuryo' :
             selectedProvider === 'MoonPay' ? '❌ ISSUE - MoonPay' :
             selectedProvider === 'Both Available' ? '⚠️ BOTH AVAILABLE' :
             '❓ UNCLEAR') :
            (exchangeButtonFound ? '❌ NO PROVIDER PAGE' : '❌ NO EXCHANGE BUTTON');
        
        return {
            currency: test.currency,
            url: test.url,
            exchangeButtonFound: exchangeButtonFound,
            reachedProviderPage: reachedProviderPage,
            selectedProvider: selectedProvider,
            finalStatus: finalStatus,
            currentUrl: page.url()
        };
        
    } catch (error) {
        console.log(`   → ❌ Error: ${error.message}`);
        return {
            currency: test.currency,
            url: test.url,
            exchangeButtonFound: false,
            reachedProviderPage: false,
            selectedProvider: 'Error',
            finalStatus: '❌ ERROR',
            error: error.message
        };
    } finally {
        // Don't close page immediately - keep it open for inspection
        console.log(`   → Keeping ${test.currency} tab open for manual inspection`);
    }
}

// Run the correct test
correctProviderTest().catch(console.error);