// Comprehensive mobile simulator testing for EUR vs USD on all phone types
const { chromium, firefox, webkit } = require('playwright');

async function comprehensiveMobileTest() {
    console.log('📱 COMPREHENSIVE MOBILE SIMULATOR TEST: EUR vs USD');
    console.log('Testing SimpleSwap provider selection across all mobile devices');
    console.log('='.repeat(70));
    
    const results = [];
    
    // Mobile device configurations for testing
    const mobileDevices = [
        {
            name: 'iPhone 12 Pro',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            viewport: { width: 390, height: 844 },
            browser: 'webkit'
        },
        {
            name: 'iPhone 13 Mini',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 375, height: 812 },
            browser: 'webkit'
        },
        {
            name: 'iPhone 14 Pro Max',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 428, height: 926 },
            browser: 'webkit'
        },
        {
            name: 'Samsung Galaxy S21',
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 384, height: 854 },
            browser: 'chromium'
        },
        {
            name: 'Samsung Galaxy S22 Ultra',
            userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36',
            viewport: { width: 412, height: 915 },
            browser: 'chromium'
        },
        {
            name: 'Google Pixel 6',
            userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36',
            viewport: { width: 412, height: 915 },
            browser: 'chromium'
        },
        {
            name: 'OnePlus 9 Pro',
            userAgent: 'Mozilla/5.0 (Linux; Android 11; LE2123) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 412, height: 919 },
            browser: 'chromium'
        },
        {
            name: 'iPad Pro 11',
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            viewport: { width: 834, height: 1194 },
            browser: 'webkit'
        },
        {
            name: 'iPad Mini',
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 768, height: 1024 },
            browser: 'webkit'
        }
    ];
    
    // Test URLs
    const testUrls = [
        {
            name: 'USD → POL ($19.50)',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            currency: 'USD',
            expectedMobile: 'MoonPay (Problem)',
            amount: '$19.50'
        },
        {
            name: 'EUR → POL (€18)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            currency: 'EUR',
            expectedMobile: 'Mercuryo? (Test)',
            amount: '€18'
        },
        {
            name: 'EUR → POL (€19)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=19&partner=auralo',
            currency: 'EUR',
            expectedMobile: 'Mercuryo? (Test)',
            amount: '€19'
        },
        {
            name: 'EUR → POL (€20)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=20&partner=auralo',
            currency: 'EUR',
            expectedMobile: 'Mercuryo? (Test)',
            amount: '€20'
        }
    ];
    
    // Test each device with each URL
    for (const device of mobileDevices) {
        console.log(`\n📱 TESTING DEVICE: ${device.name}`);
        console.log(`   Browser: ${device.browser}`);
        console.log(`   Viewport: ${device.viewport.width}x${device.viewport.height}`);
        
        const browserType = device.browser === 'webkit' ? webkit : 
                           device.browser === 'firefox' ? firefox : chromium;
        
        const browser = await browserType.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext({
            userAgent: device.userAgent,
            viewport: device.viewport
        });
        
        for (const testUrl of testUrls) {
            console.log(`\n   🧪 Testing: ${testUrl.name}`);
            const result = await testSingleConfiguration(context, device, testUrl);
            results.push(result);
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        await browser.close();
        console.log(`   ✅ Completed ${device.name}`);
    }
    
    // Analysis
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE TEST RESULTS ANALYSIS');
    console.log('='.repeat(70));
    
    analyzeResults(results);
    generateConclusions(results);
    
    return results;
}

