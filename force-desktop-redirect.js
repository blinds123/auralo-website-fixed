// FORCE DESKTOP REDIRECT - Most aggressive approach
// This script forces SimpleSwap to load in desktop mode

(function() {
    'use strict';
    
    // Only run on mobile
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return;
    }
    
    console.log('🔥 FORCE DESKTOP REDIRECT ACTIVE');
    
    // Method 1: Use desktop subdomain if it exists
    const desktopUrls = [
        'https://widget.simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury',
        'https://simpleswap.io/widget?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&embed=1',
        'https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&mode=widget',
        'https://app.simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury',
        'https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&desktop_mode=1'
    ];
    
    // Method 2: Create desktop session first
    window.createDesktopSession = function() {
        console.log('🖥️ Creating desktop session...');
        
        // Try each URL until one works
        let currentIndex = 0;
        
        const tryNextUrl = () => {
            if (currentIndex >= desktopUrls.length) {
                // All URLs tried, use final fallback
                useFinalFallback();
                return;
            }
            
            const url = desktopUrls[currentIndex];
            console.log(`🔧 Trying URL ${currentIndex + 1}:`, url);
            
            // Create invisible iframe to test
            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.src = url;
            
            document.body.appendChild(testFrame);
            
            // Check if it loads correctly
            testFrame.onload = () => {
                // If loaded, redirect main window
                console.log('✅ URL worked, redirecting...');
                window.location.href = url;
            };
            
            testFrame.onerror = () => {
                // Try next URL
                currentIndex++;
                testFrame.remove();
                tryNextUrl();
            };
            
            // Timeout fallback
            setTimeout(() => {
                if (testFrame.parentNode) {
                    testFrame.remove();
                    currentIndex++;
                    tryNextUrl();
                }
            }, 3000);
        };
        
        tryNextUrl();
    };
    
    // Method 3: Use URL shortener/redirect service
    function useUrlRedirect() {
        console.log('🔀 Using URL redirect approach...');
        
        // Create data URI redirect
        const redirectHtml = `
            <html>
            <head>
                <meta http-equiv="refresh" content="0; url=https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&ref=desktop">
                <script>
                    // Force desktop detection
                    Object.defineProperty(navigator, 'userAgent', {
                        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    });
                    window.location.replace('https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury');
                </script>
            </head>
            <body>Redirecting...</body>
            </html>
        `;
        
        const dataUri = 'data:text/html;base64,' + btoa(redirectHtml);
        window.location.href = dataUri;
    }
    
    // Method 4: Final fallback - Create custom exchange
    function useFinalFallback() {
        console.log('🎯 Using final fallback - Custom exchange interface');
        
        // Create full-screen exchange interface
        const exchangeUI = document.createElement('div');
        exchangeUI.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            z-index: 999999;
        `;
        
        exchangeUI.innerHTML = `
            <iframe 
                src="https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&widget=1"
                style="width: 100%; height: 100%; border: none;"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            ></iframe>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(exchangeUI);
        
        // Monitor iframe and fix issues
        const iframe = exchangeUI.querySelector('iframe');
        iframe.onload = () => {
            try {
                // Attempt to modify iframe content
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const script = iframeDoc.createElement('script');
                script.textContent = `
                    // Force Mercury selection
                    setInterval(() => {
                        const mercuryBtn = document.querySelector('[data-provider*="mercury"]');
                        if (mercuryBtn && !mercuryBtn.classList.contains('selected')) {
                            mercuryBtn.click();
                        }
                        
                        // Fix amount
                        const amountInput = document.querySelector('input[value*="21"]');
                        if (amountInput) {
                            amountInput.value = '19.50';
                            amountInput.dispatchEvent(new Event('change'));
                        }
                    }, 1000);
                `;
                iframeDoc.head.appendChild(script);
            } catch (e) {
                console.log('Cross-origin blocked, but iframe loaded');
            }
        };
    }
    
    // Auto-execute on payment gateway call
    const originalInitiate = window.initiatePaymentGateway;
    window.initiatePaymentGateway = function() {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            console.log('🚀 Mobile detected - forcing desktop mode');
            window.createDesktopSession();
        } else if (originalInitiate) {
            originalInitiate();
        }
    };
    
    console.log('✅ Force Desktop Redirect Ready');
})();