#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');

class QuickMobileTest {
    constructor() {
        this.results = [];
    }

    async runTest() {
        console.log('🚀 Running quick mobile verification test...\n');
        
        const browser = await chromium.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        // Test iPhone 13 Safari
        await this.testDevice(browser, 'iPhone 13 Safari', {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        // Test Android Chrome
        await this.testDevice(browser, 'Android Chrome', {
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 360, height: 800 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        await browser.close();
        this.generateReport();
    }

    async testDevice(browser, deviceName, config) {
        console.log(`📱 Testing ${deviceName}...`);
        
        const context = await browser.newContext(config);
        const page = await context.newPage();
        
        const result = {
            device: deviceName,
            timestamp: new Date().toISOString(),
            tests: {}
        };

        try {
            // Test 1: Our buy page
            console.log(`  🔍 Testing our buy page...`);
            await page.goto('https://auralo-website-fixed.netlify.app/buy.html', { 
                waitUntil: 'domcontentloaded',
                timeout: 15000 
            });
            
            const buyButton = await page.$('button:has-text("Buy POL Now")');
            result.tests.buyPageLoad = {
                success: !!buyButton,
                message: buyButton ? 'Buy page loaded successfully' : 'Buy button not found'
            };

            // Test 2: SimpleSwap with faster loading
            console.log(`  🌐 Testing SimpleSwap (quick load)...`);
            try {
                await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=50', { 
                    waitUntil: 'domcontentloaded',
                    timeout: 20000 
                });
                
                // Wait a bit for dynamic content
                await page.waitForTimeout(5000);
                
                result.tests.simpleSwapLoad = {
                    success: true,
                    message: 'SimpleSwap loaded successfully',
                    url: page.url()
                };

                // Test 3: Inject compact forcing script
                console.log(`  ⚡ Testing Mercuryo forcing...`);
                
                const forcingResults = await page.evaluate(() => {
                    // Compact forcing script
                    let forced = 0;
                    let disabled = 0;
                    
                    document.querySelectorAll('*').forEach(el => {
                        if (!el || !el.offsetWidth) return;
                        
                        const text = (el.textContent || '').toLowerCase();
                        
                        if (text.includes('mercuryo') && text.length < 500) {
                            el.style.border = '3px solid #22c55e';
                            el.style.background = 'rgba(34, 197, 94, 0.2)';
                            el.style.boxShadow = '0 0 10px #22c55e';
                            el.setAttribute('data-auralo-forced', 'true');
                            forced++;
                            
                            // Try to interact
                            try {
                                el.click();
                                if (el.tagName === 'INPUT') {
                                    el.checked = true;
                                }
                            } catch(e) {}
                        }
                        
                        if (text.includes('moonpay') && text.length < 500) {
                            el.style.opacity = '0.3';
                            el.style.filter = 'grayscale(100%)';
                            el.setAttribute('data-auralo-disabled', 'true');
                            disabled++;
                        }
                    });
                    
                    return { forced, disabled, totalElements: document.querySelectorAll('*').length };
                });

                result.tests.forcingExecution = {
                    success: forcingResults.forced > 0,
                    message: `Forced ${forcingResults.forced} Mercuryo elements, disabled ${forcingResults.disabled} MoonPay elements`,
                    ...forcingResults
                };

                // Test 4: Visual verification
                console.log(`  🔍 Visual verification...`);
                
                const visualCheck = await page.evaluate(() => {
                    const forcedElements = Array.from(document.querySelectorAll('[data-auralo-forced="true"]'));
                    const disabledElements = Array.from(document.querySelectorAll('[data-auralo-disabled="true"]'));
                    
                    return {
                        forcedCount: forcedElements.length,
                        disabledCount: disabledElements.length,
                        forcedTexts: forcedElements.map(el => el.textContent?.slice(0, 50)).filter(t => t),
                        disabledTexts: disabledElements.map(el => el.textContent?.slice(0, 50)).filter(t => t)
                    };
                });

                result.tests.visualVerification = {
                    success: visualCheck.forcedCount > 0,
                    message: `Visual check: ${visualCheck.forcedCount} forced, ${visualCheck.disabledCount} disabled`,
                    ...visualCheck
                };

                // Test 5: Screenshot
                const screenshotPath = `./screenshots/${deviceName.replace(/\s+/g, '_')}_quick_test.png`;
                await page.screenshot({ path: screenshotPath, fullPage: false });
                
                result.tests.screenshot = {
                    success: true,
                    message: `Screenshot saved: ${screenshotPath}`,
                    path: screenshotPath
                };

                // Test 6: Stability check (shorter)
                console.log(`  ⏰ Stability check (5 seconds)...`);
                await page.waitForTimeout(5000);
                
                const stabilityCheck = await page.evaluate(() => {
                    return {
                        forcedStillVisible: document.querySelectorAll('[data-auralo-forced="true"]').length,
                        disabledStillVisible: document.querySelectorAll('[data-auralo-disabled="true"]').length
                    };
                });

                result.tests.stabilityCheck = {
                    success: stabilityCheck.forcedStillVisible > 0,
                    message: `After 5s: ${stabilityCheck.forcedStillVisible} forced elements still visible`,
                    ...stabilityCheck
                };

            } catch (simpleSwapError) {
                result.tests.simpleSwapLoad = {
                    success: false,
                    message: `SimpleSwap failed to load: ${simpleSwapError.message}`
                };
            }

        } catch (error) {
            result.tests.error = {
                success: false,
                message: `Device test failed: ${error.message}`
            };
        }

        await context.close();
        this.results.push(result);
        this.printDeviceResults(result);
    }

    printDeviceResults(result) {
        console.log(`\n  📊 Results for ${result.device}:`);
        for (const [testName, testResult] of Object.entries(result.tests)) {
            const status = testResult.success ? '✅' : '❌';
            console.log(`    ${status} ${testName}: ${testResult.message}`);
        }
        console.log('');
    }

    generateReport() {
        const reportPath = './quick-mobile-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\n📄 Report saved to: ${reportPath}`);
        
        const totalDevices = this.results.length;
        let criticalSuccesses = 0;
        
        this.results.forEach(result => {
            const criticalTests = ['buyPageLoad', 'simpleSwapLoad', 'forcingExecution', 'visualVerification'];
            const criticalPassed = criticalTests.filter(test => 
                result.tests[test] && result.tests[test].success
            ).length;
            
            if (criticalPassed >= 3) { // At least 3 of 4 critical tests must pass
                criticalSuccesses++;
            }
        });
        
        console.log(`\n📈 Summary:`);
        console.log(`  Devices tested: ${totalDevices}`);
        console.log(`  Critical success: ${criticalSuccesses}/${totalDevices}`);
        console.log(`  Success rate: ${((criticalSuccesses / totalDevices) * 100).toFixed(1)}%`);
        
        // Individual test results
        const testTypes = ['buyPageLoad', 'simpleSwapLoad', 'forcingExecution', 'visualVerification', 'stabilityCheck'];
        console.log(`\n🧪 Individual Test Results:`);
        
        testTypes.forEach(testType => {
            const results = this.results.map(r => r.tests[testType]).filter(Boolean);
            const successCount = results.filter(r => r.success).length;
            console.log(`  ${testType}: ${successCount}/${results.length} passed`);
        });

        // Show forcing details
        console.log(`\n🎯 Forcing Details:`);
        this.results.forEach(result => {
            if (result.tests.forcingExecution) {
                const test = result.tests.forcingExecution;
                console.log(`  ${result.device}: Forced ${test.forced || 0}, Disabled ${test.disabled || 0}`);
            }
        });
    }
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

// Run test
const tester = new QuickMobileTest();
tester.runTest().catch(console.error);