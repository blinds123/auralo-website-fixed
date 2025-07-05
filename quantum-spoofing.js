/**
 * PROJECT QUANTUM - Desktop Spoofing System
 * Prevents SimpleSwap mobile price markup (€19.50 → €21)
 * Ensures Mercury provider selection with green border
 * Preserves authentic mobile UX while spoofing desktop signals
 */

// ============================================================================
// LAYER 1: USER-AGENT MASQUERADING
// ============================================================================

const DESKTOP_USER_AGENTS = {
    chrome_windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    chrome_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    safari_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
};

function applySpoofingLayer1_UserAgent() {
    try {
        // Store original user agent for UX preservation
        window.quantumSpoofing = window.quantumSpoofing || {};
        window.quantumSpoofing.originalUserAgent = navigator.userAgent;
        
        // Override navigator.userAgent
        Object.defineProperty(navigator, 'userAgent', {
            get: () => DESKTOP_USER_AGENTS.chrome_windows,
            configurable: false
        });
        
        console.log('🎭 Layer 1: User-Agent spoofed to desktop');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 1: User-Agent spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 2: NAVIGATOR API SPOOFING
// ============================================================================

function applySpoofingLayer2_Navigator() {
    try {
        // Store original navigator properties
        if (!window.quantumSpoofing) window.quantumSpoofing = {};
        window.quantumSpoofing.originalNavigator = {
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            vendor: navigator.vendor,
            userAgentData: navigator.userAgentData
        };
        
        const desktopNavigator = {
            platform: "Win32",
            userAgent: DESKTOP_USER_AGENTS.chrome_windows,
            maxTouchPoints: 0,
            vendor: "Google Inc.",
            language: "en-US",
            languages: ["en-US", "en"],
            hardwareConcurrency: 8,
            deviceMemory: 8,
            cookieEnabled: true,
            onLine: true,
            doNotTrack: null
        };
        
        // Apply overrides with Proxy for undetectable spoofing
        const originalNavigator = navigator;
        window.navigator = new Proxy(originalNavigator, {
            get(target, prop) {
                if (desktopNavigator.hasOwnProperty(prop)) {
                    return desktopNavigator[prop];
                }
                return target[prop];
            }
        });
        
        // Override userAgentData (modern browsers)
        if (navigator.userAgentData) {
            Object.defineProperty(navigator, 'userAgentData', {
                value: {
                    brands: [
                        { brand: "Not_A Brand", version: "8" },
                        { brand: "Chromium", version: "120" },
                        { brand: "Google Chrome", version: "120" }
                    ],
                    mobile: false,
                    platform: "Windows"
                },
                writable: false
            });
        }
        
        console.log('🎭 Layer 2: Navigator API spoofed to desktop');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 2: Navigator spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 3: SCREEN/DISPLAY SPOOFING
// ============================================================================

function applySpoofingLayer3_Screen() {
    try {
        // Store original screen properties
        if (!window.quantumSpoofing) window.quantumSpoofing = {};
        window.quantumSpoofing.originalScreen = {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            devicePixelRatio: window.devicePixelRatio
        };
        
        // Desktop-typical screen dimensions
        const desktopScreen = {
            width: 1920,
            height: 1080,
            availWidth: 1920,
            availHeight: 1040,
            colorDepth: 24,
            pixelDepth: 24,
            orientation: {
                angle: 0,
                type: "landscape-primary"
            }
        };
        
        // Override screen properties
        Object.keys(desktopScreen).forEach(prop => {
            if (prop !== 'orientation') {
                Object.defineProperty(screen, prop, {
                    get: () => desktopScreen[prop],
                    configurable: false
                });
            }
        });
        
        // Override devicePixelRatio
        Object.defineProperty(window, 'devicePixelRatio', {
            get: () => 1.0,
            configurable: false
        });
        
        console.log('🎭 Layer 3: Screen/Display spoofed to desktop');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 3: Screen spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 4: EVENT SYSTEM MANIPULATION
// ============================================================================

function applySpoofingLayer4_Events() {
    try {
        // Store original event listener
        if (!window.quantumSpoofing) window.quantumSpoofing = {};
        window.quantumSpoofing.originalAddEventListener = EventTarget.prototype.addEventListener;
        
        // Suppress touch events for detection while preserving mobile UX
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Block touch event registration for SimpleSwap domain
            if (window.location.hostname.includes('simpleswap.io')) {
                if (['touchstart', 'touchend', 'touchmove', 'touchcancel'].includes(type)) {
                    // Register as mouse event instead
                    const mouseType = {
                        'touchstart': 'mousedown',
                        'touchend': 'mouseup', 
                        'touchmove': 'mousemove',
                        'touchcancel': 'mouseleave'
                    }[type];
                    
                    return originalAddEventListener.call(this, mouseType, listener, options);
                }
            }
            
            return originalAddEventListener.call(this, type, listener, options);
        };
        
        // Override pointer capabilities
        window.PointerEvent = window.PointerEvent || function() {};
        if (navigator.pointerEnabled !== undefined) navigator.pointerEnabled = false;
        if (navigator.msPointerEnabled !== undefined) navigator.msPointerEnabled = false;
        
        console.log('🎭 Layer 4: Event system spoofed to desktop');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 4: Event spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 5: MEDIA QUERY & CSS SPOOFING
// ============================================================================

function applySpoofingLayer5_MediaQueries() {
    try {
        // Store original matchMedia
        if (!window.quantumSpoofing) window.quantumSpoofing = {};
        window.quantumSpoofing.originalMatchMedia = window.matchMedia;
        
        const mediaQueryOverrides = {
            '(pointer: coarse)': false,
            '(pointer: fine)': true,
            '(hover: hover)': true,
            '(hover: none)': false,
            '(any-hover: hover)': true,
            '(any-pointer: coarse)': false,
            '(any-pointer: fine)': true,
            '(orientation: portrait)': false,
            '(orientation: landscape)': true
        };
        
        // Enhanced matchMedia override
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
            const normalizedQuery = query.toLowerCase().trim();
            
            // Check for override matches
            for (const [overrideQuery, result] of Object.entries(mediaQueryOverrides)) {
                if (normalizedQuery.includes(overrideQuery)) {
                    return {
                        matches: result,
                        media: query,
                        addListener: function() {},
                        removeListener: function() {},
                        addEventListener: function() {},
                        removeEventListener: function() {},
                        dispatchEvent: function() {}
                    };
                }
            }
            
            return originalMatchMedia.call(this, query);
        };
        
        console.log('🎭 Layer 5: Media queries spoofed to desktop');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 5: Media query spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 6: ANTI-DETECTION MECHANISMS
// ============================================================================

function applySpoofingLayer6_AntiDetection() {
    try {
        // Implement random delays to avoid detection patterns
        function randomDelay(min = 1, max = 10) {
            return new Promise(resolve => 
                setTimeout(resolve, Math.random() * (max - min) + min)
            );
        }
        
        // Create undetectable property overrides using Proxy
        function createUndetectableOverride(target, overrides) {
            return new Proxy(target, {
                get(obj, prop) {
                    if (overrides.hasOwnProperty(prop)) {
                        return overrides[prop];
                    }
                    return obj[prop];
                },
                
                has(obj, prop) {
                    return prop in obj;
                },
                
                ownKeys(obj) {
                    return Object.getOwnPropertyNames(obj);
                },
                
                getOwnPropertyDescriptor(obj, prop) {
                    return Object.getOwnPropertyDescriptor(obj, prop);
                }
            });
        }
        
        // Store anti-detection utilities
        window.quantumSpoofing.antiDetection = {
            randomDelay,
            createUndetectableOverride
        };
        
        console.log('🎭 Layer 6: Anti-detection mechanisms initialized');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 6: Anti-detection failed:', e.message);
        return false;
    }
}

// ============================================================================
// LAYER 7: NETWORK-LEVEL SPOOFING
// ============================================================================

function applySpoofingLayer7_Network() {
    try {
        // Store original fetch and XHR
        if (!window.quantumSpoofing) window.quantumSpoofing = {};
        window.quantumSpoofing.originalFetch = window.fetch;
        window.quantumSpoofing.originalXHROpen = XMLHttpRequest.prototype.open;
        
        // Override all network requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            options.headers = options.headers || {};
            
            // Desktop headers
            options.headers['User-Agent'] = DESKTOP_USER_AGENTS.chrome_windows;
            options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
            options.headers['Accept-Language'] = 'en-US,en;q=0.5';
            options.headers['Accept-Encoding'] = 'gzip, deflate';
            options.headers['DNT'] = '1';
            options.headers['Connection'] = 'keep-alive';
            
            return originalFetch.call(this, url, options);
        };
        
        // Override XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 1) {  // OPENED
                    this.setRequestHeader('User-Agent', DESKTOP_USER_AGENTS.chrome_windows);
                }
            });
            
            return originalXHROpen.call(this, method, url, async, user, password);
        };
        
        console.log('🎭 Layer 7: Network-level spoofing initialized');
        return true;
    } catch (e) {
        console.warn('⚠️ Layer 7: Network spoofing failed:', e.message);
        return false;
    }
}

// ============================================================================
// QUANTUM SPOOFING ACTIVATION SYSTEM
// ============================================================================

function activateQuantumSpoofing() {
    console.log('🎭 Activating PROJECT QUANTUM Desktop Spoofing...');
    
    // Initialize spoofing state
    window.quantumSpoofing = {
        active: true,
        timestamp: Date.now(),
        layers: {}
    };
    
    // Apply all layers with random delays for stealth
    const layers = [
        { name: 'UserAgent', fn: applySpoofingLayer1_UserAgent },
        { name: 'Navigator', fn: applySpoofingLayer2_Navigator },
        { name: 'Screen', fn: applySpoofingLayer3_Screen },
        { name: 'Events', fn: applySpoofingLayer4_Events },
        { name: 'MediaQueries', fn: applySpoofingLayer5_MediaQueries },
        { name: 'AntiDetection', fn: applySpoofingLayer6_AntiDetection },
        { name: 'Network', fn: applySpoofingLayer7_Network }
    ];
    
    layers.forEach(async (layer, index) => {
        // Random delay between layers for stealth
        await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 5));
        
        const success = layer.fn();
        window.quantumSpoofing.layers[layer.name] = success;
        
        if (!success) {
            console.warn(`⚠️ Layer ${index + 1} (${layer.name}) failed to activate`);
        }
    });
    
    // Verify spoofing status
    setTimeout(() => {
        const successCount = Object.values(window.quantumSpoofing.layers).filter(Boolean).length;
        console.log(`🎭 PROJECT QUANTUM: ${successCount}/7 layers active`);
        
        if (successCount >= 5) {
            console.log('✅ Desktop spoofing successfully activated');
            console.log('💰 Price should remain €19.50 (no mobile markup)');
            console.log('🏆 Mercury should be auto-selected with green border');
        } else {
            console.warn('⚠️ Desktop spoofing partially failed - some layers inactive');
        }
    }, 100);
}

function deactivateQuantumSpoofing() {
    if (!window.quantumSpoofing || !window.quantumSpoofing.active) {
        return;
    }
    
    console.log('🎭 Deactivating PROJECT QUANTUM Desktop Spoofing...');
    
    try {
        // Restore original properties where possible
        if (window.quantumSpoofing.originalAddEventListener) {
            EventTarget.prototype.addEventListener = window.quantumSpoofing.originalAddEventListener;
        }
        
        if (window.quantumSpoofing.originalMatchMedia) {
            window.matchMedia = window.quantumSpoofing.originalMatchMedia;
        }
        
        if (window.quantumSpoofing.originalFetch) {
            window.fetch = window.quantumSpoofing.originalFetch;
        }
        
        if (window.quantumSpoofing.originalXHROpen) {
            XMLHttpRequest.prototype.open = window.quantumSpoofing.originalXHROpen;
        }
        
        window.quantumSpoofing.active = false;
        console.log('✅ Desktop spoofing deactivated');
    } catch (e) {
        console.warn('⚠️ Some spoofing elements could not be fully restored:', e.message);
    }
}

// ============================================================================
// SELECTIVE ACTIVATION FOR SIMPLESWAP ONLY
// ============================================================================

function initializeSelectiveSpoofing() {
    // Monitor URL changes for selective activation
    function checkDomainAndActivate() {
        const currentDomain = window.location.hostname;
        const isSimpleSwap = currentDomain.includes('simpleswap.io') || 
                           currentDomain.includes('simpleswap') ||
                           document.referrer.includes('simpleswap.io');
        
        if (isSimpleSwap && (!window.quantumSpoofing || !window.quantumSpoofing.active)) {
            console.log('🎯 SimpleSwap domain detected - activating desktop spoofing');
            activateQuantumSpoofing();
        } else if (!isSimpleSwap && window.quantumSpoofing && window.quantumSpoofing.active) {
            console.log('🎯 Leaving SimpleSwap - deactivating desktop spoofing');
            deactivateQuantumSpoofing();
        }
    }
    
    // Initial check
    checkDomainAndActivate();
    
    // Monitor for URL changes
    const observer = new MutationObserver(() => {
        checkDomainAndActivate();
    });
    
    observer.observe(document, { childList: true, subtree: true });
    
    // Monitor window focus changes (for new tabs)
    window.addEventListener('focus', checkDomainAndActivate);
    
    console.log('🎭 Selective spoofing monitor initialized');
}

// ============================================================================
// INTEGRATION WITH EXISTING PAYMENT SYSTEM
// ============================================================================

function enhancePaymentGatewayWithSpoofing() {
    // Store original initiatePaymentGateway if it exists
    if (typeof window.initiatePaymentGateway === 'function') {
        window.quantumSpoofing = window.quantumSpoofing || {};
        window.quantumSpoofing.originalInitiatePaymentGateway = window.initiatePaymentGateway;
        
        // Enhanced version with desktop spoofing
        window.initiatePaymentGateway = function() {
            console.log('🎭 Enhanced payment gateway with desktop spoofing');
            
            // Pre-activate spoofing for SimpleSwap
            activateQuantumSpoofing();
            
            // Small delay to ensure spoofing is active
            setTimeout(() => {
                // Call original function
                if (window.quantumSpoofing.originalInitiatePaymentGateway) {
                    window.quantumSpoofing.originalInitiatePaymentGateway();
                } else {
                    // Fallback to direct SimpleSwap navigation
                    const simpleSwapURL = "https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercuryo";
                    window.open(simpleSwapURL, '_blank');
                }
            }, 100);
        };
    }
}

// ============================================================================
// VALIDATION SYSTEM
// ============================================================================

function validateQuantumSpoofing() {
    const validation = {
        timestamp: new Date().toISOString(),
        spoofingActive: window.quantumSpoofing && window.quantumSpoofing.active,
        layers: window.quantumSpoofing ? window.quantumSpoofing.layers : {},
        deviceSignals: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            screenWidth: screen.width,
            screenHeight: screen.height,
            devicePixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window
        },
        expectedResults: {
            priceStability: "€19.50 should remain €19.50 (no mobile markup)",
            mercurySelection: "Mercury should have green border (auto-selected)",
            walletFunctionality: "Wallet address field should be accessible",
            mobileUX: "Touch experience should remain natural"
        }
    };
    
    console.log('🔍 PROJECT QUANTUM Validation:', validation);
    return validation;
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeSelectiveSpoofing();
        enhancePaymentGatewayWithSpoofing();
    });
} else {
    initializeSelectiveSpoofing();
    enhancePaymentGatewayWithSpoofing();
}

// Export for manual control
window.projectQuantum = {
    activate: activateQuantumSpoofing,
    deactivate: deactivateQuantumSpoofing,
    validate: validateQuantumSpoofing,
    version: "1.0.0"
};

console.log('🎭 PROJECT QUANTUM Desktop Spoofing System loaded and ready');