/**
 * AUTOMATED REBATE SYSTEM FOR MOBILE PRICING DISCRIMINATION
 * 
 * Handles automatic €1.50 rebate for mobile users charged €21 instead of €19.50
 * Provides seamless user experience with instant rebate code generation and validation
 */

class AutomatedRebateSystem {
    constructor() {
        this.rebateAmount = 1.50;
        this.validityPeriod = 30; // days
        this.emailSupport = 'support@auralo.com';
        this.webhookUrl = null; // Configure for payment notifications
    }

    /**
     * Generate unique rebate code
     * Format: MOBILE150_[TIMESTAMP]_[RANDOM]
     */
    generateRebateCode(userEmail = null) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `MOBILE150_${timestamp}_${random}`;
        
        // Store rebate code with metadata
        const rebateData = {
            code: code,
            amount: this.rebateAmount,
            generated: new Date().toISOString(),
            expires: new Date(Date.now() + (this.validityPeriod * 24 * 60 * 60 * 1000)).toISOString(),
            userEmail: userEmail,
            status: 'pending',
            paymentVerified: false
        };
        
        this.storeRebateCode(rebateData);
        return code;
    }

    /**
     * Store rebate code (localStorage for demo, implement proper backend)
     */
    storeRebateCode(rebateData) {
        const existingCodes = JSON.parse(localStorage.getItem('auralo_rebate_codes') || '[]');
        existingCodes.push(rebateData);
        localStorage.setItem('auralo_rebate_codes', JSON.stringify(existingCodes));
    }

    /**
     * Validate and process rebate code
     */
    validateRebateCode(code) {
        const existingCodes = JSON.parse(localStorage.getItem('auralo_rebate_codes') || '[]');
        const rebateData = existingCodes.find(item => item.code === code);
        
        if (!rebateData) {
            return { valid: false, error: 'Rebate code not found' };
        }
        
        if (rebateData.status === 'redeemed') {
            return { valid: false, error: 'Rebate code already used' };
        }
        
        if (new Date() > new Date(rebateData.expires)) {
            return { valid: false, error: 'Rebate code expired' };
        }
        
        return { valid: true, data: rebateData };
    }

    /**
     * Process rebate redemption
     */
    redeemRebateCode(code, paymentProof = null) {
        const validation = this.validateRebateCode(code);
        
        if (!validation.valid) {
            return validation;
        }
        
        // Mark as redeemed
        const existingCodes = JSON.parse(localStorage.getItem('auralo_rebate_codes') || '[]');
        const index = existingCodes.findIndex(item => item.code === code);
        
        if (index !== -1) {
            existingCodes[index].status = 'redeemed';
            existingCodes[index].redeemedAt = new Date().toISOString();
            existingCodes[index].paymentProof = paymentProof;
            
            localStorage.setItem('auralo_rebate_codes', JSON.stringify(existingCodes));
            
            // Trigger refund process
            this.processRefund(existingCodes[index]);
            
            return { 
                success: true, 
                message: 'Rebate code redeemed successfully',
                amount: this.rebateAmount,
                processingTime: '1-3 business days'
            };
        }
        
        return { success: false, error: 'Failed to redeem rebate code' };
    }

    /**
     * Process actual refund (integrate with payment processor)
     */
    processRefund(rebateData) {
        // In production, integrate with:
        // - Stripe refunds API
        // - PayPal refunds API
        // - Bank transfer system
        // - Gift card generation
        
        const refundData = {
            rebateCode: rebateData.code,
            amount: rebateData.amount,
            currency: 'EUR',
            method: 'original_payment_method', // or 'gift_card', 'bank_transfer'
            status: 'processing',
            estimatedDelivery: this.calculateRefundDelivery()
        };
        
        // Send confirmation email
        this.sendRefundConfirmation(rebateData.userEmail, refundData);
        
        // Log for admin review
        console.log('🔄 Processing refund:', refundData);
        
        return refundData;
    }

    /**
     * Calculate refund delivery timeframe
     */
    calculateRefundDelivery() {
        const now = new Date();
        const businessDays = 3;
        const deliveryDate = new Date(now.getTime() + (businessDays * 24 * 60 * 60 * 1000));
        return deliveryDate.toISOString();
    }

    /**
     * Send refund confirmation email
     */
    sendRefundConfirmation(email, refundData) {
        // In production, integrate with email service (SendGrid, Mailgun, etc.)
        const emailContent = {
            to: email,
            subject: 'Auralo Rebate Processed - €1.50 Refund Confirmation',
            html: `
                <h2>Your Auralo Mobile Rebate is Being Processed!</h2>
                <p>Thank you for your purchase. We've received your rebate request and are processing your €1.50 refund.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3>Refund Details:</h3>
                    <p><strong>Rebate Code:</strong> ${refundData.rebateCode}</p>
                    <p><strong>Amount:</strong> €${refundData.amount}</p>
                    <p><strong>Processing Time:</strong> 1-3 business days</p>
                    <p><strong>Method:</strong> ${refundData.method}</p>
                </div>
                
                <p>You'll receive the refund to your original payment method within 3 business days.</p>
                
                <p>Questions? Contact us at ${this.emailSupport}</p>
                
                <p>Thank you for choosing Auralo!</p>
            `
        };
        
        // Queue email for sending
        console.log('📧 Email queued:', emailContent);
        return emailContent;
    }

    /**
     * Get rebate statistics for admin dashboard
     */
    getRebateStatistics() {
        const existingCodes = JSON.parse(localStorage.getItem('auralo_rebate_codes') || '[]');
        
        const stats = {
            totalGenerated: existingCodes.length,
            totalRedeemed: existingCodes.filter(code => code.status === 'redeemed').length,
            totalPending: existingCodes.filter(code => code.status === 'pending').length,
            totalValue: existingCodes.filter(code => code.status === 'redeemed').length * this.rebateAmount,
            conversionRate: 0
        };
        
        if (stats.totalGenerated > 0) {
            stats.conversionRate = ((stats.totalRedeemed / stats.totalGenerated) * 100).toFixed(2);
        }
        
        return stats;
    }

    /**
     * Admin function to manually verify payment and approve rebate
     */
    verifyPaymentAndApprove(rebateCode, paymentVerification) {
        const existingCodes = JSON.parse(localStorage.getItem('auralo_rebate_codes') || '[]');
        const index = existingCodes.findIndex(item => item.code === rebateCode);
        
        if (index !== -1) {
            existingCodes[index].paymentVerified = true;
            existingCodes[index].paymentVerification = paymentVerification;
            existingCodes[index].verifiedAt = new Date().toISOString();
            
            localStorage.setItem('auralo_rebate_codes', JSON.stringify(existingCodes));
            
            // Auto-approve for refund processing
            return this.redeemRebateCode(rebateCode, paymentVerification);
        }
        
        return { success: false, error: 'Rebate code not found' };
    }
}

