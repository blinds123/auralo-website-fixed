// Auto-triggering Mercuryo forcing script
// This runs automatically when URL contains "auralo=force"

(function() {
    // Check if this should run
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('auralo')) {
        return; // Don't run if not triggered by our buy button
    }
    
    console.log('🚀 Auralo Auto-Force Detected');
    
    let attempts = 0;
    const maxAttempts = 150;
    let lastForced = 0;
    
    function cleanForce() {
        attempts++;
        
        if (attempts > maxAttempts) {
            console.log('✅ Forcing complete after', maxAttempts, 'attempts');
            return;
        }
        
        let currentForced = 0;
        let currentDisabled = 0;
        
        try {
            // Force Mercuryo elements
            document.querySelectorAll('*').forEach(el => {
                if (!el || !el.textContent) return;
                
                const text = el.textContent.toLowerCase();
                if (text.includes('mercuryo') && text.length < 800) {
                    // Visual highlighting
                    el.style.cssText += `
                        border: 3px solid #22c55e !important;
                        background: rgba(34, 197, 94, 0.15) !important;
                        box-shadow: 0 0 15px rgba(34, 197, 94, 0.5) !important;
                    `;
                    
                    // Interaction
                    setTimeout(() => {
                        try {
                            el.click();
                            el.focus();
                            
                            if (el.type === 'radio' || el.type === 'checkbox') {
                                el.checked = true;
                                el.dispatchEvent(new Event('change', {bubbles: true}));
                            }
                        } catch(e) {}
                    }, 200 + Math.random() * 300);
                    
                    currentForced++;
                }
                
                // Disable MoonPay
                if (text.includes('moonpay') && text.length < 800) {
                    el.style.cssText += `
                        opacity: 0.2 !important;
                        pointer-events: none !important;
                        filter: grayscale(100%) !important;
                    `;
                    
                    if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                        el.disabled = true;
                    }
                    
                    currentDisabled++;
                }
            });
            
            lastForced = Math.max(lastForced, currentForced);
            
            if (attempts % 10 === 0) {
                console.log(`🎯 Progress: ${currentForced} forced, ${currentDisabled} disabled (attempt ${attempts})`);
            }
            
        } catch(e) {
            console.log('⚠️ Error in forcing:', e.message);
        }
        
        // Continue forcing
        setTimeout(cleanForce, 800);
    }
    
    // Wait for page to load, then start
    setTimeout(() => {
        console.log('🎯 Starting clean Mercuryo forcing...');
        cleanForce();
    }, 2000);
    
    // Also watch for dynamic content
    const observer = new MutationObserver(() => {
        setTimeout(cleanForce, 400);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();