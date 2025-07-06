// PROJECT QUANTUM: ADVANCED DESKTOP SPOOFING SYSTEM
// More comprehensive spoofing since simple UA didn't work

// ADVANCED SPOOFING INJECTION SCRIPT
function injectAdvancedSpoofing() {
    console.log('🎭 PROJECT QUANTUM: Activating advanced spoofing...');
    
    // 1. COMPREHENSIVE NAVIGATOR OVERRIDES
    const navigatorProps = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        platform: 'Win32',
        maxTouchPoints: 0,
        hardwareConcurrency: 8,
        deviceMemory: 8,
        language: 'en-US',
        languages: ['en-US', 'en'],
        vendor: 'Google Inc.',
        appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    // Apply all navigator overrides
    for (const [prop, value] of Object.entries(navigatorProps)) {
        try {
            Object.defineProperty(navigator, prop, {
                get: () => value,
                configurable: true
            });
        } catch (e) {
            console.warn(`Failed to override navigator.${prop}`);
        }
    }
    
    // 2. USER AGENT DATA (Modern Chrome)
    if ('userAgentData' in navigator) {
        try {
            Object.defineProperty(navigator, 'userAgentData', {
                value: {
                    brands: [
                        { brand: "Not_A Brand", version: "8" },
                        { brand: "Chromium", version: "120" },
                    { brand: "Google Chrome", version: "120" }
                ],
                mobile: false,
                platform: "Windows",
                getHighEntropyValues: async (hints) => ({
                    brands: [
                        { brand: "Not_A Brand", version: "8" },
                        { brand: "Chromium", version: "120" },
                        { brand: "Google Chrome", version: "120" }
                    ],
                    mobile: false,
                    platform: "Windows",
                    platformVersion: "10.0.0",
                    architecture: "x86",
                    bitness: "64",
                    model: "",
                    uaFullVersion: "120.0.0.0"
                })
            },
            writable: false
        });
        } catch (e) {
            console.warn('Failed to override userAgentData:', e.message);
        }
    }
    
    // 3. SCREEN & WINDOW OVERRIDES
    const screenProps = {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1040,
        colorDepth: 24,
        pixelDepth: 24
    };
    
    for (const [prop, value] of Object.entries(screenProps)) {
        try {
            Object.defineProperty(screen, prop, {
                get: () => value,
                configurable: true
            });
        } catch (e) {
            console.warn(`Failed to override screen.${prop}`);
        }
    }
    
    // Device pixel ratio
    Object.defineProperty(window, 'devicePixelRatio', {
        get: () => 1.0,
        configurable: true
    });
    
    // 4. REMOVE TOUCH SUPPORT
    delete window.ontouchstart;
    delete window.ontouchmove;
    delete window.ontouchend;
    delete window.ontouchcancel;
    
    // Override TouchEvent
    window.TouchEvent = undefined;
    window.Touch = undefined;
    window.TouchList = undefined;
    
    // 5. MEDIA QUERY OVERRIDES
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
        // Force desktop responses
        if (query.includes('pointer: coarse')) {
            return {
                matches: false,
                media: query,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            };
        }
        if (query.includes('pointer: fine')) {
            return {
                matches: true,
                media: query,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            };
        }
        if (query.includes('hover: hover')) {
            return {
                matches: true,
                media: query,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            };
        }
        if (query.includes('hover: none')) {
            return {
                matches: false,
                media: query,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            };
        }
        if (query.includes('max-width') && (query.includes('768px') || query.includes('480px'))) {
            return {
                matches: false,
                media: query,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true
            };
        }
        
        return originalMatchMedia.call(this, query);
    };
    
    // 6. PERMISSIONS API
    if (navigator.permissions && navigator.permissions.query) {
        const originalQuery = navigator.permissions.query;
        navigator.permissions.query = function(descriptor) {
            // Desktop typically has different permissions
            if (descriptor.name === 'geolocation' || descriptor.name === 'notifications') {
                return Promise.resolve({ state: 'prompt' });
            }
            return originalQuery.call(this, descriptor);
        };
    }
    
    // 7. BATTERY API (Desktop typically doesn't have battery API)
    if ('getBattery' in navigator) {
        navigator.getBattery = undefined;
    }
    
    // 8. ORIENTATION (Desktop doesn't change orientation)
    if (screen.orientation) {
        Object.defineProperty(screen.orientation, 'type', {
            get: () => 'landscape-primary',
            configurable: true
        });
        Object.defineProperty(screen.orientation, 'angle', {
            get: () => 0,
            configurable: true
        });
    }
    
    // 9. NETWORK INFORMATION API
    if ('connection' in navigator) {
        Object.defineProperty(navigator.connection, 'effectiveType', {
            get: () => '4g',
            configurable: true
        });
    }
    
    // 10. WEBGL VENDOR (Desktop GPU)
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const context = getContext.call(this, type, ...args);
        if (type === 'webgl' || type === 'webgl2') {
            const getParameter = context.getParameter;
            context.getParameter = function(param) {
                if (param === 0x9245) { // UNMASKED_VENDOR_WEBGL
                    return 'Intel Inc.';
                }
                if (param === 0x9246) { // UNMASKED_RENDERER_WEBGL
                    return 'Intel Iris OpenGL Engine';
                }
                return getParameter.call(this, param);
            };
        }
        return context;
    };
    
    console.log('✅ Advanced spoofing active!');
    console.log('Navigator:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints,
        mobile: navigator.userAgentData?.mobile
    });
}

// INTEGRATION WITH PAYMENT GATEWAY
function integrateAdvancedSpoofing() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', integrateAdvancedSpoofing);
        return;
    }
    
    // Apply spoofing immediately
    injectAdvancedSpoofing();
    
    // Override payment gateway if it exists
    if (window.initiatePaymentGateway) {
        const originalInitiatePayment = window.initiatePaymentGateway;
        window.initiatePaymentGateway = function() {
            console.log('🚀 Payment gateway intercepted - ensuring spoofing is active');
            injectAdvancedSpoofing(); // Reapply just in case
            
            // Add delay to ensure spoofing takes effect
            setTimeout(() => {
                originalInitiatePayment.call(this);
            }, 100);
        };
    }
    
    // Monitor for navigation to SimpleSwap
    const observer = new MutationObserver(() => {
        if (window.location.hostname.includes('simpleswap')) {
            console.log('🎯 SimpleSwap detected - reinforcing spoofing');
            injectAdvancedSpoofing();
            observer.disconnect();
        }
    });
    
    observer.observe(document, { childList: true, subtree: true });
}

// AUTO-EXECUTE ON LOAD
if (typeof window !== 'undefined') {
    integrateAdvancedSpoofing();
}

// EXPORT FOR EXTERNAL USE
window.QuantumAdvancedSpoofing = {
    inject: injectAdvancedSpoofing,
    integrate: integrateAdvancedSpoofing
};