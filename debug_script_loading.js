// Debug script loading issues on production
const { chromium } = require('playwright');

async function debugScriptLoading() {
    console.log('🔧 DEBUG: Script loading issues');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 390, height: 844 }
    });
    
    const page = await context.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
        console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });
    
    // Listen for errors
    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
    });
    
    try {
        console.log('🌐 Loading site with error monitoring...');
        await page.goto('https://auralo-website-fixed.netlify.app/');
        await page.waitForLoadState('networkidle');
        
        console.log('\n🔍 Checking script execution...');
        const scriptCheck = await page.evaluate(() => {
            return {
                earlyScriptExecuted: window.earlyScriptExecuted || false,
                version: window.AURALO_VERSION,
                startPurchase: typeof window.startPurchase,
                openSimpleSwap: typeof window.openSimpleSwapWithMercuryoTrigger,
                forceDesktop: typeof window.forceDesktopModeForMercuryo,
                windowKeys: Object.keys(window).filter(k => k.includes('auralo') || k.includes('Purchase') || k.includes('SimpleSwap')),
                errorMessages: window.scriptErrors || []
            };
        });
        
        console.log('\n📋 Script Check Results:');
        Object.entries(scriptCheck).forEach(([key, value]) => {
            console.log(`   ${key}: ${JSON.stringify(value)}`);
        });
        
        // Try manual script injection
        console.log('\n💉 Attempting manual script injection...');
        await page.evaluate(() => {
            console.log('🧪 Manual injection test...');
            
            // Test basic function definition
            window.testFunction = function() {
                console.log('✅ Test function works');
                return true;
            };
            
            // Try to manually define critical functions
            window.forceDesktopModeForMercuryo = function() {
                console.log('📱 MANUAL: Forcing desktop mode for mobile Mercuryo selection');
                
                const form = document.createElement('form');
                form.method = 'POST';
                
                const checkoutUrl = 'https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo';
                
                const htmlContent = '<html><head><title>Smart Checkout</title></head>' +
                    '<body style="font-family:Arial;text-align:center;padding:50px;background:#2196F3;color:white;">' +
                    '<h2>🚀 Opening Smart Checkout</h2>' +
                    '<div style="border:4px solid rgba(255,255,255,0.3);border-radius:50%;border-top:4px solid white;width:40px;height:40px;animation:spin 1s linear infinite;margin:20px auto;"></div>' +
                    '<p>Optimizing for best provider selection...</p>' +
                    '<style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>' +
                    '<script>' +
                    'Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",writable:false});' +
                    'Object.defineProperty(navigator,"platform",{value:"Win32",writable:false});' +
                    'setTimeout(function(){window.location.href="' + checkoutUrl + '";},1000);' +
                    '</script>' +
                    '</body></html>';
                
                form.action = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
                form.target = '_blank';
                form.style.display = 'none';
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
                
                console.log('✅ MANUAL: Desktop mode redirect submitted');
                return true;
            };
            
            window.openSimpleSwapWithMercuryoTrigger = function() {
                console.log('🎯 MANUAL: Opening SimpleSwap with mobile Mercuryo solution');
                
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                console.log('📱 Device detection:', isMobile ? 'MOBILE' : 'DESKTOP');
                
                if (isMobile) {
                    console.log('📱 MOBILE DETECTED: Applying desktop user agent spoofing');
                    return window.forceDesktopModeForMercuryo();
                } else {
                    console.log('🖥️ DESKTOP DETECTED: Using standard USD approach');
                    window.open('https://simpleswap.io/?from=usd&to=pol&amount=19.50&partner=auralo', '_blank');
                    return true;
                }
            };
            
            console.log('✅ Manual functions injected');
        });
        
        // Test the manually injected functions
        console.log('\n🧪 Testing manually injected functions...');
        await page.evaluate(() => {
            if (typeof window.testFunction === 'function') {
                window.testFunction();
            }
            
            if (typeof window.openSimpleSwapWithMercuryoTrigger === 'function') {
                console.log('🎯 Testing manual openSimpleSwapWithMercuryoTrigger...');
                window.openSimpleSwapWithMercuryoTrigger();
            }
        });
        
        await page.waitForTimeout(3000);
        
        const finalPages = context.pages();
        console.log(`\n📊 Final page count: ${finalPages.length}`);
        finalPages.forEach((p, index) => {
            console.log(`   Page ${index + 1}: ${p.url()}`);
        });
        
    } catch (error) {
        console.log(`❌ Debug error: ${error.message}`);
    }
    
    console.log('\n⏳ Keeping browser open for inspection...');
    console.log('Press Ctrl+C when done\n');
    
    await new Promise(resolve => {
        process.on('SIGINT', () => {
            resolve();
        });
    });
    
    await browser.close();
}

debugScriptLoading().catch(console.error);