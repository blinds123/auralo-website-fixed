const puppeteer = require('puppeteer');

// COMPREHENSIVE MOBILE DEVICE TESTING SUITE
const DEVICE_CONFIGS = [
    // IPHONES
    {
        name: 'iPhone 12 Pro - Safari',
        viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'iPhone 14 Pro Max - Safari',
        viewport: { width: 430, height: 932, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'iPhone 12 - Chrome',
        viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.38'
    },
    {
        name: 'iPhone SE - Safari',
        viewport: { width: 375, height: 667, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    
    // ANDROID PHONES
    {
        name: 'Samsung Galaxy S23 - Chrome',
        viewport: { width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 3.5 },
        userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
        name: 'Google Pixel 7 - Chrome',
        viewport: { width: 411, height: 823, isMobile: true, hasTouch: true, deviceScaleFactor: 2.625 },
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
        name: 'Samsung Galaxy S21 - Firefox',
        viewport: { width: 360, height: 800, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
        userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
    },
    {
        name: 'OnePlus 11 - Chrome',
        viewport: { width: 412, height: 919, isMobile: true, hasTouch: true, deviceScaleFactor: 3.5 },
        userAgent: 'Mozilla/5.0 (Linux; Android 14; CPH2449) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    
    // TABLETS
    {
        name: 'iPad Pro 12.9 - Safari',
        viewport: { width: 1024, height: 1366, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'iPad Air - Safari',
        viewport: { width: 820, height: 1180, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
        name: 'Samsung Galaxy Tab S9 - Chrome',
        viewport: { width: 753, height: 1205, isMobile: true, hasTouch: true, deviceScaleFactor: 2.625 },
        userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
        name: 'iPad Mini - Chrome',
        viewport: { width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.38'
    }
];

async function testDevice(config) {
    console.log(`\n📱 Testing: ${config.name}`);
    console.log('='.repeat(50));
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: config.viewport,
        args: [`--user-agent=${config.userAgent}`, '--enable-touch-events']
    });
    
    try {
        const page = await browser.newPage();
        
        // Test 1: Direct EUR URL
        console.log('\n🔍 Test 1: Direct EUR URL');
        await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo', {
            waitUntil: 'networkidle2'
        });
        
        // Handle cookie consent
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const gotIt = buttons.find(btn => btn.textContent.includes('Got it'));
            if (gotIt) gotIt.click();
        });
        
        // Click Exchange
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const exchange = buttons.find(btn => btn.textContent.trim() === 'Exchange');
            if (exchange) exchange.click();
        });
        
        // Wait for provider page
        await page.waitForTimeout(5000);
        
        // Fill address if needed
        await page.evaluate(() => {
            const input = document.querySelector('input[placeholder*="address"]');
            if (input) {
                input.value = '0xE5173e7c3089bD89cd1341b637b8e1951745ED5C';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // Click Create Exchange if present
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const create = buttons.find(btn => 
                btn.textContent.toLowerCase().includes('create') && 
                btn.textContent.toLowerCase().includes('exchange')
            );
            if (create) create.click();
        });
        
        await page.waitForTimeout(3000);
        
        // Handle "Stay in browser" popup
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a'));
            const stay = buttons.find(btn => btn.textContent.includes('Stay in browser'));
            if (stay) stay.click();
        });
        
        await page.waitForTimeout(3000);
        
        // CHECK FOR GREEN BORDER
        const providerStatus = await page.evaluate(() => {
            // Look for elements with green borders or selected states
            const allElements = Array.from(document.querySelectorAll('*'));
            const results = {
                mercuryoHasGreenBorder: false,
                moonpayHasGreenBorder: false,
                detectedProviders: []
            };
            
            allElements.forEach(el => {
                const text = el.textContent || '';
                const styles = window.getComputedStyle(el);
                const borderColor = styles.borderColor;
                const backgroundColor = styles.backgroundColor;
                const classList = Array.from(el.classList);
                
                // Check if element has green border (various green shades)
                const hasGreenBorder = 
                    borderColor.includes('rgb(34, 197, 94)') || // green-500
                    borderColor.includes('rgb(22, 163, 74)') || // green-600
                    borderColor.includes('rgb(16, 185, 129)') || // emerald-500
                    borderColor.includes('rgb(74, 222, 128)') || // green-400
                    borderColor.includes('#') && borderColor.toLowerCase().includes('22c55e') ||
                    classList.some(c => c.includes('selected') || c.includes('active'));
                
                if (text.toLowerCase().includes('mercuryo') && el.children.length < 5) {
                    if (hasGreenBorder) {
                        results.mercuryoHasGreenBorder = true;
                        results.detectedProviders.push({
                            provider: 'Mercuryo',
                            borderColor: borderColor,
                            classes: classList.join(' '),
                            hasGreenBorder: true
                        });
                    }
                }
                
                if (text.toLowerCase().includes('moonpay') && el.children.length < 5) {
                    if (hasGreenBorder) {
                        results.moonpayHasGreenBorder = true;
                        results.detectedProviders.push({
                            provider: 'MoonPay',
                            borderColor: borderColor,
                            classes: classList.join(' '),
                            hasGreenBorder: true
                        });
                    }
                }
            });
            
            return results;
        });
        
        console.log('\n📊 Results for', config.name);
        console.log('Mercuryo has green border:', providerStatus.mercuryoHasGreenBorder ? '✅' : '❌');
        console.log('MoonPay has green border:', providerStatus.moonpayHasGreenBorder ? '✅' : '❌');
        console.log('Detected providers:', providerStatus.detectedProviders);
        
        await page.screenshot({ 
            path: `test_${config.name.replace(/\s/g, '_').toLowerCase()}.png`,
            fullPage: true 
        });
        
        // Test 2: Enhanced URL with parameters
        console.log('\n🔍 Test 2: Enhanced URL with preferred=mercuryo');
        await page.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&preferred=mercuryo', {
            waitUntil: 'networkidle2'
        });
        
        // Repeat the process...
        // (Similar steps as above)
        
        await browser.close();
        
        return {
            device: config.name,
            directEUR: providerStatus,
            enhancedURL: null // Would be filled by Test 2
        };
        
    } catch (error) {
        console.error(`❌ Error testing ${config.name}:`, error.message);
        await browser.close();
        return {
            device: config.name,
            error: error.message
        };
    }
}

async function runAllTests() {
    console.log('🚀 COMPREHENSIVE MOBILE DEVICE TESTING');
    console.log('=====================================');
    console.log(`Testing ${DEVICE_CONFIGS.length} device configurations...`);
    
    const results = [];
    
    for (const config of DEVICE_CONFIGS) {
        const result = await testDevice(config);
        results.push(result);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Summary
    console.log('\n\n📊 FINAL SUMMARY');
    console.log('================');
    
    results.forEach(result => {
        console.log(`\n${result.device}:`);
        if (result.error) {
            console.log(`  ❌ Error: ${result.error}`);
        } else {
            console.log(`  Direct EUR: Mercuryo border: ${result.directEUR.mercuryoHasGreenBorder ? '✅' : '❌'}, MoonPay border: ${result.directEUR.moonpayHasGreenBorder ? '✅' : '❌'}`);
        }
    });
}

// Run tests
runAllTests().catch(console.error);