/**
 * Integration with existing payment flow
 */
function integrateRebateWithPaymentFlow() {
    const rebateSystem = new AutomatedRebateSystem();
    
    // Modify existing prp-business-solution.html proceedWithRebate function
    window.enhancedProceedWithRebate = function(event) {
        event.stopPropagation();
        
        // Generate rebate code
        const rebateCode = rebateSystem.generateRebateCode();
        
        // Enhanced rebate display
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div class="price-guarantee">
                <h1>🎉 Rebate Code Generated!</h1>
                <div class="subtitle">Your €1.50 compensation is ready</div>
            </div>
            
            <div style="text-align: center; padding: 30px;">
                <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                    <h2 style="margin: 0 0 15px 0; color: white;">Your Rebate Code:</h2>
                    <div class="discount-code" id="rebate-code" style="background: rgba(255,255,255,0.2); color: white; font-size: 16px; border-color: rgba(255,255,255,0.3);">${rebateCode}</div>
                    <button onclick="copyRebateCode('${rebateCode}')" style="margin-top: 15px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        📋 Copy Code
                    </button>
                </div>
                
                <div style="background: rgba(33, 150, 243, 0.1); border: 1px solid #2196F3; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3>📋 How to Get Your €1.50 Refund:</h3>
                    <ol style="text-align: left; padding-left: 20px;">
                        <li>Complete your €21 payment on SimpleSwap</li>
                        <li>Take a screenshot of your payment confirmation</li>
                        <li>Email your rebate code + screenshot to: <strong>${rebateSystem.emailSupport}</strong></li>
                        <li>Receive €1.50 refund within 3 business days</li>
                    </ol>
                </div>
                
                <button class="proceed-button primary" onclick="proceedToSimpleSwap()" style="margin-top: 20px;">
                    Continue to Payment (€21) →
                </button>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,152,0,0.1); border-radius: 10px; font-size: 14px;">
                    <strong>⏰ Code expires in 30 days</strong><br>
                    Keep this code safe - you'll need it for your refund!
                </div>
            </div>
        `;
        
        // Auto-copy rebate code
        navigator.clipboard.writeText(rebateCode).then(() => {
            console.log('🎫 Rebate code generated and copied:', rebateCode);
        });
    };
    
    // Add copy function
    window.copyRebateCode = function(code) {
        navigator.clipboard.writeText(code).then(() => {
            // Show feedback
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            button.style.background = 'rgba(76, 175, 80, 0.3)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'rgba(255,255,255,0.2)';
            }, 2000);
        });
    };
}

// Initialize rebate system
const rebateSystem = new AutomatedRebateSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomatedRebateSystem;
}