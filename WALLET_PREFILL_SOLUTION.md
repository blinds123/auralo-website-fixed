# Wallet Address Pre-fill Solution for SimpleSwap

## Research Results
SimpleSwap does NOT support pre-filling wallet addresses via URL parameters. Tested:
- `?address=0x...` - Does not work
- `?recipient=0x...` - Does not work  
- `?destination=0x...` - Does not work
- `?to_address=0x...` - Does not work

## Recommended Solution: Enhanced Auto-Copy

Since we can't pre-fill the address on SimpleSwap, we can enhance the current auto-copy feature:

### Option 1: Visual Reminder (Current Implementation)
- Auto-copy wallet address when clicking checkout
- Show visual feedback "Wallet address copied!"
- User pastes it on SimpleSwap

### Option 2: Two-Step Process
```javascript
// 1. Copy address
// 2. Show modal: "Address copied! Click OK to proceed to SimpleSwap"
// 3. User clicks OK and goes to SimpleSwap
```

### Option 3: Custom Landing Page
Create `/checkout.html` that:
1. Shows wallet address prominently
2. Has "Copy Address" button
3. Has "Proceed to Payment" button
4. Tracks if address was copied before proceeding

### Option 4: Browser Extension
Create a simple browser extension that:
- Detects SimpleSwap checkout page
- Auto-fills the wallet address
- (Requires users to install extension)

### Option 5: SimpleSwap Widget
Use SimpleSwap's iframe widget on your site:
- Embed the exchange directly
- Users never leave your site
- May have more control over fields

## Current Implementation
The website currently uses auto-copy which:
- ✅ Works on all devices
- ✅ No extra steps for users
- ✅ Visual confirmation
- ✅ Address saved to clipboard

This is likely the best UX given SimpleSwap's limitations.