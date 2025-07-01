#!/usr/bin/env node

const { chromium, webkit } = require('playwright');
const fs = require('fs');

class EnhancedForcingTest {
    constructor() {
        this.results = [];
    }

    async runTest() {
        console.log('🚀 Running enhanced forcing test with dynamic content detection...\n');
        
        // Test with Chromium (for Android Chrome simulation)
        await this.testBrowser('Chromium Mobile', chromium, {
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            viewport: { width: 360, height: 800 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        // Test with WebKit (for iOS Safari simulation)
        await this.testBrowser('WebKit Mobile', webkit, {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });

        this.generateReport();
    }

    async testBrowser(browserName, browserType, config) {
        console.log(`🌐 Testing ${browserName}...`);
        
        const browser = await browserType.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext(config);
        const page = await context.newPage();
        
        const result = {
            browser: browserName,
            timestamp: new Date().toISOString(),
            tests: {}
        };

        try {
            // Test SimpleSwap with enhanced waiting
            console.log(`  🌐 Loading SimpleSwap with enhanced waiting...`);
            
            await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=50', { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });
            
            // Wait for dynamic content with multiple strategies
            console.log(`  ⏰ Waiting for dynamic content...`);
            
            // Strategy 1: Wait for common elements
            try {
                await page.waitForSelector('input, button, select', { timeout: 10000 });
                console.log(`    ✅ Basic elements loaded`);
            } catch(e) {
                console.log(`    ⚠️ Basic elements timeout: ${e.message}`);
            }

            // Strategy 2: Wait for text content
            await page.waitForTimeout(8000); // Give time for dynamic loading
            
            // Strategy 3: Enhanced forcing with multiple attempts
            console.log(`  ⚡ Running enhanced Mercuryo forcing...`);
            
            const enhancedResults = await page.evaluate(() => {
                return new Promise((resolve) => {
                    let totalForced = 0;
                    let totalDisabled = 0;
                    let attempts = 0;
                    const maxAttempts = 20;
                    
                    function enhancedForcing() {
                        attempts++;
                        let currentForced = 0;
                        let currentDisabled = 0;
                        
                        // Get all elements
                        const allElements = document.querySelectorAll('*');
                        console.log('Attempt ' + attempts + ': Scanning ' + allElements.length + ' elements');
                        
                        allElements.forEach(el => {
                            if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
                            
                            const text = (el.textContent || '').toLowerCase();
                            const innerHTML = (el.innerHTML || '').toLowerCase();
                            const className = (el.className || '').toLowerCase();
                            const id = (el.id || '').toLowerCase();
                            
                            // Enhanced Mercuryo detection
                            if ((text.includes('mercuryo') || innerHTML.includes('mercuryo') || 
                                 className.includes('mercuryo') || id.includes('mercuryo')) && 
                                text.length < 1000) {
                                
                                // Ultra-aggressive styling
                                el.style.cssText += \`
                                    border: 4px solid #22c55e !important;
                                    background: rgba(34, 197, 94, 0.3) !important;
                                    box-shadow: 0 0 20px #22c55e !important;
                                    outline: 2px solid #22c55e !important;
                                    z-index: 99999 !important;
                                    position: relative !important;
                                \`;
                                
                                // Multiple selection attributes
                                el.setAttribute('data-auralo-forced', 'true');
                                el.setAttribute('aria-selected', 'true');
                                el.setAttribute('data-selected', 'true');
                                el.setAttribute('selected', 'true');
                                
                                // Add classes
                                if (el.classList) {
                                    el.classList.add('selected', 'active', 'preferred', 'auralo-forced');
                                }
                                
                                // Enhanced interaction
                                setTimeout(() => {
                                    try {
                                        // Multiple click methods
                                        el.click();
                                        el.focus();
                                        
                                        // Dispatch events
                                        ['mousedown', 'mouseup', 'click', 'change', 'input'].forEach(eventType => {
                                            try {
                                                el.dispatchEvent(new Event(eventType, { bubbles: true }));
                                            } catch(e) {}
                                        });
                                        
                                        // Form element handling
                                        if (el.tagName === 'INPUT') {
                                            if (el.type === 'radio' || el.type === 'checkbox') {
                                                el.checked = true;
                                            }
                                            el.value = 'mercuryo';
                                        } else if (el.tagName === 'SELECT') {
                                            for (let option of el.options) {
                                                if (option.value.toLowerCase().includes('mercuryo')) {
                                                    option.selected = true;
                                                    el.selectedIndex = option.index;
                                                    break;
                                                }
                                            }
                                        }
                                        
                                        // Touch events for mobile
                                        if ('ontouchstart' in window) {
                                            const rect = el.getBoundingClientRect();
                                            const touch = new Touch({
                                                identifier: Date.now(),
                                                target: el,
                                                clientX: rect.left + rect.width / 2,
                                                clientY: rect.top + rect.height / 2
                                            });
                                            
                                            el.dispatchEvent(new TouchEvent('touchstart', {
                                                bubbles: true,
                                                touches: [touch]
                                            }));
                                            
                                            setTimeout(() => {
                                                el.dispatchEvent(new TouchEvent('touchend', {
                                                    bubbles: true,
                                                    touches: []
                                                }));
                                            }, 100);
                                        }
                                    } catch(e) {}
                                }, 50 * currentForced);
                                
                                currentForced++;
                                totalForced = Math.max(totalForced, currentForced);
                            }
                            
                            // Enhanced MoonPay disabling
                            if ((text.includes('moonpay') || innerHTML.includes('moonpay') || 
                                 className.includes('moonpay') || id.includes('moonpay')) && 
                                text.length < 1000) {
                                
                                // Ultra-aggressive disabling
                                el.style.cssText += \`
                                    opacity: 0.2 !important;
                                    filter: grayscale(100%) blur(1px) !important;
                                    pointer-events: none !important;
                                    user-select: none !important;
                                    z-index: -1 !important;
                                \`;
                                
                                el.setAttribute('data-auralo-disabled', 'true');
                                el.setAttribute('aria-disabled', 'true');
                                el.setAttribute('disabled', 'true');
                                
                                if (el.classList) {
                                    el.classList.add('disabled', 'auralo-disabled');
                                }
                                
                                // Disable form elements
                                if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
                                    el.disabled = true;
                                    el.checked = false;
                                    el.selected = false;
                                }
                                
                                currentDisabled++;
                                totalDisabled = Math.max(totalDisabled, currentDisabled);
                            }
                        });
                        
                        console.log('Attempt ' + attempts + ': Forced ' + currentForced + ', Disabled ' + currentDisabled);
                        
                        if (attempts < maxAttempts) {
                            setTimeout(enhancedForcing, 1000);
                        } else {
                            resolve({
                                totalForced,
                                totalDisabled,
                                attempts: maxAttempts,
                                finalCheck: {
                                    forcedVisible: document.querySelectorAll('[data-auralo-forced="true"]').length,
                                    disabledVisible: document.querySelectorAll('[data-auralo-disabled="true"]').length
                                }
                            });
                        }
                    }
                    
                    // Start enhanced forcing
                    enhancedForcing();
                });
            });

            result.tests.enhancedForcing = {
                success: enhancedResults.totalForced > 0,
                message: `Enhanced forcing: ${enhancedResults.totalForced} forced, ${enhancedResults.totalDisabled} disabled over ${enhancedResults.attempts} attempts`,
                ...enhancedResults
            };

            // Content analysis
            console.log(\`  📄 Analyzing page content...\`);
            
            const contentAnalysis = await page.evaluate(() => {
                const bodyText = document.body.textContent.toLowerCase();
                const allElements = document.querySelectorAll('*').length;
                const inputElements = document.querySelectorAll('input, select, button').length;
                
                return {
                    totalElements: allElements,
                    inputElements: inputElements,
                    hasMercuryo: bodyText.includes('mercuryo'),
                    hasMoonpay: bodyText.includes('moonpay'),
                    mercuryoCount: (bodyText.match(/mercuryo/g) || []).length,
                    moonpayCount: (bodyText.match(/moonpay/g) || []).length,
                    bodyTextLength: bodyText.length,
                    currentUrl: window.location.href
                };
            });

            result.tests.contentAnalysis = {
                success: contentAnalysis.hasMercuryo || contentAnalysis.hasMoonpay,
                message: `Page analysis: ${contentAnalysis.mercuryoCount} Mercuryo, ${contentAnalysis.moonpayCount} MoonPay mentions`,
                ...contentAnalysis
            };

            // Screenshot for verification
            const screenshotPath = `./screenshots/${browserName.replace(/\s+/g, '_')}_enhanced.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            
            result.tests.screenshot = {
                success: true,
                message: `Screenshot: ${screenshotPath}`,
                path: screenshotPath
            };

        } catch (error) {
            result.tests.error = {
                success: false,
                message: `Browser test failed: ${error.message}`,
                stack: error.stack
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
        const reportPath = './enhanced-forcing-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\n📄 Enhanced report saved to: ${reportPath}`);
        
        console.log(`\n📈 Enhanced Test Summary:`);
        this.results.forEach(result => {
            const successRate = Object.values(result.tests).filter(t => t.success).length / Object.keys(result.tests).length;
            console.log(`  ${result.browser}: ${(successRate * 100).toFixed(1)}% success rate`);
            
            if (result.tests.enhancedForcing) {
                const test = result.tests.enhancedForcing;
                console.log(`    Forcing: ${test.totalForced || 0} forced, ${test.totalDisabled || 0} disabled`);
            }
            
            if (result.tests.contentAnalysis) {
                const test = result.tests.contentAnalysis;
                console.log(`    Content: ${test.mercuryoCount || 0} Mercuryo, ${test.moonpayCount || 0} MoonPay mentions`);
            }
        });
    }
}

// Create screenshots directory
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

// Run enhanced test
const tester = new EnhancedForcingTest();
tester.runTest().catch(console.error);