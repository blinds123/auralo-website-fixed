// Final verification test for comprehensive EUR-USD solution
const { chromium } = require('playwright');

async function finalVerificationTest() {
    console.log('🎯 FINAL VERIFICATION: COMPREHENSIVE EUR-USD SOLUTION');
    console.log('Site: https://auralo-website-fixed.netlify.app/');
    console.log('Version: 4.9-COMPREHENSIVE-EUR-USD-SOLUTION\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Test on mobile simulation (iPhone)
    const mobileContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const mobilePage = await mobileContext.newPage();
    
    try {
        console.log('📱 MOBILE VERIFICATION TEST');
        console.log('============================\n');
        
        console.log('1. Opening Auralo site...');
        await mobilePage.goto('https://auralo-website-fixed.netlify.app/');
        await mobilePage.waitForLoadState('networkidle');
        
        console.log('2. Checking function availability...');
        const mobileConfig = await mobilePage.evaluate(() => {
            // Log current configuration
            if (typeof window.logCurrentConfiguration === 'function') {
                window.logCurrentConfiguration();
            }
            
            return {
                version: window.AURALO_VERSION,
                hasMainFunction: typeof window.openSimpleSwapWithMercuryoTrigger === 'function',
                hasEURFunction: typeof window.tryEURCurrencyApproach === 'function',
                hasDesktopSpoof: typeof window.forceDesktopModeForMercuryo === 'function',
                hasStartPurchase: typeof window.startPurchase === 'function',
                hasQATest: typeof window.runComprehensiveQATest === 'function',
                deviceDetection: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'MOBILE' : 'DESKTOP'
            };
        });
        
        console.log('📋 Mobile Configuration:', mobileConfig);
        
        if (!mobileConfig.hasMainFunction) {
            console.log('❌ CRITICAL: Main function not available!');
            return false;
        }
        
        console.log('3. Testing main purchase function...');
        await mobilePage.evaluate(() => {
            console.log('🧪 TESTING: Main openSimpleSwapWithMercuryoTrigger function');
            if (typeof window.openSimpleSwapWithMercuryoTrigger === 'function') {
                window.openSimpleSwapWithMercuryoTrigger();
            }
        });
        
        await mobilePage.waitForTimeout(2000);
        
        console.log('4. Running comprehensive QA test...');
        await mobilePage.evaluate(() => {
            console.log('🧪 TESTING: Comprehensive QA test');
            if (typeof window.runComprehensiveQATest === 'function') {
                window.runComprehensiveQATest();
            } else {
                console.log('⚠️ QA test function not available, running manual tests');
                // Manual testing
                setTimeout(() => window.open('https://simpleswap.io/?from=eur&to=pol&amount=18&partner=auralo', '_blank'), 1000);
                setTimeout(() => window.open('https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo', '_blank'), 3000);
            }
        });
        
        console.log('\n✅ MOBILE TEST COMPLETE');
        
    } catch (error) {
        console.error('❌ Mobile test error:', error.message);
    }
    
    // Test on desktop simulation
    const desktopContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1280, height: 720 }
    });
    
    const desktopPage = await desktopContext.newPage();
    
    try {
        console.log('\n🖥️ DESKTOP VERIFICATION TEST');
        console.log('=============================\n');
        
        console.log('1. Opening Auralo site...');
        await desktopPage.goto('https://auralo-website-fixed.netlify.app/');
        await desktopPage.waitForLoadState('networkidle');
        
        console.log('2. Checking function availability...');
        const desktopConfig = await desktopPage.evaluate(() => {
            return {
                version: window.AURALO_VERSION,
                hasMainFunction: typeof window.openSimpleSwapWithMercuryoTrigger === 'function',
                deviceDetection: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'MOBILE' : 'DESKTOP'
            };
        });
        
        console.log('📋 Desktop Configuration:', desktopConfig);
        
        console.log('3. Testing desktop purchase function...');
        await desktopPage.evaluate(() => {
            console.log('🧪 TESTING: Desktop openSimpleSwapWithMercuryoTrigger function');
            if (typeof window.openSimpleSwapWithMercuryoTrigger === 'function') {
                window.openSimpleSwapWithMercuryoTrigger();
            }
        });
        
        console.log('\n✅ DESKTOP TEST COMPLETE');
        
    } catch (error) {
        console.error('❌ Desktop test error:', error.message);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 FINAL VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    
    console.log('\n🎯 EXPECTED BEHAVIOR:');
    console.log('📱 MOBILE:');
    console.log('   1. EUR approach (€18) opens first - check if Mercuryo selected');
    console.log('   2. After 10 seconds, desktop spoofing backup opens');
    console.log('   3. QA test opens multiple approaches for comparison');
    
    console.log('\n🖥️ DESKTOP:');
    console.log('   1. Standard USD approach ($19.50) opens');
    console.log('   2. Should consistently select Mercuryo (already working)');
    
    console.log('\n📋 MANUAL VERIFICATION CHECKLIST:');
    console.log('   ✅ Check each opened SimpleSwap tab');
    console.log('   ✅ Click "Exchange" button on each');
    console.log('   ✅ Note which provider is selected (Mercuryo vs MoonPay)');
    console.log('   ✅ Verify EUR approach works on mobile');
    console.log('   ✅ Confirm desktop spoofing fallback works');
    console.log('   ✅ Test complete purchase flow');
    
    console.log('\n🏆 SUCCESS CRITERIA:');
    console.log('   🎯 EUR approach selects Mercuryo on mobile devices');
    console.log('   🎯 Desktop spoofing provides reliable fallback');
    console.log('   🎯 Desktop functionality remains unchanged');
    console.log('   🎯 Complete purchase flow works without errors');
    
    console.log('\n⏳ Manual testing time - keep browser open...');
    console.log('   Press Ctrl+C when verification is complete');
    
    // Keep browser open for manual verification
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            console.log('\n👋 Verification completed. Generating final report...');
            resolve();
        });
    });
    
    await browser.close();
    
    console.log('\n📝 FINAL REPORT:');
    console.log('Based on manual verification, record results:');
    console.log('- EUR approach on mobile: [PASS/FAIL]');
    console.log('- Desktop spoofing fallback: [PASS/FAIL]');
    console.log('- Desktop USD functionality: [PASS/FAIL]');
    console.log('- Overall solution: [READY FOR PRODUCTION/NEEDS ADJUSTMENT]');
}

finalVerificationTest().catch(console.error);