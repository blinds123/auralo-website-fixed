// Automated EUR vs USD SimpleSwap Provider Testing
// Comprehensive test across device types and currencies

const { chromium } = require('playwright');

async function comprehensiveProviderTest() {
    console.log('🧪 COMPREHENSIVE EUR vs USD PROVIDER TESTING\n');
    console.log('Testing Hypothesis: EUR currency may consistently select Mercuryo on mobile\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const testResults = [];
    
    // Test configurations
    const deviceConfigs = [
        {
            name: 'iPhone 12',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            viewport: { width: 390, height: 844 }
        },
        {
            name: 'Samsung Galaxy S21',
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 384, height: 854 }
        },
        {
            name: 'iPad Pro',
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            viewport: { width: 1024, height: 1366 }
        },
        {
            name: 'Desktop Chrome',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            viewport: { width: 1280, height: 720 }
        }
    ];
    
    const testCases = [
        // USD Tests (Current Implementation)
        {
            name: 'USD → POL ($19.50) - Current',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo',
            currency: 'USD',
            expectedIssue: 'MoonPay on mobile'
        },
        {
            name: 'USD → POL ($20.00)',
            url: 'https://simpleswap.io/?from=usd&to=pol&amount=20&partner=auralo',
            currency: 'USD',
            expectedIssue: 'MoonPay on mobile'
        },
        
        // EUR Tests (Potential Solution)
        {
            name: 'EUR → POL (€18.00)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo',
            currency: 'EUR',
            expectedFix: 'Mercuryo on all devices'
        },
        {
            name: 'EUR → POL (€19.00)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=19&partner=auralo',
            currency: 'EUR',
            expectedFix: 'Mercuryo on all devices'
        },
        {
            name: 'EUR → POL (€20.00)',
            url: 'https://simpleswap.io/?from=eur&to=pol&amount=20&partner=auralo',
            currency: 'EUR',
            expectedFix: 'Mercuryo on all devices'
        },
        
        // Additional Currencies
        {
            name: 'GBP → POL (£15.00)',
            url: 'https://simpleswap.io/?from=gbp&to=pol&amount=15&partner=auralo',
            currency: 'GBP',
            expectedTest: 'Alternative currency test'
        }
    ];
    
    console.log(`Testing ${testCases.length} URLs across ${deviceConfigs.length} device types\n`);
    
    for (const device of deviceConfigs) {
        console.log(`\n📱 TESTING DEVICE: ${device.name}`);
        console.log(`   User Agent: ${device.userAgent.substring(0, 50)}...`);
        console.log(`   Viewport: ${device.viewport.width}x${device.viewport.height}`);
        
        for (const testCase of testCases) {
            console.log(`\n  🔍 Testing: ${testCase.name}`);
            
            const result = await testProviderSelection(browser, device, testCase);
            testResults.push({
                device: device.name,
                testCase: testCase.name,
                currency: testCase.currency,
                url: testCase.url,
                ...result
            });
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log(`\n✅ Completed testing ${testCases.length} cases for ${device.name}`);
    }
    
    await browser.close();
    
    // Analyze and report results
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS ANALYSIS');
    console.log('='.repeat(80));
    
    analyzeResults(testResults);
    generateRecommendations(testResults);
    
    return testResults;
}

async function testProviderSelection(browser, device, testCase) {
    const context = await browser.newContext({
        userAgent: device.userAgent,
        viewport: device.viewport
    });
    
    const page = await context.newPage();
    
    try {
        console.log(`    → Opening ${testCase.currency} URL...`);
        await page.goto(testCase.url);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        
        // Wait for page to fully load
        await page.waitForTimeout(3000);
        
        // Look for exchange/continue button with multiple selectors
        const exchangeSelectors = [
            'button:has-text("Exchange")',
            'button:has-text("Continue")',
            'input[type="submit"][value*="Exchange"]',
            '[data-testid="exchange-button"]',
            '.exchange-button',
            'button[class*="exchange"]',
            'button[class*="continue"]',
            'a[href*="exchange"]'
        ];
        
        let exchangeButton = null;
        for (const selector of exchangeSelectors) {
            try {
                exchangeButton = page.locator(selector).first();
                if (await exchangeButton.isVisible({ timeout: 2000 })) {
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!exchangeButton) {
            // Try generic button search
            const buttons = await page.locator('button, input[type="submit"], a[class*="button"]').all();
            for (const button of buttons) {
                const text = await button.textContent();
                if (text && /exchange|continue|next|proceed/i.test(text)) {
                    exchangeButton = button;
                    break;
                }
            }
        }
        
        if (exchangeButton && await exchangeButton.isVisible()) {
            console.log(`    → Clicking exchange button...`);
            await exchangeButton.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(5000); // Give time for provider selection
            
            // Check for providers in page content
            const content = await page.content();
            const hasMercuryo = content.toLowerCase().includes('mercuryo');
            const hasMoonPay = content.toLowerCase().includes('moonpay');
            
            // Also check visible text for more accuracy
            const visibleText = await page.textContent('body');
            const visibleMercuryo = visibleText.toLowerCase().includes('mercuryo');
            const visibleMoonPay = visibleText.toLowerCase().includes('moonpay');
            
            let provider = 'Unknown';
            let status = '❓';
            
            if ((hasMercuryo || visibleMercuryo) && !(hasMoonPay || visibleMoonPay)) {
                provider = 'Mercuryo';
                status = '✅';
            } else if (!(hasMercuryo || visibleMercuryo) && (hasMoonPay || visibleMoonPay)) {
                provider = 'MoonPay';
                status = device.name.includes('iPhone') || device.name.includes('Samsung') ? '❌' : '⚠️';
            } else if ((hasMercuryo || visibleMercuryo) && (hasMoonPay || visibleMoonPay)) {
                provider = 'Both Available';
                status = '⚠️';
            }
            
            console.log(`    → Result: ${status} ${provider}`);
            
            return {
                success: true,
                provider: provider,
                status: status,
                hasMercuryo: hasMercuryo || visibleMercuryo,
                hasMoonPay: hasMoonPay || visibleMoonPay,
                error: null
            };
            
        } else {
            console.log(`    → ❌ Exchange button not found`);
            return {
                success: false,
                provider: 'N/A',
                status: '❌',
                error: 'Exchange button not found'
            };
        }
        
    } catch (error) {
        console.log(`    → ❌ Error: ${error.message}`);
        return {
            success: false,
            provider: 'N/A',
            status: '❌',
            error: error.message
        };
    } finally {
        await context.close();
    }
}

function analyzeResults(results) {
    console.log('\n🔍 DETAILED ANALYSIS BY CURRENCY:');
    
    const currencies = ['USD', 'EUR', 'GBP'];
    
    for (const currency of currencies) {
        const currencyResults = results.filter(r => r.currency === currency);
        if (currencyResults.length === 0) continue;
        
        console.log(`\n💱 ${currency} RESULTS:`);
        
        const mobileResults = currencyResults.filter(r => 
            r.device.includes('iPhone') || r.device.includes('Samsung')
        );
        
        const tabletResults = currencyResults.filter(r => 
            r.device.includes('iPad')
        );
        
        const desktopResults = currencyResults.filter(r => 
            r.device.includes('Desktop')
        );
        
        console.log(`   📱 Mobile (${mobileResults.length} tests):`);
        mobileResults.forEach(r => {
            console.log(`      ${r.device}: ${r.status} ${r.provider} (${r.testCase})`);
        });
        
        if (tabletResults.length > 0) {
            console.log(`   📱 Tablet (${tabletResults.length} tests):`);
            tabletResults.forEach(r => {
                console.log(`      ${r.device}: ${r.status} ${r.provider} (${r.testCase})`);
            });
        }
        
        console.log(`   🖥️ Desktop (${desktopResults.length} tests):`);
        desktopResults.forEach(r => {
            console.log(`      ${r.device}: ${r.status} ${r.provider} (${r.testCase})`);
        });
    }
}

function generateRecommendations(results) {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 RECOMMENDATIONS & IMPLEMENTATION STRATEGY');
    console.log('='.repeat(80));
    
    const mobileResults = results.filter(r => 
        r.device.includes('iPhone') || r.device.includes('Samsung')
    );
    
    const eurMobileResults = mobileResults.filter(r => r.currency === 'EUR');
    const usdMobileResults = mobileResults.filter(r => r.currency === 'USD');
    
    const eurMercuryoCount = eurMobileResults.filter(r => r.provider === 'Mercuryo').length;
    const usdMercuryoCount = usdMobileResults.filter(r => r.provider === 'Mercuryo').length;
    
    console.log('\n📊 MOBILE DEVICE ANALYSIS:');
    console.log(`   EUR → Mercuryo: ${eurMercuryoCount}/${eurMobileResults.length} tests`);
    console.log(`   USD → Mercuryo: ${usdMercuryoCount}/${usdMobileResults.length} tests`);
    
    if (eurMercuryoCount > usdMercuryoCount) {
        console.log('\n✅ RECOMMENDATION: EUR CURRENCY SOLUTION');
        console.log('   EUR shows better Mercuryo selection on mobile devices');
        console.log('   Suggested implementation:');
        console.log('   1. Change primary currency from USD to EUR');
        console.log('   2. Adjust amount to €18-20 (equivalent to $19.50)');
        console.log('   3. Update all SimpleSwap URLs to use EUR');
        console.log('   4. Test complete purchase flow with EUR');
    } else {
        console.log('\n⚠️ EUR CURRENCY DID NOT SOLVE THE ISSUE');
        console.log('   Need to explore alternative solutions:');
        console.log('   1. Desktop user agent spoofing (current approach)');
        console.log('   2. Alternative fiat providers');
        console.log('   3. Different URL parameters');
        console.log('   4. Contact SimpleSwap for API solution');
    }
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('   1. Implement the recommended solution');
    console.log('   2. Test on real devices (not just simulated)');
    console.log('   3. Verify complete purchase flow');
    console.log('   4. Deploy and monitor production results');
}

// Execute the comprehensive test
comprehensiveProviderTest().catch(console.error);