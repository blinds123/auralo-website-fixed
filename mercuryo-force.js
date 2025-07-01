// Clean Mercuryo Forcing Script for SimpleSwap
// Paste this in browser console on SimpleSwap page

(function() {
    console.log('🚀 Auralo Mercuryo Forcing Started');
    
    let attempts = 0;
    const maxAttempts = 100;
    
    function forceMercuryo() {
        attempts++;
        if (attempts > maxAttempts) {
            console.log('⏰ Max attempts reached');
            return;
        }
        
        let forced = 0;
        let disabled = 0;
        
        // Find all elements
        document.querySelectorAll('*').forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            
            // Force Mercuryo selection
            if (text.includes('mercuryo') && text.length < 500) {
                el.style.border = '3px solid #22c55e';
                el.style.background = 'rgba(34, 197, 94, 0.2)';
                el.style.boxShadow = '0 0 10px #22c55e';
                
                // Click it
                setTimeout(() => {
                    el.click();
                    if (el.tagName === 'INPUT' && el.type === 'radio') {
                        el.checked = true;
                    }
                }, 100);
                
                forced++;
            }
            
            // Disable MoonPay
            if (text.includes('moonpay') && text.length < 500) {
                el.style.opacity = '0.3';
                el.style.pointerEvents = 'none';
                if (el.tagName === 'INPUT') {
                    el.disabled = true;
                }
                disabled++;
            }
        });
        
        console.log(`🎯 Attempt ${attempts}: ${forced} forced, ${disabled} disabled`);
        
        // Continue forcing
        setTimeout(forceMercuryo, 1000);
    }
    
    // Start forcing
    forceMercuryo();
    
    // Watch for page changes
    const observer = new MutationObserver(() => {
        setTimeout(forceMercuryo, 500);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Mercuryo forcing active - will run for', maxAttempts, 'attempts');
})();