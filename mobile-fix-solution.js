// MOBILE FIX SOLUTION - Works around SimpleSwap's mobile detection
// Since SimpleSwap forces €21 and MoonPay on mobile, we guide users to correct selection

function createMobilePaymentSolution() {
    console.log('📱 Mobile Payment Solution Active');
    
    // Detect if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!isMobile) {
        console.log('Desktop detected, using standard flow');
        return;
    }
    
    // Override the payment gateway for mobile users
    window.mobilePaymentGateway = function() {
        console.log('🔧 Mobile-specific payment flow activated');
        
        // Show instruction overlay
        showMobileInstructions();
    };
    
    // Create mobile instruction overlay
    function showMobileInstructions() {
        const overlay = document.createElement('div');
        overlay.id = 'mobile-instruction-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        `;
        
        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-radius: 20px;
                padding: 30px 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                color: white;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 2px solid #FF6B35;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                
                <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #FFE066;">
                    Important: Mobile Checkout Instructions
                </h2>
                
                <div style="background: rgba(255, 107, 53, 0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #FF6B35;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                        SimpleSwap shows €21 on mobile by default.<br>
                        <strong>Follow these steps to get €19.50:</strong>
                    </p>
                </div>
                
                <div style="text-align: left; margin-bottom: 25px;">
                    <div style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 18px; color: #4CAF50; margin-bottom: 8px;">✅ Step 1:</div>
                        <div style="font-size: 14px; line-height: 1.4;">
                            Click "Continue to SimpleSwap" below
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 18px; color: #4CAF50; margin-bottom: 8px;">✅ Step 2:</div>
                        <div style="font-size: 14px; line-height: 1.4;">
                            <strong>IMMEDIATELY</strong> tap on "Mercury" provider<br>
                            <span style="color: #FFE066;">(It will have a green border when selected)</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 18px; color: #4CAF50; margin-bottom: 8px;">✅ Step 3:</div>
                        <div style="font-size: 14px; line-height: 1.4;">
                            Change amount from <span style="color: #FF6B35;">€21</span> back to <span style="color: #4CAF50;">€19.50</span><br>
                            <span style="color: #FFE066;">(Tap the amount field and edit it)</span>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 18px; color: #4CAF50; margin-bottom: 8px;">✅ Step 4:</div>
                        <div style="font-size: 14px; line-height: 1.4;">
                            Complete checkout with Mercury at €19.50
                        </div>
                    </div>
                </div>
                
                <div style="background: #2ECC71; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="font-size: 12px; margin-bottom: 5px;">Your Wallet (Already Copied!):</div>
                    <div style="font-family: monospace; font-size: 10px; word-break: break-all;">
                        0xE5173e7c3089bD89cd1341b637b8e1951745ED5C
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; flex-direction: column;">
                    <button onclick="proceedToSimpleSwap()" style="
                        background: linear-gradient(135deg, #FF6B35, #F7931E);
                        color: white;
                        border: none;
                        padding: 16px 24px;
                        border-radius: 30px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
                    ">
                        📱 Continue to SimpleSwap →
                    </button>
                    
                    <button onclick="useAlternativePayment()" style="
                        background: linear-gradient(135deg, #8B5CF6, #6366F1);
                        color: white;
                        border: none;
                        padding: 14px 20px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        💳 Alternative: Direct €19.50 Payment
                    </button>
                    
                    <button onclick="closeMobileOverlay()" style="
                        background: transparent;
                        color: #999;
                        border: 1px solid #666;
                        padding: 10px;
                        border-radius: 20px;
                        font-size: 14px;
                        cursor: pointer;
                    ">
                        Cancel
                    </button>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
                    <p style="font-size: 12px; color: #FFE066; margin: 0;">
                        💡 Tip: Mercury + €19.50 = Best Rate!<br>
                        <span style="color: #999;">SimpleSwap defaults to €21 on mobile, but you can change it!</span>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add entrance animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });
        });
    }
    
    // Proceed to SimpleSwap with enhanced parameters
    window.proceedToSimpleSwap = function() {
        console.log('📱 Opening SimpleSwap with mobile instructions completed');
        
        closeMobileOverlay();
        
        // Enhanced URL with more parameters
        const params = new URLSearchParams({
            from: 'eur-eur',
            to: 'pol-matic',
            amount: '19.50',
            provider: 'mercury',
            fixed: '1',              // Try to fix the rate
            floating: '0',           // Disable floating rate
            ref: 'auralo_mobile',    // Reference tracking
            platform: 'web',         // Force web platform
            view: 'desktop',         // Request desktop view
            device: 'desktop',       // Claim desktop device
            nomobile: '1',           // No mobile flag
            currency: 'eur'          // Force EUR currency
        });
        
        const simpleSwapUrl = `https://simpleswap.io/exchange?${params.toString()}`;
        
        // Try to open in a popup window first (might help with detection)
        const popupWindow = window.open(
            simpleSwapUrl,
            'SimpleSwapPayment',
            'width=1200,height=800,left=100,top=100,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes'
        );
        
        // If popup blocked, use regular navigation
        if (!popupWindow || popupWindow.closed) {
            window.location.href = simpleSwapUrl;
        }
    };
    
    // Alternative payment method
    window.useAlternativePayment = function() {
        console.log('💳 Using alternative payment method');
        
        closeMobileOverlay();
        
        // Create alternative payment interface
        const altPayment = document.createElement('div');
        altPayment.id = 'alternative-payment';
        altPayment.style.cssText = `
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
            padding: 20px;
        `;
        
        altPayment.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border-radius: 20px;
                padding: 30px 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                color: white;
            ">
                <h2 style="color: #4CAF50; margin-bottom: 20px;">✅ Direct €19.50 Payment</h2>
                
                <p style="margin-bottom: 20px;">
                    Pay exactly €19.50 using our direct payment partners:
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="https://payment.auralo.com/checkout/19.50/eur" style="
                        background: #4CAF50;
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        text-decoration: none;
                        font-weight: 600;
                    ">
                        💳 Pay with Card (€19.50)
                    </a>
                    
                    <a href="https://crypto.auralo.com/pay/19.50/eur" style="
                        background: #2196F3;
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        text-decoration: none;
                        font-weight: 600;
                    ">
                        🔗 Pay with Crypto (€19.50)
                    </a>
                    
                    <button onclick="closeAltPayment()" style="
                        background: transparent;
                        color: #999;
                        border: 1px solid #666;
                        padding: 10px;
                        border-radius: 20px;
                        cursor: pointer;
                    ">
                        Back
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(altPayment);
    };
    
    window.closeMobileOverlay = function() {
        const overlay = document.getElementById('mobile-instruction-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    };
    
    window.closeAltPayment = function() {
        const altPayment = document.getElementById('alternative-payment');
        if (altPayment) altPayment.remove();
    };
}

// Initialize mobile solution
createMobilePaymentSolution();

// Export for use
window.mobilePaymentSolution = {
    init: createMobilePaymentSolution,
    showInstructions: () => window.mobilePaymentGateway && window.mobilePaymentGateway()
};