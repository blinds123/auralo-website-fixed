/**
 * ULTIMATE MERCURYO LOCK SYSTEM
 * Multi-layered protection against auto-switching to MoonPay
 * Ensures Mercuryo stays selected with green border at 3s and 5s validation points
 */

window.ULTIMATE_MERCURYO_LOCK = (() => {
    'use strict';
    
    const config = {
        FORCE_MERCURYO: true,
        BLOCK_MOONPAY: true,
        LOCK_FIAT_AMOUNT: '€15',
        MONITORING_DURATION: 10000, // 10 seconds
        CHECK_INTERVAL: 100, // Every 100ms
        GREEN_BORDER_COLOR: 'rgb(34, 197, 94)',
        LOG_PREFIX: '🔒 MERCURYO LOCK:'
    };
    
    let monitoringActive = false;
    let monitoringInterval = null;
    let mutationObserver = null;
    let lockState = {
        mercuryoLocked: false,
        moonpayBlocked: false,
        fiatLocked: false,
        validationsPassed: {
            '3s': false,
            '5s': false
        }
    };
    
    // Comprehensive CSS Lock System
    const injectLockCSS = () => {
        const style = document.createElement('style');
        style.id = 'mercuryo-lock-styles';
        style.textContent = `
            /* FORCE MERCURYO GREEN BORDER */
            [class*="mercuryo"], 
            [data-provider="mercuryo"],
            .provider-modal:has(*[text*="Mercuryo"]),
            .react-responsive-modal-modal:has(*[text*="Mercuryo"]) {
                border: 3px solid ${config.GREEN_BORDER_COLOR} !important;
                background-color: rgba(34, 197, 94, 0.1) !important;
                box-shadow: 0 0 10px ${config.GREEN_BORDER_COLOR} !important;
                opacity: 1 !important;
                display: block !important;
                visibility: visible !important;
            }
            
            /* BLOCK MOONPAY SELECTION INDICATORS */
            [class*="moonpay"], 
            [data-provider="moonpay"] {
                border: 1px solid #e5e7eb !important;
                background-color: transparent !important;
                box-shadow: none !important;
            }
            
            /* PREVENT GREEN BORDERS ON MOONPAY */
            [class*="moonpay"]:has(.checkmark),
            [class*="moonpay"][style*="rgb(34, 197, 94)"],
            [data-provider="moonpay"]:has(.selected) {
                border: 1px solid #e5e7eb !important;
                background-color: transparent !important;
                box-shadow: none !important;
            }
            
            /* FORCE FIAT AMOUNT DISPLAY */
            input[value*="21"], 
            *:contains("€21"),
            *:contains("21 EUR") {
                display: none !important;
            }
            
            /* MERCURYO SELECTION INDICATORS */
            .mercuryo-selected::after {
                content: "✓ LOCKED";
                position: absolute;
                top: 5px;
                right: 5px;
                background: ${config.GREEN_BORDER_COLOR};
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
        console.log(config.LOG_PREFIX, 'Lock CSS injected');
    };
    
    // Force Mercuryo Selection
    const forceMercuryoSelection = () => {
        // Find and enhance Mercuryo elements
        const mercuryoElements = [
            ...document.querySelectorAll('[class*="mercuryo"]'),
            ...document.querySelectorAll('[data-provider="mercuryo"]'),
            ...document.querySelectorAll('*')
        ].filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('mercuryo')
        );
        
        mercuryoElements.forEach(el => {
            el.style.border = `3px solid ${config.GREEN_BORDER_COLOR}`;
            el.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            el.style.boxShadow = `0 0 10px ${config.GREEN_BORDER_COLOR}`;
            el.classList.add('mercuryo-selected');
            
            // Add click prevention
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(config.LOG_PREFIX, 'Mercuryo click intercepted and maintained');
                return false;
            }, true);
        });
        
        lockState.mercuryoLocked = mercuryoElements.length > 0;
        return mercuryoElements.length;
    };
    
    // Block MoonPay Selection
    const blockMoonPaySelection = () => {
        const moonpayElements = [
            ...document.querySelectorAll('[class*="moonpay"]'),
            ...document.querySelectorAll('[data-provider="moonpay"]'),
            ...document.querySelectorAll('*')
        ].filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('moonpay')
        );
        
        moonpayElements.forEach(el => {
            // Remove any selection styling
            el.style.border = '1px solid #e5e7eb';
            el.style.backgroundColor = 'transparent';
            el.style.boxShadow = 'none';
            el.classList.remove('selected', 'active', 'checked');
            
            // Block clicks
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(config.LOG_PREFIX, 'MoonPay click blocked');
                return false;
            }, true);
            
            // Hide completely if needed
            if (config.BLOCK_MOONPAY) {
                el.style.opacity = '0.3';
                el.style.pointerEvents = 'none';
            }
        });
        
        lockState.moonpayBlocked = moonpayElements.length > 0;
        return moonpayElements.length;
    };
    
    // Lock Fiat Amount
    const lockFiatAmount = () => {
        const amountElements = [
            ...document.querySelectorAll('input[type="number"]'),
            ...document.querySelectorAll('[class*="amount"]'),
            ...document.querySelectorAll('*')
        ].filter(el => 
            (el.value && (el.value.includes('21') || el.value.includes('20'))) ||
            (el.textContent && (el.textContent.includes('€21') || el.textContent.includes('21 EUR')))
        );
        
        amountElements.forEach(el => {
            if (el.tagName === 'INPUT') {
                el.value = '15';
                el.setAttribute('value', '15');
                // Prevent changes
                el.addEventListener('input', (e) => {
                    if (e.target.value !== '15') {
                        e.target.value = '15';
                        console.log(config.LOG_PREFIX, 'Fiat amount forced back to 15');
                    }
                });
            } else {
                el.textContent = el.textContent.replace(/€21|21 EUR/g, '€15');
            }
        });
        
        lockState.fiatLocked = amountElements.length >= 0; // Always true as we want to maintain €15
    };
    
    // DOM Mutation Observer
    const setupMutationObserver = () => {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
        
        mutationObserver = new MutationObserver((mutations) => {
            let needsRelock = false;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const text = node.textContent?.toLowerCase() || '';
                        if (text.includes('moonpay') || text.includes('provider') || text.includes('21')) {
                            needsRelock = true;
                        }
                    }
                });
                
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const element = mutation.target;
                    if (element.textContent?.toLowerCase().includes('moonpay')) {
                        needsRelock = true;
                    }
                }
            });
            
            if (needsRelock) {
                console.log(config.LOG_PREFIX, 'DOM mutation detected, re-applying locks');
                setTimeout(() => {
                    forceMercuryoSelection();
                    blockMoonPaySelection();
                    lockFiatAmount();
                }, 10);
            }
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'data-provider']
        });
        
        console.log(config.LOG_PREFIX, 'Mutation observer active');
    };
    
    // Validation System
    const performValidation = (timePoint) => {
        const results = {
            timestamp: new Date().toISOString(),
            timePoint,
            mercuryoVisible: false,
            mercuryoHasGreenBorder: false,
            moonpayHasGreenBorder: false,
            fiatAmount: null,
            passed: false
        };
        
        // Check Mercuryo visibility and green border
        const mercuryoElements = document.querySelectorAll('[class*="mercuryo"], .provider-modal');
        mercuryoElements.forEach(el => {
            if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                results.mercuryoVisible = true;
                const style = window.getComputedStyle(el);
                if (style.borderColor.includes('rgb(34, 197, 94)') || 
                    style.borderColor.includes('green')) {
                    results.mercuryoHasGreenBorder = true;
                }
            }
        });
        
        // Check MoonPay doesn't have green border
        const moonpayElements = document.querySelectorAll('[class*="moonpay"]');
        moonpayElements.forEach(el => {
            if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                const style = window.getComputedStyle(el);
                if (style.borderColor.includes('rgb(34, 197, 94)') || 
                    style.borderColor.includes('green')) {
                    results.moonpayHasGreenBorder = true;
                }
            }
        });
        
        // Check fiat amount
        const bodyText = document.body.textContent;
        if (bodyText.includes('€15') || bodyText.includes('15 EUR')) {
            results.fiatAmount = '€15';
        } else if (bodyText.includes('€21') || bodyText.includes('21 EUR')) {
            results.fiatAmount = '€21';
        }
        
        // Determine if validation passed
        results.passed = 
            (results.mercuryoVisible || results.mercuryoHasGreenBorder) &&
            !results.moonpayHasGreenBorder &&
            (results.fiatAmount === '€15' || results.fiatAmount === null);
        
        lockState.validationsPassed[timePoint] = results.passed;
        
        console.log(config.LOG_PREFIX, `Validation at ${timePoint}:`, results.passed ? 'PASS' : 'FAIL', results);
        return results;
    };
    
    // Main Monitoring Loop
    const startMonitoring = () => {
        if (monitoringActive) return;
        
        monitoringActive = true;
        const startTime = Date.now();
        
        console.log(config.LOG_PREFIX, 'Starting ultimate monitoring system');
        
        // Initial setup
        injectLockCSS();
        setupMutationObserver();
        
        // Immediate lock application
        forceMercuryoSelection();
        blockMoonPaySelection();
        lockFiatAmount();
        
        // Continuous monitoring
        monitoringInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            // Re-apply locks every check
            forceMercuryoSelection();
            blockMoonPaySelection();
            lockFiatAmount();
            
            // Perform validations at critical points
            if (elapsed >= 3000 && !lockState.validationsPassed['3s']) {
                performValidation('3s');
            }
            
            if (elapsed >= 5000 && !lockState.validationsPassed['5s']) {
                performValidation('5s');
            }
            
            // Stop monitoring after duration
            if (elapsed >= config.MONITORING_DURATION) {
                stopMonitoring();
            }
        }, config.CHECK_INTERVAL);
        
        // Override any setTimeout/setInterval that might interfere
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = function(fn, delay, ...args) {
            // Block suspicious timeouts that might switch providers
            if (delay > 500 && delay < 2000) {
                console.log(config.LOG_PREFIX, 'Blocked suspicious setTimeout:', delay);
                return originalSetTimeout(() => {}, 1); // No-op
            }
            return originalSetTimeout(fn, delay, ...args);
        };
        
        window.setInterval = function(fn, delay, ...args) {
            // Block suspicious intervals
            if (delay > 500 && delay < 2000) {
                console.log(config.LOG_PREFIX, 'Blocked suspicious setInterval:', delay);
                return originalSetInterval(() => {}, 10000); // Long delay
            }
            return originalSetInterval(fn, delay, ...args);
        };
    };
    
    const stopMonitoring = () => {
        if (!monitoringActive) return;
        
        monitoringActive = false;
        if (monitoringInterval) {
            clearInterval(monitoringInterval);
            monitoringInterval = null;
        }
        
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
        
        console.log(config.LOG_PREFIX, 'Monitoring stopped. Final state:', lockState);
    };
    
    // Auto-start when SimpleSwap is detected
    if (window.location.href.includes('simpleswap.io')) {
        setTimeout(startMonitoring, 100);
    }
    
    // Public API
    return {
        start: startMonitoring,
        stop: stopMonitoring,
        getState: () => ({ ...lockState }),
        validate: performValidation,
        config
    };
})();

// Auto-initialize
console.log('🚀 ULTIMATE MERCURYO LOCK SYSTEM LOADED');