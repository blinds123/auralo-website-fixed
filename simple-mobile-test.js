#!/usr/bin/env node

const { chromium, webkit } = require('playwright');
const fs = require('fs');

class SimpleMobileTest {
    constructor() {
        this.results = [];
    }

    async runTest() {
        console.log('🚀 Running simple mobile verification test...\n');
        
        // Test with Chromium (Android Chrome)
        await this.testBrowser('Chromium Mobile', chromium);
        
        // Test with WebKit (iOS Safari)
        await this.testBrowser('WebKit Mobile', webkit);

        this.generateReport();
    }

    async testBrowser(browserName, browserType) {
        console.log(`🌐 Testing ${browserName}...`);
        
        const browser = await browserType.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext({
            userAgent: browserName.includes('WebKit') ? 
                'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' :
                'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: browserName.includes('WebKit') ? 
                { width: 390, height: 844 } : 
                { width: 360, height: 800 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        const page = await context.newPage();
        
        const result = {
            browser: browserName,
            timestamp: new Date().toISOString(),
            tests: {}
        };

        try {
            // Test our buy page first
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

            // Test SimpleSwap
            console.log(`  🌐 Testing SimpleSwap...`);
            
            await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=50', { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });
            
            // Wait for page to load
            await page.waitForTimeout(10000);
            
            result.tests.simpleSwapLoad = {
                success: true,
                message: 'SimpleSwap loaded successfully',
                url: page.url()
            };

            // Inject simple forcing script
            console.log(`  ⚡ Injecting forcing script...`);
            
            const forcingResults = await page.evaluate(() => {
                let forced = 0;
                let disabled = 0;
                
                // Simple forcing logic
                document.querySelectorAll('*').forEach(el => {
                    if (!el || !el.offsetWidth) return;
                    
                    const text = (el.textContent || '').toLowerCase();
                    
                    if (text.includes('mercuryo') && text.length < 500) {
                        el.style.border = '3px solid #22c55e';
                        el.style.background = 'rgba(34, 197, 94, 0.2)';
                        el.style.boxShadow = '0 0 10px #22c55e';
                        el.setAttribute('data-forced', 'true');
                        forced++;
                        
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
                        el.setAttribute('data-disabled', 'true');
                        disabled++;
                    }
                });
                
                return { forced, disabled, totalElements: document.querySelectorAll('*').length };
            });

            result.tests.forcingExecution = {
                success: forcingResults.forced > 0 || forcingResults.disabled > 0,
                message: `Forced ${forcingResults.forced} Mercuryo, disabled ${forcingResults.disabled} MoonPay elements`,
                ...forcingResults
            };

            // Content analysis
            const contentAnalysis = await page.evaluate(() => {
                const bodyText = document.body.textContent.toLowerCase();
                return {
                    hasMercuryo: bodyText.includes('mercuryo'),
                    hasMoonpay: bodyText.includes('moonpay'),
                    mercuryoCount: (bodyText.match(/mercuryo/g) || []).length,
                    moonpayCount: (bodyText.match(/moonpay/g) || []).length,
                    totalElements: document.querySelectorAll('*').length
                };
            });

            result.tests.contentAnalysis = {
                success: contentAnalysis.hasMercuryo || contentAnalysis.hasMoonpay,
                message: `Found ${contentAnalysis.mercuryoCount} Mercuryo, ${contentAnalysis.moonpayCount} MoonPay mentions`,
                ...contentAnalysis
            };

            // Screenshot
            const screenshotPath = `./screenshots/${browserName.replace(/\s+/g, '_')}_simple.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            
            result.tests.screenshot = {
                success: true,
                message: `Screenshot saved: ${screenshotPath}`,
                path: screenshotPath
            };

        } catch (error) {
            result.tests.error = {
                success: false,
                message: `Test failed: ${error.message}`
            };
        }

        await browser.close();
        this.results.push(result);
        this.printBrowserResults(result);
    }

    printBrowserResults(result) {
        console.log(`\n  📊 Results for ${result.browser}:`);
        for (const [testName, testResult] of Object.entries(result.tests)) {
            const status = testResult.success ? '✅' : '❌';
            console.log(`    ${status} ${testName}: ${testResult.message}`);
        }
        console.log('');
    }

    generateReport() {
        const reportPath = './simple-mobile-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\n📄 Report saved to: ${reportPath}`);
        
        console.log(`\n📈 Summary:`);
        this.results.forEach(result => {
            const tests = Object.values(result.tests);
            const successCount = tests.filter(t => t.success).length;
            const successRate = (successCount / tests.length * 100).toFixed(1);
            
            console.log(`  ${result.browser}: ${successRate}% success rate (${successCount}/${tests.length})`);
            
            if (result.tests.forcingExecution) {
                const test = result.tests.forcingExecution;
                console.log(`    Forcing: ${test.forced || 0} forced, ${test.disabled || 0} disabled`);
            }
            
            if (result.tests.contentAnalysis) {
                const test = result.tests.contentAnalysis;
                console.log(`    Content: ${test.mercuryoCount || 0} Mercuryo, ${test.moonpayCount || 0} MoonPay`);
            }
        });
    }
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

// Run test
const tester = new SimpleMobileTest();
tester.runTest().catch(console.error);