# Product Requirements Document (PRD)
## Mobile Payment Pricing Solution

### 1. Problem Statement
SimpleSwap charges mobile users €21 instead of €19.50 for the same transaction, and doesn't default to Mercury provider. This creates an unfair 8% price increase for mobile users.

### 2. Business Objectives
- Ensure all customers pay €19.50 regardless of device
- Maintain Mercury as the default provider
- Provide seamless user experience
- Maintain business integrity and transparency

### 3. User Stories
**As a mobile user:**
- I want to pay the same price as desktop users
- I want Mercury selected by default
- I want a simple, clear payment process
- I don't want to be penalized for using my phone

**As a business owner:**
- I want all customers to have fair pricing
- I want to maintain profit margins
- I want happy customers who trust my business
- I want a sustainable solution

### 4. Constraints
- **Technical**: SimpleSwap's mobile detection is server-side (cannot be bypassed with JavaScript)
- **Legal**: Must comply with payment processing regulations
- **Business**: Cannot lose money on transactions
- **UX**: Solution must work on all mobile devices

### 5. Proposed Solutions

#### Solution A: Desktop Mode Guidance (Implemented)
**Description**: Guide users to enable desktop mode in their mobile browser
- **Pros**: Works reliably, no additional costs
- **Cons**: Requires user action, not all users know how

#### Solution B: Price Rebate System (Implemented)
**Description**: Let users pay €21, then rebate €1.50
- **Pros**: Works for all users, builds trust
- **Cons**: Requires manual rebate processing

#### Solution C: Alternative Payment Provider
**Description**: Find provider without mobile markup
- **Pros**: Permanent solution, no user action needed
- **Cons**: Requires integration, may have different fees

#### Solution D: Absorb the Difference
**Description**: Business pays the €1.50 difference
- **Pros**: Best user experience, builds loyalty
- **Cons**: Reduces profit margin

### 6. Recommended Approach
Implement a **multi-option strategy** that lets users choose:
1. Desktop mode (primary recommendation)
2. Rebate system (fallback option)
3. Alternative provider (future implementation)

### 7. Success Metrics
- **Conversion Rate**: % of mobile users who complete purchase
- **Price Paid**: Average price paid by mobile users (target: €19.50)
- **User Satisfaction**: Support tickets related to pricing
- **Time to Purchase**: How long mobile checkout takes

### 8. Implementation Plan
1. **Phase 1**: Deploy desktop mode guide ✅
2. **Phase 2**: Implement rebate system ✅
3. **Phase 3**: Research alternative providers
4. **Phase 4**: A/B test solutions
5. **Phase 5**: Optimize based on metrics

### 9. Risk Mitigation
- **Risk**: Users don't enable desktop mode
  - **Mitigation**: Provide rebate option
- **Risk**: Rebate processing overhead
  - **Mitigation**: Automate with codes
- **Risk**: SimpleSwap changes detection
  - **Mitigation**: Multiple solution options

### 10. Future Considerations
- Negotiate with SimpleSwap for uniform pricing
- Build direct payment processing
- Create mobile app with fair pricing
- Partner with mobile-friendly providers

---

## Conclusion
The technical spoofing approach fails because SimpleSwap detects mobile server-side. The proper solution addresses the business problem through user education, rebates, and alternative options. This maintains trust, ensures fair pricing, and provides flexibility for different user preferences.