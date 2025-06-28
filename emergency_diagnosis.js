// Emergency diagnosis - check what's actually happening on the live site
const { chromium } = require('playwright');

async function emergencyDiagnosis() {
    console.log('🚨 EMERGENCY DIAGNOSIS: iPhone 12 Pro Still Getting MoonPay');
    console.log('Checking what is actually happening on live site');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Exact iPhone 12 Pro simulation
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log('📱 Step 1: Opening live Auralo site...');
        await page.goto('https://auralo-website-fixed.netlify.app/');
        await page.waitForLoadState('networkidle');
        
        console.log('📱 Step 2: Checking function availability...');
        const functionCheck = await page.evaluate(() => {
            return {
                hasOpenSimpleSwapWithMercuryoTrigger: typeof window.openSimpleSwapWithMercuryoTrigger === 'function',
                hasForceDesktopModeForMercuryo: typeof window.forceDesktopModeForMercuryo === 'function',
                hasStartPurchase: typeof window.startPurchase === 'function',
                version: window.AURALO_VERSION,
                userAgent: navigator.userAgent,
                isMobileDetected: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            };
        });
        
        console.log('📋 Function Check:');
        Object.entries(functionCheck).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
        
        if (!functionCheck.hasOpenSimpleSwapWithMercuryoTrigger) {
            console.log('❌ CRITICAL: Main function not available!');
        }
        
        console.log('\n📱 Step 3: Testing buy button workflow...');
        
        // Find size buttons first
        const sizeButtons = await page.locator('.size-option').all();
        console.log(`   Found ${sizeButtons.length} size buttons`);
        
        if (sizeButtons.length > 0) {
            console.log('   → Selecting size M...');
            await sizeButtons[1].click(); // Select M size
            await page.waitForTimeout(1000);
        }
        
        // Find buy button
        const buyButton = page.locator('.buy-now-button').first();
        if (await buyButton.isVisible()) {
            console.log('   → Clicking buy button...');
            await buyButton.click();
            await page.waitForTimeout(2000);
        }
        
        console.log('\n📱 Step 4: Checking what SimpleSwap URLs were opened...');
        
        // Get all pages (including popups)
        const pages = context.pages();
        console.log(`   → Found ${pages.length} total pages/tabs`);
        
        for (let i = 0; i < pages.length; i++) {
            const pageUrl = pages[i].url();
            console.log(`   → Page ${i + 1}: ${pageUrl}`);
            
            if (pageUrl.includes('simpleswap.io')) {
                console.log(`   → ✅ SimpleSwap page found: ${pageUrl}`);
                
                // Check if this is EUR or USD
                if (pageUrl.includes('from=eur')) {
                    console.log('   → 💶 EUR approach was used');
                } else if (pageUrl.includes('from=usd')) {
                    console.log('   → 💵 USD approach was used');
                }
                
                // Check if desktop spoofing was used
                if (pageUrl.includes('data:text/html')) {
                    console.log('   → 🖥️ Desktop spoofing was used');
                } else {
                    console.log('   → ⚠️ Direct URL used (no spoofing)');
                }
            }
        }
        
        console.log('\n📱 Step 5: Manual function testing...');
        await page.evaluate(() => {
            console.log('🧪 Manual test: Calling openSimpleSwapWithMercuryoTrigger directly');
            if (typeof window.openSimpleSwapWithMercuryoTrigger === 'function') {
                window.openSimpleSwapWithMercuryoTrigger();
            } else {
                console.log('❌ Function not available for direct call');
            }
        });
        
        await page.waitForTimeout(3000);
        
        // Check for new pages again
        const finalPages = context.pages();
        console.log(`\n📋 Final page count: ${finalPages.length}`);
        
        finalPages.forEach((p, i) => {
            console.log(`   Page ${i + 1}: ${p.url()}`);
        });
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n🎯 DIAGNOSIS COMPLETE');
    console.log('Check the opened tabs to see what actually happened');
    console.log('Press Ctrl+C when done\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            resolve();
        });
    });
    
    await browser.close();
}

emergencyDiagnosis().catch(console.error);