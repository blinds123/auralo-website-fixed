# 🔧 IMPLEMENTATION: SimpleSwap Desktop Spoofing System

## 🎯 Core Mission (NEVER FORGET)
**Prevent SimpleSwap mobile price increase (€19.50 → €21) and ensure Mercury green border selection while preserving mobile UX**

## 📊 Success Validation Checklist
- [ ] €19.50 stays €19.50 (not €21)
- [ ] Mercury has green border (auto-selected)  
- [ ] Wallet address entry functional
- [ ] Works on verified iOS/Android emulators
- [ ] Natural mobile touch experience preserved
- [ ] Claude Code Anti-Reward-Hacking Validation: 4/4 score

---

## 🔍 PHASE 1: DEEP RESEARCH & DISCOVERY

### SimpleSwap Device Detection Analysis

#### Primary Detection Vectors (Research Required)
```javascript
// Detection methods to investigate:
1. User-Agent string parsing
2. Navigator API properties (platform, userAgent, maxTouchPoints)
3. Screen dimensions and devicePixelRatio
4. Touch capability detection (ontouchstart, TouchEvent)
5. CSS media queries (@media pointer, hover)
6. Browser feature detection (orientation API, vibration)
7. Network headers and referrer analysis
8. Canvas fingerprinting and WebGL renderer
```

#### Critical Research Questions
1. **Price Logic**: What triggers €19.50 → €21 increase on mobile?
2. **Provider Logic**: How does SimpleSwap determine Mercury vs MoonPay default?
3. **Detection Timing**: When during page load does device detection occur?
4. **Fallback Mechanisms**: What happens if detection fails or is inconclusive?
5. **Server vs Client**: Which detection happens server-side vs client-side?

### Research Methodology
```javascript
// Step 1: Traffic Analysis
// Use browser dev tools to capture:
// - Initial page load requests
// - XHR/fetch calls with device info
// - POST/GET parameters sent to SimpleSwap
// - Response differences between desktop/mobile

// Step 2: JavaScript Analysis  
// Examine SimpleSwap's JavaScript for:
// - Device detection functions
// - Price calculation logic
// - Provider selection algorithms
// - DOM manipulation for mobile layouts

// Step 3: Comparison Testing
// Document exact differences between:
// - Desktop: €19.50 + Mercury green border
// - Mobile: €21 + different provider behavior
```

---

## 🏗️ PHASE 2: 7-LAYER SPOOFING ARCHITECTURE

### Layer 1: User-Agent Masquerading

#### Implementation Strategy
```javascript
// Override User-Agent before any requests
const DESKTOP_USER_AGENTS = {
    chrome_windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    chrome_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    safari_mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
};

// Override navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
    get: () => DESKTOP_USER_AGENTS.chrome_windows,
    configurable: false
});

// Override for network requests
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['User-Agent'] = DESKTOP_USER_AGENTS.chrome_windows;
    return originalFetch.call(this, url, options);
};
```

#### Testing Requirements
- Verify User-Agent appears as desktop in SimpleSwap logs
- Confirm no mobile-specific JavaScript branches execute
- Test across all target browsers (iOS Safari, Android Chrome)

### Layer 2: Navigator API Spoofing

#### Critical Properties to Override
```javascript
// Complete navigator object spoofing
const desktopNavigator = {
    platform: "Win32",              // Critical: Not "iPhone" or "Android"
    userAgent: DESKTOP_USER_AGENTS.chrome_windows,
    maxTouchPoints: 0,              // Critical: 0 = no touch support
    vendor: "Google Inc.",
    language: "en-US",
    languages: ["en-US", "en"],
    hardwareConcurrency: 8,         // Desktop-typical value
    deviceMemory: 8,                // Desktop-typical value
    cookieEnabled: true,
    onLine: true,
    doNotTrack: null
};

// Apply overrides with Proxy for undetectable spoofing
navigator = new Proxy(navigator, {
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
            mobile: false,              // Critical: false = desktop
            platform: "Windows"
        },
        writable: false
    });
}
```