async function testSingleConfiguration(context, device, testUrl) {
    const page = await context.newPage();
    const startTime = Date.now();
    
    try {
        console.log(`      → Opening: ${testUrl.url}`);
        
        // Set longer timeout for mobile
        await page.goto(testUrl.url, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 20000 });
        
        // Wait for page to fully render
        await page.waitForTimeout(3000);
        
        console.log(`      → Looking for exchange button...`);
        
        // Multiple strategies to find exchange button
        let exchangeClicked = false;
        const selectors = [
            'button:has-text("Exchange")',
            'input[type="submit"][value*="Exchange"]',
            'button[class*="exchange"]',
            '.exchange-btn',
            '.exchange-button',
            'button:has-text("Continue")',
            'button:has-text("Proceed")',
            '[data-testid*="exchange"]'
        ];
        
        for (const selector of selectors) {
            try {
                const element = page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`      → Found exchange button: ${selector}`);
                    await element.click();
                    exchangeClicked = true;
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!exchangeClicked) {
            // Try to find any button with exchange-related text
            const buttons = await page.locator('button, input[type="submit"]').all();
            for (const button of buttons) {
                try {
                    const text = await button.textContent();
                    if (text && /exchange|continue|proceed|next|start/i.test(text)) {
                        console.log(`      → Found button by text: "${text}"`);
                        await button.click();
                        exchangeClicked = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (exchangeClicked) {
            console.log(`      → Exchange clicked, waiting for provider selection...`);
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            await page.waitForTimeout(5000); // Extra time for provider logic
            
            // Check for providers in multiple ways
            const pageContent = await page.content();
            const visibleText = await page.textContent('body');
            
            const contentHasMercuryo = /mercuryo/i.test(pageContent);
            const contentHasMoonPay = /moonpay/i.test(pageContent);
            const visibleHasMercuryo = /mercuryo/i.test(visibleText);
            const visibleHasMoonPay = /moonpay/i.test(visibleText);
            
            const hasMercuryo = contentHasMercuryo || visibleHasMercuryo;
            const hasMoonPay = contentHasMoonPay || visibleHasMoonPay;
            
            let provider;
            let status;
            let success = false;
            
            if (hasMercuryo && !hasMoonPay) {
                provider = 'Mercuryo';
                status = '✅ SUCCESS';
                success = true;
            } else if (!hasMercuryo && hasMoonPay) {
                provider = 'MoonPay';
                status = testUrl.currency === 'USD' ? '❌ EXPECTED ISSUE' : '❌ EUR FAILED';
            } else if (hasMercuryo && hasMoonPay) {
                provider = 'Both Available';
                status = '⚠️ MIXED';
            } else {
                provider = 'Unknown';
                status = '❓ UNCLEAR';
            }
            
            console.log(`      → Result: ${status} - ${provider}`);
            
            return {
                device: device.name,
                browser: device.browser,
                testUrl: testUrl.name,
                currency: testUrl.currency,
                amount: testUrl.amount,
                provider: provider,
                status: status,
                success: success,
                exchangeButtonFound: true,
                duration: Date.now() - startTime
            };
            
        } else {
            console.log(`      → ❌ Exchange button not found`);
            return {
                device: device.name,
                browser: device.browser,
                testUrl: testUrl.name,
                currency: testUrl.currency,
                amount: testUrl.amount,
                provider: 'N/A',
                status: '❌ NO BUTTON',
                success: false,
                exchangeButtonFound: false,
                duration: Date.now() - startTime
            };
        }
        
    } catch (error) {
        console.log(`      → ❌ Error: ${error.message}`);
        return {
            device: device.name,
            browser: device.browser,
            testUrl: testUrl.name,
            currency: testUrl.currency,
            amount: testUrl.amount,
            provider: 'N/A',
            status: '❌ ERROR',
            success: false,
            error: error.message,
            duration: Date.now() - startTime
        };
    } finally {
        await page.close();
    }
}

function analyzeResults(results) {
    console.log('\n📱 RESULTS BY DEVICE:');
    
    const devices = [...new Set(results.map(r => r.device))];
    
    for (const device of devices) {
        const deviceResults = results.filter(r => r.device === device);
        console.log(`\n   ${device}:`);
        
        deviceResults.forEach(result => {
            console.log(`      ${result.status} ${result.currency} (${result.amount}): ${result.provider}`);
        });
    }
    
    console.log('\n💱 RESULTS BY CURRENCY:');
    
    const usdResults = results.filter(r => r.currency === 'USD');
    const eurResults = results.filter(r => r.currency === 'EUR');
    
    console.log(`\n   USD Results (${usdResults.length} tests):`);
    const usdMercuryo = usdResults.filter(r => r.provider === 'Mercuryo').length;
    const usdMoonPay = usdResults.filter(r => r.provider === 'MoonPay').length;
    console.log(`      Mercuryo: ${usdMercuryo} | MoonPay: ${usdMoonPay} | Other: ${usdResults.length - usdMercuryo - usdMoonPay}`);
    
    console.log(`\n   EUR Results (${eurResults.length} tests):`);
    const eurMercuryo = eurResults.filter(r => r.provider === 'Mercuryo').length;
    const eurMoonPay = eurResults.filter(r => r.provider === 'MoonPay').length;
    console.log(`      Mercuryo: ${eurMercuryo} | MoonPay: ${eurMoonPay} | Other: ${eurResults.length - eurMercuryo - eurMoonPay}`);
}

function generateConclusions(results) {
    console.log('\n🎯 CONCLUSIONS:');
    
    const successfulTests = results.filter(r => r.exchangeButtonFound && r.provider !== 'N/A');
    const usdSuccessful = successfulTests.filter(r => r.currency === 'USD');
    const eurSuccessful = successfulTests.filter(r => r.currency === 'EUR');
    
    const usdMercuryoRate = usdSuccessful.filter(r => r.provider === 'Mercuryo').length / Math.max(usdSuccessful.length, 1);
    const eurMercuryoRate = eurSuccessful.filter(r => r.provider === 'Mercuryo').length / Math.max(eurSuccessful.length, 1);
    
    console.log(`\n   USD → Mercuryo Rate: ${(usdMercuryoRate * 100).toFixed(1)}% (${usdSuccessful.filter(r => r.provider === 'Mercuryo').length}/${usdSuccessful.length})`);
    console.log(`   EUR → Mercuryo Rate: ${(eurMercuryoRate * 100).toFixed(1)}% (${eurSuccessful.filter(r => r.provider === 'Mercuryo').length}/${eurSuccessful.length})`);
    
    console.log('\n🏆 FINAL RECOMMENDATION:');
    
    if (eurMercuryoRate > usdMercuryoRate + 0.2) {
        console.log('   ✅ EUR CURRENCY SOLUTION CONFIRMED');
        console.log('   → EUR significantly outperforms USD for Mercuryo selection');
        console.log('   → IMPLEMENT: EUR as primary currency for mobile');
        console.log('   → AMOUNT: €18-20 equivalent to $19.50');
    } else if (eurMercuryoRate > usdMercuryoRate) {
        console.log('   ⚠️ EUR SHOWS IMPROVEMENT BUT MARGINAL');
        console.log('   → EUR slightly better than USD but not decisive');
        console.log('   → CONSIDER: EUR with desktop spoofing fallback');
    } else {
        console.log('   ❌ EUR DOES NOT SOLVE THE PROBLEM');
        console.log('   → EUR performs similar to or worse than USD');
        console.log('   → IMPLEMENT: Desktop user agent spoofing solution');
        console.log('   → FALLBACK: Keep USD with proven spoofing method');
    }
    
    console.log('\n📋 IMPLEMENTATION ACTIONS:');
    if (eurMercuryoRate > 0.7) {
        console.log('   1. Update production to use EUR currency');
        console.log('   2. Change amount to €18 for mobile users');
        console.log('   3. Keep desktop spoofing as backup');
        console.log('   4. Monitor real-world performance');
    } else {
        console.log('   1. Continue with desktop user agent spoofing');
        console.log('   2. Keep USD currency but spoof desktop on mobile');
        console.log('   3. Consider alternative solutions');
        console.log('   4. Test on real devices for confirmation');
    }
}

// Run the comprehensive test
comprehensiveMobileTest().catch(console.error);