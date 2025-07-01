#!/usr/bin/env node

const { chromium, webkit, firefox } = require('playwright');
const fs = require('fs');

// Mobile device configurations
const MOBILE_DEVICES = {
    'iPhone 13': {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    },
    'iPhone 13 Pro Max': {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 428, height: 926 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    },
    'Samsung Galaxy S21': {
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        viewport: { width: 360, height: 800 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    },
    'Google Pixel 6': {
        userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2.75,
        isMobile: true,
        hasTouch: true
    }
};

class MobileVerificationTester {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting comprehensive mobile verification tests...\n');
        
        // Test each device
        for (const [deviceName, config] of Object.entries(MOBILE_DEVICES)) {
            console.log(`📱 Testing ${deviceName}...`);
            await this.testDevice(deviceName, config);
        }
        
        // Generate report
        this.generateReport();
        console.log('\n✅ All mobile verification tests completed!');
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
            // Test 1: Load buy page
            console.log(`  🔍 Testing buy page load...`);
            await page.goto('https://auralo-website-fixed.netlify.app/buy.html');
            await page.waitForTimeout(3000);
            
            const buyButtonVisible = await page.isVisible('button:has-text("Buy POL Now")');
            testResult.tests.buyPageLoad = {
                success: buyButtonVisible,
                message: buyButtonVisible ? 'Buy button visible' : 'Buy button not found'
            };

            // Test 2: Button click functionality
            console.log(`  🖱️ Testing button click...`);
            await page.click('button:has-text("Buy POL Now")');
            await page.waitForTimeout(2000);
            
            const processingVisible = await page.isVisible(':text("Processing")');
            testResult.tests.buttonClick = {
                success: processingVisible,
                message: processingVisible ? 'Button click triggered processing' : 'No processing indication'
            };

            // Test 3: SimpleSwap navigation
            console.log(`  🌐 Testing SimpleSwap navigation...`);
            
            // Wait for new tab/window
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.waitForTimeout(5000)
            ]);

            if (newPage) {
                await newPage.waitForLoadState('networkidle');
                const url = newPage.url();
                const isSimpleSwap = url.includes('simpleswap.io');
                
                testResult.tests.simpleSwapNavigation = {
                    success: isSimpleSwap,
                    message: isSimpleSwap ? `Navigated to ${url}` : `Wrong URL: ${url}`,
                    url: url
                };

                if (isSimpleSwap) {
                    // Test 4: Mercuryo forcing verification
                    console.log(`  ⚡ Testing Mercuryo forcing...`);
                    
                    // Wait for page to fully load
                    await newPage.waitForTimeout(5000);
                    
                    // Check for Mercuryo elements with green border (forced)
                    const forcedElements = await newPage.$$eval('*', elements => {
                        return elements
                            .filter(el => {
                                const text = el.textContent?.toLowerCase() || '';
                                const style = window.getComputedStyle(el);
                                return text.includes('mercuryo') && 
                                       (style.border.includes('rgb(34, 197, 94)') || 
                                        style.borderColor.includes('rgb(34, 197, 94)'));
                            })
                            .length;
                    });

                    // Check for any Mercuryo elements
                    const mercuryoElements = await newPage.$$eval('*', elements => {
                        return elements
                            .filter(el => {
                                const text = el.textContent?.toLowerCase() || '';
                                return text.includes('mercuryo') && text.length < 500;
                            })
                            .length;
                    });

                    testResult.tests.mercuryoForcing = {
                        success: forcedElements > 0,
                        message: `Found ${mercuryoElements} Mercuryo elements, ${forcedElements} forced with green border`,
                        mercuryoElements: mercuryoElements,
                        forcedElements: forcedElements
                    };

                    // Test 5: Check for MoonPay elements (should be disabled)
                    console.log(`  🌙 Testing MoonPay disabling...`);
                    
                    const moonpayElements = await newPage.$$eval('*', elements => {
                        return elements
                            .filter(el => {
                                const text = el.textContent?.toLowerCase() || '';
                                return text.includes('moonpay') && text.length < 500;
                            })
                            .length;
                    });

                    const disabledMoonpayElements = await newPage.$$eval('*', elements => {
                        return elements
                            .filter(el => {
                                const text = el.textContent?.toLowerCase() || '';
                                const style = window.getComputedStyle(el);
                                return text.includes('moonpay') && 
                                       (style.opacity < 0.5 || style.filter.includes('grayscale'));
                            })
                            .length;
                    });

                    testResult.tests.moonpayDisabling = {
                        success: disabledMoonpayElements > 0 || moonpayElements === 0,
                        message: `Found ${moonpayElements} MoonPay elements, ${disabledMoonpayElements} disabled`,
                        moonpayElements: moonpayElements,
                        disabledElements: disabledMoonpayElements
                    };

                    // Take screenshot for verification
                    await newPage.screenshot({ 
                        path: `./screenshots/${deviceName.replace(/\s+/g, '_')}_simpleswap.png`,
                        fullPage: true 
                    });

                    testResult.tests.screenshot = {
                        success: true,
                        message: `Screenshot saved for ${deviceName}`,
                        path: `./screenshots/${deviceName.replace(/\s+/g, '_')}_simpleswap.png`
                    };
                }
                
                await newPage.close();
            } else {
                testResult.tests.simpleSwapNavigation = {
                    success: false,
                    message: 'No new page opened'
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
        const reportPath = './mobile-verification-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        // Summary
        const totalDevices = this.results.tests.length;
        const successfulDevices = this.results.tests.filter(test => 
            Object.values(test.tests).every(t => t.success)
        ).length;
        
        console.log(`\n📈 Summary:`);
        console.log(`  Total devices tested: ${totalDevices}`);
        console.log(`  Fully successful: ${successfulDevices}`);
        console.log(`  Success rate: ${((successfulDevices / totalDevices) * 100).toFixed(1)}%`);
        
        // Test specific results
        const testTypes = ['buyPageLoad', 'buttonClick', 'simpleSwapNavigation', 'mercuryoForcing', 'moonpayDisabling'];
        console.log(`\n🔍 Test Results by Type:`);
        
        testTypes.forEach(testType => {
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
const tester = new MobileVerificationTester();
tester.runAllTests().catch(console.error);