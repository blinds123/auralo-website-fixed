// Mobile Fix Validation Script
console.log('🧪 MOBILE FIX VALIDATION SCRIPT');
console.log('================================');

// Check current environment
function checkEnvironment() {
    console.log('\n📱 ENVIRONMENT CHECK:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Max Touch Points:', navigator.maxTouchPoints);
    console.log('Screen:', screen.width + 'x' + screen.height);
    console.log('Window:', window.innerWidth + 'x' + window.innerHeight);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log('Detected as Mobile:', isMobile);
}

// Test spoofing effectiveness
function testSpoofing() {
    console.log('\n🎭 SPOOFING TEST:');
    
    // Test 1: User Agent
    const spoofedUA = navigator.userAgent.includes('Windows');
    console.log('✓ User Agent spoofed to desktop:', spoofedUA);
    
    // Test 2: Touch support
    const noTouch = navigator.maxTouchPoints === 0;
    console.log('✓ Touch support removed:', noTouch);
    
    // Test 3: Screen dimensions
    const desktopScreen = screen.width >= 1920;
    console.log('✓ Screen spoofed to desktop:', desktopScreen);
    
    // Test 4: Media queries
    const desktopMedia = window.matchMedia('(hover: hover)').matches;
    console.log('✓ Media queries indicate desktop:', desktopMedia);
    
    return spoofedUA && noTouch && desktopScreen && desktopMedia;
}

// Check service worker
async function checkServiceWorker() {
    console.log('\n🔧 SERVICE WORKER CHECK:');
    
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('Service Workers registered:', registrations.length);
        
        registrations.forEach(reg => {
            console.log('- SW Scope:', reg.scope);
            console.log('  Active:', reg.active?.scriptURL);
        });
    } else {
        console.log('❌ Service Worker not supported');
    }
}

// Test SimpleSwap URL generation
function testUrlGeneration() {
    console.log('\n🔗 URL GENERATION TEST:');
    
    const params = {
        'from': 'eur-eur',
        'to': 'pol-matic',
        'amount': '19.50',
        'provider': 'mercury',
        'fixed': '1',
        'source': 'desktop',
        'platform': 'desktop',
        'device': 'desktop',
        'mobile': '0'
    };
    
    const url = 'https://simpleswap.io/exchange?' + 
        Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    
    console.log('Generated URL:', url);
    console.log('✓ Amount is €19.50:', url.includes('amount=19.50'));
    console.log('✓ Provider is Mercury:', url.includes('provider=mercury'));
    console.log('✓ Desktop parameters:', url.includes('device=desktop'));
}

// Check storage
function checkStorage() {
    console.log('\n💾 STORAGE CHECK:');
    
    try {
        console.log('LocalStorage device_type:', localStorage.getItem('device_type'));
        console.log('SessionStorage force_desktop:', sessionStorage.getItem('force_desktop'));
        
        // Check cookies
        const cookies = document.cookie.split(';').map(c => c.trim());
        const desktopCookie = cookies.find(c => c.includes('device_type=desktop'));
        console.log('Desktop cookie set:', !!desktopCookie);
    } catch (e) {
        console.log('Storage access error:', e.message);
    }
}

// Summary and recommendations
function generateSummary() {
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('====================');
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const spoofingActive = testSpoofing();
    
    if (isMobile && !spoofingActive) {
        console.log('❌ MOBILE DETECTED - SPOOFING NOT ACTIVE');
        console.log('Recommendation: Use mobile-gateway-spoofer.html');
    } else if (isMobile && spoofingActive) {
        console.log('✅ MOBILE DETECTED - SPOOFING ACTIVE');
        console.log('SimpleSwap should see desktop environment');
    } else {
        console.log('✅ DESKTOP ENVIRONMENT');
        console.log('No spoofing needed');
    }
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. If on mobile, click payment button');
    console.log('2. Verify redirect to mobile-gateway-spoofer.html');
    console.log('3. Check that SimpleSwap shows €19.50 (not €21)');
    console.log('4. Confirm Mercury has green border');
}

// Run all tests
async function runValidation() {
    checkEnvironment();
    testSpoofing();
    await checkServiceWorker();
    testUrlGeneration();
    checkStorage();
    generateSummary();
}

// Auto-run validation
runValidation();

// Export for manual testing
window.mobileFixValidation = {
    checkEnvironment,
    testSpoofing,
    checkServiceWorker,
    testUrlGeneration,
    checkStorage,
    runValidation
};