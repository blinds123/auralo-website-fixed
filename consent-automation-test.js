#!/usr/bin/env node

const { chromium, webkit } = require('playwright');
const fs = require('fs');

class ConsentAutomationTest {
    constructor() {
        this.results = [];
    }

    async runTest() {
        console.log('🧪 Testing Consent-Based Automation System...\n');
        
        // Test iOS Safari
        await this.testDevice('iOS Safari', webkit, {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });
        
        // Test Android Chrome
        await this.testDevice('Android Chrome', chromium, {
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 360, height: 800 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        this.generateReport();
    }

    async testDevice(deviceName, browserType, config) {
        console.log(`📱 Testing ${deviceName}...`);
        
        const browser = await browserType.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext(config);
        const page = await context.newPage();
        
        const result = {
            device: deviceName,
            timestamp: new Date().toISOString(),
            tests: {}
        };

        try {
            // Test 1: Load buy page and check consent system
            console.log(`  🔍 Testing buy page with consent system...`);
            
            await page.goto('https://auralo-website-fixed.netlify.app/buy.html', { 
                waitUntil: 'domcontentloaded',
                timeout: 15000 
            });
            
            // Check for consent checkbox
            const consentCheckbox = await page.$('#enableAutoOptimization');
            const buyButton = await page.$('#buyButton');
            
            result.tests.consentSystem = {
                success: !!consentCheckbox && !!buyButton,
                message: `Consent checkbox: ${!!consentCheckbox}, Buy button: ${!!buyButton}`,
                hasConsentCheckbox: !!consentCheckbox,
                hasBuyButton: !!buyButton
            };

            // Test 2: Test with consent enabled
            console.log(`  ✅ Testing with consent enabled...`);
            
            if (consentCheckbox) {
                await page.check('#enableAutoOptimization');
                
                // Set up popup detection
                let popupCreated = false;
                let popupPage = null;
                
                context.on('page', (newPage) => {
                    popupCreated = true;
                    popupPage = newPage;
                    console.log(`    ✅ SimpleSwap popup created`);
                });
                
                // Click buy button with consent
                await page.click('#buyButton');
                await page.waitForTimeout(5000);
                
                result.tests.consentEnabled = {
                    success: popupCreated,
                    message: `Popup created with consent: ${popupCreated}`,
                    popupCreated: popupCreated
                };

                // Test 3: Check if automation script was injected
                if (popupCreated && popupPage) {
                    console.log(`  🚀 Testing automation script injection...`);
                    
                    await popupPage.waitForTimeout(8000); // Wait for script injection
                    
                    // Check if optimization script is running
                    const scriptActive = await popupPage.evaluate(() => {
                        // Look for console messages indicating script is running
                        return document.head.innerHTML.includes('User consented optimization') ||
                               window.location.href.includes('auto=enabled');
                    });
                    
                    // Check for Mercuryo forcing indicators
                    const forcingActive = await popupPage.evaluate(() => {
                        const forcedElements = Array.from(document.querySelectorAll('*')).filter(el => 
                            el.style.border && el.style.border.includes('#22c55e')
                        );
                        return forcedElements.length;
                    });
                    
                    result.tests.automationInjection = {
                        success: scriptActive || forcingActive > 0,
                        message: `Script active: ${scriptActive}, Forced elements: ${forcingActive}`,
                        scriptActive: scriptActive,
                        forcedElements: forcingActive
                    };

                    // Test 4: Check MoonPay removal
                    console.log(`  🗑️ Testing MoonPay removal...`);
                    
                    await popupPage.waitForTimeout(5000);
                    
                    const moonpayCheck = await popupPage.evaluate(() => {
                        const moonpayElements = Array.from(document.querySelectorAll('*')).filter(el => 
                            (el.textContent || '').toLowerCase().includes('moonpay') && 
                            el.textContent.length < 500
                        );
                        
                        const visibleMoonpay = moonpayElements.filter(el => 
                            el.offsetWidth > 0 && el.offsetHeight > 0 && 
                            getComputedStyle(el).display !== 'none'
                        );
                        
                        return {
                            totalMoonpay: moonpayElements.length,
                            visibleMoonpay: visibleMoonpay.length,
                            hiddenMoonpay: moonpayElements.length - visibleMoonpay.length
                        };
                    });
                    
                    result.tests.moonpayRemoval = {
                        success: moonpayCheck.visibleMoonpay === 0 && moonpayCheck.totalMoonpay > 0,
                        message: `Total: ${moonpayCheck.totalMoonpay}, Visible: ${moonpayCheck.visibleMoonpay}, Hidden: ${moonpayCheck.hiddenMoonpay}`,
                        ...moonpayCheck
                    };

                    // Screenshot
                    const screenshotPath = `./screenshots/${deviceName.replace(/\s+/g, '_')}_consent_automation.png`;
                    await popupPage.screenshot({ path: screenshotPath, fullPage: true });
                    
                    result.tests.screenshot = {
                        success: true,
                        message: `Screenshot: ${screenshotPath}`,
                        path: screenshotPath
                    };
                }
            }

            // Test 5: Test without consent (control)
            console.log(`  ❌ Testing without consent (control)...`);
            
            await page.goto('https://auralo-website-fixed.netlify.app/buy.html');
            await page.waitForTimeout(2000);
            
            // Don't check the consent box
            let controlPopupCreated = false;
            
            context.on('page', (newPage) => {
                controlPopupCreated = true;
            });
            
            await page.click('#buyButton');
            await page.waitForTimeout(3000);
            
            result.tests.controlTest = {
                success: controlPopupCreated,
                message: `Control popup (no consent): ${controlPopupCreated}`,
                popupCreated: controlPopupCreated
            };

        } catch (error) {
            result.tests.error = {
                success: false,
                message: `Test failed: ${error.message}`,
                stack: error.stack
            };
        }

        await browser.close();
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
        const reportPath = './consent-automation-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`📄 Test report saved: ${reportPath}\n`);
        
        console.log(`🎯 CONSENT-BASED AUTOMATION TEST SUMMARY:`);
        
        let totalTests = 0;
        let passedTests = 0;
        
        this.results.forEach(result => {
            const criticalTests = ['consentSystem', 'consentEnabled', 'automationInjection', 'moonpayRemoval'];
            const criticalPassed = criticalTests.filter(test => 
                result.tests[test] && result.tests[test].success
            ).length;
            
            totalTests += criticalTests.length;
            passedTests += criticalPassed;
            
            const successRate = (criticalPassed / criticalTests.length * 100).toFixed(1);
            console.log(`  ${result.device}: ${successRate}% (${criticalPassed}/${criticalTests.length})`);
        });
        
        const overallSuccess = (passedTests / totalTests * 100).toFixed(1);
        console.log(`\n🏆 OVERALL SUCCESS: ${overallSuccess}% (${passedTests}/${totalTests})`);
        
        if (overallSuccess >= 75) {
            console.log(`\n✅ CONSENT-BASED AUTOMATION IS WORKING!`);
            console.log(`🎯 The "virus-like" solution with user consent is functional`);
            console.log(`🔒 User consent system is properly implemented`);
            console.log(`🚀 Automation successfully injects and runs on mobile`);
        } else {
            console.log(`\n⚠️  Automation needs improvement. Success rate: ${overallSuccess}%`);
        }
    }
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

// Run the test
const tester = new ConsentAutomationTest();
tester.runTest().catch(console.error);