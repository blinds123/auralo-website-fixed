// Direct EUR vs USD comparison test
const { chromium } = require('playwright');

async function directEURvsUSDTest() {
    console.log('🧪 DIRECT EUR vs USD PROVIDER COMPARISON TEST\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const testResults = [];
    
    // Mobile device simulation
    const mobileContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    console.log('📱 MOBILE DEVICE TESTING');
    console.log('=====================================\n');
    
    // Test 1: USD approach (current problematic one)
    console.log('🧪 Test 1: USD → POL ($19.50) [Current Implementation]');
    await testSingleURL(
        mobileContext, 
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
        'USD-Mobile',
        testResults
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: EUR approach (potential solution)
    console.log('🧪 Test 2: EUR → POL (€18) [Potential Solution]');
    await testSingleURL(
        mobileContext,
        'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
        'EUR-Mobile',
        testResults
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 3: EUR different amount
    console.log('🧪 Test 3: EUR → POL (€19) [Alternative Amount]');
    await testSingleURL(
        mobileContext,
        'https://simpleswap.io/?from=eur&to=pol&amount=19&partner=auralo',
        'EUR19-Mobile',
        testResults
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 4: GBP approach (additional test)
    console.log('🧪 Test 4: GBP → POL (£15) [Alternative Currency]');
    await testSingleURL(
        mobileContext,
        'https://simpleswap.io/?from=gbp&to=pol&amount=15&partner=auralo',
        'GBP-Mobile',
        testResults
    );
    
    await mobileContext.close();
    
    // Desktop comparison
    const desktopContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1280, height: 720 }
    });
    
    console.log('\n🖥️ DESKTOP DEVICE TESTING (For Comparison)');
    console.log('=====================================\n');
    
    // Test 5: USD on desktop (should work fine)
    console.log('🧪 Test 5: USD → POL ($19.50) [Desktop Control]');
    await testSingleURL(
        desktopContext,
        'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
        'USD-Desktop',
        testResults
    );
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 6: EUR on desktop
    console.log('🧪 Test 6: EUR → POL (€18) [Desktop EUR Test]');
    await testSingleURL(
        desktopContext,
        'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
        'EUR-Desktop',
        testResults
    );
    
    await desktopContext.close();
    await browser.close();
    
    // Analysis
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS ANALYSIS');
    console.log('='.repeat(80));
    
    analyzeProviderResults(testResults);
    
    return testResults;
}

async function testSingleURL(context, url, testName, results) {
    const page = await context.newPage();
    
    try {
        console.log(`   → Opening: ${url}`);
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // Wait for page to stabilize
        await page.waitForTimeout(2000);
        
        // Look for exchange button
        console.log('   → Looking for exchange button...');
        let exchangeButton = null;
        
        // Multiple strategies to find exchange button
        const selectors = [
            'button:has-text("Exchange")',
            'input[type="submit"][value*="Exchange"]',
            'button[class*="exchange"]',
            '.exchange-btn',
            'button:has-text("Continue")',
            'button:has-text("Proceed")'
        ];
        
        for (const selector of selectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible({ timeout: 2000 })) {
                    exchangeButton = element;
                    console.log(`   → Found exchange button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!exchangeButton) {
            // Try to find any button that looks like exchange
            const buttons = await page.locator('button, input[type="submit"]').all();
            for (const button of buttons) {
                const text = await button.textContent();
                if (text && /exchange|continue|proceed|next/i.test(text)) {
                    exchangeButton = button;
                    console.log(`   → Found exchange button by text: "${text}"`);
                    break;
                }
            }
        }
        
        if (exchangeButton) {
            console.log('   → Clicking exchange button...');
            await exchangeButton.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(4000); // Give extra time for provider selection
            
            // Check for providers
            const pageContent = await page.content();
            const hasMercuryo = /mercuryo/i.test(pageContent);
            const hasMoonPay = /moonpay/i.test(pageContent);
            
            let provider;
            let status;
            
            if (hasMercuryo && !hasMoonPay) {
                provider = 'Mercuryo';
                status = '✅ SUCCESS';
            } else if (!hasMercuryo && hasMoonPay) {
                provider = 'MoonPay';
                status = testName.includes('Mobile') ? '❌ ISSUE' : '⚠️ CHECK';
            } else if (hasMercuryo && hasMoonPay) {
                provider = 'Both Available';
                status = '⚠️ MIXED';
            } else {
                provider = 'Unknown';
                status = '❓ UNCLEAR';
            }
            
            console.log(`   → Result: ${status} - ${provider} selected`);
            
            results.push({
                test: testName,
                url: url,
                provider: provider,
                status: status,
                success: status.includes('SUCCESS')
            });
            
        } else {
            console.log('   → ❌ Exchange button not found');
            results.push({
                test: testName,
                url: url,
                provider: 'N/A',
                status: '❌ NO BUTTON',
                success: false
            });
        }
        
    } catch (error) {
        console.log(`   → ❌ Error: ${error.message}`);
        results.push({
            test: testName,
            url: url,
            provider: 'N/A',
            status: '❌ ERROR',
            success: false,
            error: error.message
        });
    } finally {
        await page.close();
    }
}

function analyzeProviderResults(results) {
    console.log('\n📋 DETAILED RESULTS:');
    results.forEach(result => {
        console.log(`   ${result.status} ${result.test}: ${result.provider}`);
    });
    
    const mobileResults = results.filter(r => r.test.includes('Mobile'));
    const desktopResults = results.filter(r => r.test.includes('Desktop'));
    
    const mobileUSD = mobileResults.find(r => r.test.includes('USD'));
    const mobileEUR = mobileResults.find(r => r.test.includes('EUR') && r.test.includes('EUR-'));
    const mobileEUR19 = mobileResults.find(r => r.test.includes('EUR19'));
    const mobileGBP = mobileResults.find(r => r.test.includes('GBP'));
    
    console.log('\n🎯 MOBILE RESULTS COMPARISON:');
    console.log(`   USD ($19.50): ${mobileUSD?.provider || 'N/A'} ${mobileUSD?.status || ''}`);
    console.log(`   EUR (€18.00): ${mobileEUR?.provider || 'N/A'} ${mobileEUR?.status || ''}`);
    console.log(`   EUR (€19.00): ${mobileEUR19?.provider || 'N/A'} ${mobileEUR19?.status || ''}`);
    console.log(`   GBP (£15.00): ${mobileGBP?.provider || 'N/A'} ${mobileGBP?.status || ''}`);
    
    console.log('\n📊 SOLUTION ANALYSIS:');
    
    const eurSuccessful = [mobileEUR, mobileEUR19].some(r => r && r.provider === 'Mercuryo');
    const usdProblem = mobileUSD && mobileUSD.provider === 'MoonPay';
    
    if (eurSuccessful && usdProblem) {
        console.log('✅ EUR CURRENCY SOLUTION CONFIRMED');
        console.log('   → EUR consistently selects Mercuryo on mobile');
        console.log('   → USD selects MoonPay on mobile (problem confirmed)');
        console.log('   → RECOMMENDATION: Implement EUR as primary currency');
    } else if (eurSuccessful && !usdProblem) {
        console.log('⚠️ EUR WORKS BUT USD ALSO WORKS');
        console.log('   → Both currencies may work, need further testing');
    } else if (!eurSuccessful && usdProblem) {
        console.log('❌ EUR DOES NOT SOLVE THE PROBLEM');
        console.log('   → Need alternative solution (desktop user agent spoofing)');
        console.log('   → Continue with current implementation');
    } else {
        console.log('❓ INCONCLUSIVE RESULTS');
        console.log('   → Need additional testing or manual verification');
    }
    
    console.log('\n🔧 NEXT STEPS:');
    if (eurSuccessful) {
        console.log('   1. Update main implementation to use EUR currency');
        console.log('   2. Change amount to €18 or €19 in production');
        console.log('   3. Test complete purchase flow with EUR');
        console.log('   4. Monitor real-world performance');
    } else {
        console.log('   1. Continue with desktop user agent spoofing approach');
        console.log('   2. Test alternative currencies (CAD, AUD, etc.)');
        console.log('   3. Consider API-based solutions');
        console.log('   4. Manual testing on real devices');
    }
}

directEURvsUSDTest().catch(console.error);