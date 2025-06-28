// Simple mobile test with shorter timeouts and better error handling
const { chromium } = require('playwright');

async function simpleMobileTest() {
    console.log('📱 SIMPLE MOBILE TEST: EUR vs USD');
    console.log('Quick test to determine if EUR fixes the mobile issue\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    
    // Test with iPhone simulation
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const results = [];
    
    // Test URLs
    const tests = [
        {
            name: 'USD (Problem)',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            expected: 'Should select MoonPay on mobile'
        },
        {
            name: 'EUR (Solution?)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            expected: 'Testing if selects Mercuryo on mobile'
        }
    ];
    
    for (const test of tests) {
        console.log(`🧪 Testing: ${test.name}`);
        console.log(`   URL: ${test.url}`);
        console.log(`   Expected: ${test.expected}`);
        
        const result = await quickTest(context, test);
        results.push(result);
        
        console.log(`   Result: ${result.status} - ${result.provider}\n`);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('='.repeat(60));
    console.log('📊 RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    results.forEach(result => {
        console.log(`${result.test}: ${result.status} - ${result.provider}`);
    });
    
    // Analysis
    const usdResult = results.find(r => r.test.includes('USD'));
    const eurResult = results.find(r => r.test.includes('EUR'));
    
    console.log('\n🎯 ANALYSIS:');
    
    if (eurResult && eurResult.provider === 'Mercuryo' && 
        usdResult && usdResult.provider === 'MoonPay') {
        console.log('✅ SUCCESS: EUR SOLVES THE MOBILE ISSUE');
        console.log('   → EUR selects Mercuryo on mobile');
        console.log('   → USD selects MoonPay on mobile (confirmed problem)');
        console.log('   → SOLUTION: Use EUR currency for mobile users');
    } else if (eurResult && eurResult.provider === 'Mercuryo') {
        console.log('✅ EUR WORKS: EUR selects Mercuryo');
        console.log('   → EUR approach is successful');
        console.log('   → Implement EUR as primary mobile solution');
    } else if (eurResult && eurResult.provider === 'MoonPay') {
        console.log('❌ EUR FAILED: EUR also selects MoonPay');
        console.log('   → EUR does not solve the mobile issue');
        console.log('   → Fall back to desktop user agent spoofing');
    } else {
        console.log('❓ INCONCLUSIVE: Need manual testing');
        console.log('   → Automated test could not determine providers');
        console.log('   → Manual verification required');
    }
    
    console.log('\n📋 MANUAL VERIFICATION:');
    console.log('Open these URLs on your mobile phone:');
    console.log('1. USD: https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo');
    console.log('2. EUR: https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo');
    console.log('Click Exchange on each and note the provider selected.');
    
    // Keep browser open for manual inspection
    console.log('\n⏳ Browser kept open for manual inspection...');
    console.log('Press Ctrl+C when done\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            console.log('Closing browser...');
            resolve();
        });
    });
    
    await browser.close();
    return results;
}

async function quickTest(context, test) {
    const page = await context.newPage();
    
    try {
        // Shorter timeout, quicker test
        await page.goto(test.url, { timeout: 15000 });
        
        // Wait briefly for page load
        await page.waitForTimeout(3000);
        
        // Try to find exchange button quickly
        let exchangeFound = false;
        let provider = 'Unknown';
        
        try {
            // Look for exchange button
            const exchangeButton = page.locator('button, input[type="submit"]').filter({ hasText: /exchange|continue/i }).first();
            
            if (await exchangeButton.isVisible({ timeout: 5000 })) {
                await exchangeButton.click();
                await page.waitForTimeout(4000); // Wait for provider selection
                
                // Quick provider check
                const content = await page.content();
                const hasMercuryo = /mercuryo/i.test(content);
                const hasMoonPay = /moonpay/i.test(content);
                
                if (hasMercuryo && !hasMoonPay) {
                    provider = 'Mercuryo';
                } else if (!hasMercuryo && hasMoonPay) {
                    provider = 'MoonPay';
                } else if (hasMercuryo && hasMoonPay) {
                    provider = 'Both';
                }
                
                exchangeFound = true;
            }
        } catch (e) {
            // Button interaction failed
        }
        
        const status = exchangeFound ? 
            (provider === 'Mercuryo' ? '✅ SUCCESS' : 
             provider === 'MoonPay' ? '❌ MOONPAY' : 
             provider === 'Both' ? '⚠️ BOTH' : '❓ UNCLEAR') : 
            '❌ NO BUTTON';
        
        return {
            test: test.name,
            url: test.url,
            provider: provider,
            status: status,
            exchangeFound: exchangeFound
        };
        
    } catch (error) {
        return {
            test: test.name,
            url: test.url,
            provider: 'Error',
            status: '❌ ERROR',
            error: error.message,
            exchangeFound: false
        };
    } finally {
        await page.close();
    }
}

// Run the test
simpleMobileTest().catch(console.error);