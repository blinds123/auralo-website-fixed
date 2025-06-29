/**
 * COMPREHENSIVE MOBILE MERCURYO SOLUTION
 * Addresses SimpleSwap's mobile-specific provider selection algorithm
 */

console.log('🔧 Loading Comprehensive Mobile Mercuryo Solution...');

// SOLUTION 1: Enhanced Desktop User Agent Spoofing
window.enhancedDesktopSpoofing = function() {
    console.log('🖥️ ENHANCED: Applying comprehensive desktop spoofing');
    
    const form = document.createElement('form');
    form.method = 'POST';
    
    // Enhanced desktop spoofing with multiple parameters
    const desktopSpoofHTML = `
    <html>
    <head>
        <title>Desktop Mercuryo Mode</title>
        <meta name="viewport" content="width=1920,initial-scale=1.0">
    </head>
    <body style="font-family:Arial;text-align:center;padding:50px;background:#2196F3;color:white;">
        <h2>🚀 Desktop Mercuryo Mode Active</h2>
        <div style="border:4px solid rgba(255,255,255,0.3);border-radius:50%;border-top:4px solid white;width:40px;height:40px;animation:spin 1s linear infinite;margin:20px auto;"></div>
        <p>iPhone → Windows Desktop → Mercuryo Selection</p>
        <p>Redirecting with enhanced parameters...</p>
        <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        <script>
            // Enhanced desktop spoofing
            Object.defineProperty(navigator, "userAgent", {
                value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                writable: false
            });
            Object.defineProperty(navigator, "platform", {
                value: "Win32",
                writable: false
            });
            Object.defineProperty(navigator, "vendor", {
                value: "Google Inc.",
                writable: false
            });
            Object.defineProperty(screen, "width", {
                value: 1920,
                writable: false
            });
            Object.defineProperty(screen, "height", {
                value: 1080,
                writable: false
            });
            
            // Multiple Mercuryo selection strategies
            const strategies = [
                // Strategy 1: EUR with minimal amount
                'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&preferred=mercuryo',
                // Strategy 2: EUR with explicit provider
                'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&provider=mercuryo',
                // Strategy 3: EUR with desktop hint
                'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&device=desktop'
            ];
            
            let currentStrategy = 0;
            
            function tryNextStrategy() {
                if (currentStrategy < strategies.length) {
                    console.log('🔄 Trying strategy', currentStrategy + 1);
                    window.location.href = strategies[currentStrategy];
                    currentStrategy++;
                } else {
                    console.log('📱 Fallback to direct URL');
                    window.location.href = 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo';
                }
            }
            
            setTimeout(tryNextStrategy, 1000);
        </script>
    </body>
    </html>`;
    
    form.action = 'data:text/html;charset=utf-8,' + encodeURIComponent(desktopSpoofHTML);
    form.target = '_blank';
    form.style.display = 'none';
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return true;
};

// SOLUTION 2: Multi-Parameter Mercuryo URL
window.buildMercuryoURL = function() {
    const baseURL = 'https://simpleswap.io/';
    const params = new URLSearchParams({
        from: 'eur',
        to: 'pol', 
        amount: '15',
        partner: 'auralo',
        // Additional parameters to force Mercuryo
        preferred: 'mercuryo',
        provider: 'mercuryo',
        payment: 'mercuryo',
        method: 'card',
        fiat: 'eur'
    });
    
    return baseURL + '?' + params.toString();
};

// SOLUTION 3: Interaction-Based Mercuryo Selection
window.interactionBasedMercuryo = function() {
    console.log('🎯 INTERACTION: Opening SimpleSwap for manual Mercuryo selection');
    
    const instructionHTML = `
    <html>
    <head>
        <title>Mercuryo Selection Guide</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
    </head>
    <body style="font-family:Arial;padding:20px;background:#f0f0f0;">
        <div style="max-width:400px;margin:0 auto;background:white;padding:20px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color:#2196F3;text-align:center;">📱 Mercuryo Selection Guide</h2>
            <div style="background:#e8f5e8;padding:15px;border-radius:8px;margin:15px 0;">
                <strong>CRITICAL STEPS:</strong>
                <ol style="margin:10px 0;">
                    <li><strong>Tap amount field</strong> (21.42 EUR)</li>
                    <li><strong>Wait for Mercuryo</strong> to load first</li>
                    <li><strong>Select Mercuryo</strong> immediately</li>
                    <li><strong>Continue</strong> before MoonPay overrides</li>
                </ol>
            </div>
            <div style="text-align:center;margin:20px 0;">
                <a href="${window.buildMercuryoURL()}" 
                   style="display:inline-block;background:#4CAF50;color:white;padding:15px 25px;text-decoration:none;border-radius:8px;font-weight:bold;"
                   target="_blank">
                   🚀 Open SimpleSwap (Mercuryo Mode)
                </a>
            </div>
            <div style="background:#fff3cd;padding:10px;border-radius:5px;font-size:14px;">
                <strong>💡 Pro Tip:</strong> The key is speed - select Mercuryo as soon as it appears!
            </div>
        </div>
    </body>
    </html>`;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'data:text/html;charset=utf-8,' + encodeURIComponent(instructionHTML);
    form.target = '_blank';
    form.style.display = 'none';
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return true;
};

// SOLUTION 4: Comprehensive Mobile Mercuryo Function
window.comprehensiveMobileMercuryo = function() {
    console.log('🔥 COMPREHENSIVE: Applying all mobile Mercuryo strategies');
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('📱 Device Type:', isMobile ? 'MOBILE' : 'DESKTOP');
    
    if (isMobile) {
        // For mobile devices, try enhanced desktop spoofing first
        console.log('📱 MOBILE DETECTED: Applying enhanced desktop spoofing');
        return window.enhancedDesktopSpoofing();
    } else {
        // For desktop, use multi-parameter URL
        console.log('🖥️ DESKTOP DETECTED: Using multi-parameter Mercuryo URL');
        window.open(window.buildMercuryoURL(), '_blank');
        return true;
    }
};

console.log('✅ Comprehensive Mobile Mercuryo Solution Loaded');
console.log('🎯 Available Functions:');
console.log('  - window.enhancedDesktopSpoofing()');
console.log('  - window.buildMercuryoURL()'); 
console.log('  - window.interactionBasedMercuryo()');
console.log('  - window.comprehensiveMobileMercuryo()');