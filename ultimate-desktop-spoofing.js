// ULTIMATE DESKTOP SPOOFING SOLUTION V3
// This comprehensive solution ensures SimpleSwap never detects mobile

(function() {
    'use strict';
    
    console.log('🚀 ULTIMATE DESKTOP SPOOFING V3 - Initializing...');
    
    // Only activate on SimpleSwap domains
    const isSimpleSwap = () => {
        return window.location.hostname.includes('simpleswap.io') ||
               document.referrer.includes('simpleswap.io');
    };
    
    // LAYER 1: Deep Navigator Override
    const spoofNavigator = () => {
        console.log('🎭 Layer 1: Spoofing Navigator...');
        
        const fakeNavigator = {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            maxTouchPoints: 0,
            vendor: 'Google Inc.',
            language: 'en-US',
            languages: ['en-US', 'en'],
            hardwareConcurrency: 8,
            deviceMemory: 8,
            cookieEnabled: true,
            onLine: true,
            doNotTrack: null,
            userAgentData: {
                brands: [
                    { brand: "Not_A Brand", version: "8" },
                    { brand: "Chromium", version: "120" },
                    { brand: "Google Chrome", version: "120" }
                ],
                mobile: false,
                platform: "Windows"
            }
        };
        
        // Use Object.defineProperty for each property
        Object.keys(fakeNavigator).forEach(key => {
            try {
                Object.defineProperty(navigator, key, {
                    get: () => fakeNavigator[key],
                    configurable: true
                });
            } catch (e) {
                // Fallback for protected properties
                navigator.__defineGetter__(key, () => fakeNavigator[key]);
            }
        });
        
        // Remove touch support indicators
        delete window.ontouchstart;
        delete window.ontouchmove;
        delete window.ontouchend;
        delete window.ontouchcancel;
        
        // Override touch detection
        Object.defineProperty(window, 'TouchEvent', {
            get: () => undefined,
            configurable: true
        });
        
        Object.defineProperty(window, 'Touch', {
            get: () => undefined,
            configurable: true
        });
    };
    
    // LAYER 2: Screen Spoofing
    const spoofScreen = () => {
        console.log('🎭 Layer 2: Spoofing Screen...');
        
        const fakeScreen = {
            width: 1920,
            height: 1080,
            availWidth: 1920,
            availHeight: 1040,
            colorDepth: 24,
            pixelDepth: 24,
            orientation: {
                angle: 0,
                type: "landscape-primary",
                lock: () => Promise.resolve(),
                unlock: () => {}
            }
        };
        
        Object.keys(fakeScreen).forEach(key => {
            try {
                Object.defineProperty(screen, key, {
                    get: () => fakeScreen[key],
                    configurable: true
                });
            } catch (e) {
                screen.__defineGetter__(key, () => fakeScreen[key]);
            }
        });
        
        // Device pixel ratio
        Object.defineProperty(window, 'devicePixelRatio', {
            get: () => 1.0,
            configurable: true
        });
    };
    
    // LAYER 3: Media Query Spoofing
    const spoofMediaQueries = () => {
        console.log('🎭 Layer 3: Spoofing Media Queries...');
        
        const originalMatchMedia = window.matchMedia;
        
        window.matchMedia = function(query) {
            // Desktop responses for all queries
            const desktopResponses = {
                '(pointer: coarse)': false,
                '(pointer: fine)': true,
                '(hover: hover)': true,
                '(hover: none)': false,
                '(any-hover: hover)': true,
                '(any-pointer: coarse)': false,
                '(any-pointer: fine)': true,
                'handheld': false,
                'screen and (max-width: 768px)': false,
                'screen and (max-width: 1024px)': false,
                '(orientation: portrait)': false,
                '(orientation: landscape)': true
            };
            
            // Check for matches
            for (const [pattern, result] of Object.entries(desktopResponses)) {
                if (query.toLowerCase().includes(pattern)) {
                    return {
                        matches: result,
                        media: query,
                        onchange: null,
                        addListener: () => {},
                        removeListener: () => {},
                        addEventListener: () => {},
                        removeEventListener: () => {},
                        dispatchEvent: () => true
                    };
                }
            }
            
            return originalMatchMedia.call(this, query);
        };
    };
    
    // LAYER 4: Event System Override
    const spoofEvents = () => {
        console.log('🎭 Layer 4: Spoofing Events...');
        
        // Block touch event registration
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (['touchstart', 'touchend', 'touchmove', 'touchcancel'].includes(type)) {
                // Convert to mouse events
                const mouseType = {
                    'touchstart': 'mousedown',
                    'touchend': 'mouseup',
                    'touchmove': 'mousemove',
                    'touchcancel': 'mouseleave'
                }[type];
                
                return originalAddEventListener.call(this, mouseType, listener, options);
            }
            
            return originalAddEventListener.call(this, type, listener, options);
        };
        
        // Override touch capability checks
        document.createTouch = undefined;
        document.createTouchList = undefined;
    };
    
    // LAYER 5: Network Request Spoofing
    const spoofNetworkRequests = () => {
        console.log('🎭 Layer 5: Spoofing Network Requests...');
        
        // Override fetch
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            options.headers = options.headers || {};
            options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            
            return originalFetch.call(this, url, options);
        };
        
        // Override XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 1) {
                    this.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                }
            });
            
            return originalOpen.call(this, method, url, ...args);
        };
    };
    
    // LAYER 6: CSS Environment Override
    const spoofCSSEnvironment = () => {
        console.log('🎭 Layer 6: Spoofing CSS Environment...');
        
        const style = document.createElement('style');
        style.textContent = `
            /* Force desktop CSS environment */
            :root {
                --sai-top: 0px !important;
                --sai-bottom: 0px !important;
                --sai-left: 0px !important;
                --sai-right: 0px !important;
            }
            
            /* Override mobile-specific styles */
            @media (pointer: coarse) {
                * { cursor: pointer !important; }
            }
            
            @media (hover: none) {
                *:hover { opacity: 1 !important; }
            }
        `;
        
        (document.head || document.documentElement).appendChild(style);
    };
    
    // LAYER 7: Advanced Detection Evasion
    const advancedEvasion = () => {
        console.log('🎭 Layer 7: Advanced Detection Evasion...');
        
        // Override feature detection
        const features = [
            'ontouchstart',
            'ontouchmove',
            'ontouchend',
            'ontouchcancel',
            'orientation',
            'ondeviceorientation',
            'ondevicemotion'
        ];
        
        features.forEach(feature => {
            if (feature in window) {
                delete window[feature];
            }
        });
        
        // Override permissions API
        if (navigator.permissions) {
            const originalQuery = navigator.permissions.query;
            navigator.permissions.query = function(permissionDesc) {
                if (permissionDesc.name === 'accelerometer' ||
                    permissionDesc.name === 'gyroscope' ||
                    permissionDesc.name === 'magnetometer') {
                    return Promise.resolve({ state: 'denied' });
                }
                return originalQuery.call(this, permissionDesc);
            };
        }
        
        // Override battery API (mobile indicator)
        if ('getBattery' in navigator) {
            navigator.getBattery = undefined;
        }
        
        // Override vibration API (mobile indicator)
        navigator.vibrate = undefined;
        navigator.mozVibrate = undefined;
    };
    
    // Initialize all layers
    const initializeSpoofing = () => {
        if (!isSimpleSwap()) {
            console.log('❌ Not on SimpleSwap, spoofing not activated');
            return;
        }
        
        console.log('✅ SimpleSwap detected, activating all spoofing layers...');
        
        spoofNavigator();
        spoofScreen();
        spoofMediaQueries();
        spoofEvents();
        spoofNetworkRequests();
        spoofCSSEnvironment();
        advancedEvasion();
        
        console.log('🎭 All spoofing layers active!');
        
        // Monitor for dynamic content changes
        const observer = new MutationObserver(() => {
            // Re-apply spoofing if needed
            if (window.navigator.maxTouchPoints > 0) {
                spoofNavigator();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    
    // Initialize immediately and on DOM ready
    initializeSpoofing();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSpoofing);
    }
    
    // Also initialize on window load
    window.addEventListener('load', initializeSpoofing);
    
    // Export for external use
    window.ultimateDesktopSpoofing = {
        initialize: initializeSpoofing,
        isActive: () => true
    };
    
    console.log('✅ Ultimate Desktop Spoofing V3 Ready');
})();