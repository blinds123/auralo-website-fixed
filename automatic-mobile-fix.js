// AUTOMATIC MOBILE FIX - No user guidance needed
// Forces SimpleSwap to behave like desktop even on mobile

(function() {
    'use strict';
    
    console.log('🚀 AUTOMATIC MOBILE FIX - Initializing...');
    
    // Register advanced service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw-advanced.js')
            .then(reg => console.log('✅ Advanced service worker registered'))
            .catch(err => console.warn('⚠️ Service worker registration failed:', err));
    }
    
    // Create automatic payment gateway
    window.automaticPaymentGateway = function() {
        console.log('🎯 Automatic Mobile Payment Gateway Activated');
        
        // Method 1: Hidden iframe pre-warming
        preWarmSimpleSwap();
        
        // Method 2: Try embed/widget parameters
        setTimeout(() => {
            openWithEmbedParams();
        }, 2000);
    };
    
    // Pre-warm SimpleSwap in hidden iframe
    function preWarmSimpleSwap() {
        console.log('🔥 Pre-warming SimpleSwap in hidden iframe...');
        
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 1px; height: 1px;';
        iframe.id = 'simpleswap-prewarm';
        
        // Create blob URL with spoofing script
        const spoofingScript = `
            <script>
                // Spoof everything before SimpleSwap loads
                Object.defineProperty(navigator, 'userAgent', {
                    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                });
                
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32'
                });
                
                Object.defineProperty(navigator, 'maxTouchPoints', {
                    get: () => 0
                });
                
                // Remove touch support
                delete window.ontouchstart;
                delete window.Touch;
                delete window.TouchEvent;
                
                // Spoof screen
                Object.defineProperty(screen, 'width', { get: () => 1920 });
                Object.defineProperty(screen, 'height', { get: () => 1080 });
                
                // Redirect to SimpleSwap after spoofing
                window.location.href = 'https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&widget=1&embed=1&source=desktop';
            </script>
        `;
        
        const blob = new Blob([spoofingScript], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        
        // Clean up after delay
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            iframe.remove();
        }, 5000);
    }
    
    // Open with embed/widget parameters
    function openWithEmbedParams() {
        console.log('🎯 Opening SimpleSwap with embed parameters...');
        
        // Try multiple parameter combinations
        const paramSets = [
            // Widget mode
            {
                from: 'eur-eur',
                to: 'pol-matic',
                amount: '19.50',
                provider: 'mercury',
                widget: '1',
                embed: '1',
                source: 'desktop',
                partner: 'auralo',
                fixed: '1'
            },
            // API mode
            {
                from: 'eur-eur',
                to: 'pol-matic',
                amount: '19.50',
                provider: 'mercury',
                api: '1',
                platform: 'desktop',
                client: 'auralo',
                type: 'fixed'
            },
            // Partner mode
            {
                from: 'eur-eur',
                to: 'pol-matic',
                amount: '19.50',
                provider: 'mercury',
                partner: 'auralo_desktop',
                ref: 'desktop_widget',
                mode: 'fixed'
            }
        ];
        
        // Try each parameter set
        const tryNextParams = (index = 0) => {
            if (index >= paramSets.length) {
                console.log('❌ All parameter sets tried');
                fallbackToDirectApi();
                return;
            }
            
            const params = new URLSearchParams(paramSets[index]);
            const url = `https://simpleswap.io/exchange?${params.toString()}`;
            
            console.log(`🔧 Trying parameter set ${index + 1}:`, url);
            
            // Open in controlled window
            const win = window.open(
                url,
                'SimpleSwapDesktop',
                'width=1280,height=800,toolbar=yes,location=yes,status=yes'
            );
            
            // Monitor the window
            if (win) {
                setTimeout(() => {
                    try {
                        // Try to inject spoofing
                        injectSpoofingIntoWindow(win);
                    } catch (e) {
                        console.log('Cross-origin injection blocked');
                    }
                }, 1000);
                
                // Check if it worked after delay
                setTimeout(() => {
                    // If user reports it didn't work, try next set
                    if (window.simpleSwapFailed) {
                        win.close();
                        tryNextParams(index + 1);
                    }
                }, 5000);
            }
        };
        
        tryNextParams();
    }
    
    // Inject spoofing into window
    function injectSpoofingIntoWindow(targetWindow) {
        try {
            const script = targetWindow.document.createElement('script');
            script.textContent = `
                console.log('🎭 Spoofing injected into SimpleSwap');
                
                // Force Mercury selection
                setTimeout(() => {
                    // Find Mercury provider
                    const providers = document.querySelectorAll('[data-provider]');
                    providers.forEach(p => {
                        if (p.getAttribute('data-provider').includes('mercury')) {
                            p.click();
                            console.log('✅ Mercury clicked');
                        }
                    });
                    
                    // Fix amount if needed
                    const amountInputs = document.querySelectorAll('input[type="number"], input[type="text"]');
                    amountInputs.forEach(input => {
                        if (input.value.includes('21')) {
                            input.value = '19.50';
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log('✅ Amount fixed to 19.50');
                        }
                    });
                }, 2000);
            `;
            
            targetWindow.document.head.appendChild(script);
        } catch (e) {
            console.log('Injection failed:', e);
        }
    }
    
    // Fallback to direct API approach
    function fallbackToDirectApi() {
        console.log('🔧 Attempting direct API approach...');
        
        // Create our own exchange interface
        const exchangeInterface = document.createElement('div');
        exchangeInterface.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        exchangeInterface.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Processing €19.50 Payment...</h2>
                <p>Connecting to payment provider...</p>
                <div style="margin-top: 20px;">
                    <iframe 
                        src="https://simpleswap.io/widget?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury"
                        style="width: 600px; height: 400px; border: none;"
                        allow="payment"
                    ></iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(exchangeInterface);
    }
    
    // Override the default payment gateway
    const originalGateway = window.initiatePaymentGateway;
    window.initiatePaymentGateway = function() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log('📱 Mobile detected - using automatic fix');
            automaticPaymentGateway();
        } else if (originalGateway) {
            originalGateway();
        }
    };
    
    // Monitor for payment attempts
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PAYMENT_FAILED') {
            window.simpleSwapFailed = true;
        }
    });
    
    console.log('✅ Automatic Mobile Fix Ready');
})();