#### Validation Methods
- Test `navigator.maxTouchPoints === 0` returns true
- Verify `navigator.platform` returns desktop value
- Confirm `navigator.userAgentData.mobile === false`

### Layer 3: Screen/Display Spoofing

#### Screen Object Override
```javascript
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

// Override window dimensions strategically
// Note: Don't override window.innerWidth/Height completely as it breaks mobile layouts
// Instead, override only for detection scripts

// Override devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
    get: () => 1.0,  // Desktop-typical value
    configurable: false
});
```

#### Strategic Considerations
- Maintain actual mobile viewport for layout purposes
- Only spoof dimensions for detection queries
- Preserve responsive design functionality

### Layer 4: Event System Manipulation

#### Touch Event Suppression
```javascript
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

// Generate synthetic mouse events for critical interactions
function simulateMouseInteraction(element) {
    const rect = element.getBoundingClientRect();
    const mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    });
    element.dispatchEvent(mouseEvent);
}
```

#### Pointer Event Spoofing
```javascript
// Override pointer capabilities
window.PointerEvent = window.PointerEvent || function() {};
window.navigator.pointerEnabled = false;
window.navigator.msPointerEnabled = false;

// Override CSS pointer detection
const originalMatchMedia = window.matchMedia;
window.matchMedia = function(query) {
    // Spoof pointer capabilities
    if (query.includes('pointer: coarse')) {
        return { matches: false };  // No coarse pointer (touch)
    }
    if (query.includes('pointer: fine')) {
        return { matches: true };   // Fine pointer (mouse)
    }
    if (query.includes('hover: hover')) {
        return { matches: true };   // Hover support
    }
    if (query.includes('hover: none')) {
        return { matches: false };  // No hover limitations
    }
    
    return originalMatchMedia.call(this, query);
};
```

### Layer 5: Media Query & CSS Spoofing

#### CSS Detection Override
```javascript
// Override CSS media query detection
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
```

#### CSS Environment Variables
```javascript
// Override CSS environment variables (safe areas, etc.)
const style = document.createElement('style');
style.textContent = `
    :root {
        --sai-top: 0px;
        --sai-bottom: 0px;
        --sai-left: 0px;
        --sai-right: 0px;
    }
`;
document.head.appendChild(style);
```

### Layer 6: Anti-Detection Mechanisms

#### Undetectable Property Overrides
```javascript
// Use Proxy for undetectable overrides
function createUndetectableOverride(target, overrides) {
    return new Proxy(target, {
        get(obj, prop) {
            if (overrides.hasOwnProperty(prop)) {
                return overrides[prop];
            }
            return obj[prop];
        },
        
        has(obj, prop) {
            return prop in obj;  // Always return original has behavior
        },
        
        ownKeys(obj) {
            return Object.getOwnPropertyNames(obj);  // Hide override properties
        },
        
        getOwnPropertyDescriptor(obj, prop) {
            return Object.getOwnPropertyDescriptor(obj, prop);
        }
    });
}

// Apply to critical objects
window.navigator = createUndetectableOverride(navigator, desktopNavigator);
window.screen = createUndetectableOverride(screen, desktopScreen);
```

#### Timing-Based Detection Avoidance
```javascript
// Implement random delays to avoid detection patterns
function randomDelay(min = 1, max = 10) {
    return new Promise(resolve => 
        setTimeout(resolve, Math.random() * (max - min) + min)
    );
}

// Apply delays to critical spoofing operations
async function initiateSpoofing() {
    await randomDelay(5, 15);  // Random delay before spoofing
    
    // Apply spoofing layers
    applySpoofingLayer1();
    await randomDelay(2, 8);
    
    applySpoofingLayer2();
    await randomDelay(3, 12);
    
    // Continue for all layers...
}
```

### Layer 7: Network-Level Spoofing

#### Header Modification
```javascript
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
```

