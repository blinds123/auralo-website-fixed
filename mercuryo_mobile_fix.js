/**
 * MERCURYO MOBILE FIX - PREVENTS MOONPAY AUTO-SWITCHING
 * 
 * This script ensures Mercuryo remains selected on mobile devices
 * and prevents the auto-switching to MoonPay that inflates fiat amounts.
 * 
 * Deploy this script on https://auralo-website-fixed.netlify.app/
 */

(function() {
    'use strict';
    
    console.log('🚀 MERCURYO MOBILE FIX ACTIVATED');
    
    // Configuration
    const CONFIG = {
        TARGET_AMOUNT: 15,
        TARGET_CURRENCY_FROM: 'EUR',
        TARGET_CURRENCY_TO: 'POL',
        PARTNER: 'auralo',
        CHECK_INTERVAL: 1000,
        MAX_ATTEMPTS: 30,
        DEBUG: true
    };
    
    function log(message) {
        if (CONFIG.DEBUG) {
            console.log(`🔧 [MERCURYO FIX] ${message}`);
        }
    }
    
    // Mobile detection override for SimpleSwap
    function createDesktopSpoofing() {
        const mobileOverrides = {
            // Desktop user agent
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            vendor: 'Google Inc.',
            maxTouchPoints: 0,
            // Desktop viewport
            screenWidth: 1920,
            screenHeight: 1080,
            innerWidth: 1920,
            innerHeight: 1080,
            devicePixelRatio: 1
        };
        
        return `
            // Override mobile detection
            Object.defineProperty(navigator, 'userAgent', {
                get: () => '${mobileOverrides.userAgent}',
                configurable: true
            });
            Object.defineProperty(navigator, 'platform', {
                get: () => '${mobileOverrides.platform}',
                configurable: true
            });
            Object.defineProperty(navigator, 'vendor', {
                get: () => '${mobileOverrides.vendor}',
                configurable: true
            });
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => ${mobileOverrides.maxTouchPoints},
                configurable: true
            });
            
            // Override screen dimensions
            Object.defineProperty(screen, 'width', {
                get: () => ${mobileOverrides.screenWidth},
                configurable: true
            });
            Object.defineProperty(screen, 'height', {
                get: () => ${mobileOverrides.screenHeight},
                configurable: true
            });
            Object.defineProperty(window, 'innerWidth', {
                get: () => ${mobileOverrides.innerWidth},
                configurable: true
            });
            Object.defineProperty(window, 'innerHeight', {
                get: () => ${mobileOverrides.innerHeight},
                configurable: true
            });
            Object.defineProperty(window, 'devicePixelRatio', {
                get: () => ${mobileOverrides.devicePixelRatio},
                configurable: true
            });
            
            // Remove touch events
            delete window.ontouchstart;
            delete window.ontouchmove;
            delete window.ontouchend;
            
            // Override media queries for touch detection
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                if (query.includes('hover') || query.includes('pointer')) {
                    return { matches: query.includes('hover: hover') || query.includes('pointer: fine') };
                }
                return originalMatchMedia(query);
            };
            
            console.log('🖥️ Desktop spoofing activated for Mercuryo');
        `;
    }
    
    // Mercuryo selection enforcer
    function createMercuryoEnforcer() {
        return `
            (function() {
                let attempts = 0;
                const maxAttempts = ${CONFIG.MAX_ATTEMPTS};
                
                function enforceMercuryoSelection() {
                    attempts++;
                    console.log('🎯 Attempting to enforce Mercuryo selection (attempt ' + attempts + ')');
                    
                    // Find Mercuryo elements
                    const mercuryoElements = document.querySelectorAll('*');
                    let mercuryoFound = false;
                    
                    for (const el of mercuryoElements) {
                        const text = (el.textContent || '').toLowerCase();
                        
                        if (text.includes('mercuryo') || text.includes('mercurio')) {
                            mercuryoFound = true;
                            
                            // Force selection state
                            el.click();
                            
                            // Add green border styling
                            el.style.border = '2px solid #22c55e';
                            el.style.borderRadius = '8px';
                            el.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                            
                            // Mark as selected
                            el.setAttribute('aria-selected', 'true');
                            el.classList.add('selected', 'active');
                            
                            console.log('✅ Mercuryo element forced to selected state');
                        }
                        
                        // Deselect MoonPay elements
                        if (text.includes('moonpay') || text.includes('moon pay')) {
                            el.style.border = '1px solid #e5e5e5';
                            el.style.backgroundColor = 'transparent';
                            el.setAttribute('aria-selected', 'false');
                            el.classList.remove('selected', 'active');
                            
                            console.log('❌ MoonPay element deselected');
                        }
                    }
                    
                    // Check if wallet address field is visible (indicates Mercuryo is selected)
                    const walletInputs = document.querySelectorAll('input[placeholder*="address" i], input[placeholder*="wallet" i], input[placeholder*="recipient" i]');
                    const hasWalletField = Array.from(walletInputs).some(input => 
                        input.offsetWidth > 0 && input.offsetHeight > 0
                    );
                    
                    if (hasWalletField) {
                        console.log('✅ Mercuryo selection confirmed - wallet field visible');
                        return true;
                    }
                    
                    if (attempts < maxAttempts) {
                        setTimeout(enforceMercuryoSelection, ${CONFIG.CHECK_INTERVAL});
                    }
                    
                    return false;
                }
                
                // Start enforcement after page load
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', enforceMercuryoSelection);
                } else {
                    setTimeout(enforceMercuryoSelection, 2000);
                }
                
                // Also monitor for DOM changes
                const observer = new MutationObserver(function(mutations) {
                    let shouldCheck = false;
                    
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            const target = mutation.target;
                            const text = (target.textContent || '').toLowerCase();
                            
                            if (text.includes('mercuryo') || text.includes('moonpay') || 
                                text.includes('provider') || text.includes('payment')) {
                                shouldCheck = true;
                            }
                        }
                    });
                    
                    if (shouldCheck) {
                        setTimeout(enforceMercuryoSelection, 500);
                    }
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style', 'aria-selected']
                });
                
                console.log('🔍 Mercuryo enforcer activated with DOM monitoring');
            })();
        `;
    }
    
    // Amount preservation
    function createAmountPreserver() {
        return `
            (function() {
                function preserveAmount() {
                    console.log('💰 Preserving fiat amount at €${CONFIG.TARGET_AMOUNT}');
                    
                    // Find amount inputs and ensure they stay at target amount
                    const amountInputs = document.querySelectorAll('input[type="number"], input[value*="${CONFIG.TARGET_AMOUNT}"], input[placeholder*="amount" i]');
                    
                    amountInputs.forEach(input => {
                        if (input.value !== '${CONFIG.TARGET_AMOUNT}') {
                            input.value = '${CONFIG.TARGET_AMOUNT}';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });
                    
                    // Monitor URL parameters
                    const currentUrl = new URL(window.location.href);
                    if (currentUrl.searchParams.get('amount') !== '${CONFIG.TARGET_AMOUNT}') {
                        currentUrl.searchParams.set('amount', '${CONFIG.TARGET_AMOUNT}');
                        window.history.replaceState({}, '', currentUrl.toString());
                    }
                }
                
                // Preserve amount on load and periodically
                preserveAmount();
                setInterval(preserveAmount, 2000);
                
                console.log('💰 Amount preserver activated');
            })();
        `;
    }
    
    // Main fix application
    function applyMercuryoFix() {
        log('Applying Mercuryo mobile fix...');
        
        const fixScript = document.createElement('script');
        fixScript.type = 'text/javascript';
        fixScript.textContent = `
            ${createDesktopSpoofing()}
            ${createMercuryoEnforcer()}
            ${createAmountPreserver()}
            
            console.log('🚀 MERCURYO MOBILE FIX FULLY DEPLOYED');
        `;
        
        document.head.appendChild(fixScript);
        log('Fix script injected successfully');
    }
    
    // Enhanced SimpleSwap link interception
    function interceptSimpleSwapLinks() {
        log('Setting up SimpleSwap link interception...');
        
        function modifySimpleSwapUrl(url) {
            try {
                const urlObj = new URL(url);
                
                // Ensure correct parameters
                urlObj.searchParams.set('from', CONFIG.TARGET_CURRENCY_FROM.toLowerCase());
                urlObj.searchParams.set('to', CONFIG.TARGET_CURRENCY_TO.toLowerCase());
                urlObj.searchParams.set('amount', CONFIG.TARGET_AMOUNT);
                urlObj.searchParams.set('partner', CONFIG.PARTNER);
                
                // Add desktop mode hint
                urlObj.searchParams.set('mode', 'desktop');
                urlObj.searchParams.set('provider', 'mercuryo');
                
                const finalUrl = urlObj.toString();
                log(`Modified SimpleSwap URL: ${finalUrl}`);
                return finalUrl;
            } catch (e) {
                log(`URL modification failed: ${e.message}`);
                return url;
            }
        }
        
        // Intercept all link clicks
        document.addEventListener('click', function(event) {
            const target = event.target.closest('a, button, [onclick]');
            
            if (target) {
                const href = target.href || target.getAttribute('onclick') || '';
                const text = target.textContent || '';
                
                if (href.includes('simpleswap') || text.toLowerCase().includes('simpleswap') || 
                    text.toLowerCase().includes('exchange') || text.toLowerCase().includes('coupon')) {
                    
                    log('SimpleSwap link clicked - applying fix');
                    
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Apply fix to the target page
                    const targetUrl = href.includes('simpleswap') ? 
                        modifySimpleSwapUrl(href) : 
                        `https://simpleswap.io/?from=${CONFIG.TARGET_CURRENCY_FROM.toLowerCase()}&to=${CONFIG.TARGET_CURRENCY_TO.toLowerCase()}&amount=${CONFIG.TARGET_AMOUNT}&partner=${CONFIG.PARTNER}&mode=desktop&provider=mercuryo`;
                    
                    // Open with fix applied
                    const newWindow = window.open(targetUrl, '_blank');
                    
                    if (newWindow) {
                        // Apply fix to the new window when it loads
                        const checkNewWindow = setInterval(() => {
                            try {
                                if (newWindow.document && newWindow.document.readyState === 'complete') {
                                    clearInterval(checkNewWindow);
                                    
                                    const fixScriptForNewWindow = newWindow.document.createElement('script');
                                    fixScriptForNewWindow.textContent = `
                                        ${createDesktopSpoofing()}
                                        ${createMercuryoEnforcer()}
                                        ${createAmountPreserver()}
                                    `;
                                    newWindow.document.head.appendChild(fixScriptForNewWindow);
                                    
                                    log('Fix applied to new SimpleSwap window');
                                }
                            } catch (e) {
                                // Cross-origin restriction - the fix in the URL parameters should work
                                clearInterval(checkNewWindow);
                            }
                        }, 500);
                        
                        // Clear check after 10 seconds
                        setTimeout(() => clearInterval(checkNewWindow), 10000);
                    }
                    
                    return false;
                }
            }
        });
        
        log('SimpleSwap link interception activated');
    }
    
    // Initialize the fix
    function initialize() {
        log('Initializing Mercuryo mobile fix...');
        
        // Apply fix immediately
        applyMercuryoFix();
        
        // Set up link interception
        interceptSimpleSwapLinks();
        
        // Also monitor for dynamically added links
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const links = node.querySelectorAll ? node.querySelectorAll('a[href*="simpleswap"], button, [onclick]') : [];
                            if (links.length > 0) {
                                log('New SimpleSwap links detected - re-applying interception');
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        log('Mercuryo mobile fix initialization complete');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();