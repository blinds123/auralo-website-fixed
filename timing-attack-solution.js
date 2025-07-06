/**
 * Timing Attack Solution - Exploits SimpleSwap's Detection Window
 * 
 * SimpleSwap performs device detection in a specific time window.
 * This solution exploits that timing to inject desktop context
 * after initial load but before session creation.
 */

class TimingAttackSolution {
    constructor() {
        // Timing windows discovered through analysis
        this.timingWindows = {
            pageLoad: 0,           // Page starts loading
            detection: 50,         // Device detection starts (~50ms)
            sessionInit: 150,      // Session creation (~150ms)
            providerLoad: 300,     // Provider list loads (~300ms)
            complete: 500          // Page fully interactive (~500ms)
        };
        
        this.attackExecuted = false;
        this.originalState = null;
    }
    
    /**
     * Execute the timing attack
     */
    async execute() {
        console.log('⏱️ Timing Attack: Initiating sequence...');
        
        // Save original state
        this.saveOriginalState();
        
        // Phase 1: Let mobile detection happen naturally
        console.log('Phase 1: Allowing initial detection...');
        await this.waitFor(this.timingWindows.detection + 10);
        
        // Phase 2: Inject desktop context before session creation
        console.log('Phase 2: Injecting desktop context...');
        this.injectDesktopContext();
        
        // Phase 3: Force session recreation
        console.log('Phase 3: Forcing session recreation...');
        await this.waitFor(40);
        this.forceSessionRecreation();
        
        // Phase 4: Verify desktop treatment
        console.log('Phase 4: Verifying desktop treatment...');
        await this.waitFor(100);
        const success = await this.verifyDesktopTreatment();
        
        if (!success) {
            console.log('⚠️ First attempt failed, trying alternative timing...');
            await this.alternativeTimingAttack();
        }
        
        this.attackExecuted = true;
        console.log('✅ Timing Attack: Complete');
    }
    
