#!/usr/bin/env node

const { chromium } = require('playwright');

async function realWorldTest() {
    console.log('🌐 Real-World SimpleSwap Analysis...\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
        // Go directly to SimpleSwap to see what's actually there
        console.log('📱 Loading SimpleSwap directly...');
        await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=20', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        // Wait for dynamic content to load
        console.log('⏳ Waiting for dynamic content...');
        await page.waitForTimeout(10000);
        
        // Analyze what payment providers are actually present
        const providerAnalysis = await page.evaluate(() => {
            const results = {
                allText: [],
                mercuryoElements: [],
                moonpayElements: [],
                paymentSections: [],
                buttons: [],
                forms: []
            };
            
            // Scan all elements
            document.querySelectorAll('*').forEach((el, index) => {
                const text = (el.textContent || '').toLowerCase();
                
                // Collect all text for analysis
                if (text.length > 0 && text.length < 100) {
                    results.allText.push(text);
                }
                
                // Look for Mercuryo
                if (text.includes('mercuryo')) {
                    results.mercuryoElements.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        className: el.className,
                        id: el.id,
                        visible: el.offsetWidth > 0 && el.offsetHeight > 0
                    });
                }
                
                // Look for MoonPay
                if (text.includes('moonpay')) {
                    results.moonpayElements.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        className: el.className,
                        id: el.id,
                        visible: el.offsetWidth > 0 && el.offsetHeight > 0
                    });
                }
                
                // Look for payment-related sections
                if (text.includes('payment') || text.includes('provider') || text.includes('exchange')) {
                    results.paymentSections.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        className: el.className
                    });
                }
                
                // Collect buttons
                if (el.tagName === 'BUTTON' || el.type === 'button') {
                    results.buttons.push({
                        text: text.substring(0, 50),
                        className: el.className,
                        id: el.id
                    });
                }
                
                // Collect form elements
                if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                    results.forms.push({
                        type: el.type,
                        name: el.name,
                        className: el.className,
                        checked: el.checked
                    });
                }
            });
            
            return results;
        });
        
        // Take screenshot
        await page.screenshot({ 
            path: './screenshots/real_world_simpleswap.png', 
            fullPage: true 
        });
        
        // Report findings
        console.log('\n📊 REAL-WORLD ANALYSIS RESULTS:');
        console.log('\n🔍 Provider Detection:');
        console.log(`  Mercuryo elements found: ${providerAnalysis.mercuryoElements.length}`);
        console.log(`  MoonPay elements found: ${providerAnalysis.moonpayElements.length}`);
        
        if (providerAnalysis.mercuryoElements.length > 0) {
            console.log('\n✅ Mercuryo Elements:');
            providerAnalysis.mercuryoElements.forEach((el, i) => {
                console.log(`  ${i+1}. ${el.tag} - "${el.text}" (visible: ${el.visible})`);
            });
        }
        
        if (providerAnalysis.moonpayElements.length > 0) {
            console.log('\n🌙 MoonPay Elements:');
            providerAnalysis.moonpayElements.forEach((el, i) => {
                console.log(`  ${i+1}. ${el.tag} - "${el.text}" (visible: ${el.visible})`);
            });
        }
        
        console.log(`\n🔘 Buttons found: ${providerAnalysis.buttons.length}`);
        console.log(`📝 Form elements: ${providerAnalysis.forms.length}`);
        console.log(`📄 Payment sections: ${providerAnalysis.paymentSections.length}`);
        
        // Test our enhanced forcing script on the real page
        console.log('\n🚀 Testing Enhanced Forcing Script...');
        
        const forcingResults = await page.evaluate(() => {
            return new Promise((resolve) => {
                let attempts = 0;
                let totalForced = 0;
                let totalRemoved = 0;
                const maxAttempts = 50;
                
                function testForcing() {
                    attempts++;
                    let currentForced = 0;
                    let currentRemoved = 0;
                    
                    document.querySelectorAll('*').forEach(el => {
                        try {
                            const text = (el.textContent || '').toLowerCase();
                            const innerHTML = (el.innerHTML || '').toLowerCase();
                            const className = el.className ? el.className.toString().toLowerCase() : '';
                            const id = el.id ? el.id.toLowerCase() : '';
                            
                            // Mercuryo forcing
                            if ((text.includes('mercuryo') || innerHTML.includes('mercuryo') || 
                                 className.includes('mercuryo') || id.includes('mercuryo')) && 
                                text.length < 2000) {
                                
                                el.style.cssText += 'border: 5px solid #22c55e !important; background: rgba(34,197,94,0.4) !important;';
                                el.setAttribute('data-test-forced', 'true');
                                currentForced++;
                            }
                            
                            // MoonPay removal
                            if ((text.includes('moonpay') || innerHTML.includes('moonpay') || 
                                 className.includes('moonpay') || id.includes('moonpay')) && 
                                text.length < 2000) {
                                
                                el.style.display = 'none';
                                el.setAttribute('data-test-removed', 'true');
                                currentRemoved++;
                            }
                        } catch(e) {}
                    });
                    
                    totalForced = Math.max(totalForced, currentForced);
                    totalRemoved = Math.max(totalRemoved, currentRemoved);
                    
                    if (attempts >= maxAttempts) {
                        resolve({
                            attempts: maxAttempts,
                            totalForced,
                            totalRemoved,
                            finalCheck: {
                                forcedVisible: document.querySelectorAll('[data-test-forced="true"]').length,
                                removedHidden: document.querySelectorAll('[data-test-removed="true"]').length
                            }
                        });
                    } else {
                        setTimeout(testForcing, 500);
                    }
                }
                
                testForcing();
            });
        });
        
        console.log('\n🎯 FORCING SCRIPT TEST RESULTS:');
        console.log(`  Attempts: ${forcingResults.attempts}`);
        console.log(`  Elements forced: ${forcingResults.totalForced}`);
        console.log(`  Elements removed: ${forcingResults.totalRemoved}`);
        console.log(`  Final forced visible: ${forcingResults.finalCheck.forcedVisible}`);
        console.log(`  Final removed hidden: ${forcingResults.finalCheck.removedHidden}`);
        
        // Calculate success rate
        const hasProviders = providerAnalysis.mercuryoElements.length > 0 || providerAnalysis.moonpayElements.length > 0;
        const forcingWorked = forcingResults.totalForced > 0 || forcingResults.totalRemoved > 0;
        
        const successRate = hasProviders && forcingWorked ? 100 : (hasProviders ? 50 : 0);
        
        console.log(`\n🏆 REAL-WORLD SUCCESS RATE: ${successRate}%`);
        
        if (successRate === 100) {
            console.log('✅ PERFECT! Script finds and manipulates providers correctly');
        } else if (successRate === 50) {
            console.log('⚠️  Providers found but script needs improvement');
        } else {
            console.log('❌ No providers detected - page may not be loaded correctly');
        }
        
        console.log('\n📸 Screenshot saved: ./screenshots/real_world_simpleswap.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

// Run the test
realWorldTest().catch(console.error);