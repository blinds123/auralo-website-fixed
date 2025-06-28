// Systematic SimpleSwap Provider Selection Investigation
// Testing different parameters to find what triggers Mercuryo

const { chromium } = require('playwright');

async function systematicSimpleSwapTest() {
    console.log('🔬 Systematic SimpleSwap Provider Selection Investigation\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Test different URL variations
    const testCases = [
        {
            name: "Original (Current)",
            url: "https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo",
            description: "Current implementation - pre-filled amount"
        },
        {
            name: "Different Amount 1",
            url: "https://simpleswap.io/?from=usd&to=pol&amount=20&partner=auralo",
            description: "Test if round number affects provider"
        },
        {
            name: "Different Amount 2", 
            url: "https://simpleswap.io/?from=usd&to=pol&amount=25&partner=auralo",
            description: "Test higher amount"
        },
        {
            name: "Different Amount 3",
            url: "https://simpleswap.io/?from=usd&to=pol&amount=15&partner=auralo", 
            description: "Test lower amount"
        },
        {
            name: "Different Currency",
            url: "https://simpleswap.io/?from=usd&to=matic&amount=19.50&partner=auralo",
            description: "Test MATIC instead of POL"
        },
        {
            name: "No Partner",
            url: "https://simpleswap.io/?from=usd&to=pol&amount=19.50",
            description: "Test without partner parameter"
        },
        {
            name: "Additional Parameters",
            url: "https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo&ref=mobile",
            description: "Test with reference parameter"
        },
        {
            name: "Reverse Order",
            url: "https://simpleswap.io/?partner=auralo&amount=19.50&to=pol&from=usd",
            description: "Test parameter order"
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n📱 Testing: ${testCase.name}`);
        console.log(`   URL: ${testCase.url}`);
        console.log(`   Desc: ${testCase.description}`);
        
        await testURLVariation(browser, testCase, 'mobile');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await testURLVariation(browser, testCase, 'desktop'); 
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await browser.close();
    console.log('\n🏁 Systematic testing complete!');
}

async function testURLVariation(browser, testCase, deviceType) {
    const context = await browser.newContext({
        userAgent: deviceType === 'mobile' 
            ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
            : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        viewport: deviceType === 'mobile' 
            ? { width: 375, height: 667 }
            : { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log(`   → ${deviceType}: Opening URL...`);
        await page.goto(testCase.url);
        await page.waitForLoadState('networkidle');
        
        // Look for exchange button and click it
        const exchangeButton = page.locator('button, input[type="submit"], .button').filter({ hasText: /exchange|continue|next/i }).first();
        
        if (await exchangeButton.isVisible({ timeout: 5000 })) {
            console.log(`   → ${deviceType}: Clicking exchange...`);
            await exchangeButton.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            
            // Check for providers
            const content = await page.content();
            const hasMercuryo = content.toLowerCase().includes('mercuryo');
            const hasMoonPay = content.toLowerCase().includes('moonpay');
            
            let result = '';
            if (hasMercuryo && !hasMoonPay) result = '✅ MERCURYO ONLY';
            else if (!hasMercuryo && hasMoonPay) result = '❌ MOONPAY ONLY';
            else if (hasMercuryo && hasMoonPay) result = '⚠️ BOTH PROVIDERS';
            else result = '❓ NO PROVIDERS DETECTED';
            
            console.log(`   → ${deviceType}: ${result}`);
        } else {
            console.log(`   → ${deviceType}: ❌ Exchange button not found`);
        }
        
    } catch (error) {
        console.log(`   → ${deviceType}: ❌ Error - ${error.message}`);
    } finally {
        await context.close();
    }
}

// Run the systematic test
systematicSimpleSwapTest().catch(console.error);