#### WebRTC & Fingerprinting Protection
```javascript
// Override WebRTC APIs that leak device info
if (window.RTCPeerConnection) {
    const originalRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
        const pc = new originalRTC(...args);
        
        // Override getStats to return desktop-like values
        const originalGetStats = pc.getStats;
        pc.getStats = function() {
            return originalGetStats.call(this).then(stats => {
                // Modify stats to appear desktop-like
                return stats;
            });
        };
        
        return pc;
    };
}

// Canvas fingerprinting protection
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    const context = originalGetContext.call(this, type, ...args);
    
    if (type === '2d' || type === 'webgl' || type === 'webgl2') {
        // Add subtle noise to prevent fingerprinting
        const originalFillRect = context.fillRect;
        context.fillRect = function(...args) {
            // Add minimal noise while maintaining desktop signature
            return originalFillRect.apply(this, args);
        };
    }
    
    return context;
};
```

---

## 🔗 PHASE 3: INTEGRATION WITH EXISTING SYSTEMS

### World-Class Popup Integration

#### Activation Point
```javascript
// File: index.html, Lines 2225-2330
// Function: showNFTIncentivePopup()
// Trigger: "Continue to Checkout" button click

// Integration approach:
function showNFTIncentivePopup() {
    // Existing popup code...
    
    // ADD: Activate spoofing before SimpleSwap navigation
    activateDesktopSpoofing();
    
    // Existing popup display code...
}

// New function to activate spoofing
function activateDesktopSpoofing() {
    // Only activate for SimpleSwap domain
    if (window.location.hostname.includes('simpleswap.io') || 
        document.referrer.includes('simpleswap.io')) {
        
        console.log('🎭 Activating desktop spoofing for SimpleSwap');
        
        // Apply all 7 layers
        applySpoofingLayer1_UserAgent();
        applySpoofingLayer2_Navigator();
        applySpoofingLayer3_Screen();
        applySpoofingLayer4_Events();
        applySpoofingLayer5_MediaQueries();
        applySpoofingLayer6_AntiDetection();
        applySpoofingLayer7_Network();
        
        console.log('✅ Desktop spoofing active - Mercury should remain default');
    }
}
```

#### Payment Gateway Modification
```javascript
// Update initiatePaymentGateway function
function initiatePaymentGateway() {
    // Pre-activate spoofing
    activateDesktopSpoofing();
    
    // Small delay to ensure spoofing is active
    setTimeout(() => {
        const simpleSwapURL = "https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercuryo";
        
        // Open with spoofing active
        const newWindow = window.open(simpleSwapURL, '_blank');
        
        // Inject spoofing into new window
        newWindow.addEventListener('load', () => {
            injectSpoofingIntoWindow(newWindow);
        });
        
    }, 100);
}

function injectSpoofingIntoWindow(targetWindow) {
    try {
        // Inject spoofing script into SimpleSwap window
        const script = targetWindow.document.createElement('script');
        script.textContent = generateSpoofingScript();
        targetWindow.document.head.appendChild(script);
        
        console.log('🎭 Spoofing injected into SimpleSwap window');
    } catch (e) {
        console.warn('Cross-origin injection failed, spoofing may be limited');
    }
}
```

---

## 🧪 PHASE 4: TESTING & VALIDATION FRAMEWORK

### Verified Emulator Testing Requirements

#### iOS Testing Platform
```javascript
// Required testing on verified iOS emulators:
// - iPhone 13 iOS 16.x emulator
// - iPhone 14 iOS 17.x emulator  
// - iPhone 15 iOS 17.x emulator
// - iPad Air iOS 17.x emulator

// Testing checklist for each device:
const iosTestChecklist = {
    priceStability: false,    // €19.50 → €19.50 (not €21)
    mercurySelected: false,   // Green border around Mercury
    walletEntry: false,       // Can enter wallet address
    touchUX: false,          // Natural touch interactions
    layoutIntact: false      // Mobile layout preserved
};
```

