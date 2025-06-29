/**
 * FINAL COMPREHENSIVE MERCURYO SOLUTION
 * Based on desktop vs mobile analysis
 */

// SOLUTION 1: Maximum Desktop Spoofing
window.ultimateDesktopSpoof = function() {
    console.log('🔥 ULTIMATE DESKTOP SPOOF: Overriding ALL mobile indicators');
    
    const form = document.createElement('form');
    form.method = 'POST';
    
    const spoofHTML = `
    <html>
    <head>
        <title>Mercuryo Force Mode</title>
        <meta name="viewport" content="width=1920,initial-scale=1">
    </head>
    <body style="font-family:Arial;text-align:center;padding:50px;background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:white;">
        <h1>🚀 FORCING MERCURYO SELECTION</h1>
        <div style="border:4px solid rgba(255,255,255,0.3);border-radius:50%;border-top:4px solid white;width:60px;height:60px;animation:spin 1s linear infinite;margin:30px auto;"></div>
        <h2>Mobile → Desktop → Mercuryo Green Border</h2>
        <div style="background:rgba(255,255,255,0.2);padding:20px;border-radius:10px;margin:20px 0;">
            <h3>Override Status:</h3>
            <p id="status">Initializing overrides...</p>
        </div>
        <style>
            @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        </style>
        <script>
            // COMPLETE MOBILE DETECTION OVERRIDE
            
            // 1. User Agent Override
            Object.defineProperty(navigator, 'userAgent', {
                get: function() { return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; },
                configurable: false
            });
            
            // 2. Platform Override
            Object.defineProperty(navigator, 'platform', {
                get: function() { return 'Win32'; },
                configurable: false
            });
            
            // 3. Vendor Override
            Object.defineProperty(navigator, 'vendor', {
                get: function() { return 'Google Inc.'; },
                configurable: false
            });
            
            // 4. Touch Points Override
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: function() { return 0; },
                configurable: false
            });
            
            // 5. Screen Properties Override
            Object.defineProperty(screen, 'width', {
                get: function() { return 1920; },
                configurable: false
            });
            Object.defineProperty(screen, 'height', {
                get: function() { return 1080; },
                configurable: false
            });
            Object.defineProperty(window, 'innerWidth', {
                get: function() { return 1920; },
                configurable: false
            });
            Object.defineProperty(window, 'innerHeight', {
                get: function() { return 1080; },
                configurable: false
            });
            
            // 6. Device Pixel Ratio Override
            Object.defineProperty(window, 'devicePixelRatio', {
                get: function() { return 1; },
                configurable: false
            });
            
            // 7. Touch Event Removal
            delete window.ontouchstart;
            delete window.ontouchmove;
            delete window.ontouchend;
            delete window.ontouchcancel;
            delete document.ontouchstart;
            delete document.ontouchmove;
            delete document.ontouchend;
            delete document.ontouchcancel;
            
            // 8. Override touch event detection
            Object.defineProperty(window, 'ontouchstart', {
                get: function() { return undefined; },
                set: function() { return false; },
                configurable: false
            });
            
            // 9. MediaQuery Override
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                if (query.includes('pointer: coarse') || query.includes('hover: none')) {
                    return {
                        matches: false,
                        media: query,
                        addListener: function() {},
                        removeListener: function() {}
                    };
                }
                return originalMatchMedia.call(window, query);
            };
            
            // Update status
            document.getElementById('status').innerHTML = 
                '✅ User Agent: Desktop<br>' +
                '✅ Touch Events: Disabled<br>' +
                '✅ Screen Size: 1920x1080<br>' +
                '✅ Device Type: Desktop PC';
            
            // Redirect with all parameters
            setTimeout(() => {
                const urls = [
                    'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&device=desktop&preferred=mercuryo',
                    'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&provider=mercuryo&platform=desktop'
                ];
                
                // Try first URL
                window.location.href = urls[0];
            }, 2000);
        </script>
    </body>
    </html>`;
    
    form.action = 'data:text/html;charset=utf-8,' + encodeURIComponent(spoofHTML);
    form.target = '_blank';
    form.style.display = 'none';
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return true;
};

// SOLUTION 2: Direct Override in Current Window
window.applyDesktopOverrides = function() {
    console.log('🎯 Applying desktop overrides in current window');
    
    // Create script to inject
    const script = document.createElement('script');
    script.textContent = `
        // Override all mobile detection methods
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
        });
        Object.defineProperty(navigator, 'platform', {
            get: () => 'Win32'
        });
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 0
        });
        Object.defineProperty(screen, 'width', {
            get: () => 1920
        });
        Object.defineProperty(window, 'innerWidth', {
            get: () => 1920
        });
        delete window.ontouchstart;
        
        console.log('✅ Desktop overrides applied');
    `;
    
    document.head.appendChild(script);
    
    // Then navigate
    setTimeout(() => {
        window.location.href = 'https://simpleswap.io/?from=eur&to=pol&amount=15&partner=auralo&device=desktop';
    }, 100);
};

// SOLUTION 3: Test Current Detection
window.testDeviceDetection = function() {
    console.log('📱 Current Device Detection:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Touch Points:', navigator.maxTouchPoints);
    console.log('Screen Width:', screen.width);
    console.log('Inner Width:', window.innerWidth);
    console.log('Has Touch:', 'ontouchstart' in window);
    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    
    const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent) ||
                    'ontouchstart' in window ||
                    navigator.maxTouchPoints > 0 ||
                    window.innerWidth < 768;
    
    console.log('Detected as Mobile:', isMobile);
    
    return {
        isMobile,
        userAgent: navigator.userAgent,
        hasTouch: 'ontouchstart' in window
    };
};

console.log('✅ FINAL MERCURYO SOLUTION LOADED');
console.log('Available functions:');
console.log('- window.ultimateDesktopSpoof() [RECOMMENDED]');
console.log('- window.applyDesktopOverrides()');
console.log('- window.testDeviceDetection()');