const { chromium, devices } = require('playwright');

// PROPER MOBILE EMULATION TEST
async function testWithProperEmulation() {
    console.log('🚀 STARTING PROPER MOBILE EMULATION TEST');
    console.log('=====================================\n');
    
    // Test configurations with real device emulation
    const deviceTests = [
        {
            name: 'iPhone 12 Pro',
            device: devices['iPhone 12 Pro']
        },
        {
            name: 'iPhone 14 Pro Max',
            device: devices['iPhone 14 Pro Max']
        },
        {
            name: 'Pixel 7',
            device: devices['Pixel 7']
        },
        {
            name: 'Galaxy S9+',
            device: devices['Galaxy S9+']
        },
        {
            name: 'iPad Pro 11',
            device: devices['iPad Pro 11']
        },
        {
            name: 'Galaxy Tab S4',
            device: devices['Galaxy Tab S4']
        }
    ];
    
    for (const test of deviceTests) {
        console.log(`\n📱 Testing: ${test.name}`);
        console.log('='.repeat(50));
        
        const browser = await chromium.launch({
            headless: false
        });
        
        // Create context with device emulation
        const context = await browser.newContext({
            ...test.device,
            locale: 'en-US',
            permissions: ['geolocation']
        });
        
        const page = await context.newPage();
        
        try {
            // Navigate to SimpleSwap
            console.log('📍 Navigating to SimpleSwap EUR...');
            await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', {
                waitUntil: 'networkidle'
            });
            
            // Handle cookie consent
            try {
                await page.click('button:has-text("Got it")', { timeout: 5000 });
                console.log('✅ Clicked cookie consent');
            } catch (e) {
                console.log('ℹ️ No cookie consent found');
            }
            
            // Click Exchange
            console.log('📍 Clicking Exchange button...');
            await page.waitForTimeout(2000);
            await page.click('button:has-text("Exchange")');
            
            // Wait for navigation
            await page.waitForTimeout(3000);
            
            // Fill address
            console.log('📍 Filling address...');
            const addressInput = await page.$('input[placeholder*="address" i], input[placeholder*="wallet" i]');
            if (addressInput) {
                await addressInput.fill('0xE5173e7c3089bD89cd1341b637b8e1951745ED5C');
                console.log('✅ Address filled');
            }
            
            // Try to click Create Exchange
            try {
                await page.click('button:has-text("Create an exchange")', { timeout: 5000 });
                console.log('✅ Clicked Create Exchange');
            } catch (e) {
                console.log('ℹ️ Create Exchange button not found or not clickable');
            }
            
            // Handle Stay in browser popup
            try {
                await page.click('button:has-text("Stay in browser")', { timeout: 5000 });
                console.log('✅ Clicked Stay in browser');
            } catch (e) {
                console.log('ℹ️ No Stay in browser popup');
            }
            
            // Wait for provider section
            await page.waitForTimeout(3000);
            
            // ANALYZE PROVIDER SELECTION
            console.log('\n🔍 Analyzing provider selection...');
            const providerAnalysis = await page.evaluate(() => {
                const results = {
                    mercuryoFound: false,
                    moonpayFound: false,
                    mercuryoHasGreenBorder: false,
                    moonpayHasGreenBorder: false,
                    detectedElements: []
                };
                
                // Find all elements
                const allElements = document.querySelectorAll('*');
                
                allElements.forEach(el => {
                    const text = el.textContent || '';
                    const styles = window.getComputedStyle(el);
                    
                    // Check if element contains provider name
                    if (text.includes('mercuryo') || text.includes('Mercuryo')) {
                        results.mercuryoFound = true;
                        
                        // Check for green border/selection
                        const borderColor = styles.borderColor;
                        const outline = styles.outline;
                        const boxShadow = styles.boxShadow;
                        
                        if (borderColor.includes('rgb(34, 197, 94)') || // green-500
                            borderColor.includes('rgb(74, 222, 128)') || // green-400
                            borderColor.includes('#22c55e') ||
                            outline.includes('rgb(34, 197, 94)') ||
                            boxShadow.includes('rgb(34, 197, 94)')) {
                            results.mercuryoHasGreenBorder = true;
                        }
                        
                        results.detectedElements.push({
                            provider: 'Mercuryo',
                            borderColor: borderColor,
                            outline: outline,
                            boxShadow: boxShadow.substring(0, 50)
                        });
                    }
                    
                    if (text.includes('moonpay') || text.includes('MoonPay')) {
                        results.moonpayFound = true;
                        
                        const borderColor = styles.borderColor;
                        const outline = styles.outline;
                        const boxShadow = styles.boxShadow;
                        
                        if (borderColor.includes('rgb(34, 197, 94)') ||
                            borderColor.includes('rgb(74, 222, 128)') ||
                            borderColor.includes('#22c55e') ||
                            outline.includes('rgb(34, 197, 94)') ||
                            boxShadow.includes('rgb(34, 197, 94)')) {
                            results.moonpayHasGreenBorder = true;
                        }
                        
                        results.detectedElements.push({
                            provider: 'MoonPay',
                            borderColor: borderColor,
                            outline: outline,
                            boxShadow: boxShadow.substring(0, 50)
                        });
                    }
                });
                
                return results;
            });
            
            console.log('\n📊 RESULTS:');
            console.log('Mercuryo found:', providerAnalysis.mercuryoFound ? '✅' : '❌');
            console.log('Mercuryo has green border:', providerAnalysis.mercuryoHasGreenBorder ? '✅' : '❌');
            console.log('MoonPay found:', providerAnalysis.moonpayFound ? '✅' : '❌');
            console.log('MoonPay has green border:', providerAnalysis.moonpayHasGreenBorder ? '✅' : '❌');
            
            if (providerAnalysis.detectedElements.length > 0) {
                console.log('\nDetected elements:');
                providerAnalysis.detectedElements.forEach(el => {
                    console.log(`- ${el.provider}:`);
                    console.log(`  Border: ${el.borderColor}`);
                    console.log(`  Outline: ${el.outline}`);
                    console.log(`  Shadow: ${el.boxShadow}`);
                });
            }
            
            // Take screenshot
            await page.screenshot({
                path: `test_${test.name.replace(/\s+/g, '_').toLowerCase()}_providers.png`,
                fullPage: true
            });
            console.log(`📸 Screenshot saved`);
            
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        } finally {
            await browser.close();
        }
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n\n✅ TESTING COMPLETE');
}

// Run the test
testWithProperEmulation().catch(console.error);