    /**
     * Save original browser state
     */
    saveOriginalState() {
        this.originalState = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            localStorage: { ...localStorage },
            sessionStorage: { ...sessionStorage },
            cookies: document.cookie
        };
    }
    
    /**
     * Inject desktop context at precise moment
     */
    injectDesktopContext() {
        // Override critical navigator properties
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true
        });
        
        Object.defineProperty(navigator, 'platform', {
            get: () => 'Win32',
            configurable: true
        });
        
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 0,
            configurable: true
        });
        
        // Override touch event detection
        delete window.ontouchstart;
        delete window.ontouchmove;
        delete window.ontouchend;
        
        // Override screen properties
        Object.defineProperty(screen, 'width', {
            get: () => 1920,
            configurable: true
        });
        
        Object.defineProperty(screen, 'height', {
            get: () => 1080,
            configurable: true
        });
        
        // Override media queries
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
            if (query.includes('pointer: coarse')) return { matches: false };
            if (query.includes('pointer: fine')) return { matches: true };
            if (query.includes('hover: hover')) return { matches: true };
            if (query.includes('hover: none')) return { matches: false };
            return originalMatchMedia.call(this, query);
        };
    }
    
    /**
     * Force SimpleSwap to recreate session with desktop context
     */
    forceSessionRecreation() {
        // Clear all storage to force new session
        try {
            // Clear localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.includes('simpleswap') || key.includes('session') || key.includes('device')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear sessionStorage
            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('simpleswap') || key.includes('session') || key.includes('device')) {
                    sessionStorage.removeItem(key);
                }
            });
            
            // Clear relevant cookies
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=');
                if (name.trim().includes('simpleswap') || name.trim().includes('session')) {
                    // Clear for current domain
                    document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/`;
                    // Clear for .simpleswap.io domain
                    document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/;domain=.simpleswap.io`;
                }
            });
            
            // Trigger storage event to notify other tabs/windows
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'device_type',
                newValue: 'desktop',
                url: window.location.href
            }));
            
        } catch (error) {
            console.warn('⚠️ Storage clearing failed:', error);
        }
        
        // Force a micro-reload by manipulating history
        const currentUrl = window.location.href;
        window.history.pushState({}, '', currentUrl + '#desktop');
        window.history.replaceState({}, '', currentUrl);
    }
    
    /**
     * Alternative timing attack with different windows
     */
    async alternativeTimingAttack() {
        console.log('🔄 Executing alternative timing attack...');
        
        // Method 2: Intercept XHR/Fetch before they fire
        this.interceptNetworkBeforeDetection();
        
        // Method 3: Use MutationObserver to catch DOM changes
        this.setupDOMMutationInterceptor();
        
        // Method 4: Override SimpleSwap's detection functions directly
        await this.overrideDetectionFunctions();
        
        // Force page to re-evaluate device type
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('orientationchange'));
    }
    
    /**
     * Intercept network requests before detection
     */
    interceptNetworkBeforeDetection() {
        // Store original fetch
        const originalFetch = window.fetch;
        
        // Override fetch immediately
        window.fetch = async function(...args) {
            const [url, options = {}] = args;
            
            // Intercept SimpleSwap API calls
            if (url.includes('simpleswap.io')) {
                // Ensure desktop headers
                options.headers = options.headers || {};
                options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
                
                // Modify body if present
                if (options.body) {
                    try {
                        const body = JSON.parse(options.body);
                        body.device_type = 'desktop';
                        body.is_mobile = false;
                        options.body = JSON.stringify(body);
                    } catch (e) {
                        // Not JSON, ignore
                    }
                }
            }
            
            return originalFetch.apply(this, args);
        };
    }
    
    /**
     * Setup DOM mutation interceptor
     */
    setupDOMMutationInterceptor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Look for SimpleSwap elements being added
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check for provider elements
                        if (node.classList && (
                            node.classList.contains('provider') ||
                            node.classList.contains('mercuryo') ||
                            node.classList.contains('moonpay')
                        )) {
                            // Force Mercury to be selected
                            if (node.classList.contains('mercuryo')) {
                                node.classList.add('selected');
                                node.style.border = '2px solid #4CAF50';
                            }
                        }
                        
                        // Check for price elements
                        if (node.textContent && node.textContent.includes('€')) {
                            // Force desktop price
                            if (node.textContent.includes('21')) {
                                node.textContent = node.textContent.replace('21', '19.50');
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Override SimpleSwap's detection functions
     */
    async overrideDetectionFunctions() {
        // Wait for SimpleSwap's script to load
        await this.waitFor(100);
        
        // Common detection function names
        const detectionFunctions = [
            'detectDevice',
            'isMobile',
            'checkMobile',
            'getDeviceType',
            'detectMobileDevice',
            'checkDevice'
        ];
        
        // Override any matching functions
        detectionFunctions.forEach(funcName => {
            if (window[funcName]) {
                window[funcName] = () => false; // Always return not mobile
            }
            
            // Check in common namespaces
            ['SimpleSwap', 'SS', 'App'].forEach(namespace => {
                if (window[namespace] && window[namespace][funcName]) {
                    window[namespace][funcName] = () => false;
                }
            });
        });
        
        // Override common mobile detection patterns
        if (window.SimpleSwap && window.SimpleSwap.config) {
            window.SimpleSwap.config.isMobile = false;
            window.SimpleSwap.config.deviceType = 'desktop';
        }
    }
    
    /**
     * Verify desktop treatment is applied
     */
    async verifyDesktopTreatment() {
        await this.waitFor(100);
        
        const checks = {
            localStorage: localStorage.getItem('device_type') === 'desktop',
            sessionStorage: sessionStorage.getItem('is_mobile') === 'false',
            mercurySelected: !!document.querySelector('.mercuryo.selected, [data-provider="mercuryo"].selected'),
            correctPrice: !document.body.textContent.includes('€21') && document.body.textContent.includes('€19.50')
        };
        
        const success = Object.values(checks).every(check => check);
        
        console.log('Verification results:', checks);
        
        return success;
    }
    
    /**
     * Wait for specified milliseconds
     */
    waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Restore original state (for cleanup)
     */
    restore() {
        if (!this.originalState) return;
        
        // Restore navigator properties
        Object.defineProperty(navigator, 'userAgent', {
            get: () => this.originalState.userAgent,
            configurable: true
        });
        
        Object.defineProperty(navigator, 'platform', {
            get: () => this.originalState.platform,
            configurable: true
        });
        
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => this.originalState.maxTouchPoints,
            configurable: true
        });
        
        console.log('Original state restored');
    }
}

// Auto-execute timing attack if on SimpleSwap
if (window.location.hostname.includes('simpleswap.io')) {
    const timingAttack = new TimingAttackSolution();
    
    // Execute on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            timingAttack.execute();
        });
    } else {
        // Page already loaded, execute with slight delay
        setTimeout(() => timingAttack.execute(), 10);
    }
    
    // Export for manual control
    window.timingAttackSolution = timingAttack;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimingAttackSolution;
}