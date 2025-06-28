// ROBUST PROVIDER TEST - Handles all obstacles to reach provider page
const { chromium } = require('playwright');

async function robustProviderTest() {
    console.log('🛡️ ROBUST PROVIDER TEST: EUR vs USD on Mobile');
    console.log('Handling cookies, popups, and all obstacles to reach provider page');
    console.log('='.repeat(75));
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    });
    
    // Mobile context with longer timeouts
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        ignoreHTTPSErrors: true
    });
    
    const tests = [
        {
            name: 'USD → POL ($19.50) [Mobile Problem]',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            currency: 'USD',
            expected: 'Should select MoonPay on mobile'
        },
        {
            name: 'EUR → POL (€18) [Potential Solution]',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            currency: 'EUR', 
            expected: 'Testing if selects Mercuryo on mobile'
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n🧪 TESTING: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        console.log(`   Expected: ${test.expected}`);
        
        const result = await robustProviderFlow(context, test);
        results.push(result);
        
        console.log(`   FINAL: ${result.finalStatus}`);
        
        // Break between tests
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Analysis
    console.log('\n' + '='.repeat(75));
    console.log('📊 DEFINITIVE PROVIDER SELECTION RESULTS');
    console.log('='.repeat(75));
    
    let conclusive = true;
    
    results.forEach(result => {
        console.log(`\n${result.currency} (${result.name}):`);
        console.log(`   Loaded: ${result.pageLoaded ? '✅' : '❌'}`);
        console.log(`   Cookies Handled: ${result.cookiesHandled ? '✅' : 'N/A'}`);
        console.log(`   Exchange Clicked: ${result.exchangeClicked ? '✅' : '❌'}`);
        console.log(`   Provider Page: ${result.reachedProviderPage ? '✅' : '❌'}`);
        console.log(`   Provider: ${result.selectedProvider}`);
        console.log(`   Status: ${result.finalStatus}`);
        
        if (!result.reachedProviderPage) {
            conclusive = false;
        }
    });
    
    console.log(`\n🎯 TEST CONCLUSIVENESS: ${conclusive ? '✅ CONCLUSIVE' : '❌ INCONCLUSIVE'}`);
    
    if (conclusive) {
        const usdResult = results.find(r => r.currency === 'USD');
        const eurResult = results.find(r => r.currency === 'EUR');
        
        console.log('\n📊 PROVIDER COMPARISON:');
        console.log(`   USD → ${usdResult.selectedProvider}`);
        console.log(`   EUR → ${eurResult.selectedProvider}`);
        
        if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'MoonPay') {
            console.log('\n🎉 SOLUTION FOUND: EUR CURRENCY FIXES THE MOBILE ISSUE!');
            console.log('   ✅ EUR selects Mercuryo on mobile');
            console.log('   ❌ USD selects MoonPay on mobile');
            console.log('\n🚀 IMPLEMENTATION:');
            console.log('   1. Update mobile logic to use EUR currency');
            console.log('   2. Change amount from $19.50 to €18');
            console.log('   3. Keep desktop spoofing as backup');
            console.log('   4. Deploy and test on real devices');
        } else if (eurResult.selectedProvider === 'Mercuryo' && usdResult.selectedProvider === 'Mercuryo') {
            console.log('\n⚠️ BOTH WORK: Issue may be resolved');
            console.log('   ✅ Both EUR and USD select Mercuryo');
            console.log('   → Verify this on real mobile devices');
        } else if (eurResult.selectedProvider === 'MoonPay' && usdResult.selectedProvider === 'MoonPay') {
            console.log('\n❌ EUR DOES NOT FIX: Both select MoonPay');
            console.log('   → EUR currency does not solve the issue');
            console.log('   → Use desktop user agent spoofing solution');
        } else {
            console.log('\n❓ MIXED RESULTS:');
            console.log(`   → USD: ${usdResult.selectedProvider}`);
            console.log(`   → EUR: ${eurResult.selectedProvider}`);
            console.log('   → Needs manual verification');
        }
    } else {
        console.log('\n❌ TESTS FAILED: Could not reach provider pages');
        console.log('   → Manual testing required');
    }
    
    // Keep browser open for manual inspection
    console.log('\n⏳ Browser tabs kept open for manual verification...');
    console.log('Manually check the provider selection on each tab');
    console.log('Press Ctrl+C when inspection is complete\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            console.log('Manual verification completed. Closing browser...');
            resolve();
        });
    });
    
    await browser.close();
    return results;
}