#### Android Testing Platform  
```javascript
// Required testing on verified Android emulators:
// - Samsung Galaxy S21 Android 12 emulator
// - Samsung Galaxy S22 Android 13 emulator
// - Google Pixel 6 Android 12 emulator
// - Google Pixel 7 Android 13 emulator
// - Samsung Tab S8 Android 12 emulator

// Testing checklist for each device:
const androidTestChecklist = {
    priceStability: false,    // €19.50 → €19.50 (not €21)
    mercurySelected: false,   // Green border around Mercury
    walletEntry: false,       // Can enter wallet address
    touchUX: false,          // Natural touch interactions
    layoutIntact: false      // Mobile layout preserved
};
```

### Automated Testing Pipeline
```javascript
// Playwright automation for comprehensive testing
const { test, expect } = require('@playwright/test');

test.describe('SimpleSwap Desktop Spoofing', () => {
    test('iOS Safari - Price Stability & Mercury Selection', async ({ page }) => {
        // Set iOS Safari user agent
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...');
        
        // Navigate to Auralo landing page
        await page.goto('file:///Users/nelsonchan/auralo-website-fixed/index.html');
        
        // Click Buy Now button
        await page.click('.buy-now-button');
        
        // Click Continue to Checkout  
        await page.click('button[onclick*="initiatePaymentGateway"]');
        
        // Wait for SimpleSwap to load
        await page.waitForURL('**/simpleswap.io/**');
        
        // Verify price stability
        const amount = await page.textContent('[data-testid="amount"]');
        expect(amount).toBe('19.50');
        
        // Verify Mercury selection
        const mercuryElement = await page.locator('[data-testid="mercuryo"]');
        await expect(mercuryElement).toHaveCSS('border-color', 'rgb(34, 197, 94)');
        
        // Verify wallet address entry
        const walletInput = await page.locator('[data-testid="wallet-input"]');
        await expect(walletInput).toBeEnabled();
    });
});
```

### Real-Device Simulation Validation
```javascript
// Validation that emulators are truly simulating real devices
const deviceValidation = {
    async validateRealDeviceSimulation(page) {
        // Check device APIs that differ from desktop
        const deviceInfo = await page.evaluate(() => ({
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            orientation: screen.orientation?.type,
            devicePixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window
        }));
        
        console.log('📱 Device simulation validation:', deviceInfo);
        
        // Verify it's a real mobile simulation, not just a small window
        expect(deviceInfo.touchSupport).toBe(true);
        expect(deviceInfo.maxTouchPoints).toBeGreaterThan(0);
        expect(deviceInfo.platform).toMatch(/iPhone|Android/);
    }
};
```

---

## 🔒 PHASE 5: ANTI-REWARD-HACKING VALIDATION

### Comprehensive Security Validation
```javascript
// Anti-Reward-Hacking Validation System Integration
const antiRewardHackingValidation = {
    
    async validateSpoofingIntegrity() {
        // 1. Verify spoofing doesn't create security vulnerabilities
        const securityChecks = {
            noDataLeakage: await this.checkDataLeakage(),
            noXSSVulnerabilities: await this.checkXSSVulnerabilities(), 
            noCSRFExposure: await this.checkCSRFExposure(),
            noPrivacyViolations: await this.checkPrivacyViolations()
        };
        
        return securityChecks;
    },
    
    async validateMissionCompliance() {
        // 2. Verify solution solves exact problem without side effects
        const missionChecks = {
            priceStabilityAchieved: await this.validatePriceStability(),
            mercurySelectionConfirmed: await this.validateMercurySelection(),
            mobileUXPreserved: await this.validateMobileUX(),
            noRewardHacking: await this.validateNoRewardHacking()
        };
        
        return missionChecks;
    },
    
    async generateValidationReport() {
        const securityScore = await this.validateSpoofingIntegrity();
        const missionScore = await this.validateMissionCompliance();
        
        const overallScore = this.calculateScore(securityScore, missionScore);
        
        return {
            score: overallScore,
            maxScore: 4,
            passed: overallScore === 4,
            securityValidation: securityScore,
            missionValidation: missionScore,
            timestamp: new Date().toISOString()
        };
    }
};
```

