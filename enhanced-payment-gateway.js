// ENHANCED PAYMENT GATEWAY WITH DESKTOP SPOOFING V3
// Fixes SimpleSwap mobile detection issues with pre-navigation spoofing

function enhancedPaymentGateway() {
    console.log('🚀 ENHANCED PAYMENT GATEWAY V3 - Starting...');
    
    // Load and activate ultimate desktop spoofing
    const loadUltimateSpoofing = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'ultimate-desktop-spoofing.js';
            script.onload = () => {
                console.log('✅ Ultimate spoofing loaded');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ Could not load ultimate spoofing');
                resolve();
            };
            document.head.appendChild(script);
        });
    };
    
    // Activate all existing spoofing layers
    if (window.desktopSessionHijacker) {
        window.desktopSessionHijacker.initialize();
        window.desktopSessionHijacker.activate();
    }
    
    if (window.timingAttackSolution) {
        window.timingAttackSolution.execute();
    }
    
    // Prepare enhanced URL with multiple approaches
    const baseURL = 'https://simpleswap.io/exchange';
    
    // Try mercury (without 'o') as primary provider
    const params = new URLSearchParams({
        from: 'eur-eur',
        to: 'pol-matic',  
        amount: '19.50',
        provider: 'mercury',  // Try without the 'o'
        desktop: 'true',
        mobile: 'false',
        device: 'desktop',
        view: 'desktop',
        force_desktop: 'true',
        quantum: 'active',
        ref: 'desktop_auralo',
        v: Date.now()  // Cache buster
    });
    
    const enhancedURL = `${baseURL}?${params.toString()}`;
    
    console.log('🔗 Enhanced URL:', enhancedURL);
    
    // Enhanced window.open with desktop viewport
    const openDesktopWindow = () => {
        // Calculate desktop-like dimensions
        const width = 1280;
        const height = 800;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        // Desktop window features
        const features = [
            `width=${width}`,
            `height=${height}`,
            `left=${left}`,
            `top=${top}`,
            'toolbar=yes',
            'location=yes',
            'directories=no',
            'status=yes',
            'menubar=yes',
            'scrollbars=yes',
            'resizable=yes',
            'copyhistory=yes'
        ].join(',');
        
        console.log('🖥️ Opening with desktop features:', features);
        
        // Open with desktop features
        const newWindow = window.open(enhancedURL, 'SimpleSwapDesktop', features);
        
        if (newWindow) {
            // Inject spoofing script after load
            newWindow.addEventListener('load', () => {
                injectDesktopSpoofingScript(newWindow);
            });
            
            // Monitor for Mercury selection
            setTimeout(() => {
                checkMercurySelection(newWindow);
            }, 3000);
        }
        
        return newWindow;
    };
    
    // Inject desktop spoofing into SimpleSwap window
    const injectDesktopSpoofingScript = (targetWindow) => {
        try {
            const script = targetWindow.document.createElement('script');
            script.textContent = `
                console.log('🎭 DESKTOP SPOOFING INJECTED');
                
                // Override navigator
                Object.defineProperty(navigator, 'userAgent', {
                    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                });
                
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32'
                });
                
                Object.defineProperty(navigator, 'maxTouchPoints', {
                    get: () => 0
                });
                
                // Override screen
                Object.defineProperty(screen, 'width', {
                    get: () => 1920
                });
                
                Object.defineProperty(screen, 'height', {
                    get: () => 1080
                });
                
                // Remove touch events
                delete window.ontouchstart;
                delete window.ontouchmove;
                delete window.ontouchend;
                
                // Force Mercury selection
                setTimeout(() => {
                    const mercuryElement = document.querySelector('[data-provider="mercury"], [data-provider="mercuryo"]');
                    if (mercuryElement) {
                        mercuryElement.click();
                        console.log('✅ Mercury clicked programmatically');
                    }
                    
                    // Also try to find by text
                    const elements = Array.from(document.querySelectorAll('*'));
                    const mercuryTextElement = elements.find(el => 
                        el.textContent && el.textContent.toLowerCase().includes('mercury')
                    );
                    if (mercuryTextElement) {
                        mercuryTextElement.click();
                    }
                }, 1000);
            `;
            
            targetWindow.document.head.appendChild(script);
            console.log('✅ Desktop spoofing script injected successfully');
        } catch (e) {
            console.warn('❌ Cross-origin injection failed:', e.message);
            // Fallback: Try postMessage approach
            targetWindow.postMessage({
                type: 'DESKTOP_SPOOFING',
                action: 'ACTIVATE'
            }, '*');
        }
    };
    
    // Check if Mercury is selected
    const checkMercurySelection = (targetWindow) => {
        try {
            // Try to check if Mercury is selected
            const checkScript = targetWindow.document.createElement('script');
            checkScript.textContent = `
                const mercurySelected = document.querySelector('.selected[data-provider*="mercury"], .active[data-provider*="mercury"]');
                const greenBorder = Array.from(document.querySelectorAll('*')).find(el => {
                    const styles = window.getComputedStyle(el);
                    return styles.borderColor.includes('34, 197, 94') || 
                           styles.borderColor.includes('rgb(34, 197, 94)') ||
                           styles.borderColor.includes('#22c55e');
                });
                
                if (mercurySelected || greenBorder) {
                    console.log('✅ MERCURY SELECTED WITH GREEN BORDER!');
                } else {
                    console.log('❌ Mercury not selected, attempting fallback...');
                    // Try alternative provider parameter
                    window.location.href = window.location.href.replace('provider=mercury', 'provider=mercuryo');
                }
            `;
            targetWindow.document.head.appendChild(checkScript);
        } catch (e) {
            console.log('Could not check Mercury selection:', e.message);
        }
    };
    
    // Load ultimate spoofing first, then open window
    loadUltimateSpoofing().then(() => {
        // Execute the enhanced gateway
        const paymentWindow = openDesktopWindow();
        
        // Fallback if window doesn't open
        if (!paymentWindow || paymentWindow.closed) {
            console.log('⚠️ Window blocked, trying direct navigation...');
            window.location.href = enhancedURL;
        }
        
        return paymentWindow;
    });
}

// Export for use in index.html
window.enhancedPaymentGateway = enhancedPaymentGateway;