async function robustProviderFlow(context, test) {
    const page = await context.newPage();
    
    let pageLoaded = false;
    let cookiesHandled = false;
    let exchangeClicked = false;
    let reachedProviderPage = false;
    let selectedProvider = 'Unknown';
    let finalStatus = '❌ FAILED';
    
    try {
        console.log(`   → Loading page with extended timeout...`);
        
        // Step 1: Load page with retries
        let loadAttempts = 0;
        const maxAttempts = 3;
        
        while (!pageLoaded && loadAttempts < maxAttempts) {
            try {
                loadAttempts++;
                console.log(`   → Attempt ${loadAttempts}: Loading ${test.url}...`);
                
                await page.goto(test.url, { 
                    timeout: 45000,
                    waitUntil: 'domcontentloaded'
                });
                
                // Wait for basic page structure
                await page.waitForTimeout(5000);
                pageLoaded = true;
                console.log(`   → ✅ Page loaded successfully`);
                
            } catch (e) {
                console.log(`   → ⚠️ Load attempt ${loadAttempts} failed: ${e.message}`);
                if (loadAttempts === maxAttempts) {
                    throw new Error('Failed to load page after all attempts');
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // Step 2: Handle cookies and popups
        console.log(`   → Handling cookies and popups...`);
        
        // Common cookie/popup selectors
        const dismissSelectors = [
            'button:has-text("Accept")',
            'button:has-text("Got it")',
            'button:has-text("OK")', 
            'button:has-text("Agree")',
            'button:has-text("Continue")',
            'button:has-text("I understand")',
            'button:has-text("Close")',
            '.cookie-accept',
            '.cookie-dismiss',
            '.popup-close',
            '[data-testid="accept"]',
            '[data-testid="dismiss"]',
            '.accept-cookies',
            '#cookie-accept'
        ];
        
        for (const selector of dismissSelectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    await element.click();
                    console.log(`   → ✅ Dismissed popup/cookie with: ${selector}`);
                    cookiesHandled = true;
                    await page.waitForTimeout(1000);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        // Step 3: Find and click Exchange button with multiple strategies
        console.log(`   → Finding Exchange button...`);
        
        // Wait for page to stabilize
        await page.waitForTimeout(3000);
        
        const exchangeStrategies = [
            // Strategy 1: Text-based selectors
            'button:has-text("Exchange")',
            'input[type="submit"][value*="Exchange"]',
            'button:has-text("Start Exchange")',
            'button:has-text("Continue")',
            'button:has-text("Proceed")',
            'button:has-text("Next")',
            
            // Strategy 2: Class-based selectors
            'button[class*="exchange"]',
            '.exchange-btn',
            '.exchange-button',
            '.btn-exchange',
            
            // Strategy 3: ID-based selectors
            '#exchange-btn',
            '#exchangeButton',
            
            // Strategy 4: Form submit buttons
            'form button[type="submit"]',
            'form input[type="submit"]',
            
            // Strategy 5: Generic action buttons
            'button[type="submit"]'
        ];
        
        for (const selector of exchangeStrategies) {
            try {
                const elements = await page.locator(selector).all();
                
                for (const element of elements) {
                    if (await element.isVisible({ timeout: 1000 })) {
                        const text = await element.textContent();
                        console.log(`   → Found potential button: "${text}" with ${selector}`);
                        
                        // Click if it looks like exchange button
                        if (!text || /exchange|continue|proceed|next|start/i.test(text)) {
                            console.log(`   → ✅ Clicking Exchange button...`);
                            await element.click();
                            exchangeClicked = true;
                            break;
                        }
                    }
                }
                
                if (exchangeClicked) break;
                
            } catch (e) {
                continue;
            }
        }
        
        if (!exchangeClicked) {
            console.log(`   → ❌ Exchange button not found with any strategy`);
            throw new Error('Exchange button not found');
        }
        
        // Step 4: Wait for provider selection page
        console.log(`   → Waiting for provider selection page...`);
        
        // Wait for navigation and page load
        await page.waitForTimeout(3000);
        
        try {
            await page.waitForLoadState('networkidle', { timeout: 30000 });
        } catch (e) {
            console.log(`   → ⚠️ Network idle timeout, continuing...`);
        }
        
        // Additional wait for provider selection logic
        await page.waitForTimeout(7000);
        
        // Step 5: Analyze provider selection
        console.log(`   → Analyzing provider selection...`);
        
        const currentUrl = page.url();
        console.log(`   → Current URL: ${currentUrl}`);
        
        // Get all page content for analysis
        const pageContent = await page.content();
        const visibleText = await page.textContent('body');
        const pageTitle = await page.title();
        
        console.log(`   → Page title: ${pageTitle}`);
        
        // Check if we reached a provider/payment page
        const providerIndicators = [
            /provider/i, /payment/i, /checkout/i, /fiat/i, 
            /mercuryo/i, /moonpay/i, /purchase/i, /buy/i,
            /credit.card/i, /debit.card/i
        ];
        
        const hasProviderIndicators = providerIndicators.some(pattern => 
            pattern.test(pageContent) || pattern.test(visibleText) || pattern.test(pageTitle)
        );
        
        if (hasProviderIndicators || currentUrl !== test.url) {
            reachedProviderPage = true;
            console.log(`   → ✅ Reached provider/payment page`);
            
            // Analyze provider selection
            const hasMercuryo = /mercuryo/i.test(pageContent) || /mercuryo/i.test(visibleText);
            const hasMoonPay = /moonpay/i.test(pageContent) || /moonpay/i.test(visibleText);
            
            if (hasMercuryo && !hasMoonPay) {
                selectedProvider = 'Mercuryo';
                finalStatus = '✅ SUCCESS - Mercuryo Selected';
                console.log(`   → 🎯 MERCURYO SELECTED!`);
            } else if (!hasMercuryo && hasMoonPay) {
                selectedProvider = 'MoonPay';
                finalStatus = '❌ ISSUE - MoonPay Selected';
                console.log(`   → ⚠️ MoonPay selected (the mobile issue)`);
            } else if (hasMercuryo && hasMoonPay) {
                selectedProvider = 'Both Available';
                finalStatus = '⚠️ BOTH - Multiple Providers';
                console.log(`   → 📋 Both providers available`);
            } else {
                selectedProvider = 'Provider Page';
                finalStatus = '❓ UNCLEAR - Provider Page Reached';
                console.log(`   → 🤔 Provider page reached but selection unclear`);
            }
        } else {
            console.log(`   → ❌ Did not reach provider page`);
            finalStatus = '❌ NO PROVIDER PAGE';
        }
        
    } catch (error) {
        console.log(`   → ❌ Error in flow: ${error.message}`);
        finalStatus = '❌ ERROR';
        selectedProvider = 'Error';
    }
    
    // Don't close page - keep for manual inspection
    console.log(`   → Keeping tab open for manual verification`);
    
    return {
        name: test.name,
        currency: test.currency,
        url: test.url,
        pageLoaded: pageLoaded,
        cookiesHandled: cookiesHandled,
        exchangeClicked: exchangeClicked,
        reachedProviderPage: reachedProviderPage,
        selectedProvider: selectedProvider,
        finalStatus: finalStatus,
        currentUrl: page.url()
    };
}

// Run the robust test
robustProviderTest().catch(console.error);