// PERFECT 100% SUCCESS RATE FORCING SCRIPT
// Targets actual UI elements, not metadata

(function() {
    console.log('🎯 PERFECT FORCING SCRIPT - 100% SUCCESS TARGET');
    
    let attempts = 0;
    const maxAttempts = 500; // Extended for thorough scanning
    let successfulForces = 0;
    let successfulRemovals = 0;
    
    function perfectForcing() {
        attempts++;
        
        if (attempts > maxAttempts) {
            console.log(`✅ Perfect forcing complete. Forces: ${successfulForces}, Removals: ${successfulRemovals}`);
            return;
        }
        
        let currentForced = 0;
        let currentRemoved = 0;
        
        // TARGET 1: Actual visible UI elements with payment provider text
        document.querySelectorAll('*').forEach(el => {
            try {
                // Skip script tags, style tags, and metadata
                if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'TITLE'].includes(el.tagName)) {
                    return;
                }
                
                const text = (el.textContent || '').trim().toLowerCase();
                const isVisibleText = text.length > 0 && text.length < 500 && el.offsetWidth > 10 && el.offsetHeight > 10;
                
                if (!isVisibleText) return;
                
                // MERCURYO FORCING - Target actual UI payment options
                if (text.includes('mercuryo') && !text.includes('script') && !text.includes('{')) {
                    // Enhanced visual highlighting
                    el.style.cssText += `
                        border: 6px solid #22c55e !important;
                        background: linear-gradient(45deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1)) !important;
                        box-shadow: 0 0 25px rgba(34,197,94,0.8) !important;
                        z-index: 999999 !important;
                        transform: scale(1.03) !important;
                        animation: glow 2s infinite alternate !important;
                    `;
                    
                    // Add glow animation
                    if (!document.getElementById('auralo-glow-style')) {
                        const style = document.createElement('style');
                        style.id = 'auralo-glow-style';
                        style.textContent = `
                            @keyframes glow {
                                from { box-shadow: 0 0 25px rgba(34,197,94,0.8); }
                                to { box-shadow: 0 0 35px rgba(34,197,94,1), 0 0 45px rgba(34,197,94,0.5); }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    el.setAttribute('data-auralo-perfect-forced', 'true');
                    
                    // Multi-method interaction for guaranteed selection
                    setTimeout(() => {
                        try {
                            // Method 1: Direct click
                            el.click();
                            
                            // Method 2: Focus and click
                            el.focus();
                            el.click();
                            
                            // Method 3: Form element selection
                            if (el.type === 'radio' || el.type === 'checkbox') {
                                el.checked = true;
                                el.selected = true;
                            }
                            
                            // Method 4: Event simulation
                            ['mousedown', 'mouseup', 'click', 'change', 'input', 'focus'].forEach(eventType => {
                                el.dispatchEvent(new Event(eventType, {bubbles: true, cancelable: true}));
                            });
                            
                            // Method 5: Mobile touch simulation
                            if (window.TouchEvent) {
                                const rect = el.getBoundingClientRect();
                                const touch = new Touch({
                                    identifier: Date.now(),
                                    target: el,
                                    clientX: rect.left + rect.width / 2,
                                    clientY: rect.top + rect.height / 2
                                });
                                
                                ['touchstart', 'touchend', 'tap'].forEach(eventType => {
                                    try {
                                        el.dispatchEvent(new TouchEvent(eventType, {
                                            bubbles: true,
                                            touches: [touch],
                                            targetTouches: [touch],
                                            changedTouches: [touch]
                                        }));
                                    } catch(e) {}
                                });
                            }
                            
                            // Method 6: Parent/child interaction
                            if (el.parentElement) {
                                el.parentElement.click();
                            }
                            
                            el.children && Array.from(el.children).forEach(child => {
                                try { child.click(); } catch(e) {}
                            });
                            
                        } catch(e) {}
                    }, 200 + Math.random() * 300);
                    
                    currentForced++;
                    successfulForces = Math.max(successfulForces, currentForced);
                }
                
                // MOONPAY REMOVAL - Target actual UI payment options
                if (text.includes('moonpay') && !text.includes('script') && !text.includes('{')) {
                    // Immediate and complete removal
                    el.style.cssText += `
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        position: absolute !important;
                        left: -99999px !important;
                        top: -99999px !important;
                        width: 0 !important;
                        height: 0 !important;
                        overflow: hidden !important;
                        z-index: -999999 !important;
                    `;
                    
                    el.setAttribute('data-auralo-perfect-removed', 'true');
                    
                    // Disable all functionality
                    if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
                        el.disabled = true;
                        el.style.display = 'none';
                    }
                    
                    // Remove from DOM completely
                    setTimeout(() => {
                        try {
                            if (el && el.parentNode) {
                                el.parentNode.removeChild(el);
                            }
                        } catch(e) {}
                    }, 100);
                    
                    // Also remove parent containers if they only contain MoonPay
                    if (el.parentElement && el.parentElement.textContent.toLowerCase().includes('moonpay')) {
                        el.parentElement.style.display = 'none';
                    }
                    
                    currentRemoved++;
                    successfulRemovals = Math.max(successfulRemovals, currentRemoved);
                }
                
            } catch(e) {}
        });
        
        // TARGET 2: Look for payment provider cards/sections by common patterns
        const paymentSelectors = [
            '[data-testid*="payment"]',
            '[class*="payment"]',
            '[class*="provider"]',
            '[class*="option"]',
            '[data-provider]',
            '.payment-method',
            '.provider-option',
            '.exchange-provider'
        ];
        
        paymentSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    const text = (el.textContent || '').toLowerCase();
                    
                    if (text.includes('mercuryo')) {
                        el.style.border = '4px solid #22c55e';
                        el.click();
                        currentForced++;
                    }
                    
                    if (text.includes('moonpay')) {
                        el.style.display = 'none';
                        currentRemoved++;
                    }
                });
            } catch(e) {}
        });
        
        // Progress logging
        if (currentForced > 0 || currentRemoved > 0 || attempts % 50 === 0) {
            console.log(`🎯 Attempt ${attempts}: ${currentForced} forced, ${currentRemoved} removed`);
        }
        
        // Continue with adaptive timing
        const nextInterval = currentForced > 0 || currentRemoved > 0 ? 300 : 800;
        setTimeout(perfectForcing, nextInterval);
    }
    
    // Start immediately
    perfectForcing();
    
    // Enhanced mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        let hasNewContent = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.textContent) { // Element node with text
                        const text = node.textContent.toLowerCase();
                        if (text.includes('mercuryo') || text.includes('moonpay')) {
                            hasNewContent = true;
                        }
                    }
                });
            }
        });
        
        if (hasNewContent) {
            console.log('🔄 New payment content detected, forcing...');
            setTimeout(perfectForcing, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    // Page focus handler
    window.addEventListener('focus', () => {
        setTimeout(perfectForcing, 500);
    });
    
    console.log('✅ Perfect forcing script initialized - targeting UI elements only');
    
})();