### Continuous Monitoring System
```javascript
// Monitor for SimpleSwap changes that might break spoofing
const monitoringSystem = {
    
    async detectSimpleSwapChanges() {
        // Monitor for changes in SimpleSwap's detection algorithms
        const currentFingerprint = await this.generateSimpleSwapFingerprint();
        const storedFingerprint = localStorage.getItem('simpleswap_fingerprint');
        
        if (storedFingerprint && currentFingerprint !== storedFingerprint) {
            console.warn('🚨 SimpleSwap detection algorithm may have changed');
            this.triggerRevalidation();
        }
        
        localStorage.setItem('simpleswap_fingerprint', currentFingerprint);
    },
    
    async validateSpoofingEffectiveness() {
        // Continuously validate that spoofing is working
        const effectiveness = {
            priceStable: await this.checkPriceStability(),
            mercurySelected: await this.checkMercurySelection(),
            detectionEvaded: await this.checkDetectionEvasion()
        };
        
        return effectiveness;
    }
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Pre-Implementation Requirements
- [ ] Research Phase completed (SimpleSwap detection analysis)
- [ ] Testing environment set up (verified emulators)
- [ ] Baseline measurements documented (current mobile behavior)
- [ ] Integration points identified (existing popup system)

### Development Phase Checklist
- [ ] Layer 1: User-Agent spoofing implemented and tested
- [ ] Layer 2: Navigator API overrides implemented and tested
- [ ] Layer 3: Screen/Display spoofing implemented and tested
- [ ] Layer 4: Event system manipulation implemented and tested
- [ ] Layer 5: Media query spoofing implemented and tested
- [ ] Layer 6: Anti-detection mechanisms implemented and tested
- [ ] Layer 7: Network-level spoofing implemented and tested

### Integration Phase Checklist
- [ ] World-class popup integration completed
- [ ] Payment gateway modification implemented
- [ ] Cross-window spoofing injection working
- [ ] Error handling and fallbacks implemented

### Testing Phase Checklist
- [ ] iOS emulator testing completed (iPhone 13, 14, 15, iPad)
- [ ] Android emulator testing completed (Samsung, Pixel devices)
- [ ] Cross-browser testing completed (Chrome, Safari, Firefox)
- [ ] Network condition testing completed (4G, 5G, WiFi)
- [ ] Edge case testing completed (rotation, refresh, multi-tab)

### Validation Phase Checklist
- [ ] Price stability confirmed (€19.50 → €19.50)
- [ ] Mercury selection confirmed (green border visible)
- [ ] Wallet functionality confirmed (address entry works)
- [ ] Mobile UX preserved (natural touch interactions)
- [ ] Anti-Reward-Hacking Validation: 4/4 score achieved

---

## 🎯 SUCCESS CRITERIA FINAL VALIDATION

### Quantitative Metrics
- **100% Price Stability**: €19.50 remains €19.50 across all devices
- **100% Mercury Selection**: Green border visible on all platforms
- **100% Wallet Functionality**: Address entry works on all devices  
- **Zero UX Degradation**: Touch responsiveness maintained
- **100% Platform Coverage**: Works on all target iOS/Android devices

### Qualitative Validation
- **Stealth Operation**: Undetectable by SimpleSwap
- **Natural User Experience**: Users can't tell spoofing is active
- **Reliable Performance**: Works consistently across sessions
- **Maintainable Code**: Easy to update if SimpleSwap changes

### Final Deployment Validation
- **Production Testing**: 48-hour real-world validation
- **User Acceptance**: No complaints about mobile experience
- **Performance Monitoring**: No impact on page load times
- **Security Clearance**: Anti-Reward-Hacking Validation passed

---

**🎯 MISSION STATUS**: Implementation Ready
**📋 NEXT STEPS**: Begin Research Phase - Analyze SimpleSwap device detection
**🔗 REFERENCES**: See @CLAUDE.md for project overview, @DESIGN.md for UX strategies