const puppeteer = require('puppeteer');

// COMPREHENSIVE MOBILE MERCURYO TEST
async function testMobileMercuryoSolution() {
    console.log('🧪 STARTING COMPREHENSIVE MOBILE MERCURYO TEST');
    console.log('===========================================');
    
    const results = {
        tests: [],
        success: false
    };
    
    // Test 1: Direct EUR URL (reproduces user's screenshot issue)
    console.log('\n📋 TEST 1: Direct EUR URL (Current Problem)');
    try {
        const browser1 = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 375,
                height: 812,
                isMobile: true,
                hasTouch: true
            },
            args: ['--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1']
        });
        
        const page1 = await browser1.newPage();
        await page1.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo');
        
        // Wait for page to load
        await page1.waitForTimeout(5000);
        
        // Check which provider is selected
        const provider1 = await page1.evaluate(() => {
            // Check for active/selected provider
            const mercuryoSelected = document.querySelector('.mercuryo.selected, .mercuryo.active, [data-provider="mercuryo"].selected');
            const moonpaySelected = document.querySelector('.moonpay.selected, .moonpay.active, [data-provider="moonpay"].selected');
            
            // Check visible text
            const pageText = document.body.innerText.toLowerCase();
            const hasMercuryo = pageText.includes('mercuryo');
            const hasMoonpay = pageText.includes('moonpay');
            
            return {
                mercuryoSelected: !!mercuryoSelected,
                moonpaySelected: !!moonpaySelected,
                hasMercuryo,
                hasMoonpay,
                url: window.location.href
            };
        });
        
        console.log('Direct EUR Result:', provider1);
        results.tests.push({
            name: 'Direct EUR',
            ...provider1
        });
        
        await page1.screenshot({ path: 'test1_direct_eur.png' });
        await browser1.close();
        
    } catch (error) {
        console.error('Test 1 Error:', error.message);
    }
    
    // Test 2: Enhanced Desktop Spoofing Solution
    console.log('\n🚀 TEST 2: Enhanced Desktop Spoofing Solution');
    try {
        const browser2 = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 375,
                height: 812,
                isMobile: true,
                hasTouch: true
            },
            args: ['--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1']
        });
        
        const page2 = await browser2.newPage();
        
        // Create the enhanced spoofing page
        const enhancedHTML = `
        <html>
        <head>
            <title>Enhanced Test</title>
            <meta name="viewport" content="width=1920,initial-scale=1.0">
        </head>
        <body>
            <h2>Testing Enhanced Solution...</h2>
            <script>
                Object.defineProperty(navigator, "userAgent", {
                    value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    writable: false
                });
                Object.defineProperty(navigator, "platform", {
                    value: "Win32",
                    writable: false
                });
                
                // Try multiple strategies
                const urls = [
                    'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&preferred=mercuryo',
                    'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&provider=mercuryo',
                    'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&device=desktop'
                ];
                
                let index = 0;
                function tryNext() {
                    if (index < urls.length) {
                        console.log('Trying URL ' + (index + 1) + ': ' + urls[index]);
                        window.location.href = urls[index];
                    }
                }
                
                setTimeout(tryNext, 1000);
            </script>
        </body>
        </html>`;
        
        await page2.goto(`data:text/html,${encodeURIComponent(enhancedHTML)}`);
        
        // Wait for redirect
        await page2.waitForTimeout(3000);
        
        // Check which provider is selected after enhanced solution
        const provider2 = await page2.evaluate(() => {
            const pageText = document.body.innerText.toLowerCase();
            return {
                hasMercuryo: pageText.includes('mercuryo'),
                hasMoonpay: pageText.includes('moonpay'),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
        });
        
        console.log('Enhanced Solution Result:', provider2);
        results.tests.push({
            name: 'Enhanced Desktop Spoofing',
            ...provider2
        });
        
        await page2.screenshot({ path: 'test2_enhanced_solution.png' });
        await browser2.close();
        
    } catch (error) {
        console.error('Test 2 Error:', error.message);
    }
    
    // Test 3: Desktop Control Test
    console.log('\n🖥️ TEST 3: Desktop Control Test');
    try {
        const browser3 = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });
        
        const page3 = await browser3.newPage();
        await page3.goto('https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&preferred=mercuryo');
        
        await page3.waitForTimeout(5000);
        
        const provider3 = await page3.evaluate(() => {
            const pageText = document.body.innerText.toLowerCase();
            return {
                hasMercuryo: pageText.includes('mercuryo'),
                hasMoonpay: pageText.includes('moonpay'),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
        });
        
        console.log('Desktop Control Result:', provider3);
        results.tests.push({
            name: 'Desktop Control',
            ...provider3
        });
        
        await page3.screenshot({ path: 'test3_desktop_control.png' });
        await browser3.close();
        
    } catch (error) {
        console.error('Test 3 Error:', error.message);
    }
    
    // Analyze results
    console.log('\n📊 FINAL RESULTS:');
    console.log('================');
    results.tests.forEach(test => {
        console.log(`\n${test.name}:`);
        console.log(`  - Has Mercuryo: ${test.hasMercuryo ? '✅' : '❌'}`);
        console.log(`  - Has MoonPay: ${test.hasMoonpay ? '✅' : '❌'}`);
        console.log(`  - URL: ${test.url}`);
    });
    
    // Determine success
    const enhancedTest = results.tests.find(t => t.name === 'Enhanced Desktop Spoofing');
    const directTest = results.tests.find(t => t.name === 'Direct EUR');
    
    if (enhancedTest && directTest) {
        results.success = enhancedTest.hasMercuryo && !enhancedTest.hasMoonpay;
        console.log('\n🎯 SOLUTION SUCCESS:', results.success ? '✅ WORKING' : '❌ NOT WORKING');
    }
    
    return results;
}

// Run the test
testMobileMercuryoSolution().then(results => {
    console.log('\n✅ Test completed');
}).catch(error => {
    console.error('\n❌ Test failed:', error);
});