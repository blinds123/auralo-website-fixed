#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');

// Mobile device configurations
const MOBILE_DEVICES = {
    'iPhone 13 Safari': {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    },
    'Samsung Galaxy S21 Chrome': {
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        viewport: { width: 360, height: 800 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    }
};

class DirectMobileTester {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting direct mobile SimpleSwap tests...\n');
        
        // Test each device
        for (const [deviceName, config] of Object.entries(MOBILE_DEVICES)) {
            console.log(`📱 Testing ${deviceName}...`);
            await this.testDevice(deviceName, config);
        }
        
        // Generate report
        this.generateReport();
        console.log('\n✅ All direct mobile tests completed!');
    }

    async testDevice(deviceName, config) {
        const browser = await chromium.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext({
            userAgent: config.userAgent,
            viewport: config.viewport,
            deviceScaleFactor: config.deviceScaleFactor,
            isMobile: config.isMobile,
            hasTouch: config.hasTouch
        });

        const page = await context.newPage();
        
        const testResult = {
            device: deviceName,
            timestamp: new Date().toISOString(),
            tests: {}
        };

        try {
            // Test 1: Direct SimpleSwap navigation with forcing script
            console.log(`  🌐 Testing direct SimpleSwap navigation...`);
            await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=50');
            await page.waitForLoadState('networkidle');
            
            const isSimpleSwap = page.url().includes('simpleswap.io');
            testResult.tests.simpleSwapLoad = {
                success: isSimpleSwap,
                message: isSimpleSwap ? 'SimpleSwap loaded successfully' : 'Failed to load SimpleSwap',
                url: page.url()
            };

            if (isSimpleSwap) {
                // Test 2: Inject and run forcing script
                console.log(`  ⚡ Injecting Mercuryo forcing script...`);
                
                const forcingScript = `
                    (function() {
                        let attempts = 0;
                        const maxAttempts = 50;
                        
                        function forceMercuryo() {
                            attempts++;
                            if (attempts > maxAttempts) return false;
                            
                            let forcedCount = 0;
                            document.querySelectorAll('*').forEach(el => {
                                if (!el || !el.offsetWidth) return;
                                
                                const text = (el.textContent || '').toLowerCase();
                                
                                if (text.includes('mercuryo') && text.length < 500) {
                                    el.style.border = '2px solid #22c55e';
                                    el.style.background = 'rgba(34, 197, 94, 0.1)';
                                    el.setAttribute('data-forced', 'true');
                                    forcedCount++;
                                    
                                    // Try to click the element
                                    setTimeout(() => {
                                        try {
                                            el.click();
                                            el.focus();
                                            if (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) {
                                                el.checked = true;
                                            }
                                        } catch(e) {}
                                    }, 100);
                                }
                                
                                if (text.includes('moonpay') && text.length < 500) {
                                    el.style.opacity = '0.3';
                                    el.style.filter = 'grayscale(100%)';
                                    el.setAttribute('data-disabled', 'true');
                                }
                            });
                            
                            return forcedCount;
                        }
                        
                        // Run forcing multiple times
                        window.auraloBruteForce = function() {
                            const results = [];
                            for (let i = 0; i < 10; i++) {
                                const count = forceMercuryo();
                                results.push(count);
                                if (i < 9) {
                                    // Use synchronous delay for testing
                                    const start = Date.now();
                                    while (Date.now() - start < 1000) {}
                                }
                            }
                            return results;
                        };
                        
                        return forceMercuryo();
                    })();
                `;

                const forcingResult = await page.evaluate(forcingScript);
                
                testResult.tests.forcingInjection = {
                    success: typeof forcingResult === 'number' && forcingResult >= 0,
                    message: `Forcing script executed, ${forcingResult} elements processed`,
                    elementsForced: forcingResult
                };

                // Test 3: Run brute force and check results
                console.log(`  🔥 Running brute force Mercuryo forcing...`);
                
                const bruteForceResults = await page.evaluate(() => {
                    if (window.auraloBruteForce) {
                        return window.auraloBruteForce();
                    }
                    return [];
                });

                testResult.tests.bruteForceResults = {
                    success: bruteForceResults.length > 0,
                    message: `Brute force completed with results: ${bruteForceResults.join(', ')}`,
                    results: bruteForceResults
                };

                // Test 4: Check for forced elements
                console.log(`  🔍 Checking for forced Mercuryo elements...`);
                
                const forcedElements = await page.$$eval('[data-forced="true"]', elements => {
                    return elements.map(el => ({
                        text: el.textContent?.slice(0, 100),
                        tagName: el.tagName,
                        border: window.getComputedStyle(el).border,
                        background: window.getComputedStyle(el).background
                    }));
                });

                testResult.tests.forcedElementsCheck = {
                    success: forcedElements.length > 0,
                    message: `Found ${forcedElements.length} forced elements`,
                    elements: forcedElements
                };

                // Test 5: Check for disabled MoonPay elements
                console.log(`  🌙 Checking for disabled MoonPay elements...`);
                
                const disabledElements = await page.$$eval('[data-disabled="true"]', elements => {
                    return elements.map(el => ({
                        text: el.textContent?.slice(0, 100),
                        tagName: el.tagName,
                        opacity: window.getComputedStyle(el).opacity
                    }));
                });

                testResult.tests.disabledElementsCheck = {
                    success: disabledElements.length > 0,
                    message: `Found ${disabledElements.length} disabled MoonPay elements`,
                    elements: disabledElements
                };

                // Test 6: Check page content for provider info
                console.log(`  📄 Analyzing page content...`);
                
                const pageAnalysis = await page.evaluate(() => {
                    const allText = document.body.textContent.toLowerCase();
                    return {
                        hasMercuryo: allText.includes('mercuryo'),
                        hasMoonpay: allText.includes('moonpay'),
                        mercuryoMatches: (allText.match(/mercuryo/g) || []).length,
                        moonpayMatches: (allText.match(/moonpay/g) || []).length,
                        totalElements: document.querySelectorAll('*').length
                    };
                });

                testResult.tests.pageAnalysis = {
                    success: pageAnalysis.hasMercuryo,
                    message: `Page has ${pageAnalysis.mercuryoMatches} Mercuryo mentions, ${pageAnalysis.moonpayMatches} MoonPay mentions`,
                    analysis: pageAnalysis
                };

                // Test 7: Take screenshot for visual verification
                console.log(`  📸 Taking screenshot...`);
                
                const screenshotPath = `./screenshots/${deviceName.replace(/\s+/g, '_')}_direct_test.png`;
                await page.screenshot({ 
                    path: screenshotPath,
                    fullPage: true 
                });

                testResult.tests.screenshot = {
                    success: true,
                    message: `Screenshot saved: ${screenshotPath}`,
                    path: screenshotPath
                };

                // Test 8: Wait and check for auto-switching
                console.log(`  ⏰ Monitoring for auto-switching (10 seconds)...`);
                
                await page.waitForTimeout(10000);
                
                const finalCheck = await page.evaluate(() => {
                    const forcedElements = document.querySelectorAll('[data-forced="true"]').length;
                    const disabledElements = document.querySelectorAll('[data-disabled="true"]').length;
                    
                    return {
                        forcedElementsRemaining: forcedElements,
                        disabledElementsRemaining: disabledElements,
                        url: window.location.href
                    };
                });

                testResult.tests.stabilityCheck = {
                    success: finalCheck.forcedElementsRemaining > 0,
                    message: `After 10s: ${finalCheck.forcedElementsRemaining} forced, ${finalCheck.disabledElementsRemaining} disabled`,
                    finalState: finalCheck
                };
            }

        } catch (error) {
            testResult.tests.error = {
                success: false,
                message: `Test failed: ${error.message}`,
                stack: error.stack
            };
            console.log(`  ❌ Error testing ${deviceName}: ${error.message}`);
        }

        await browser.close();
        this.results.tests.push(testResult);

        // Print device results
        this.printDeviceResults(testResult);
    }

    printDeviceResults(testResult) {
        console.log(`\n  📊 Results for ${testResult.device}:`);
        for (const [testName, result] of Object.entries(testResult.tests)) {
            const status = result.success ? '✅' : '❌';
            console.log(`    ${status} ${testName}: ${result.message}`);
        }
        console.log('');
    }

    generateReport() {
        const reportPath = './direct-mobile-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        // Summary
        const totalDevices = this.results.tests.length;
        let overallSuccess = 0;
        
        this.results.tests.forEach(test => {
            const testResults = Object.values(test.tests);
            const successCount = testResults.filter(t => t.success).length;
            const successRate = successCount / testResults.length;
            
            if (successRate >= 0.8) { // 80% of tests must pass
                overallSuccess++;
            }
        });
        
        console.log(`\n📈 Summary:`);
        console.log(`  Total devices tested: ${totalDevices}`);
        console.log(`  Overall successful: ${overallSuccess}`);
        console.log(`  Success rate: ${((overallSuccess / totalDevices) * 100).toFixed(1)}%`);
        
        // Critical tests check
        const criticalTests = ['forcingInjection', 'forcedElementsCheck', 'stabilityCheck'];
        console.log(`\n🔥 Critical Tests Results:`);
        
        criticalTests.forEach(testType => {
            const results = this.results.tests.map(t => t.tests[testType]).filter(Boolean);
            const successCount = results.filter(r => r.success).length;
            const totalCount = results.length;
            console.log(`  ${testType}: ${successCount}/${totalCount} devices passed`);
        });
    }
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

// Run tests
const tester = new DirectMobileTester();
tester.runAllTests().catch(console.error);