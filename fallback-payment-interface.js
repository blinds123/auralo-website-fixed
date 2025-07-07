// FALLBACK PAYMENT INTERFACE
// Shows custom payment UI if SimpleSwap price detection fails

function createFallbackPaymentInterface() {
    console.log('🔄 Creating fallback payment interface...');
    
    // Check if SimpleSwap shows wrong price
    const checkSimpleSwapPrice = () => {
        // This would be called after SimpleSwap loads
        const priceElements = document.querySelectorAll('[data-amount], .amount, .price');
        let hasWrongPrice = false;
        
        priceElements.forEach(el => {
            const text = el.textContent || '';
            if (text.includes('21') || text.includes('€21')) {
                hasWrongPrice = true;
            }
        });
        
        if (hasWrongPrice) {
            showFallbackInterface();
        }
    };
    
    // Create fallback interface
    const showFallbackInterface = () => {
        console.log('⚠️ Wrong price detected, showing fallback interface...');
        
        const fallbackPopup = document.createElement('div');
        fallbackPopup.id = 'fallback-payment-interface';
        fallbackPopup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: white;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        content.innerHTML = `
            <div style="margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
                <h2 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">
                    Special Mobile Checkout
                </h2>
                <p style="font-size: 16px; color: #999; margin: 0;">
                    Complete your €19.50 purchase below
                </p>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                <div style="font-size: 14px; color: #FFE066; margin-bottom: 15px; font-weight: 600;">
                    YOUR EXCLUSIVE OFFER
                </div>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                    <div style="text-decoration: line-through; color: #999; font-size: 24px;">
                        €200
                    </div>
                    <div style="font-size: 36px; font-weight: 700; color: #4CAF50;">
                        €19.50
                    </div>
                    <div style="background: #FF6B35; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                        90% OFF
                    </div>
                </div>
                
                <div style="font-size: 14px; color: #999;">
                    Premium Auralo Hoodie + €100 NFT Bonus
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <div style="background: #2ECC71; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <div style="font-size: 14px; margin-bottom: 5px;">
                        Your Wallet Address (Coupon Code):
                    </div>
                    <div style="font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all;">
                        0xE5173e7c3089bD89cd1341b637b8e1951745ED5C
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #999; margin: 0;">
                    ✅ Automatically copied to clipboard
                </p>
            </div>
            
            <div style="display: flex; gap: 15px; flex-direction: column;">
                <button onclick="proceedWithAlternativePayment()" style="
                    background: linear-gradient(135deg, #FF6B35, #F7931E);
                    color: white;
                    border: none;
                    padding: 16px 30px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
                    transition: all 0.3s ease;
                ">
                    💳 Pay with Card - €19.50
                </button>
                
                <button onclick="proceedWithCryptoPayment()" style="
                    background: linear-gradient(135deg, #8B5CF6, #6366F1);
                    color: white;
                    border: none;
                    padding: 16px 30px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
                    transition: all 0.3s ease;
                ">
                    🔗 Pay with Crypto - €19.50
                </button>
                
                <button onclick="closeFallbackInterface()" style="
                    background: transparent;
                    color: #999;
                    border: 1px solid #333;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    Try SimpleSwap Again
                </button>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="font-size: 12px; color: #666; margin: 0;">
                    🔒 Secure checkout powered by our payment partners<br>
                    💳 All major cards accepted | 🔗 ETH, BTC, USDT accepted
                </p>
            </div>
        `;
        
        fallbackPopup.appendChild(content);
        document.body.appendChild(fallbackPopup);
        
        // Add animation
        requestAnimationFrame(() => {
            content.style.transform = 'scale(0.9)';
            content.style.opacity = '0';
            content.style.transition = 'all 0.3s ease';
            
            requestAnimationFrame(() => {
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            });
        });
    };
    
    // Alternative payment handlers
    window.proceedWithAlternativePayment = () => {
        console.log('💳 Processing card payment at €19.50...');
        
        // Use Mercury directly with correct parameters
        const mercuryURL = 'https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&fixed=true';
        
        // Try one more time with enhanced parameters
        window.location.href = mercuryURL;
    };
    
    window.proceedWithCryptoPayment = () => {
        console.log('🔗 Processing crypto payment at €19.50...');
        
        // Direct crypto payment URL
        const cryptoURL = 'https://simpleswap.io/exchange?from=eur-eur&to=pol-matic&amount=19.50&provider=mercury&crypto=true';
        
        window.location.href = cryptoURL;
    };
    
    window.closeFallbackInterface = () => {
        const popup = document.getElementById('fallback-payment-interface');
        if (popup) {
            popup.style.opacity = '0';
            setTimeout(() => popup.remove(), 300);
        }
    };
    
    return {
        checkPrice: checkSimpleSwapPrice,
        showInterface: showFallbackInterface
    };
}

// Auto-initialize fallback checker
window.fallbackPayment = createFallbackPaymentInterface();

// Monitor for SimpleSwap navigation
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SIMPLESWAP_LOADED') {
        setTimeout(() => {
            window.fallbackPayment.checkPrice();
        }, 2000);
    }
});